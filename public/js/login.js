const form = document.getElementById('registrationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
// const submit = document.getElementById('submit');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Reset errors
  emailError.textContent = '';
  passwordError.textContent = '';

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
  const url = "http://127.0.0.1:8000/api"
  // Send form data using Axios
  axios.post(url + '/login', jsonObject)
    .then(function(response) {
      // Handle success
      alert('Form submitted successfully!');
      console.log(response.data.data)
      token = response.data.data.token;
	    user = response.data.data.user;

      localStorage.setItem("token", token)
      localStorage.setItem("user", user)
      if (response.data.success === true){
        window.location.href = '/map';
      }
      else{
        console.log(response)
      }
    })
    .catch(function(error) {
      // Handle error
      alert('Failed to submit form. Please try again later.');
      console.log(error)
    });
});