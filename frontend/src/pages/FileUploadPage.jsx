import React, { useState } from 'react';
import { IoCloudUpload, IoDocument, IoClose, IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';
import { api } from '../api/axios_api'; // Путь к вашему api файлу

const FileUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('Недопустимый тип файла. Пожалуйста, выберите Excel, PDF или Word файл.');
      setSelectedFile(null);
      setFileName('');
      setFileType('');
      return false;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileType(file.type);
    setUploadStatus('');
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setUploadStatus('Загрузка...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Отправляем файл на backend
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Предполагается, что backend возвращает 200 OK при успешной загрузке
      setUploadStatus(`Файл "${selectedFile.name}" успешно загружен!`);
      setSelectedFile(null);
      setFileName('');
      setFileType('');
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      let errorMessage = 'Произошла ошибка при загрузке файла.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = `Ошибка: ${error.response.data.detail}`;
      }
      setUploadStatus(errorMessage);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('excel')) return (
      <div className="bg-green-100 p-3 rounded-lg">
        <IoDocument className="w-6 h-6 text-green-600" />
      </div>
    );
    if (type.includes('pdf')) return (
      <div className="bg-red-100 p-3 rounded-lg">
        <IoDocument className="w-6 h-6 text-red-600" />
      </div>
    );
    if (type.includes('word')) return (
      <div className="bg-blue-100 p-3 rounded-lg">
        <IoDocument className="w-6 h-6 text-blue-600" />
      </div>
    );
    return (
      <div className="bg-gray-100 p-3 rounded-lg">
        <IoDocument className="w-6 h-6 text-gray-600" />
      </div>
    );
  };

  const getFileTypeName = (type) => {
    if (type.includes('excel')) return 'Excel';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word')) return 'Word';
    return 'Файл';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Загрузка файлов</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Загрузите документы формата Excel, PDF или Word в нашу систему
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="mb-6">
                <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <IoCloudUpload className="w-10 h-10 text-indigo-600" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Перетащите файл сюда или нажмите для выбора</h3>
              <p className="text-slate-500 mb-6">Поддерживаются форматы: Excel, PDF, Word</p>

              <label className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium cursor-pointer hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                Выбрать файл
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.pdf,.doc,.docx"
                />
              </label>
            </div>
          </div>

          {fileName && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getFileIcon(fileType)}
                  <div>
                    <p className="font-medium text-slate-900 truncate max-w-xs">{fileName}</p>
                    <p className="text-sm text-slate-500">{getFileTypeName(fileType)}</p>
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileName('');
                    setFileType('');
                  }}
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {uploadStatus && (
            <div className={`mt-6 p-4 rounded-lg flex items-center ${
              uploadStatus.includes('успешно')
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {uploadStatus.includes('успешно') ? (
                <IoCheckmarkCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              ) : (
                <IoAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              {uploadStatus}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:hover:shadow-md"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Загрузить файл
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Поддерживаемые форматы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoDocument className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Excel</h3>
              <p className="text-slate-500">.xlsx, .xls</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoDocument className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">PDF</h3>
              <p className="text-slate-500">.pdf</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoDocument className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Word</h3>
              <p className="text-slate-500">.doc, .docx</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;