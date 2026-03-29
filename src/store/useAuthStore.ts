import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definimos la interfaz del usuario y el estado de autenticación que tendrá nuestra tienda, 
// incluyendo las funciones para iniciar sesión y cerrar sesión
interface User {
  email: string;
  role: 'admin' | 'user';
}

// La tienda de autenticación maneja el estado global relacionado con el usuario autenticado, su token y si está autenticado o no.
// La función `setLogin` actualiza el estado con la información del usuario y el token, mientras que la función `logout` limpia esta información para cerrar sesión.
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setLogin: (user: User, token: string) => void;
  logout: () => void;
}

// Creamos la tienda usando Zustand y persistencia para mantener la sesión incluso después de recargar la página
// La función `setLogin` actualiza el estado con la información del usuario y el token, mientras que la función `logout` limpia esta información para cerrar sesión.
// La persistencia se configura con el nombre 'auth-session', lo que significa que los datos se almacenarán en LocalStorage bajo esa clave.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setLogin: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-session' } // Nombre de la llave en LocalStorage
  )
);
