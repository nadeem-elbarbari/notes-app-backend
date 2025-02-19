export const req = async (endpoint, method, body = null) => {
    const url = 'https://notes-app-fullstack-psi.vercel.app';
    try {
        const response = await fetch(`${url}/api/v1/${endpoint}`, {
            method,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });
        return response;
    } catch (error) {
        console.error('Request error:', error);
    }
};

const checkToken = async () => {
    try {
        const response = await req('auth/checktoken', 'GET');
        return (await response.json()).success;
    } catch (error) {
        console.error('Token check error:', error);
        return false;
    }
};

export const validateToken = async () => {
    const isValid = await checkToken();
    if (!isValid) {
        showAlert('Your session has expired. Please log in again');
        setTimeout(logOut, 3000);
    }
    return isValid;
};
