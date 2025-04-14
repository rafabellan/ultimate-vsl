'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Check, Bold, Italic, Save, Eye, ChevronLeft, ChevronRight, Monitor, Edit, Play, PlusCircle, Trash2, Video } from 'lucide-react';
import { useRouter } from 'next/router';
// Importar configuração das frases
import { slideOptions } from '@/config/vsl-content';

type SlideData = {
  id: string;
  content: string;
};

// Simulação de banco de dados local para armazenar o conteúdo dos slides
// A chave agora é composta: projectId + '_' + slideId
const slideContentMap = new Map<string, string>();

// Função para gerar um ID para slides
const generateSlideId = (step: number, section: number, slide: number) => {
  return `slide-${step}-${section}-${slide}`;
};

// Banco de dados simulado que será substituído por uma API real
const slidePhraseOptions = slideOptions;

// Inicializa as opções de frases para slides que não existem na configuração
(() => {
  // Para cada passo (1-5)
  for (let step = 1; step <= 5; step++) {
    // Para cada seção (1-2)
    for (let section = 1; section <= 2; section++) {
      // Para cada slide (1-3)
      for (let slide = 1; slide <= 3; slide++) {
        const slideId = generateSlideId(step, section, slide);
        // Só cria opções padrão se não existirem na configuração
        if (!slidePhraseOptions[slideId]) {
          slidePhraseOptions[slideId] = [
            `Opção de frase 1 para o slide ${step}.${section}.${slide}`,
            `Opção de frase 2 para o slide ${step}.${section}.${slide}`,
            `Opção de frase 3 para o slide ${step}.${section}.${slide}`,
          ];
        }
      }
    }
  }
})();

// Cores associadas a cada passo
const stepColors = [
  'text-blue-600 border-blue-600',
  'text-indigo-600 border-indigo-600',
  'text-purple-600 border-purple-600',
  'text-pink-600 border-pink-600',
  'text-rose-600 border-rose-600'
];

type SlideContentProps = {
  slideId: string | null;
  projectId: string;
  onNavigate: (direction: 'prev' | 'next') => void;
};

