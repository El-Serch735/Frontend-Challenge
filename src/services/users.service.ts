import axios from 'axios';

// Definimos la interfaz para que TypeScript nos ayude
// La interfaz `User` representa la estructura de un usuario que recibiremos de la API, con campos como `id`, `email`, `first_name`, `last_name` y `avatar`.
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// La interfaz `LoginResponse` representa la estructura de la respuesta que recibiremos al intentar iniciar sesión, con campos como `token` y `user`.
export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

// La función `getUsers` realiza una solicitud a la API para obtener una lista de usuarios paginada. 
export const getUsers = async (page = 1): Promise<UsersResponse> => {
  const { data } = await axios.get(`/api/users?page=${page}`);
  return data;
};
