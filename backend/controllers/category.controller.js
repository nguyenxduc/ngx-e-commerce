import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deleted_at: null },
      orderBy: { name: "asc" },
      include: { sub_categories: { where: { deleted_at: null } } },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to list categories", error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const cat = await prisma.category.findUnique({
      where: { id: BigInt(req.params.id), deleted_at: null },
      include: {
        sub_categories: { where: { deleted_at: null } },
        products: { where: { deleted_at: null } },
      },
    });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get category", error: error.message });
  }
};

export const getSubCategoriesOfCategory = async (req, res) => {
  try {
    const subs = await prisma.subCategory.findMany({
      where: { category_id: BigInt(req.params.id), deleted_at: null },
      orderBy: { name: "asc" },
    });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: "Failed to list sub categories", error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const data = category || req.body;

    let imageUrl = data.image_url ?? null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      imageUrl = result.secure_url;
    }
    const created = await prisma.category.create({
      data: {
        name: data.name,
        image_url: imageUrl,
        description: data.description ?? null,
      },
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const data = category || req.body;

    let imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      imageUrl = result.secure_url;
    }
    const updated = await prisma.category.update({
      where: { id: BigInt(req.params.id) },
      data: {
        name: data.name ?? undefined,
        image_url: imageUrl ?? data.image_url ?? undefined,
        description: data.description ?? undefined,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await prisma.category.update({
      where: { id: BigInt(req.params.id) },
      data: { deleted_at: new Date() },
    });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};