function SlideContent({ slideId, projectId, onNavigate }: SlideContentProps) {
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [phraseOptions, setPhraseOptions] = useState<string[]>([]);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Função para gerar a chave composta (projeto + slide)
  const getCompoundKey = (slideId: string) => `${projectId}_${slideId}`;

  useEffect(() => {
    if (slideId) {
      // Carregar conteúdo do slide quando o ID mudar
      // Agora usando uma chave composta que inclui o ID do projeto
      const compoundKey = getCompoundKey(slideId);
      const savedContent = slideContentMap.get(compoundKey);
      setContent(savedContent || '');
      
      // Resetar o índice da opção selecionada
      setSelectedPhraseIndex(null);
      
      // Carregar opções de frases para este slide
      if (slidePhraseOptions[slideId]) {
        setPhraseOptions(slidePhraseOptions[slideId]);
        
        // Verificar se o conteúdo salvo corresponde a alguma das opções
        const savedIndex = slidePhraseOptions[slideId].findIndex(phrase => phrase === savedContent);
        if (savedIndex !== -1) {
          setSelectedPhraseIndex(savedIndex);
        }
      } else {
        setPhraseOptions([]);
      }
    }
  }, [slideId, projectId]);

  // Adicionar event listeners para atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S ou Cmd+S para salvar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Ctrl+Right ou Cmd+Right para próximo slide
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate('next');
      }
      
      // Ctrl+Left ou Cmd+Left para slide anterior
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate('prev');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown as any);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [onNavigate]);

  if (!slideId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Selecione um slide para editar</p>
      </div>
    );
  }

  const slideInfo = slideId.split('-');
  const step = parseInt(slideInfo[1]);
  const section = slideInfo[2];
  const slide = slideInfo[3];
  
  // Determinar a cor do passo atual
  const currentStepColor = stepColors[step - 1] || stepColors[0];

  const handleSave = () => {
    if (!slideId) return;
    
    setIsSaving(true);
    
    // Simular uma requisição ao backend
    setTimeout(() => {
      try {
        // Salvar conteúdo no mapa local usando a chave composta
        const compoundKey = getCompoundKey(slideId);
        slideContentMap.set(compoundKey, content);
        
        // Salvar o slide na lista de slides salvos
        const savedSlidesKey = `savedSlides_${projectId}`;
        let savedSlides: string[] = [];
        const savedSlidesString = localStorage.getItem(savedSlidesKey);
        
        if (savedSlidesString) {
          savedSlides = JSON.parse(savedSlidesString);
        }
        
        // Adicionar o slide à lista se ainda não estiver lá
        if (!savedSlides.includes(compoundKey)) {
          savedSlides.push(compoundKey);
          localStorage.setItem(savedSlidesKey, JSON.stringify(savedSlides));
          
          // Disparar um evento customizado para notificar outros componentes
          const slideSavedEvent = new CustomEvent('slideSaved', {
            detail: {
              projectId,
              savedSlides
            }
          });
          
          window.dispatchEvent(slideSavedEvent);
        }
        
        // Exibir mensagem de sucesso
        setSaveMessage({ type: 'success', text: 'Slide salvo com sucesso!' });
        
        // Limpar mensagem após alguns segundos
        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      } catch (error) {
        setSaveMessage({ type: 'error', text: 'Erro ao salvar slide.' });
      } finally {
        setIsSaving(false);
      }
    }, 500); // Simulação de tempo de requisição
  };

  const handleSelectPhrase = (phrase: string, index: number) => {
    setContent(phrase);
    setSelectedPhraseIndex(index);
    // Exibir mensagem de sucesso
    setSaveMessage({ type: 'success', text: 'Frase selecionada! Clique em Salvar para confirmar.' });
    // Limpar mensagem após alguns segundos
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };
  
  // Funções para formatar o texto
  const formatText = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = 0;
    
    if (type === 'bold') {
      formattedText = `**${selectedText}**`;
      newCursorPos = start + formattedText.length;
    } else if (type === 'italic') {
      formattedText = `*${selectedText}*`;
      newCursorPos = start + formattedText.length;
    }
    
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    setContent(newContent);
    
    // Reajustar foco após a operação
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  // Função para renderizar o texto formatado
  const renderFormattedText = (text: string) => {
    if (!text) return '';
    
    // Substituir marcações de negrito
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Substituir marcações de itálico (apenas aquelas que não estão dentro de negrito)
    formattedText = formattedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    
    return formattedText;
  };

  // Se estiver no modo de tela cheia
  if (showFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className={`p-4 flex justify-between items-center border-b ${currentStepColor}`}>
          <h2 className="text-lg font-semibold">
            Visualização do Slide {step}.{section}.{slide}
          </h2>
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setShowFullScreen(false)}
          >
            Fechar
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full text-center">
            <div 
              className="text-2xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderFormattedText(content) }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`bg-white p-4 border-b border-l-4 ${currentStepColor}`}>
        <h2 className="text-lg font-semibold">
          Passo {step} &gt; Seção {section} &gt; Slide {slide}
        </h2>
      </div>
      <div className="flex-1 bg-white p-4 flex flex-col overflow-auto">
        <div className="flex justify-between mb-4">
          <span className="text-gray-500 text-sm">Slide {step}.{section}.{slide}</span>
          <div className="space-x-2">
            <button 
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
              onClick={() => onNavigate('prev')}
              title="Anterior (Ctrl+←)"
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>
            <button 
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1"
              onClick={() => onNavigate('next')}
              title="Próximo (Ctrl+→)"
            >
              <span>Próximo</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Mensagem de feedback */}
        {saveMessage && (
          <div 
            className={`mb-4 p-3 rounded ${
              saveMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        
        {/* Opções de frases */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Escolha uma frase para este slide:</h3>
          <div className="space-y-2">
            {phraseOptions.map((phrase, index) => (
              <div 
                key={index} 
                className={`p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors relative ${
                  selectedPhraseIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleSelectPhrase(phrase, index)}
              >
                <p className="pr-8">{phrase}</p>
                {selectedPhraseIndex === index && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                    <Check size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Barra de formatação */}
        <div className="bg-gray-50 p-2 rounded-t-md border border-gray-200 flex items-center">
          <button 
            className="p-1.5 rounded hover:bg-gray-200 mr-1"
            onClick={() => formatText('bold')}
            title="Negrito"
          >
            <Bold size={18} />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-200 mr-1"
            onClick={() => formatText('italic')}
            title="Itálico"
          >
            <Italic size={18} />
          </button>
          <div className="ml-auto flex items-center">
            <button 
              className={`p-1.5 rounded text-sm flex items-center gap-1 ${showPreview ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              onClick={() => setShowPreview(!showPreview)}
              title="Pré-visualização"
            >
              <Eye size={18} />
              <span>Visualizar</span>
            </button>
          </div>
        </div>
        
        <div className={`flex-1 flex ${showPreview ? 'flex-col sm:flex-row' : ''} border-x border-b border-gray-200 min-h-[300px]`}>
          {/* Editor de texto */}
          <div className={`${showPreview ? 'flex-1' : 'w-full h-full'}`}>
            <textarea
              ref={textareaRef}
              className="w-full h-full p-4 resize-none text-lg focus:outline-none"
              placeholder="O conteúdo do slide aparecerá aqui após selecionar uma das opções acima..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                
                // Se o conteúdo alterado manualmente não corresponder a nenhuma opção, limpar o índice selecionado
                const matchIndex = phraseOptions.findIndex(phrase => phrase === e.target.value);
                if (matchIndex === -1 && selectedPhraseIndex !== null) {
                  setSelectedPhraseIndex(null);
                }
              }}
              onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                // Previnir comportamento padrão para atalhos específicos
                if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          
          {/* Pré-visualização */}
          {showPreview && (
            <div className="flex-1 border-t sm:border-t-0 sm:border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: renderFormattedText(content) }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <div>
            <button 
              className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-50 rounded flex items-center gap-1"
              onClick={() => setShowFullScreen(true)}
            >
              <Monitor size={16} />
              <span>Tela Cheia</span>
            </button>
          </div>
          <button 
            className={`px-3 py-1 text-sm ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white rounded flex items-center gap-1`}
            onClick={handleSave}
            disabled={isSaving}
            title="Salvar (Ctrl+S)"
          >
            <Save size={16} />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VSLEditor({ 
  activeSlideId, 
  projectId, 
  onNavigate: parentNavigate 
}: { 
  activeSlideId: string | null, 
  projectId: string,
  onNavigate: (slideId: string) => void
}) {
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(activeSlideId);

  useEffect(() => {
    setCurrentSlideId(activeSlideId);
  }, [activeSlideId]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!currentSlideId) return;
    
    const parts = currentSlideId.split('-');
    const step = parseInt(parts[1]);
    const section = parseInt(parts[2]);
    const slide = parseInt(parts[3]);
    
    let nextSlideId: string | null = null;
    
    if (direction === 'next') {
      if (slide < 3) {
        // Próximo slide na mesma seção
        nextSlideId = `slide-${step}-${section}-${slide + 1}`;
      } else if (section < 2) {
        // Primeiro slide da próxima seção
        nextSlideId = `slide-${step}-${section + 1}-1`;
      } else if (step < 5) {
        // Primeiro slide da primeira seção do próximo passo
        nextSlideId = `slide-${step + 1}-1-1`;
      }
    } else {
      if (slide > 1) {
        // Slide anterior na mesma seção
        nextSlideId = `slide-${step}-${section}-${slide - 1}`;
      } else if (section > 1) {
        // Último slide da seção anterior
        nextSlideId = `slide-${step}-${section - 1}-3`;
      } else if (step > 1) {
        // Último slide da última seção do passo anterior
        nextSlideId = `slide-${step - 1}-2-3`;
      }
    }
    
    if (nextSlideId) {
      setCurrentSlideId(nextSlideId);
      // Notificar o componente pai sobre a mudança de slide
      parentNavigate(nextSlideId);
    }
  };

  return (
    <div className="flex-1 h-full">
      <SlideContent 
        slideId={currentSlideId} 
        projectId={projectId}
        onNavigate={handleNavigate} 
      />
    </div>
  );
} 