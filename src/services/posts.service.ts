import { dataApi } from '@/lib/api';

// Definimos las interfaces `Post` y `Comment` para tipar los datos que recibiremos de la API JSONPlaceholder.
// La interfaz `Post` incluye campos como `userId`, `id`, `title` y `body`, mientras que la interfaz `Comment` incluye campos como `postId`, `id`, `name`, `email` y `body`.
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// La interfaz `Comment` representa los comentarios asociados a un post específico, con campos como `postId`, `id`, `name`, `email` y `body`.
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Obtener todos los posts
// La función `getPosts` realiza una solicitud a la API JSONPlaceholder para obtener todos los posts disponibles.
export const getPosts = async (): Promise<Post[]> => {
  const { data } = await dataApi.get('/posts');
  return data;
};

// Obtener comentarios de un post específico
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  const { data } = await dataApi.get(`/posts/${postId}/comments`);
  return data;
};

// Crear un nuevo post
// La función `createPost` realiza una solicitud POST a la API JSONPlaceholder para crear un nuevo post con los datos proporcionados. 
export const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  const { data } = await dataApi.post('/posts', newPost);
  // JSONPlaceholder siempre devuelve ID 101, así que simulamos uno único para la UI
  return { ...data, id: Math.floor(Math.random() * 1000) + 101 };
};
// editar post 
// La función `updatePost` realiza una solicitud PUT a la API JSONPlaceholder para actualizar un post existente con los datos proporcionados.
export const updatePost = async (post: Post): Promise<Post> => {
  const { data } = await dataApi.put(`/posts/${post.id}`, post);
  console.log('Respuesta de la API al actualizar:', data);
  return data;
};