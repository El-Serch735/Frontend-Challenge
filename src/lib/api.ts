import axios from 'axios';

// 1. Cliente para Autenticación y Usuarios (ReqRes)
export const authApi = axios.create({
  baseURL: 'https://reqres.in', // Base URL para ReqRes
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Cliente para Posts y Comentarios (JSONPlaceholder)
export const dataApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// 3. Cliente para Libros (Open Library)
export const booksApi = axios.create({
  baseURL: 'https://openlibrary.org',
});