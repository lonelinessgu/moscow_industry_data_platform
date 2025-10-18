import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignOutAlt, FaFileAlt, FaCheckCircle, FaUsers, FaShieldAlt, FaUpload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function MainPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const buttonConfig = [
        ...(user?.role === 'admin' ? [{
            label: "Создать нового пользователя",
            navigate_to: "/create",
            icon: FaUserPlus,
            color: "bg-blue-500 hover:bg-blue-600",
            shadow: "shadow-blue-200"
        }] : []),
        {
            label: "Форма",
            navigate_to: "/form",
            icon: FaFileAlt,
            color: "bg-green-500 hover:bg-green-600",
            shadow: "shadow-green-200"
        },
        {
            label: "Загрузка файла",
            navigate_to: "/upload",
            icon: FaUpload,
            color: "bg-purple-500 hover:bg-purple-600",
            shadow: "shadow-purple-200"
        },
        {
            label: "Выйти",
            navigate_to: "/logout",
            icon: FaSignOutAlt,
            color: "bg-red-500 hover:bg-red-600",
            shadow: "shadow-red-200"
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100">
            <div className="flex items-center justify-center h-screen p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <FaShieldAlt className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать!</h1>
                        <p className="text-cyan-100 text-lg">Вы успешно вошли в систему</p>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <FaCheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">Аутентификация прошла успешно</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 w-full">
                                {buttonConfig.map((button, index) => {
                                    const IconComponent = button.icon;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleNavigation(button.navigate_to)}
                                            className={`
                                                ${button.color}
                                                ${button.shadow}
                                                group flex items-center justify-center gap-3 w-full
                                                px-6 py-4 rounded-xl text-white font-semibold
                                                transition-all duration-200 transform hover:scale-105
                                                hover:shadow-2xl active:scale-95
                                            `}
                                        >
                                            <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                            <span>{button.label}</span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                →
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-gray-200 w-full">
                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                    <FaUsers className="w-4 h-4" />
                                    <span className="text-sm">Управление системой</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-4">
                        <div className="text-center text-xs text-gray-500">
                            Система безопасности • Защита данных • Управление доступом
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}