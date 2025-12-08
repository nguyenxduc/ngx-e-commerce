import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function to calculate final_price and discount_percentage
const calculateProductPrices = (product) => {
  const price = Number(product.price);
  const discount = Number(product.discount || 0);
  const final_price = price - discount;
  const discount_percentage =
    price > 0 ? Math.round((discount / price) * 100) : 0;

  return {
    ...product,
    price,
    discount,
    final_price,
    discount_percentage,
    rating: product.rating ? Number(product.rating) : 0,
  };
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discount = 0,
      quantity = 0,
      img = [],
      specs = [],
      specs_detail = [],
      color = [],
      category_id,
      sub_category_id,
    } = req.body;

    let imageUrls = Array.isArray(img) ? img : [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "products" })
        )
      );
      imageUrls = uploads.map((u) => u.secure_url);
    }

    const savedProduct = await prisma.product.create({
      data: {
        name,
        price,
        discount,
        quantity,
        img: imageUrls,
        specs,
        specs_detail,
        color,
        category_id: BigInt(category_id),
        sub_category_id: sub_category_id ? BigInt(sub_category_id) : null,
      },
    });

    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Standard query parameters (not filters)
    const standardParams = [
      "search",
      "category_id",
      "sub_category_id",
      "in_stock",
      "price_min",
      "price_max",
      "discount",
      "sort",
      "page",
      "limit",
    ];

    const {
      search,
      category_id,
      sub_category_id,
      in_stock,
      price_min,
      price_max,
      discount,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    // Extract all filter parameters (everything except standard params)
    const filterParams = {};
    Object.keys(req.query).forEach((key) => {
      if (!standardParams.includes(key) && req.query[key]) {
        filterParams[key] = req.query[key];
      }
    });

    const where = {};
    if (search) where.name = { contains: String(search), mode: "insensitive" };
    if (category_id) where.category_id = BigInt(category_id);
    if (sub_category_id) where.sub_category_id = BigInt(sub_category_id);
    if (in_stock === "true") where.quantity = { gt: 0 };
    if (discount === "true") where.discount = { gt: 0 };
    if (price_min || price_max) {
      where.price = {};
      if (price_min) where.price.gte = Number(price_min);
      if (price_max) where.price.lte = Number(price_max);
    }

    let orderBy = { created_at: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { rating: "desc" };
    else if (sort === "newest") orderBy = { created_at: "desc" };
    else if (sort === "popular") orderBy = { sold: "desc" };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Get all products first (before filtering by specs)
    // Note: We fetch all products because Prisma doesn't easily support filtering JSON array fields
    const allProducts = await prisma.product.findMany({
      where: { ...where, deleted_at: null },
      orderBy,
    });

    // If no filter parameters, return paginated results directly
    if (Object.keys(filterParams).length === 0) {
      const total = allProducts.length;
      const paginatedProducts = allProducts.slice(skip, skip + take);
      const productsWithCalculations = paginatedProducts.map(
        calculateProductPrices
      );

      return res.json({
        products: productsWithCalculations,
        pagination: {
          current_page: Number(page),
          per_page: Number(limit),
          total_count: total,
          total_pages: Math.ceil(total / Number(limit)),
        },
      });
    }

    // Fetch FilterOptions to build dynamic filter mapping
    // Get active filter options (both global and category-specific if category_id exists)
    const filterOptionWhere = {
      is_active: true,
    };

    if (category_id) {
      filterOptionWhere.OR = [
        { category_id: null }, // Global filters
        { category_id: BigInt(category_id) }, // Category-specific filters
      ];
    } else {
      filterOptionWhere.category_id = null; // Only global filters
    }

    const filterOptions = await prisma.filterOption.findMany({
      where: filterOptionWhere,
      select: {
        key: true,
        label: true,
        value: true,
      },
    });

    // Build a map of filter keys to their possible labels/keys
    // This allows flexible matching (e.g., "brand" can match "Brand", "brand", etc.)
    const filterKeyMap = new Map();
    filterOptions.forEach((option) => {
      const key = option.key.toLowerCase();
      if (!filterKeyMap.has(key)) {
        filterKeyMap.set(key, {
          keys: new Set([key, option.key.toLowerCase()]),
          labels: new Set([option.label?.toLowerCase()]),
        });
      } else {
        const existing = filterKeyMap.get(key);
        existing.keys.add(key);
        existing.keys.add(option.key.toLowerCase());
        if (option.label) {
          existing.labels.add(option.label.toLowerCase());
        }
      }
    });

    // Helper function to check if a product matches filter values
    const matchesFilter = (product, queryKey, filterValues) => {
      if (!filterValues || filterValues.length === 0) return true;

      const values = Array.isArray(filterValues)
        ? filterValues
        : String(filterValues)
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

      if (values.length === 0) return true;

      // Find matching filter keys from FilterOption table
      const queryKeyLower = String(queryKey).toLowerCase();
      const matchingKeys = [];

      // Check if queryKey matches any filter option key
      filterKeyMap.forEach((data, filterKey) => {
        if (
          filterKey === queryKeyLower ||
          data.keys.has(queryKeyLower) ||
          Array.from(data.labels).some((label) => label === queryKeyLower)
        ) {
          matchingKeys.push(filterKey);
          // Also add all variations
          data.keys.forEach((k) => matchingKeys.push(k));
          data.labels.forEach((l) => matchingKeys.push(l));
        }
      });

      // If no matching filter option found, try direct match with queryKey
      if (matchingKeys.length === 0) {
        matchingKeys.push(queryKeyLower);
      }

      // Check in specs array
      const specs = Array.isArray(product.specs) ? product.specs : [];
      const specsMatch = specs.some((spec) => {
        const label = String(spec.label || "").toLowerCase();
        const value = String(spec.value || "").toLowerCase();
        const key = String(spec.key || "").toLowerCase();

        // Check if label/key matches any of the matching keys
        const keyMatch =
          matchingKeys.some((mk) => mk === label || mk === key) ||
          label === queryKeyLower ||
          key === queryKeyLower;

        if (keyMatch) {
          return values.some(
            (fv) =>
              value === String(fv).toLowerCase() ||
              value.includes(String(fv).toLowerCase())
          );
        }
        return false;
      });

      // Check in specs_detail array
      const specsDetail = Array.isArray(product.specs_detail)
        ? product.specs_detail
        : [];
      const specsDetailMatch = specsDetail.some((spec) => {
        const label = String(spec.label || "").toLowerCase();
        const value = String(spec.value || "").toLowerCase();
        const key = String(spec.key || "").toLowerCase();

        const keyMatch =
          matchingKeys.some((mk) => mk === label || mk === key) ||
          label === queryKeyLower ||
          key === queryKeyLower;

        if (keyMatch) {
          return values.some(
            (fv) =>
              value === String(fv).toLowerCase() ||
              value.includes(String(fv).toLowerCase())
          );
        }
        return false;
      });

      return specsMatch || specsDetailMatch;
    };

    // Apply filters dynamically
    let filteredProducts = allProducts;
    Object.keys(filterParams).forEach((queryKey) => {
      const filterValue = filterParams[queryKey];
      filteredProducts = filteredProducts.filter((p) =>
        matchesFilter(p, queryKey, filterValue)
      );
    });

    // Apply pagination after filtering
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(skip, skip + take);

    // Calculate final_price and discount_percentage for each product
    const productsWithCalculations = paginatedProducts.map(
      calculateProductPrices
    );

    res.json({
      products: productsWithCalculations,
      pagination: {
        current_page: Number(page),
        per_page: Number(limit),
        total_count: total,
        total_pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: BigInt(req.params.id), deleted_at: null },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productWithCalculations = calculateProductPrices(product);
    const in_stock = Number(product.quantity) > 0;
    const available_colors = Array.isArray(product.color) ? product.color : [];
    res.json({ ...productWithCalculations, in_stock, available_colors });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    let imageUrls;
    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "products" })
        )
      );
      imageUrls = uploads.map((u) => u.secure_url);
    }
    const updatedProduct = await prisma.product.update({
      where: { id: BigInt(req.params.id) },
      data: {
        name: data.name ?? undefined,
        price: data.price ?? undefined,
        discount: data.discount ?? undefined,
        quantity: data.quantity ?? undefined,
        img: imageUrls ?? data.img ?? undefined,
        specs: data.specs ?? undefined,
        specs_detail: data.specs_detail ?? undefined,
        color: data.color ?? undefined,
        category_id: data.category_id ? BigInt(data.category_id) : undefined,
        sub_category_id:
          data.sub_category_id !== undefined
            ? data.sub_category_id
              ? BigInt(data.sub_category_id)
              : null
            : undefined,
      },
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: BigInt(req.params.id) },
      data: { deleted_at: new Date() },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await prisma.product.findMany({
      where: {
        deleted_at: null,
        name: { contains: query, mode: "insensitive" },
      },
      orderBy: { created_at: "desc" },
    });

    const productsWithCalculations = products.map(calculateProductPrices);

    res.json({
      products: productsWithCalculations,
      pagination: {
        current_page: 1,
        per_page: products.length,
        total_count: products.length,
        total_pages: 1,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category_id: BigInt(req.params.categoryId),
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });

    const productsWithCalculations = products.map(calculateProductPrices);

    res.json({
      products: productsWithCalculations,
      pagination: {
        current_page: 1,
        per_page: products.length,
        total_count: products.length,
        total_pages: 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products by category",
      error: error.message,
    });
  }
};

export const getProductsByShop = async (req, res) => {
  try {
    return res
      .status(400)
      .json({ message: "Shop filter not supported in current schema" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products by shop",
      error: error.message,
    });
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(req.params.id) },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      width: 500,
      crop: "scale",
    });

    const newImgs = Array.isArray(product.img)
      ? [...product.img, result.secure_url]
      : [result.secure_url];
    const updated = await prisma.product.update({
      where: { id: BigInt(req.params.id) },
      data: { img: newImgs },
    });

    res.json({ message: "Image uploaded successfully", product: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(req.params.id) },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { imageId } = req.params;
    const filtered = (Array.isArray(product.img) ? product.img : []).filter(
      (url) => url !== imageId
    );
    const updated = await prisma.product.update({
      where: { id: BigInt(req.params.id) },
      data: { img: filtered },
    });

    res.json({ message: "Image deleted successfully", product: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
};

export const addSales = async (req, res) => {
  try {
    const { amount, color_name } = req.body;
    const id = BigInt(req.params.id);
    if (!amount || Number(amount) <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let colorJson = Array.isArray(product.color) ? [...product.color] : [];
    if (color_name) {
      const idx = colorJson.findIndex(
        (c) => (c.name || c.label) === color_name
      );
      if (idx === -1)
        return res
          .status(422)
          .json({ success: false, message: "Color not found" });
      if (Number(colorJson[idx].quantity || 0) < Number(amount))
        return res
          .status(422)
          .json({ success: false, message: "Insufficient stock for color" });
      colorJson[idx].quantity =
        Number(colorJson[idx].quantity) - Number(amount);
    }

    if (Number(product.quantity) < Number(amount))
      return res
        .status(422)
        .json({ success: false, message: "Insufficient stock" });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        quantity: { decrement: Number(amount) },
        sold: { increment: Number(amount) },
        color: color_name ? colorJson : undefined,
      },
    });

    res.json({ success: true, message: "Sales added", product: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add sales",
      error: error.message,
    });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const id = BigInt(req.params.id);
    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ success: false, message: "Invalid rating" });

    const agg = await prisma.review.aggregate({
      where: { product_id: id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const product = await prisma.product.update({
      where: { id },
      data: { rating: agg._avg.rating ?? rating },
      select: { id: true, rating: true },
    });
    res.json({
      success: true,
      message: "Rating updated",
      product: {
        id: product.id.toString(),
        rating: product.rating,
        number_of_ratings: agg._count.rating || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add rating",
      error: error.message,
    });
  }
};
