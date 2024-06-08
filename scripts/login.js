async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const response = await fetch('https://uniforusuariosproject.azurewebsites.net/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        const username = data.nome;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
        // Redirect to the home page if credentials are correct
        window.location.href = 'home.html';
    } else {
        errorMessage.textContent = 'Usuário ou senha inválida';
    }
}
