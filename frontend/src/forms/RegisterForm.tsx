import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import '../styles/RegisterForm.css'
import {PathNames} from "../router/PathNames.ts";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [success] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (username.length < 3) {
            setError("Username must be at least 3 characters long.");
            return false;
        }
        if (password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*]/.test(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Email is not valid.");
            return false;
        }
        if (!/^[0-9]{9,15}$/.test(phone)) {
            setError("Phone number must be between 9 and 15 digits.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email, phone }),
            });

            if (response.ok) {
                setTimeout(() => {
                    navigate(PathNames.anonymous.login, { state: { successMessage: "Registration successful! You can now log in." } }); // Navigate to login page
                }, 1000);
            } else {
                const data = await response.json();
                setError(data.error || "Registration failed.");
            }
        } catch {
            setError("An error occurred during registration.");
        }
    };

    return (
        <div className="wrapper">
            <div className="back-link">
                <p><Link to={PathNames.anonymous.login}>← Back</Link></p>
            </div>
            <form >
                <h1>Register</h1>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}

export default RegisterForm;
