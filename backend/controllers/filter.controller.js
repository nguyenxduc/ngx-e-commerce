import { prisma } from "../lib/db.js";

export const getFilterMetadata = async (req, res) => {
  try {
    const { category_id } = req.query;

    // Build where clause for FilterOption
    // If category_id is provided, get both global (null) and category-specific filters
    // If no category_id, only get global filters
    const where = {
      is_active: true,
    };

    if (category_id) {
      // Get both global filters (category_id = null) and category-specific filters
      where.OR = [
        { category_id: null },
        { category_id: BigInt(category_id) },
      ];
    } else {
      // Only get global filters when no category_id specified
      where.category_id = null;
    }

    // Get filter options from FilterOption table
    const filterOptions = await prisma.filterOption.findMany({
      where,
      orderBy: [
        { key: "asc" },
        { order: "asc" },
        { value: "asc" },
      ],
    });

    // Group by key and format as ProductSpecMeta array
    const groupedOptions = new Map();

    filterOptions.forEach((option) => {
      const key = option.key;
      if (!groupedOptions.has(key)) {
        groupedOptions.set(key, {
          key: key,
          label: option.label || key.replace(/_/g, " "),
          options: [],
        });
      }
      groupedOptions.get(key).options.push(option.value);
    });

    // Convert map to array
    const result = Array.from(groupedOptions.values());

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Filter metadata error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get filter metadata",
      message: error.message,
    });
  }
};

// Helper function to sync filter options from products (can be called manually or via admin endpoint)
export const syncFilterOptionsFromProducts = async (req, res) => {
  try {
    const { category_id } = req.query;

    const where = {};
    if (category_id) {
      where.category_id = BigInt(category_id);
    }

    // Get all products (or filtered by category)
    const products = await prisma.product.findMany({
      where,
      select: {
        specs: true,
        specs_detail: true,
        category_id: true,
      },
    });

    // Map to store filter options by key
    const filterMap = new Map();

    // Extract unique values from specs and specs_detail
    products.forEach((product) => {
      const specs = Array.isArray(product.specs) ? product.specs : [];
      const specsDetail = Array.isArray(product.specs_detail)
        ? product.specs_detail
        : [];

      [...specs, ...specsDetail].forEach((spec) => {
        if (!spec || typeof spec !== "object") return;

        const label = (spec.label || "").toLowerCase();
        const value = String(spec.value || "").trim();

        if (!value) return;

        let key = "";
        let displayLabel = "";

        if (label.includes("brand") && !label.includes("gpu")) {
          key = "brand";
          displayLabel = "Brand";
        } else if (label.includes("ram")) {
          key = "ram";
          displayLabel = "RAM";
        } else if (label.includes("screen") || label.includes("display")) {
          key = "screen_size";
          displayLabel = "Screen Size";
        } else if (label.includes("processor") || label.includes("cpu")) {
          key = "processor";
          displayLabel = "Processor";
        } else if (label.includes("gpu") || label.includes("graphics")) {
          key = "gpu_brand";
          displayLabel = "GPU Brand";
        } else if (
          label.includes("drive") ||
          label.includes("storage") ||
          label.includes("ssd")
        ) {
          key = "drive_size";
          displayLabel = "Drive Size";
        }

        if (key) {
          const mapKey = `${key}_${value}_${product.category_id || "null"}`;
          if (!filterMap.has(mapKey)) {
            filterMap.set(mapKey, {
              key,
              label: displayLabel,
              value,
              category_id: product.category_id ? BigInt(product.category_id) : null,
            });
          }
        }
      });
    });

    // Insert or update filter options
    let created = 0;
    let updated = 0;

    for (const option of filterMap.values()) {
      // Check if filter option already exists
      const existing = await prisma.filterOption.findFirst({
        where: {
          key: option.key,
          value: option.value,
          category_id: option.category_id,
        },
      });

      if (existing) {
        // Update existing
        await prisma.filterOption.update({
          where: { id: existing.id },
          data: {
            label: option.label,
            is_active: true,
          },
        });
        updated++;
      } else {
        // Create new
        await prisma.filterOption.create({
          data: {
            key: option.key,
            label: option.label,
            value: option.value,
            category_id: option.category_id,
            is_active: true,
          },
        });
        created++;
      }
    }

    res.json({
      success: true,
      message: `Synced filter options: ${created} created, ${updated} updated`,
      data: {
        created,
        updated,
        total: filterMap.size,
      },
    });
  } catch (error) {
    console.error("Sync filter options error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync filter options",
      message: error.message,
    });
  }
};

