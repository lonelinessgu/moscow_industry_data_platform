import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from "../api/axios_api"
import Button from '../ui/Button';

export default function MainPage (){
    const navigate = useNavigate();

    return(
        <div className="bg-cyan-200 min-h-screen">
            <div className="flex items-center justify-center h-screen">
                <div className="max-w-md w-full  bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col flex items-center gap-4">
                        <div className="text-3xl">Вы вошли в систему</div>
                        <div className="flex gap-4">
                            <Button label="Создать нового пользователя" navigate_to="/create" />
                            <Button label="Выйти" navigate_to="/logout" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}