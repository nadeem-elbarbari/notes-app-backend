if (localStorage.getItem('token') && window.location.pathname === '/login.html') {
    window.location.href = 'dashboard.html';
}

if (!localStorage.getItem('token')) {
    $('#sidebar-home').show();
    $('#sidebar-register').show();
    $('#sidebar-login').show();
    $('#sidebar-dashboard').hide();
    $('#logoutButton').hide();
}

$('#menuToggle').click(() => {
    $('#sidebar').addClass('open');
});
$('#closeSidebar').click(() => {
    $('#sidebar').removeClass('open');
});

$(document).ready(() => {
    $('.auth-container').css('opacity', '0').animate({ opacity: '1', marginTop: '0' }, 1000);
});

$('.auth-form').submit(async (e) => {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    try {
        const response = await fetch('https://notes-app-pi-ecru.vercel.app/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!data.success) {
            showToast(data.message, 'error');
            return;
        }

        if (data.success) {
            localStorage.setItem('token', data.data.token);
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
        }
    } catch (error) {
        console.error('Error during login:', error);
        showToast('An error occurred during login. Please try again.', 'error');
    }
});

function showToast(message, type = 'error') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}
