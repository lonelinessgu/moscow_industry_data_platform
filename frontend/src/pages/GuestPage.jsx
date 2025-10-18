import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from "../api/axios_api";

const App = () => {
  // Mock data for different metrics
  const populationData = [
    { year: 2023, value: 8500 },
    { year: 2024, value: 8700 },
    { year: 2025, value: 9000 }
  ];

  const legalEntitiesData = [
    { year: 2023, value: 120 },
    { year: 2024, value: 135 },
    { year: 2025, value: 150 }
  ];

  const individualEntrepreneursData = [
    { year: 2023, value: 240 },
    { year: 2024, value: 265 },
    { year: 2025, value: 290 }
  ];

  const avgRevenueData = [
    { year: 2023, value: 12.5 },
    { year: 2024, value: 14.2 },
    { year: 2025, value: 16.8 }
  ];

  const totalRevenueData = [
    { year: 2023, value: 12500, share: 35 },
    { year: 2024, value: 15600, share: 42 },
    { year: 2025, value: 19800, share: 53 }
  ];

  const revenueShareData = [
    { name: '2023', value: 35 },
    { name: '2024', value: 42 },
    { name: '2025', value: 53 }
  ];

  const allData = [
    { year: 2023, population: 8500, entities: 120, entrepreneurs: 240, revenue: 12.5 },
    { year: 2024, population: 8700, entities: 135, entrepreneurs: 265, revenue: 14.2 },
    { year: 2025, population: 9000, entities: 150, entrepreneurs: 290, revenue: 16.8 }
  ];

  // Normalize data for comparative dynamics chart
  const normalizedData = allData.map(item => {
    return {
      year: item.year,
      population: item.population / 100, // normalize to fit scale
      entities: item.entities,
      entrepreneurs: item.entrepreneurs,
      revenue: item.revenue * 10 // normalize to fit scale
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

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
      navigate('/main');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Login Form - Positioned top right */}
        <div className="absolute top-4 right-4 space-x-2">
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm"
            onClick={SendLoginToServer}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </div>

        {error && <div className="absolute top-20 right-4 text-red-500 text-sm">{error}</div>}

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Статистика по годам</h1>

        {/* Population, Legal Entities, Individual Entrepreneurs in one card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Тысячи человек, Тысячи юридических лиц, Тысячи ИП</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={allData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="population" name="Тысячи человек" fill="#3b82f6" />
              <Bar dataKey="entities" name="Тысячи юридических лиц" fill="#10b981" />
              <Bar dataKey="entrepreneurs" name="Тысячи ИП" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Revenue and Total Revenue in one card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Средняя и общая выручка</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Средняя выручка, млн руб</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={avgRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Общая выручка и доля</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={totalRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="value" fill="#6366f1" name="Общая выручка" />
                  <Bar yAxisId="right" dataKey="share" fill="#ec4899" name="Доля %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue share and comparative dynamics side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Доля выручки по годам</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Сравнительная динамика</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={normalizedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="population" stroke="#3b82f6" name="Население (тыс)" />
                <Line type="monotone" dataKey="entities" stroke="#10b981" name="ЮЛ (тыс)" />
                <Line type="monotone" dataKey="entrepreneurs" stroke="#8b5cf6" name="ИП (тыс)" />
                <Line type="monotone" dataKey="revenue" stroke="#ef4444" name="Выручка (млн руб)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;