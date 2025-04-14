import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// DELETE /api/projects/[id] - Deletar um projeto específico
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Obter o ID de forma correta
    const id = params.id;
    
    // Verificar se o projeto existe e pertence ao usuário
    const project = await db.project.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado ou não autorizado' },
        { status: 404 }
      );
    }
    
    // Deletar o projeto
    await db.project.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar projeto' },
      { status: 500 }
    );
  }
} 