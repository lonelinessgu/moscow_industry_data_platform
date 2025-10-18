import React, { useState } from 'react';
import CustomSelect from '../ui/Selection';
import FieldRenderer from '../ui/FieldRenderer';
import { mainFields, productionFields, landFields, dopFields, oksFields } from "../data/FieldsData";

const FormPage = () => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    const allFields = [...mainFields, ...productionFields, ...landFields, ...dopFields, ...oksFields];
    allFields.forEach(([name, label, type, hasYears]) => {
      if (hasYears) {
        initialData[name] = {};
      } else {
        initialData[name] = '';
      }
    });
    initialData.yearlyData = {};
    initialData.selectedTypes = [];
    return initialData;
  });

  const [years, setYears] = useState(['2021', '2022', '2023', '2024']);
  const [templateFormat, setTemplateFormat] = useState('pdf');

  const cycleFormat = () => {
    if (templateFormat === 'pdf') {
      setTemplateFormat('excel');
    } else if (templateFormat === 'excel') {
      setTemplateFormat('word');
    } else {
      setTemplateFormat('pdf');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleYearlyChange = (field, year, value) => {
    setFormData(prev => ({
      ...prev,
      yearlyData: {
        ...prev.yearlyData,
        [field]: {
          ...prev.yearlyData[field],
          [year]: value
        }
      }
    }));
  };

  const handleSingleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addYear = () => {
    const newYear = (parseInt(years[years.length - 1]) + 1).toString();
    setYears(prev => [...prev, newYear]);
  };

  const downloadTemplate = () => {
    let fileName;
    if (templateFormat === 'pdf') {
      fileName = 'шаблон_КП.pdf';
    } else if (templateFormat === 'excel') {
      fileName = 'шаблон_КП.xlsx';
    } else {
      fileName = 'шаблон_КП.docx';
    }
    // В Vite используем /public как корень для статических файлов
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    link.click();
  };

  const renderYearlyFields = (label, field) => (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {years.map(year => (
          <div key={year} className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">{year}</span>
            <input
              type="number"
              value={formData.yearlyData[field]?.[year] || ''}
              onChange={(e) => handleYearlyChange(field, year, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const handleTypeChange = (type) => {
    setFormData(prev => {
      const newTypes = prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type];
      return { ...prev, selectedTypes: newTypes };
    });
  };

  const renderSubTypeFields = () => {
    const components = [];

    if (formData.selectedTypes.includes('production')) {
      components.push(
        <div key="production" className="mt-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Параметры производства</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productionFields.map((field) => (
              <FieldRenderer
                key={field[0]}
                field={field}
                value={formData[field[0]]}
                yearlyData={formData.yearlyData}
                years={years}
                onChange={handleInputChange}
                onYearlyChange={handleYearlyChange}
              />
            ))}
          </div>
        </div>
      );
    }

    if (formData.selectedTypes.includes('land')) {
      components.push(
        <div key="land" className="mt-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Параметры земельного участка</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landFields.map((field) => (
              <FieldRenderer
                key={field[0]}
                field={field}
                value={formData[field[0]]}
                yearlyData={formData.yearlyData}
                years={years}
                onChange={handleInputChange}
                onYearlyChange={handleYearlyChange}
              />
            ))}
          </div>
        </div>
      );
    }

    if (formData.selectedTypes.includes('dop')) {
      components.push(
        <div key="dop" className="mt-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Параметры ДОП</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dopFields.map((field) => (
              <FieldRenderer
                key={field[0]}
                field={field}
                value={formData[field[0]]}
                yearlyData={formData.yearlyData}
                years={years}
                onChange={handleInputChange}
                onYearlyChange={handleYearlyChange}
              />
            ))}
          </div>
        </div>
      );
    }

    if (formData.selectedTypes.includes('oks')) {
      components.push(
        <div key="oks" className="mt-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Параметры ОКС</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {oksFields.map((field) => (
              <FieldRenderer
                key={field[0]}
                field={field}
                value={formData[field[0]]}
                yearlyData={formData.yearlyData}
                years={years}
                onChange={handleInputChange}
                onYearlyChange={handleYearlyChange}
              />
            ))}
          </div>
        </div>
      );
    }

    return components;
  };

  const generalFields = mainFields;
  const financialFields = [
    { label: "Выручка предприятия, тыс. руб.", field: "revenue" },
    { label: "Чистая прибыль (убыток), тыс. руб.", field: "net_profit" },
    { label: "Среднесписочная численность персонала (всего по компании), чел", field: "staff_count_total" },
    { label: "Налог на прибыль, тыс. руб.", field: "profit_tax" },
    { label: "НДФЛ, тыс. руб.", field: "ndfl" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-gray-400 to-gray-700 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Регистрация организации
            </h1>
           <div className="flex items-center space-x-4">
                <div
                  onClick={cycleFormat}
                  className="px-4 py-2 text-black rounded-lg border border-blue-200 cursor-pointer select-none hover:bg-blue-50 hover:shadow-sm transition-all duration-200 min-w-[80px] text-center"
                >
                  {templateFormat.toUpperCase()}
                </div>
              <button
                onClick={downloadTemplate}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Скачать шаблон
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {generalFields.map(([name, label, type, hasYears]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                {name === 'msp_status' ? (
                  <CustomSelect
                    value={formData[name]}
                    options={[
                      { value: "микропредприятие", label: "Микропредприятие" },
                      { value: "малое", label: "Малое" },
                      { value: "среднее", label: "Среднее" }
                    ]}
                    placeholder="Выберите статус"
                    onChange={(e) => handleInputChange(name, e.target.value)}
                  />
                ) : hasYears ? (
                  <input
                    type="number"
                    value={formData[name]}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <input
                    type={type === 'int' || type === 'float' ? 'number' : type === 'date' ? 'date' : type === 'email' ? 'email' : 'text'}
                    value={formData[name]}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Финансовые показатели</h2>

            <div className="mb-6">
              <button
                onClick={addYear}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Добавить год
              </button>
              <div className="mt-2 text-sm text-gray-600">
                Текущие годы: {years.join(', ')}
              </div>
            </div>

            <div className="space-y-4">
              {financialFields.map(({ label, field }) => (
                renderYearlyFields(label, field)
              ))}
            </div>
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Дополнительные поля</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Типы деятельности</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "production", label: "Производство" },
                  { value: "land", label: "Земельный участок" },
                  { value: "dop", label: "ДОП" },
                  { value: "oks", label: "ОКС" }
                ].map(option => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.selectedTypes.includes(option.value)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                    onClick={() => handleTypeChange(option.value)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${
                        formData.selectedTypes.includes(option.value)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-400'
                      }`}>
                        {formData.selectedTypes.includes(option.value) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {renderSubTypeFields()}
          </div>

          <div className="flex justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
              Сохранить данные
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;