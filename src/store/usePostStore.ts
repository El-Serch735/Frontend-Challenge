import { create } from 'zustand'; 
import { persist } from 'zustand/middleware'; 
import { Post } from '@/services/posts.service'; 

interface PostState { // Definimos la interfaz del estado que tendrá nuestra tienda, incluyendo la lista de favoritos y las funciones para modificarla
  favorites: Post[]; 
  toggleFavorite: (post: Post) => void; 
  isFavorite: (postId: number) => boolean; 
}

// Creamos la tienda usando Zustand y persistencia para mantener los favoritos incluso después de recargar la página
// La función `toggleFavorite` agrega o elimina un post de la lista de favoritos dependiendo de si ya está presente o no. 
// La función `isFavorite` verifica si un post específico está en la lista de favoritos.
export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (post) => {
        const isFav = get().favorites.some((f) => f.id === post.id);
        if (isFav) {
          set({ favorites: get().favorites.filter((f) => f.id !== post.id) });
        } else {
          set({ favorites: [...get().favorites, post] });
        }
      },
      isFavorite: (postId) => get().favorites.some((f) => f.id === postId),
    }),
    { name: 'post-favorites' }
  )
);
