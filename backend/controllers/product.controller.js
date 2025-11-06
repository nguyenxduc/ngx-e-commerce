import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

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

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy, skip, take }),
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
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
    const product = await prisma.product.findUnique({
      where: { id: BigInt(req.params.id) },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const final_price = Number(product.price) - Number(product.discount || 0);
    const in_stock = Number(product.quantity) > 0;
    const available_colors = Array.isArray(product.color) ? product.color : [];
    res.json({ ...product, final_price, in_stock, available_colors });
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
    await prisma.product.delete({ where: { id: BigInt(req.params.id) } });
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
        name: { contains: query, mode: "insensitive" },
      },
      orderBy: { created_at: "desc" },
    });
    res.json({
      products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        pages: 1,
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
      where: { category_id: BigInt(req.params.categoryId) },
      orderBy: { created_at: "desc" },
    });
    res.json({
      products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        pages: 1,
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
