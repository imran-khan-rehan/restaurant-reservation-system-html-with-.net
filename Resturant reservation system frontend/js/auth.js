
document.addEventListener('DOMContentLoaded', function () {



    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});
checkAuthStatus();
function checkAuthStatus() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const logoutBtn = document.getElementById('logoutBtn');
    console.log("user from session", user);
    if (user) {

        if (logoutBtn) logoutBtn.style.display = 'inline';

        if (window.location.pathname.includes('login.html') ||
            window.location.pathname.includes('signup.html')) {
            redirectBasedOnRole(user.role);
        }
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none';

        if (window.location.pathname.includes('admin') ||
            window.location.pathname.includes('user')) {
            window.location.href = 'login.html';
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:7056/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {

            sessionStorage.setItem('user', JSON.stringify({
                data
            }));
            console.log(data);
            redirectBasedOnRole(data.role);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred during login');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:7056/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred during registration');
    }
}

function logout() {
    window.location.href = 'index.html';
}

function redirectBasedOnRole(role) {
    if (role === 'Admin') {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'reservations.html';
    }
}
