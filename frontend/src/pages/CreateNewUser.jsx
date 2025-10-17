import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from "../api/axios_api";
import Button from '../ui/Button';

export default function CreateUserForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const SendLoginToServer = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post("/create_user", {
                login,
                password,
                role: "user"
            });

            console.log("Пользователь создан", response.data);
            setLogin('');
            setPassword('');
            setError('');
        } catch (err) {
            console.error("Ошибка при создании:", err);
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Ошибка при создании пользователя';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-cyan-200 min-h-screen">
            <div className="flex items-center justify-center h-screen">
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-3xl">Создание пользователя</div>

                        {error && <div className="text-red-500">{error}</div>}

                        <input
                            id="username"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-96"
                        />
                        <input
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-96"
                        />
                        <div className="flex gap-4">
                            <Button label={isLoading ? "Создание..." : "Создать пользователя"} onClick={SendLoginToServer}/>
                            <Button label="На главную страницу" navigate_to="/"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}