// this will let the user logout

const logoutHandler = async () => {
    const response = await fetch ('/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.replace('/');
        alert ('Logged out!')
    } else {
        alert ('Failed to log out!')
    }
};

document.querySelector('#logout').addEventListener('click', logoutHandler);
