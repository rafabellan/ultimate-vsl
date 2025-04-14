'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, FolderOpen, Folder, BarChart, Clock, Search, Trash2, X, AlertCircle } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  progress?: number;
  savedSlides?: number;
  totalSlides?: number;
};

// Total de slides na estrutura padrão de VSL
const TOTAL_SLIDES = 5 * 2 * 3; // 5 passos * 2 seções * 3 slides = 30 slides

export default function ProjectManager({
  onSelectProject,
}: {
  onSelectProject: (projectId: string) => void;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'progress'>('all');
  
  // Adicionando estados para o modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar projetos
  useEffect(() => {
    const fetchProjects = async (retryCount = 0) => {
      try {
        const response = await fetch('/api/projects');
        
        if (response.status === 401) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Falha ao carregar projetos');
        }
        
        const data = await response.json();
        
        // Verificar se data é um array
        if (!Array.isArray(data)) {
          console.error('Resposta inesperada:', data);
          throw new Error('Formato de resposta inválido');
        }
        
        // Adicionar progresso real baseado nos slides salvos
        const projectsWithProgress = data.map((project: Project) => {
          // Buscar os slides salvos para este projeto do localStorage
          const savedSlidesKey = `savedSlides_${project.id}`;
          const savedSlidesString = localStorage.getItem(savedSlidesKey);
          const savedSlides = savedSlidesString ? JSON.parse(savedSlidesString) : [];
          
          // Calcular o progresso real
          const progress = savedSlides.length > 0 
            ? Math.round((savedSlides.length / TOTAL_SLIDES) * 100)
            : 0;
          
          return {
            ...project,
            progress,
            savedSlides: savedSlides.length,
            totalSlides: TOTAL_SLIDES
          };
        });
        
        setProjects(projectsWithProgress);
        // Limpar qualquer erro anterior se a requisição for bem-sucedida
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        setError('Erro ao carregar projetos. Tente novamente mais tarde.');
        
        // Tentar novamente automaticamente se for menos que 3 tentativas
        if (retryCount < 2) {
          console.log(`Tentando novamente em 2 segundos (tentativa ${retryCount + 1}/3)...`);
          setTimeout(() => fetchProjects(retryCount + 1), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
    
    // Escutar por alterações de progresso nos projetos
    const handleSlideSave = (e: CustomEvent) => {
      if (e.detail && e.detail.projectId) {
        setProjects(prev => 
          prev.map(project => {
            if (project.id === e.detail.projectId) {
              const savedSlides = e.detail.savedSlides || [];
              const progress = savedSlides.length > 0
                ? Math.round((savedSlides.length / TOTAL_SLIDES) * 100)
                : 0;
              
              return {
                ...project,
                progress,
                savedSlides: savedSlides.length,
                totalSlides: TOTAL_SLIDES
              };
            }
            return project;
          })
        );
      }
    };
    
    window.addEventListener('slideSaved', handleSlideSave as EventListener);
    
    return () => {
      window.removeEventListener('slideSaved', handleSlideSave as EventListener);
    };
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar projeto');
      }
      
      const newProject = await response.json();
      
      // Adicionar progresso inicial (0%)
      const newProjectWithProgress = {
        ...newProject,
        progress: 0,
        savedSlides: 0,
        totalSlides: TOTAL_SLIDES
      };
      
      setProjects([newProjectWithProgress, ...projects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateForm(false);
    } catch (err) {
      setError('Erro ao criar projeto. Tente novamente.');
      console.error('Erro ao criar projeto:', err);
    }
  };

  // Filtrar projetos com base na pesquisa e filtros
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (filterType === 'recent') {
      // Projetos dos últimos 7 dias (simulado)
      const projectDate = new Date(project.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return projectDate >= sevenDaysAgo;
    }
    
    if (filterType === 'progress') {
      // Projetos com progresso > 50%
      return (project.progress || 0) > 50;
    }
    
    return true;
  });

  // Função para gerar uma cor com base no nome do projeto
  const getProjectColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800'
    ];
    
    // Usar a soma dos códigos de caractere como hash simples
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Função para exibir o modal de confirmação de exclusão
  const openDeleteModal = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Evitar que o clique abra o projeto
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Função para fechar o modal de confirmação
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  // Função para deletar o projeto
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao deletar projeto');
      }
      
      // Remover o projeto da lista
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      
      // Também remover dados do localStorage
      const savedSlidesKey = `savedSlides_${projectToDelete.id}`;
      localStorage.removeItem(savedSlidesKey);
      
      // Fechar o modal
      closeDeleteModal();
    } catch (err) {
      setError('Erro ao deletar projeto. Tente novamente.');
      console.error('Erro ao deletar projeto:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Seus Projetos</h2>
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-md transition-colors"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <PlusCircle size={16} />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Pesquisar projetos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-2 rounded-md text-sm ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilterType('all')}
          >
            Todos
          </button>
          <button 
            className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 ${filterType === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilterType('recent')}
          >
            <Clock size={14} />
            Recentes
          </button>
          <button 
            className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 ${filterType === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilterType('progress')}
          >
            <BarChart size={14} />
            Avançados
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateProject} className="mb-6 p-6 bg-gray-50 rounded-md shadow-sm border border-gray-200">
          <div className="mb-3">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Projeto
            </label>
            <input
              type="text"
              id="projectName"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="projectDescription"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Criar Projeto
            </button>
          </div>
        </form>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Confirmar exclusão</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center text-amber-600 gap-2 mb-4">
                <AlertCircle size={24} />
                <p className="font-medium">Esta ação não pode ser desfeita!</p>
              </div>
              <p>
                Você tem certeza que deseja excluir o projeto <strong>{projectToDelete.name}</strong>?
                <br />
                Todos os dados associados a este projeto serão perdidos permanentemente.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Projeto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando projetos...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            {searchQuery 
              ? 'Nenhum projeto encontrado para esta pesquisa.' 
              : 'Você ainda não tem projetos. Crie seu primeiro projeto!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Miniatura visual colorida */}
              <div className={`h-3 ${getProjectColor(project.name)}`}></div>
              
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getProjectColor(project.name)}`}>
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    
                    {/* Barra de progresso */}
                    <div className="mt-3 mb-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{project.progress}% ({project.savedSlides || 0}/{project.totalSlides || TOTAL_SLIDES})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                      {project.description || 'Sem descrição'}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                      Criado em: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md py-2 hover:bg-blue-50 transition-colors"
                    onClick={() => onSelectProject(project.id)}
                  >
                    <FolderOpen size={14} />
                    <span>Abrir</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md py-2 px-3 hover:bg-red-50 transition-colors"
                    onClick={(e) => openDeleteModal(e, project)}
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 