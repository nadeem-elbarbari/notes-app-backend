if (window.location.pathname === '/index.html') {
    window.location.href = '/';
}

if (localStorage.getItem('token') && window.location.pathname === '/') {
    $('#home').hide();
    $('#register').hide();
    $('#login').hide();
    $('#sidebar-home').hide();
    $('#sidebar-register').hide();
    $('#sidebar-login').hide();

    $('#sidebar-dashboard').show();
    $('#dashboard').show();
}

if (
    (!localStorage.getItem('token') && window.location.pathname === '/') ||
    window.location.pathname === '/index.html'
) {
    $('#sidebar-home').show();
    $('#sidebar-register').show();
    $('#sidebar-login').show();

    $('#dashboard').hide();
    $('#sidebar-dashboard').hide();
    $('#logoutButton').hide();
}

$(document).ready(function () {
    $('.hero-content').css('opacity', '0').animate(
        {
            opacity: 1,
            marginTop: '0',
        },
        1000
    );
});

$('#menuToggle').click(() => {
    $('#sidebar').addClass('open');
});

$('#closeSidebar').click(() => {
    $('#sidebar').removeClass('open');
});

$('#logoutButton').click(() => {
    localStorage.removeItem('token');
    window.location.href = '/';
});

$('#dashboard').click(async () => {
    try {
        const url = 'https://notes-app-fullstack-rp7n.onrender.com';
        const response = await fetch(`${url}/api/v1/auth/checktoken`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (!data.success) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking token:', error);
    }
});
