'use client';
import { use } from 'react'; // Para obtener el ID de los params
import { useQuery } from '@tanstack/react-query';
import { getPostComments } from '@/services/posts.service';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// La página `PostDetailPage` muestra los detalles de un post específico, incluyendo sus comentarios.
// Utiliza React Query para obtener los comentarios del post desde la API, y muestra un botón para volver a la lista de posts. 
// Cada comentario se muestra en una tarjeta con el nombre del autor, su email, y el cuerpo del comentario.
export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = parseInt(id);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => getPostComments(postId),
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Cargando comentarios...</div>;

  // Renderizamos la página con el título, el filtro por usuario, el botón para crear posts (solo para admins), y el grid de posts.
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Link href="/posts">
        <Button variant="ghost" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver a Posts
        </Button>
      </Link>

      <div className="flex items-center gap-2 text-2xl font-bold">
        <MessageCircle className="h-6 w-6 text-blue-500" />
        <h1>Comentarios del Post #{postId}</h1>
      </div>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id} className="border-l-4 border-l-blue-400">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {comment.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-semibold capitalize">{comment.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{comment.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{comment.body}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
