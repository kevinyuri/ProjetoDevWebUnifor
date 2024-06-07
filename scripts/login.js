function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Example hard-coded credentials for demonstration purposes
    const validUsername = 'user';
    const validPassword = 'password';

    if (username === validUsername && password === validPassword) {
        // Redirect to the home page if credentials are correct
        window.location.href = 'home.html';
    } else {
        // Display an error message if credentials are incorrect
        errorMessage.textContent = 'Invalid username or password';
    }
}
