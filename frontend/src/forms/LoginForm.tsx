import {FaUser, FaLock} from "react-icons/fa"
import {Link, useNavigate} from "react-router-dom";
import '../styles/LoginForm.css'
import {useState} from "react";
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
    const [error, setError] = useState("");
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
                if (decodedToken.role === "WORKER") {
                    navigate(PathNames.worker.products);
                } else if (decodedToken.role === "CLIENT") {
                    navigate(PathNames.client.products);
                }
                localStorage.setItem("authToken", token);
                localStorage.setItem("username", username);
            }
            else if (r.status === 400) {
                setError("Invalid username or password.");
            }
            }).catch((error) => console.log(error));
    };
    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
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