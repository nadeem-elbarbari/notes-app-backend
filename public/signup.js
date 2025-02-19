document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const pathname = window.location.pathname;

    // Redirect to dashboard if already logged in
    if (token && pathname === '/register.html') {
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

    // Handle registration form submission
    $('.auth-form').submit(async (e) => {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirm-password').val().trim();

        // Validate password strength
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return showToast(
                'Password must be at least 8 characters long and contain at least one letter and one number',
                'error'
            );
        }

        // Ensure passwords match
        if (password !== confirmPassword) {
            return showToast('Passwords do not match', 'error');
        }

        try {
            const url = 'https://notes-app-fullstack-psi.vercel.app';
            const response = await fetch(`${url}/api/v1/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });

            const data = await response.json();
            if (!data.success) {
                return showToast(data.message, 'error');
            }

            showToast(data.message, 'success');
            setTimeout(() => (window.location.href = 'login.html'), 3000);
        } catch (error) {
            console.error('Signup error:', error);
            showToast('An error occurred during signup. Please try again.', 'error');
        }
    });
});

// Optimized toast notification function
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

// Signup with Twitter
$('#x-login').click(async (e) => {
    e.preventDefault();
    window.location.href = '/auth/twitter';
});
