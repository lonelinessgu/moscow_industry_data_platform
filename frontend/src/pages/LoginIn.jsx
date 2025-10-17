import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from "../api/axios_api";
import Button from '../ui/Button';

export default function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const passwordRef = useRef(null);

    const SendLoginToServer = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post("/login", {
                login,
                password
            });
            const { access_token, user } = response.data;
            authLogin(access_token, user);
            setLogin('');
            setPassword('');
        } catch (err) {
            console.error("Ошибка при входе:", err);
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Ошибка входа. Проверьте логин и пароль.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordRef.current?.focus();
        }
    };

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            SendLoginToServer();
        }
    };

    return (
        <div className="bg-cyan-200 min-h-screen">
            <div className="flex items-center justify-center h-screen">
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-3xl">Вход в систему</div>
                        <input
                            id="username"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            onKeyDown={handleLoginKeyDown}
                            className="border border-gray-300 rounded-md p-2 w-96"
                            autoFocus
                        />
                        <input
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handlePasswordKeyDown}
                            ref={passwordRef}
                            className="border border-gray-300 rounded-md p-2 w-96"
                        />
                        <Button label="Войти" onClick={SendLoginToServer} disabled={isLoading}/>

                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}