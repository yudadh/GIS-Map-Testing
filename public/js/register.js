
const form = document.getElementById('registrationForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
// const submit = document.getElementById('submit');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Reset errors
  usernameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';

  // Validate username
  const usernameRegex = /^[a-zA-Z0-9_]{5,}$/;
  if (!usernameRegex.test(usernameInput.value)) {
    usernameError.textContent = 'Username must be at least 5 characters long and can only contain letters, numbers, and underscores.';
    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = 'Invalid email address.';
    return;
  }

  // Validate password
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(passwordInput.value)) {
    passwordError.textContent = 'Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter.';
    return;
  }
  // Get form data
  const formData = new FormData(form);
  console.log(formData)
  // Convert FormData to JSON
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });
  console.log(jsonObject)

  const url = "http://127.0.0.0:8000/api"

  // Send form data using Axios
  axios.post(url + '/register', jsonObject)
    .then(function(response) {
      // Handle success
      alert('Form submitted successfully!');
      // Optionally, do something with the response from the server
      console.log(response)
      window.location.href = '/login';
    })
    .catch(function(error) {
      // Handle error
      alert('Failed to submit form. Please try again later.');
      console.log(error)
    });
});
