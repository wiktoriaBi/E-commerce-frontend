import {FaUser, FaLock} from "react-icons/fa"
import {Link, useNavigate} from "react-router-dom";
import '../styles/LoginForm.css'
import React, {useState} from "react";
import properties from "../properties/properties.ts";
import {PathNames} from "../router/PathNames.ts";
import {useUserContext} from "../context/UserContext.tsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


interface LoginResponse {
    token: string;
}

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setRole } = useUserContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            username: username,
            password: password
        };
         axios.post<LoginResponse>(`${properties.serverAddress}/login`, JSON.stringify(payload),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(r => {
            if (r.status === 200) {
                const { token } = r.data;
                const decodedToken: { role: string } = jwtDecode(token);

                setRole(decodedToken.role);
                // Przekierowanie w zależności od roli użytkownika
                navigate(PathNames.authenticated.products);
                localStorage.setItem("authToken", token);
                localStorage.setItem("username", username);
            }
            }).catch((error) => {
                console.log(error.response.data);
                setErrorMessage(error.response.data.error);
                setShowError(true);
            });
    };
    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {showError && <p className="text-bg-danger border-danger rounded">{errorMessage}</p>}
                <div className="input-box">
                    <input type='text'
                           placeholder='Username'
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                    />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type='password'
                           placeholder='Password'
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                    />
                    <FaLock className="icon"/>
                </div>
                <button type="submit">Login</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to={PathNames.anonymous.register}>Register</Link> </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;