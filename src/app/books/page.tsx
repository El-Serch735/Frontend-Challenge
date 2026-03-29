'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBooks, Book } from '@/services/books.service';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { BookOpen, User, Info } from "lucide-react";

// La página `BooksPage` es una vista para buscar libros utilizando la API de Open Library.
export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Utilizamos React Query para obtener los datos de los libros desde la API de Open Library, y manejamos diferentes estados como loading, error y resultados.
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['books', query, author, year, page],
    queryFn: () => getBooks(query, page, author, year),
    enabled: query.length > 2 || author.length > 2 || year.length > 0,
  });

  // Renderizamos la página con el título, los filtros para buscar libros por título, autor y año, y los resultados en un diseño tipo "Netflix/Spotify".
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">Buscador de Libros</h1>
        <p className="text-muted-foreground text-sm">
          Consulta el catálogo global de Open Library
        </p>
      </header>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border shadow-sm">
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Título</label>
          <Input
            placeholder="Ej: Harry Potter"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Autor</label>
          <Input
            placeholder="Ej: J.K. Rowling"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Año</label>
          <Input
            type="number"
            placeholder="Ej: 1997"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* ESTADOS */}
      {(isLoading || isFetching) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500">
          Error al cargar libros.
        </div>
      )}

      {/* RESULTADOS */}
      {!isLoading && !isError && (
// Reemplaza el mapeo de libros por este diseño tipo "Netflix/Spotify"
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {data?.docs.map((book: Book) => (
    <div 
        key={book.key} 
        className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-xl bg-slate-200 shadow-md transition-all hover:-translate-y-2 hover:shadow-2xl"
        onClick={() => setSelectedBook(book)}
      >
        {book.cover_i ? (
          <img 
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <BookOpen className="mb-2 h-10 w-10 text-slate-400" />
            <p className="text-xs font-bold text-slate-500 uppercase">{book.title}</p>
          </div>
        )}

        {/* Overlay al hacer Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
          <h3 className="text-white text-sm font-bold line-clamp-2">{book.title}</h3>
          <p className="text-blue-300 text-[10px] font-medium uppercase mt-1">Ver detalles</p>
        </div>
      </div>
    ))}
  </div>

      )}

      {/* DRAWER DETALLE */}
      <Drawer open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">

            <DrawerHeader className="text-center">
              <DrawerTitle>{selectedBook?.title}</DrawerTitle>
              <DrawerDescription>Detalles del libro</DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col items-center gap-6 mt-4">

              {/* PORTADA GRANDE */}
              <div className="h-64 w-44 shadow-xl rounded overflow-hidden">
                <img
                  src={
                    selectedBook?.cover_i
                      ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
                      : 'https://placehold.co/200x300'
                  }
                  className="object-cover w-full h-full"
                  alt="Libro"
                />
              </div>

              {/* AUTOR */}
              <div className="w-full bg-slate-50 p-4 rounded-xl flex items-center gap-4 border">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200">
                  <img
                    src={`https://ui-avatars.com/api/?name=${selectedBook?.author_name?.[0] || 'Autor'}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-xs text-blue-600 uppercase font-bold">
                    Autor
                  </p>
                  <h4 className="font-semibold">
                    {selectedBook?.author_name?.[0] || 'Desconocido'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Año: {selectedBook?.first_publish_year || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full" onClick={() => setSelectedBook(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* PAGINACIÓN */}
      {data?.docs?.length > 0 && (
        <div className="flex items-center justify-center gap-4 border-t pt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <span className="text-sm font-bold">Página {page}</span>

          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}