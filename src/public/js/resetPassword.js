    const form = document.getElementById("resetPasswordForm");
    const message = document.getElementById("message");

    // Get token from URL
    const token = window.location.pathname.split("/").pop();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password =
    document.getElementById("password").value;

  const confirm_password =
    document.getElementById("confirm_password").value;

  if (password !== confirm_password) {
    message.style.display = "block";
    message.textContent =
      "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch(
      `/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password,
          confirm_password
        })
      }
    );

    const data = await response.json();

    message.style.display = "block";
    message.textContent = data.message;

    if (data.success) {
      form.reset();
    }

  } catch (error) {
    message.style.display = "block";
    message.textContent =
      "Something went wrong. Please try again.";
  }
});