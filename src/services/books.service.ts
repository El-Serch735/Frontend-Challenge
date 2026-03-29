import { booksApi } from '@/lib/api';

// Definimos la interfaz `Book` para tipar los datos que recibiremos de la API de Open Library. 
// Esta interfaz incluye campos como `key`, `title`, `author_name`, `author_key`, `first_publish_year` y `cover_i`. 
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[]; // Añadimos esto para la foto del autor
  first_publish_year?: number;
  cover_i?: number;
}

// La función `getBooks` realiza una solicitud a la API de Open Library para buscar libros según un término de búsqueda, página, autor y año de publicación.
// La función construye una query combinada para la API, verificando que el término de búsqueda tenga al menos 3 caracteres. 
// Si el término es válido, se realiza la solicitud y se devuelve la respuesta con los datos de los libros encontrados.
export const getBooks = async (query: string, page = 1, author?: string, year?: string) => {
  const searchTerm = `${query} ${author}`.trim();
  if (searchTerm.length < 3) return { docs: [], numFound: 0 };

  // Construimos la query combinada para Open Library
  let q = query;
  if (author) q += ` author:${author}`;
  if (year) q += ` first_publish_year:${year}`;

  // Realizamos la solicitud a la API de Open Library con los parámetros adecuados para la búsqueda, paginación y limitación de resultados.
  const { data } = await booksApi.get('/search.json', {
    params: {
      q: q.trim(),
      page: page,
      limit: 10
    }
  });
  return data;
};
