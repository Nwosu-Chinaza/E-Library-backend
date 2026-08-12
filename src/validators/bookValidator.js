export const validateBook = (req, res, next) => {
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

  const errors = [];

  if (!category_id) {
    errors.push("Category is required.");
  }

  if (!title || !title.trim()) {
    errors.push("Title is required.");
  }

  if (!author || !author.trim()) {
    errors.push("Author is required.");
  }

  if (!description || !description.trim()) {
    errors.push("Description is required.");
  }

  if (!isbn || !isbn.trim()) {
    errors.push("ISBN is required.");
  }

  if (!publication_year) {
    errors.push("Publication year is required.");
  }

  if (!language || !language.trim()) {
    errors.push("Language is required.");
  }

  if (!pages) {
    errors.push("Number of pages is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};
