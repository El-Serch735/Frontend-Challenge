// src/services/auth.service.ts
// Definimos la interfaz aquí para que coincida con el Store
export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: 'admin' | 'user'; // Tipado estricto
  };
}

// Simulación de una función de login que valida las credenciales y devuelve un token y la información del usuario
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // En este ejemplo, solo se acepta un usuario específico con su contraseña. 
  // Si las credenciales son correctas, se devuelve un token y la información del usuario. Si no, se lanza un error con un mensaje específico.
  if (email === "eve.holt@reqres.in" && password === "cityslicka") {
    return { 
      token: "QpwL5tke4Pnpja7X4", 
      user: {
        email: "eve.holt@reqres.in",
        role: "admin" as const // El "as const" le dice a TS que es el valor exacto "admin"
      }
    };
  } else {
    const error: any = new Error("Missing password or user not found");
    error.response = { data: { error: "user not found" } };
    throw error;
  }
};
