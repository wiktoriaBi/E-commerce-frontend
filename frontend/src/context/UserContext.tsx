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
    const [loading, setLoading] = useState(true);
    console.log("UserContext!!!");

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log("No token found");
                // Brak tokenu, brak roli
                setRole(null);
                setLoading(false);
                return;
            }
            try {
                const decodedToken: { role: string; exp: number } = jwtDecode(token);
                console.log(decodedToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token wygasł
                    localStorage.removeItem('authToken');
                    navigate(PathNames.anonymous.login);
                } else {
                    console.log("Set role: ", decodedToken.role);
                    setRole(decodedToken.role);
                }
            } catch {
                // Niepoprawny token
                localStorage.removeItem("authToken");
                setRole(null);
                navigate(PathNames.anonymous.login); // Przekierowanie na login
            }
            finally {
                setLoading(false);
            }
    };
    checkToken();
}, [navigate]);

    const logOut = () => {
        localStorage.removeItem('authToken');
        setRole(null);
        navigate(PathNames.anonymous.login);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ role, setRole, logOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
