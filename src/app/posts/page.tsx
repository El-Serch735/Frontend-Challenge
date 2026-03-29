'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, Post, updatePost } from '@/services/posts.service';
import { usePostStore } from '@/store/usePostStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Plus } from "lucide-react";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from '@/store/useAuthStore';

// La página `PostsPage` es la vista principal para mostrar y gestionar los posts.
// Utiliza React Query para obtener los datos de los posts desde la API, y Zustand para manejar la lógica de favoritos. 
// La página incluye un filtro para mostrar posts por usuario, un modal para crear nuevos posts (visible solo para admins), y la opción de editar posts existentes (también solo para admins). 
// Cada post se muestra en una tarjeta con su título, cuerpo, y botones para ver comentarios, marcar como favorito o editar (si el usuario es admin).
export default function PostsPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuthStore();

  const { toggleFavorite, isFavorite } = usePostStore();

  // 1. Query para obtener posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  // 2. Mutación Optimista para Crear Post
  const mutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPostData) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      queryClient.setQueryData(['posts'], (old: Post[] | undefined) => [
        { ...newPostData, id: Date.now(), userId: 1 },
        ...(old || []),
      ]);
      return { previousPosts };
    },
    onError: (err, newPostData, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      alert("Error al crear el post");
    }
  });

  // Lógica para manejar la creación de un nuevo post desde el modal.
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...newPost, userId: 1 });
    setIsOpen(false);
    setNewPost({ title: '', body: '' });
  };

  // Mutación para EDITAR Post
  const editMutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
        await queryClient.cancelQueries({ queryKey: ['posts'] });
        const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

        // Actualización Optimista: Buscamos el post y lo reemplazamos en el caché
        queryClient.setQueryData(['posts'], (old: Post[] | undefined) => 
        old?.map(post => post.id === updatedPost.id ? updatedPost : post)
        );

        return { previousPosts };
    },
    onError: (err, updatedPost, context) => {
        queryClient.setQueryData(['posts'], context?.previousPosts);
        alert("Error al editar el post");
    },
    });

    // Lógica para manejar la edición de un post existente desde el modal.
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
        editMutation.mutate(editingPost);
        setIsEditOpen(false);
        setEditingPost(null);
    }
  };


  // Lógica de filtrado
  const filteredPosts = selectedUser === "all" 
    ? posts 
    : posts?.filter(p => p.userId.toString() === selectedUser);

  if (isLoading) return <div className="p-20 text-center animate-pulse">Cargando muro...</div>;

  // Renderizamos la página con el título, el filtro por usuario, el botón para crear posts (solo para admins), y el grid de posts.
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* CABECERA CON FILTRO Y BOTÓN CREAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Muro de Posts</h1>
        
        <div className="flex items-center gap-4">
          {/* FILTRO POR USUARIO */}
          <div className="flex items-center gap-2 bg-white border p-1.5 rounded-md shadow-sm">
            <span className="text-xs font-semibold text-slate-500 px-2 uppercase">Filtrar por ID:</span>
            <select 
              className="bg-transparent border-none text-sm outline-none cursor-pointer"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="all">Todos</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                <option key={id} value={id}>Usuario {id}</option>
              ))}
            </select>
          </div>

          {/* MODAL CREAR POST */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              {/* Solo Admin ve el botón de crear */}
              {user?.role === 'admin' && (
                <Button onClick={() => setIsOpen(true)}>Crear Post</Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Publicación</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <Input 
                  placeholder="Título" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required
                />
                <Textarea 
                  placeholder="¿Qué quieres compartir?" 
                  value={newPost.body}
                  onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                  required
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Editar Publicación</DialogTitle>
                </DialogHeader>
                {editingPost && (
                <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                    <Input 
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    required
                    />
                    <Textarea 
                    value={editingPost.body}
                    onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}
                    required
                    />
                    <Button type="submit" className="w-full" disabled={editMutation.isPending}>
                    {editMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </form>
                )}
            </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* GRID DE POSTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts?.slice(0, 15).map((post: Post) => (
          <Card key={post.id} className="flex flex-col justify-between hover:shadow-xl transition-all border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  User {post.userId}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(post)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(post.id) ? "fill-red-500 text-red-500" : "text-slate-300"}`} />
                </Button>
              </div>
              <CardTitle className="text-lg leading-snug mt-2 capitalize h-14 line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                {post.body}
              </p>
            </CardContent>

            <CardFooter className="border-t pt-4 flex justify-between bg-slate-50/50">
              <Link href={`/posts/${post.id}`}>
                <Button variant="ghost" size="sm" className="gap-2 text-blue-600 hover:text-blue-700">
                  <MessageSquare className="h-4 w-4" />
                  Ver Comentarios
                </Button>
              </Link>
              {/* Solo Admin ve el botón de editar en la Card */}
              {user?.role === 'admin' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setEditingPost(post);
                    setIsEditOpen(true);
                }}
                >
                Editar
                </Button>)}
            </CardFooter>
          </Card>
        ))}
      </div> 
    </div>
  );
}
