

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
