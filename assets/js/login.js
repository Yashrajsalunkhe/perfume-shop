// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
});

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const error = document.getElementById('error-msg');

    // Hide previous error
    error.style.display = 'none';

    // Basic validation
    if (user === '' || pass === '') {
        showError('Please fill in both fields.');
        return;
    }

    if (user.length < 3) {
        showError('Username must be at least 3 characters long.');
        return;
    }

    if (pass.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }

    // Simulate login process
    showLoading();
    
    // Here you would typically make an API call to your backend
    setTimeout(() => {
        // For demo purposes, accept any valid input
        if (user === 'admin' && pass === 'admin123') {
            // Successful login
            localStorage.setItem('user', JSON.stringify({
                username: user,
                loginTime: new Date().toISOString()
            }));
            
            showSuccess(`Welcome back, ${user}!`);
            
            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            // Failed login
            showError('Invalid username or password. Try admin/admin123 for demo.');
        }
        hideLoading();
    }, 1500);
}

function showError(message) {
    const error = document.getElementById('error-msg');
    error.textContent = message;
    error.style.display = 'block';
    error.style.background = '#ff6b6b';
}

function showSuccess(message) {
    const error = document.getElementById('error-msg');
    error.textContent = message;
    error.style.display = 'block';
    error.style.background = '#4CAF50';
}

function showLoading() {
    const button = document.querySelector('button[type="submit"]');
    button.textContent = 'Logging in...';
    button.disabled = true;
}

function hideLoading() {
    const button = document.querySelector('button[type="submit"]');
    button.textContent = 'Login';
    button.disabled = false;
}

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        // Check if login is still valid (e.g., within 24 hours)
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
            // User is still logged in
            window.location.href = '../index.html';
        } else {
            // Login expired
            localStorage.removeItem('user');
        }
    }
}

// Run auth check when page loads
checkAuth();
