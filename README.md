# Document Chain Management System

Система управления документами с блокчейн-верификацией и историей действий.

## Описание проекта

Система позволяет управлять документами с возможностью их верификации через блокчейн и отслеживанием всей истории действий. Каждое действие с документом записывается в историю и создает транзакцию в блокчейне.

### Основные возможности

- Загрузка и управление документами
- Верификация документов через блокчейн
- Отслеживание истории действий
- Ролевая система (Администратор/Пользователь)
- API для интеграции с фронтендом

## Настройка локальной разработки

### Бэкенд (NestJS)

1. Запуск сервера разработки:

```bash
npm run start:dev
```

Сервер будет доступен по адресу: `http://localhost:3001`

2. CORS настроен для следующих origins:

- `http://localhost:3000` (React по умолчанию)
- `http://localhost:5173` (Vite по умолчанию)

### Фронтенд

#### React (Create React App)

1. Создание проекта:

```bash
npx create-react-app frontend --template typescript
cd frontend
```

2. Настройка прокси в package.json:

```json
{
  "proxy": "http://localhost:3001"
}
```

#### Vite + React

1. Создание проекта:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

2. Настройка Vite для прокси:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

3. Настройка Axios:

```typescript
// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api' // В режиме разработки используем прокси
    : 'http://your-production-api-url',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с CORS
});

// Добавление токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

4. Пример использования:

```typescript
// src/components/DocumentList.tsx
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Document {
  _id: string;
  title: string;
  content: string;
  status: string;
}

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data);
      } catch (err) {
        setError('Failed to fetch documents');
        console.error(err);
      }
    };

    fetchDocuments();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            {doc.title} - {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Переменные окружения

#### Бэкенд (.env)

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BLOCKCHAIN_NODE_URL=your_blockchain_node_url
PORT=3001
```

#### Фронтенд (.env)

```env
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### Аутентификация

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Документы

#### Создание документа

```http
POST /documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Contract #123",
  "content": "This is a contract document...",
  "status": "pending"
}
```

#### Получение списка документов

```http
GET /documents
Authorization: Bearer <token>
```

#### Получение документа по ID

```http
GET /documents/:id
Authorization: Bearer <token>
```

#### Одобрение документа (только для админов)

```http
POST /documents/:id/approve
Authorization: Bearer <token>
```

#### Отклонение документа (только для админов)

```http
POST /documents/:id/reject
Authorization: Bearer <token>
```

### История действий

#### Получение истории документа

```http
GET /history/document/:id
Authorization: Bearer <token>
```

#### Получение истории пользователя

```http
GET /history/user
Authorization: Bearer <token>
```

## Логика работы

### 1. Управление документами

#### Статусы документа

- `PENDING` - документ ожидает проверки
- `APPROVED` - документ одобрен
- `REJECTED` - документ отклонен

#### Процесс работы с документом

1. Пользователь загружает документ

   - Создается запись в базе данных
   - Записывается действие UPLOAD в историю
   - Создается транзакция в блокчейне

2. Просмотр документа

   - Записывается действие VIEW в историю
   - Создается транзакция в блокчейне

3. Одобрение документа (только для админов)

   - Обновляется статус документа
   - Записывается действие APPROVE в историю
   - Создается транзакция в блокчейне

4. Отклонение документа (только для админов)
   - Обновляется статус документа
   - Записывается действие REJECT в историю
   - Создается транзакция в блокчейне

### 2. История действий

Каждая запись в истории содержит:

- ID документа
- ID пользователя
- Тип действия (UPLOAD, VIEW, APPROVE, REJECT)
- Временную метку
- Хеш транзакции в блокчейне

### 3. Роли пользователей

#### Администратор

- Может создавать документы
- Может просматривать все документы
- Может одобрять/отклонять документы
- Имеет доступ к полной истории действий

#### Пользователь

- Может создавать документы
- Может просматривать свои документы
- Может видеть историю своих действий

## Интеграция с фронтендом

### Примеры запросов

#### React + Axios

```typescript
// Конфигурация axios
const api = axios.create({
  baseURL: 'http://your-api-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Примеры использования

// Создание документа
const createDocument = async (documentData) => {
  try {
    const response = await api.post('/documents', documentData);
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Получение списка документов
const getDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Одобрение документа
const approveDocument = async (documentId) => {
  try {
    const response = await api.post(`/documents/${documentId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving document:', error);
    throw error;
  }
};
```

### Обработка ошибок

```typescript
// Пример обработки ошибок
const handleApiError = (error) => {
  if (error.response) {
    // Ошибка от сервера
    switch (error.response.status) {
      case 401:
        // Неавторизован
        // Перенаправление на страницу входа
        break;
      case 403:
        // Нет доступа
        // Показать сообщение об ошибке
        break;
      case 404:
        // Документ не найден
        // Показать сообщение об ошибке
        break;
      default:
      // Другие ошибки
      // Показать общее сообщение об ошибке
    }
  } else if (error.request) {
    // Ошибка сети
    // Показать сообщение об ошибке сети
  } else {
    // Другие ошибки
    // Показать общее сообщение об ошибке
  }
};
```

## Установка и запуск

1. Клонировать репозиторий

```bash
git clone <repository-url>
```

2. Установить зависимости

```bash
npm install
```

3. Настроить переменные окружения

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BLOCKCHAIN_NODE_URL=your_blockchain_node_url
```

4. Запустить приложение

```bash
npm run start:dev
```

## Технологии

- Backend: NestJS
- Database: MongoDB
- Authentication: JWT
- Blockchain: Ethereum
- API Documentation: Swagger
