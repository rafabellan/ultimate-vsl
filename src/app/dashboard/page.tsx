'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectManager from '@/components/ProjectManager';
import Sidebar from '@/components/Sidebar';
import VSLEditor from '@/components/VSLEditor';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleSelectSlide = (slideId: string) => {
    setActiveSlideId(slideId);
  };
  
  // Função para lidar com navegação no editor
  const handleEditorNavigate = (slideId: string) => {
    setActiveSlideId(slideId);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveSlideId(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px)] flex flex-col">
        {!selectedProjectId ? (
          <div className="flex-1 p-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">
                  Olá, {session?.user?.name}
                </h1>
                <p className="text-gray-600">
                  Bem-vindo ao Ultimate VSL. Selecione um projeto existente ou crie um novo.
                </p>
              </div>
              
              <ProjectManager onSelectProject={handleSelectProject} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex h-[calc(100vh-64px)]">
            <Sidebar 
              onSelectSlide={handleSelectSlide}
              activeSlideId={activeSlideId}
              projectId={selectedProjectId}
            />
            <div className="flex-1 flex flex-col">
              <div className="bg-white p-3 border-b flex justify-between items-center">
                <h1 className="text-lg font-medium">Editor VSL</h1>
                <button
                  onClick={handleBackToProjects}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Voltar aos Projetos
                </button>
              </div>
              <VSLEditor 
                activeSlideId={activeSlideId} 
                projectId={selectedProjectId} 
                onNavigate={handleEditorNavigate}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 