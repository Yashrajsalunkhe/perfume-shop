function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const error = document.getElementById('error-msg');

  if (user === '' || pass === '') {
    error.style.display = 'block';
  } else {
    error.style.display = 'none';
    alert(`Welcome back, ${user}!`);
    // You can redirect or process login here
  }
}
