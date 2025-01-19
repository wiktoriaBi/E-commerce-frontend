import React, {createContext, useContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { PathNames } from '../router/PathNames';

interface UserContextProps {
    role: string | null;
    setRole: (role: string | null) => void;
    logOut: () => void;
}

const UserContext = createContext<UserContextProps>({
    role: null,
    setRole: () => {},
    logOut: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();
    console.log("UserContext!!!");

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Brak tokenu, brak roli
                setRole(null);
                return;
            }
            try {
                const decodedToken: { role: string; exp: number } = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token wygasł
                    localStorage.removeItem('authToken');
                    navigate(PathNames.anonymous.login);
                } else {
                    setRole(decodedToken.role);
                }
            } catch {
                // Niepoprawny token
                localStorage.removeItem("authToken");
                setRole(null);
                navigate(PathNames.anonymous.login); // Przekierowanie na login
            }
    };
    checkToken();
}, [navigate]);

    const logOut = () => {
        localStorage.removeItem('authToken');
        setRole(null);
        navigate(PathNames.anonymous.login);
    };

    return (
        <UserContext.Provider value={{ role, setRole, logOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
