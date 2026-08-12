// export const validateRegister = (req, res, next) => {
//   const { name, email, password } = req.body;

//   const errors = [];

//   if (!name || !name.trim()) {
//     errors.push("Name is required.");
//   }

//   if (!email || !email.trim()) {
//     errors.push("Email is required.");
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     errors.push("Please provide a valid email address.");
//   }

//   if (!password) {
//     errors.push("Password is required.");
//   } else if (password.length < 6) {
//     errors.push("Password must be at least 6 characters.");
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed.",
//       errors,
//     });
//   }

//   next();
// };
