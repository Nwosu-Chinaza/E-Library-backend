import {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/bookService.js";
import { uploadFile } from "../services/uploadService.js";
import { createBookFiles } from "../services/bookFileService.js";

/**
 * @desc Get all books
 * @route GET /api/books
 * @access Public
 */
export const getBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const books = search ? await searchBooks(search) : await getAllBooks();

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get Books Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books.",
    });
  }
};

/**
 * @desc Get a single book
 * @route GET /api/books/:id
 * @access Public
 */
export const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book.",
    });
  }
};

/**
 * @desc Create a new book with cover and document
 * @route POST /api/books
 * @access Authenticated Users
 */
export const addBook = async (req, res) => {
  let documentUpload = null;
  let coverUpload = null;
  let bookCreated = null;

  try {
    const {
      category_id,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
    } = req.body;

    // Check that a document was uploaded
    if (!req.files?.document?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Book document is required.",
      });
    }

    const documentFile = req.files.document[0];
    const coverFile = req.files?.cover?.[0];

    // Upload document to Cloudinary
    const documentResourceType =
      documentFile.mimetype === "application/pdf" ? "image" : "raw";

    documentUpload = await uploadFile(
      documentFile.path,
      "e-library/documents",
      documentResourceType,
    );

    // Upload cover if provided
    if (coverFile) {
      coverUpload = await uploadFile(
        coverFile.path,
        "e-library/covers",
        "image"
      );
    }

    // Create book record
    bookCreated = await createBook({
      category_id,
      created_by: req.user.id,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
    });

    // Save Cloudinary URLs
    const bookFiles = await createBookFiles({
      book_id: bookCreated.id,
      cover_image_url: coverUpload?.url || null,
      file_url: documentUpload.url,
    });

    return res.status(201).json({
      success: true,
      message: "Book uploaded successfully.",
      book: bookCreated,
      files: bookFiles,
    });

  } catch (error) {
    console.error("Create Book Error:", error);

    // Clean up Cloudinary document if it was uploaded
    if (documentUpload?.public_id) {
      try {
        await deleteFile(
          documentUpload.public_id,
          documentUpload.resource_type
        );
      } catch (cleanupError) {
        console.error(
          "Failed to delete document from Cloudinary:",
          cleanupError
        );
      }
    }

    // Clean up Cloudinary cover if it was uploaded
    if (coverUpload?.public_id) {
      try {
        await deleteFile(
          coverUpload.public_id,
          coverUpload.resource_type
        );
      } catch (cleanupError) {
        console.error(
          "Failed to delete cover from Cloudinary:",
          cleanupError
        );
      }
    }

    // If the book was created but file record failed,
    // remove the book from the database.
    if (bookCreated?.id) {
      try {
        await deleteBook(bookCreated.id);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up book record:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload book.",
    });
  }
};

/**
 * @desc Update a book
 * @route PUT /api/books/:id
 * @access Owner or Admin
 */
export const editBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book first so we can check ownership
    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    // Only the book owner or an Admin can edit the book
    const isOwner = existingBook.created_by === Number(req.user.id);
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own books.",
      });
    }

    const {
      category_id,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
    } = req.body;

    const book = await updateBook(id, {
      category_id,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      book,
    });
  } catch (error) {
    console.error("Update Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update book.",
    });
  }
};

/**
 * @desc Delete a book
 * @route DELETE /api/books/:id
 * @access Owner or Admin
 */
export const removeBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book first so we can check ownership
    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    // Only the book owner or an Admin can delete the book
    const isOwner = existingBook.created_by === Number(req.user.id);
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own books.",
      });
    }

    const book = await deleteBook(id);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
      book,
    });
  } catch (error) {
    console.error("Delete Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete book.",
    });
  }
};
