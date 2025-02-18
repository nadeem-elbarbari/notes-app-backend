if (localStorage.getItem('token') && window.location.pathname === '/register.html') {
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

    const name = $('#name').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regex.test(password)) {
        showToast(
            'Password must be at least 8 characters long and contain at least one letter and one number',
            'error'
        );
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('https://notes-app-pi-ecru.vercel.app/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword }),
        });

        const data = await response.json();
        console.log('data :', data);

        if (data.status === 'failed') {
            showToast(data.message, 'error');
            return;
        }

        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        showToast('An error occurred during signup. Please try again.', 'error');
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
