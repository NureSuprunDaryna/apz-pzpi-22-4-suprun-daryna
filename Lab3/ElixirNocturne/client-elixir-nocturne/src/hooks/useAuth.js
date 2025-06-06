import { useState } from 'react';

export function useAuth() {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData); // збереження у стейті
    };

    const logout = () => {
        setUser(null);
    };

    return { user, login, logout };
}

