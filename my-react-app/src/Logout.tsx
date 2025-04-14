import { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem('jwtToken');
        window.location.href = '/'; // Redirect to the root path
    }, []);

    return null;
};

export default Logout;
