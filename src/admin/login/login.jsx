import { useState } from "react";
import axios from "axios";
import { api } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { setToken } from "../auth";
import "./Login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            const res = await api.post("/login", { username, password });
            setToken(res.data.token);
            navigate("/admin");
        } catch (err) {
            console.log(err)
            setError("Invalid email or password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back 👋</h2>
                <p className="subtitle">Please log in to continue</p>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="login-btn" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}