// Admin CRUD operations
export const listFilterOptions = async (req, res) => {
  try {
    const { category_id, key, is_active } = req.query;
    
    const where = {};
    if (category_id) {
      where.category_id = BigInt(category_id);
    }
    if (key) {
      where.key = String(key);
    }
    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    const filterOptions = await prisma.filterOption.findMany({
      where,
      orderBy: [
        { key: "asc" },
        { order: "asc" },
        { value: "asc" },
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: filterOptions.map((opt) => ({
        ...opt,
        id: opt.id.toString(),
        category_id: opt.category_id ? opt.category_id.toString() : null,
        category: opt.category ? {
          id: opt.category.id.toString(),
          name: opt.category.name,
        } : null,
      })),
    });
  } catch (error) {
    console.error("List filter options error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to list filter options",
      message: error.message,
    });
  }
};

export const getFilterOption = async (req, res) => {
  try {
    const filterOption = await prisma.filterOption.findUnique({
      where: { id: BigInt(req.params.id) },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!filterOption) {
      return res.status(404).json({
        success: false,
        error: "Filter option not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...filterOption,
        id: filterOption.id.toString(),
        category_id: filterOption.category_id ? filterOption.category_id.toString() : null,
        category: filterOption.category ? {
          id: filterOption.category.id.toString(),
          name: filterOption.category.name,
        } : null,
      },
    });
  } catch (error) {
    console.error("Get filter option error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get filter option",
      message: error.message,
    });
  }
};

export const createFilterOption = async (req, res) => {
  try {
    const { key, label, value, category_id, order, is_active } = req.body;

    if (!key || !label || !value) {
      return res.status(400).json({
        success: false,
        error: "key, label, and value are required",
      });
    }

    const filterOption = await prisma.filterOption.create({
      data: {
        key: String(key),
        label: String(label),
        value: String(value),
        category_id: category_id ? BigInt(category_id) : null,
        order: order ? Number(order) : 0,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...filterOption,
        id: filterOption.id.toString(),
        category_id: filterOption.category_id ? filterOption.category_id.toString() : null,
        category: filterOption.category ? {
          id: filterOption.category.id.toString(),
          name: filterOption.category.name,
        } : null,
      },
    });
  } catch (error) {
    console.error("Create filter option error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Filter option already exists",
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create filter option",
      message: error.message,
    });
  }
};

export const updateFilterOption = async (req, res) => {
  try {
    const { key, label, value, category_id, order, is_active } = req.body;

    const updateData = {};
    if (key !== undefined) updateData.key = String(key);
    if (label !== undefined) updateData.label = String(label);
    if (value !== undefined) updateData.value = String(value);
    if (category_id !== undefined) {
      updateData.category_id = category_id ? BigInt(category_id) : null;
    }
    if (order !== undefined) updateData.order = Number(order);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    const filterOption = await prisma.filterOption.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...filterOption,
        id: filterOption.id.toString(),
        category_id: filterOption.category_id ? filterOption.category_id.toString() : null,
        category: filterOption.category ? {
          id: filterOption.category.id.toString(),
          name: filterOption.category.name,
        } : null,
      },
    });
  } catch (error) {
    console.error("Update filter option error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Filter option not found",
      });
    }
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Filter option already exists",
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update filter option",
      message: error.message,
    });
  }
};

export const deleteFilterOption = async (req, res) => {
  try {
    await prisma.filterOption.delete({
      where: { id: BigInt(req.params.id) },
    });

    res.json({
      success: true,
      message: "Filter option deleted",
    });
  } catch (error) {
    console.error("Delete filter option error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Filter option not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete filter option",
      message: error.message,
    });
  }
};

