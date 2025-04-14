'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Home, List, Navigation, MinusSquare, CheckCircle2 } from 'lucide-react';
// Importar as configurações do arquivo centralizado
import { stepColors, stepNames, sectionNames } from '@/config/vsl-content';

type SlideType = {
  id: string;
  number: number;
  title: string;
};

type SectionType = {
  id: string;
  number: number;
  title: string;
  slides: SlideType[];
};

type StepType = {
  id: string;
  number: number;
  title: string;
  color: string;
  sections: SectionType[];
};

// Construir a estrutura usando os dados de configuração
const exampleSteps: StepType[] = Array.from({ length: 5 }, (_, i) => ({
  id: `step-${i + 1}`,
  number: i + 1,
  title: stepNames[i] || `Passo ${i + 1}`,
  color: stepColors[i],
  sections: Array.from({ length: 2 }, (_, j) => ({
    id: `section-${i + 1}-${j + 1}`,
    number: j + 1,
    title: sectionNames[i+1]?.[j] || `Seção ${j + 1}`,
    slides: Array.from({ length: 3 }, (_, k) => ({
      id: `slide-${i + 1}-${j + 1}-${k + 1}`,
      number: k + 1,
      title: `Slide ${k + 1}`,
    })),
  })),
}));

export default function Sidebar({
  onSelectSlide,
  activeSlideId,
  projectId,
}: {
  onSelectSlide: (slideId: string) => void;
  activeSlideId: string | null;
  projectId: string;
}) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [totalSlides, setTotalSlides] = useState(0);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(0);
  const [savedSlides, setSavedSlides] = useState<string[]>([]);
  const [allExpanded, setAllExpanded] = useState(false);

  // Função para verificar slides salvos no localStorage
  useEffect(() => {
    // Carregar slides salvos do localStorage com base no projectId
    const savedSlidesKey = `savedSlides_${projectId}`;
    const savedSlidesString = localStorage.getItem(savedSlidesKey);
    if (savedSlidesString) {
      setSavedSlides(JSON.parse(savedSlidesString));
    } else {
      setSavedSlides([]);
    }

    // Escutar por eventos de armazenamento de slides
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === savedSlidesKey) {
        const newSavedSlides = e.newValue ? JSON.parse(e.newValue) : [];
        setSavedSlides(newSavedSlides);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Também escutar um evento customizado para atualizações no mesmo navegador
    const handleSlideSave = (e: CustomEvent) => {
      if (e.detail && e.detail.projectId === projectId) {
        setSavedSlides(e.detail.savedSlides);
      }
    };
    
    window.addEventListener('slideSaved', handleSlideSave as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('slideSaved', handleSlideSave as EventListener);
    };
  }, [projectId]);

  // Auto-expandir passos e seções quando um slide é selecionado
  useEffect(() => {
    if (activeSlideId) {
      const parts = activeSlideId.split('-');
      const stepId = `step-${parts[1]}`;
      const sectionId = `section-${parts[1]}-${parts[2]}`;
      
      setExpandedSteps(prev => ({
        ...prev,
        [stepId]: true
      }));
      
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: true
      }));

      // Cálculo da posição atual para a barra de progresso
      const step = parseInt(parts[1]);
      const section = parseInt(parts[2]);
      const slide = parseInt(parts[3]);
      
      // Cálculo simplificado da posição
      const current = ((step - 1) * 6) + ((section - 1) * 3) + slide;
      setCurrentSlideNumber(current);
    }
  }, [activeSlideId]);

  // Calcular total de slides
  useEffect(() => {
    let total = 0;
    exampleSteps.forEach(step => {
      step.sections.forEach(section => {
        total += section.slides.length;
      });
    });
    setTotalSlides(total);
  }, []);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const selectSlide = (slideId: string) => {
    onSelectSlide(slideId);
  };

  // Navegar para o início
  const goToFirstSlide = () => {
    onSelectSlide('slide-1-1-1');
  };

  // Navegar para o fim
  const goToLastSlide = () => {
    onSelectSlide('slide-5-2-3');
  };
  
  // Expandir ou colapsar todos os passos
  const toggleExpandAll = () => {
    if (allExpanded) {
      // Colapsar tudo
      setExpandedSteps({});
      setExpandedSections({});
    } else {
      // Expandir tudo
      const allStepsExpanded = {} as Record<string, boolean>;
      const allSectionsExpanded = {} as Record<string, boolean>;
      
      exampleSteps.forEach(step => {
        allStepsExpanded[step.id] = true;
        step.sections.forEach(section => {
          allSectionsExpanded[section.id] = true;
        });
      });
      
      setExpandedSteps(allStepsExpanded);
      setExpandedSections(allSectionsExpanded);
    }
    
    setAllExpanded(!allExpanded);
  };

  // Calcular o progresso com base nos slides salvos
  const progressPercentage = totalSlides > 0 
    ? (savedSlides.length / totalSlides) * 100 
    : 0;

  return (
    <div className="w-72 h-full bg-gray-100 flex flex-col">
      {/* Cabeçalho da Sidebar com Barra de Progresso */}
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Estrutura do VSL</h2>
        
        {/* Barra de progresso */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}% ({savedSlides.length}/{totalSlides})</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Botões de navegação rápida */}
        <div className="flex justify-between mt-3">
          <button 
            onClick={goToFirstSlide}
            className="flex items-center text-xs text-gray-700 hover:text-blue-600 gap-1 p-1 rounded hover:bg-gray-100"
          >
            <Home size={14} />
            <span>Início</span>
          </button>
          
          <button
            className="flex items-center text-xs text-gray-700 hover:text-blue-600 gap-1 p-1 rounded hover:bg-gray-100"
            onClick={toggleExpandAll}
          >
            {allExpanded ? (
              <>
                <MinusSquare size={14} />
                <span>Colapsar</span>
              </>
            ) : (
              <>
                <List size={14} />
                <span>Expandir</span>
              </>
            )}
          </button>
          
          <button 
            onClick={goToLastSlide}
            className="flex items-center text-xs text-gray-700 hover:text-blue-600 gap-1 p-1 rounded hover:bg-gray-100"
          >
            <Navigation size={14} />
            <span>Fim</span>
          </button>
        </div>
      </div>
      
      {/* Lista de passos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {exampleSteps.map((step) => (
          <div key={step.id} className="rounded-md overflow-hidden shadow-sm">
            <button
              className={`w-full flex items-center justify-between p-3 text-left font-medium bg-gradient-to-r ${step.color} text-white hover:shadow-md transition-shadow`}
              onClick={() => toggleStep(step.id)}
            >
              <span>{step.title}</span>
              {expandedSteps[step.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {expandedSteps[step.id] && (
              <div className="py-1 border-x border-b border-gray-200 bg-white">
                {step.sections.map((section) => (
                  <div key={section.id} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between p-2 text-left text-sm font-medium hover:bg-gray-50"
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${step.color}`}></span>
                        <span>
                          {section.title}
                        </span>
                      </span>
                      {expandedSections[section.id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {expandedSections[section.id] && (
                      <div className="pl-7 pr-2 py-1">
                        {section.slides.map((slide) => {
                          const slideKey = `${projectId}_${slide.id}`;
                          const isSaved = savedSlides.includes(slideKey);
                          
                          return (
                            <button
                              key={slide.id}
                              className={`w-full text-left text-xs p-2 rounded flex items-center ${
                                activeSlideId === slide.id 
                                  ? `bg-gradient-to-r ${step.color} bg-opacity-20 text-gray-800` 
                                  : 'hover:bg-gray-100'
                              } ${isSaved ? 'font-medium' : 'font-normal'}`}
                              onClick={() => selectSlide(slide.id)}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                activeSlideId === slide.id 
                                  ? `bg-gradient-to-r ${step.color}` 
                                  : isSaved ? 'bg-green-500' : 'bg-gray-300'
                              }`}></span>
                              <span>Slide {slide.number}</span>
                              {isSaved && (
                                <span className="ml-auto">
                                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 