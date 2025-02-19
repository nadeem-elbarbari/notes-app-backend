import { req } from './auth.js';
import { showAlert } from './script.js';

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
        const response = await req('auth/checktoken', 'GET');
        const data = await response.json();
        if (!data.success) {
       console.log('Your session has expired. Please log in again');
       
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});
