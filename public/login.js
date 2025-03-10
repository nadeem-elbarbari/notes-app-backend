document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const pathname = window.location.pathname;

    // Redirect to dashboard if already logged in
    if (token && pathname === '/login.html') {
        window.location.href = 'dashboard.html';
    }

    // Show/hide sidebar elements based on authentication state
    const isAuthenticated = !!token;
    $('#sidebar-home, #sidebar-register, #sidebar-login').toggle(!isAuthenticated);
    $('#sidebar-dashboard, #logoutButton').toggle(isAuthenticated);

    // Sidebar toggle functionality
    $('#menuToggle').click(() => $('#sidebar').addClass('open'));
    $('#closeSidebar').click(() => $('#sidebar').removeClass('open'));

    // Fade-in animation for auth container
    $('.auth-container').css({ opacity: '0' }).animate({ opacity: '1', marginTop: '0' }, 1000);

    const loginButton = document.getElementById('loginButton');
    const loader = document.createElement('i');
    loader.className = 'fa-solid fa-circle-notch fa-spin fa-xl';


    // Handle login form submission
    $('.auth-form').submit(async (e) => {
        e.preventDefault();
        
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        
        if (!email || !password) {
            showToast('Email and password are required.', 'error');
            return;
        }
        try {
            // Disable the button
            loginButton.disabled = true;

            // Show the loader
            loginButton.textContent = '';            
            loginButton.appendChild(loader);
            
            const response = await fetch('https://notes-app-fullstack-wheat.vercel.app/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            // Re-enable the button
            $('#loginButton').attr('disabled', false).text('Login');

            if (!data.success) return showToast(data.message, 'error');

            localStorage.setItem('token', data.data.token);
            showToast(data.message, 'success');
            setTimeout(() => (window.location.href = 'dashboard.html'), 3000);
        } catch (error) {
            console.error('Login error:', error);
            showToast('An error occurred during login. Please try again.', 'error');
        }
    });
});

// toast notification function
const showToast = (message, type = 'error') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3000);
};

// Login with Twitter
$('#x-login').click(async (e) => {
    e.preventDefault();
    window.location.href = '/auth/twitter';
});
