import { Router } from "express";

import {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController.js";

const router = Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 * @access Public
 */
router.get("/", getCategories);

/**
 * @route GET /api/categories/:id
 * @desc Get a single category
 * @access Public
 */
router.get("/:id", getCategory);

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Admin
 */
router.post("/", addCategory);

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Admin
 */
router.put("/:id", editCategory);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Admin
 */
router.delete("/:id", removeCategory);

export default router;
