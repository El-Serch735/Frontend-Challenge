import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';

// Este archivo contiene pruebas unitarias para la tienda de autenticación creada con Zustand.
// Se verifica que el estado inicial sea el esperado, que la función de login actualice el estado correctamente y que la función de logout limpie el estado como se espera.
describe('AuthStore - Estado Global', () => {
  beforeEach(() => {
    // Resetear el store antes de cada prueba
    useAuthStore.getState().logout();
  });

  // Prueba para verificar el estado inicial de la tienda de autenticación
  it('debe iniciar con estado no autenticado', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  // Prueba para verificar que la función de login actualiza el estado correctamente
  it('debe actualizar el estado correctamente al hacer login', () => {
    const mockUser = { email: 'admin@xdevelop.com', role: 'admin' as const };
    const mockToken = 'token-123';

    useAuthStore.getState().setLogin(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('admin@xdevelop.com');
    expect(state.token).toBe('token-123');
  });

  // Prueba para verificar que la función de logout limpia el estado correctamente
  it('debe limpiar el estado al cerrar sesión', () => {
    // Primero logueamos
    useAuthStore.getState().setLogin({ email: 'u@x.com', role: 'user' }, 't');
    
    // Luego cerramos sesión
    useAuthStore.getState().logout();
    
    // Verificamos que el estado se haya limpiado correctamente
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
