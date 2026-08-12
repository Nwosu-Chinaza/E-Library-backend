import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

/**
 * @desc Create a new category
 * @route POST /api/categories
 * @access Admin
 */
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const category = await createCategory({
      name: name.trim(),
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
};

/**
 * @desc Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};

/**
 * @desc Get a single category
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
    });
  }
};

/**
 * @desc Update a category
 * @route PUT /api/categories/:id
 * @access Admin
 */
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const category = await updateCategory(id, {
      name: name.trim(),
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
};

/**
 * @desc Delete a category
 * @route DELETE /api/categories/:id
 * @access Admin
 */
export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const category = await deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      category,
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};
