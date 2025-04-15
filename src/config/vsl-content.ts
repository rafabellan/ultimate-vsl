/**
 * Arquivo de configuração para a estrutura da VSL
 * Altere este arquivo para modificar nomes de passos, seções e as opções de frases para cada slide
 */

// Cores para cada passo (não é necessário alterar a menos que deseje cores diferentes)
export const stepColors = [
  'from-blue-500 to-blue-600',
  'from-indigo-500 to-indigo-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-rose-500 to-rose-600'
];

// Defina os nomes dos passos aqui
export const stepNames = [
  "A Sugestão Snap", 
  "A Conexão Vital",
  "O Grande Problema",
  "A Grande Solução",
  "A Grande Oferta",
  "Perguntas & Respostas"
];

// Defina os nomes das seções para cada passo
export const sectionNames: { [key: number]: string[] } = {
  // Passo 1: A Sugestão Snap
  1: [
    "Quebra de Padrão",
    "Sua Grande Promessa",
    "Escassez do Vídeo",
    "Algo Completamente Diferente",
    "Vamos Fazer um Acordo"
  ],
  // Passo 2: A Conexão Vital
  2: [
    "Introdução Modesta",
    "A História do Pesadelo",
    "Transição Para o Grande Problema",
    "Sobre o Sistema",
    "Resultados do Sistema",
    "Transição Final"
  ],
  // Passo 3: O Grande Problema
  3: [
    "Visão Geral",
    "Transição para a Grande Mentira",
    "Loop da Grande Mentira",
    "A Culpa Não é Sua",
    "Culpe Isso",
    "A Grande Verdade",
    "Loop Para a Grande Solução"
  ],
  // Passo 4: A Grande Solução
  4: [
    "Abertura de Loop de Dicas",
    "Resumo da Fórmula de Dicas",
    "A Dica do Que Evitar",
    "A Dica do Que Curtir",
    "A Dica do Que Fazer",
    "Transição para a Grande Oferta"
  ],
  // Passo 5: A Grande Oferta
  5: [
    "O Produto",
    "O Preço",
    "A Chamada Para Ação",
    "Dor/Prazer",
    "Ações/Resultados"
  ],
  // Passo 6: Perguntas & Respostas
  6: [
    "O Produto",
    "O Preço",
    "A Chamada Para Ação",
    "Dor/Prazer",
    "Ações/Resultados"
  ]
};

// Defina as opções de frases para cada slide
export const slideOptions: { [key: string]: string[] } = {
  // PASSO 1
  // Seção 1.1: Quebra de Padrão
  "slide-1-1-1": [
    "Oi, meu nome é (SEU NOME OU NOME DA TERCEIRA PESSOA FAZENDO O VÍDEO) e essa é uma (IMAGEM DE INTERRUPÇÃO)...?",
    "Oi, meu nome é (SEU NOME OU NOME DA TERCEIRA PESSOA FAZENDO O VÍDEO) e sem essa (IMAGEM DE INTERRUPÇÃO), você não tem chance alguma de conseguir/ter/conquistar (OBJETIVO)...",
    "Meu nome é (SEU NOME OU NOME DA TERCEIRA PESSOA FAZENDO O VÍDEO) e o que você está enxergando nesse exato instante é uma (IMAGEM DE INTERRUPÇÃO)... estranho não?"
  ],
  "slide-1-1-2": [
    "Em apenas alguns minutos você vai descobrir porque essa (IMAGEM) é o SEGREDO para que você possa (OBJETIVO)...",
    "Eu já vou explicar o que isso significa logo logo...",
    "Curioso? Então não se preocupe que tudo vai fazer sentido daqui a pouco...",
    "Bom, acredite ou não, essa (IMAGEM DE INTERRUPÇÃO) contém o segredo para que você consiga finalmente (OBJETIVO)..."
  ],
  "slide-1-1-3": [
    "O segredo que a indústria de [área] não quer que você saiba.",
    "Após [número] anos de pesquisa, finalmente descobrimos a solução para [problema].",
    "Esta informação é tão poderosa que pode [benefício transformador]."
  ],
  
  // Seção 1.2: Estabelecer Credibilidade
  "slide-1-2-1": [
    "Meu nome é [Nome] e sou especialista em [área] há mais de [número] anos.",
    "Como fundador da [empresa/método], já ajudei mais de [número] pessoas a [benefício].",
    "Nosso método exclusivo já foi validado por [especialistas/instituições respeitadas]."
  ],
  "slide-1-2-2": [
    "Antes de criar este método, eu também sofria com [problema comum].",
    "Nossa equipe de especialistas trabalhou por [tempo] para desenvolver esta solução.",
    "Os resultados que obtivemos com [número] clientes comprovam a eficácia deste sistema."
  ],
  "slide-1-2-3": [
    "Fomos reconhecidos por [publicação/organização] como líderes em [área/solução].",
    "Nossa taxa de sucesso de [percentual]% supera qualquer outra solução disponível no mercado.",
    "O método que você vai conhecer hoje é baseado em [ciência/tecnologia/princípio] avançado."
  ],
  
  // PASSO 2
  // Seção 2.1: Dor e Frustração
  "slide-2-1-1": [
    "A cada dia que passa sem resolver [problema], você perde [benefício/oportunidade].",
    "Muitas pessoas gastam anos tentando solucionar [problema] com métodos ultrapassados.",
    "O custo emocional de continuar enfrentando [problema] pode ser devastador."
  ],
  "slide-2-1-2": [
    "Imagino que você já tenha tentado [soluções comuns] sem obter resultados satisfatórios.",
    "A frustração de investir tempo e dinheiro em soluções que não funcionam é enorme.",
    "Sentir-se preso a [problema] pode afetar sua autoestima e qualidade de vida."
  ],
  "slide-2-1-3": [
    "O ciclo vicioso de [problema recorrente] drena sua energia e motivação.",
    "Muitos desistem de seus sonhos porque não conseguem superar [obstáculo].",
    "A sensação de impotência diante de [problema] é algo que ninguém merece sentir."
  ],
  
  // Seção 2.2: Consequências Negativas
  "slide-2-2-1": [
    "Se você não resolver [problema] agora, em [tempo futuro] a situação pode piorar significativamente.",
    "Estudos mostram que [problema não resolvido] pode levar a [consequência grave].",
    "Ignorar [problema] hoje pode custar [valor/recurso] no futuro."
  ],
  "slide-2-2-2": [
    "As estatísticas mostram que [percentual]% das pessoas que não resolvem [problema] acabam enfrentando [consequência].",
    "Sem uma solução eficaz, [problema] tende a se agravar e afetar outras áreas da sua vida.",
    "O impacto financeiro de não resolver [problema] pode chegar a [valor] por ano."
  ],
  "slide-2-2-3": [
    "A longo prazo, [problema] pode comprometer sua [saúde/relacionamentos/finanças/etc.].",
    "A maioria das pessoas só percebe a gravidade de [problema] quando já é tarde demais.",
    "Continuar no mesmo caminho levará inevitavelmente a [consequência negativa]."
  ],
  
  // PASSO 3
  // Seção 3.1: Revelação da Solução
  "slide-3-1-1": [
    "Apresento a você [nome do produto/método], a solução definitiva para [problema principal].",
    "Depois de anos de pesquisa, desenvolvemos [nome do produto/método] para eliminar [problema] de uma vez por todas.",
    "O revolucionário [nome do produto/método] foi criado especificamente para pessoas que enfrentam [problema]."
  ],
  "slide-3-1-2": [
    "O segredo do [nome do produto/método] está na sua abordagem [característica única].",
    "Ao contrário de outros métodos, [nome do produto/método] ataca a raiz do problema, não apenas os sintomas.",
    "A tecnologia exclusiva por trás do [nome do produto/método] torna-o 3x mais eficaz que alternativas convencionais."
  ],
  "slide-3-1-3": [
    "O [nome do produto/método] é o resultado de [número] anos de testes e aperfeiçoamentos.",
    "Nossa solução patenteada elimina [problema] através de um processo em [número] etapas.",
    "Desenvolvemos o [nome do produto/método] com base nos mais recentes avanços em [ciência/tecnologia]."
  ],
  
  // Seção 3.2: Benefícios Principais
  "slide-3-2-1": [
    "Com [nome do produto/método], você poderá [benefício principal] em apenas [tempo curto].",
    "Nossos usuários relatam [benefício mensurável] após apenas [período curto] de uso.",
    "O primeiro benefício que você vai notar é [transformação imediata]."
  ],
  "slide-3-2-2": [
    "Imagine acordar todos os dias sentindo [emoção positiva] em vez de [emoção negativa].",
    "Você finalmente poderá [realizar desejo] sem se preocupar com [problema atual].",
    "A liberdade de viver sem [problema] vai transformar completamente sua qualidade de vida."
  ],
  "slide-3-2-3": [
    "Nossos clientes experimentam [benefício específico] em [tempo] ou menos.",
    "O [nome do produto/método] não apenas resolve [problema], mas também melhora [área relacionada].",
    "O impacto positivo em sua [área da vida] será imediato e duradouro."
  ],
  
  // PASSO 4
  // Seção 4.1: Funcionalidades
  "slide-4-1-1": [
    "O [nome do produto/método] inclui [número] módulos completos sobre [tópicos principais].",
    "Nossa plataforma intuitiva permite que você [funcionalidade principal] com apenas alguns cliques.",
    "Cada aspecto do [nome do produto/método] foi projetado para [benefício de uso]."
  ],
  "slide-4-1-2": [
    "O sistema está estruturado em [formato/estrutura] para garantir resultados progressivos e consistentes.",
    "Você terá acesso a [recurso exclusivo] que facilita [processo/objetivo].",
    "Nossa interface [característica] torna o processo simples mesmo para quem nunca [experiência prévia]."
  ],
  "slide-4-1-3": [
    "Incluímos ferramentas de [funcionalidade especial] para acelerar seus resultados.",
    "O recurso de [funcionalidade] permite que você [benefício específico] sem esforço.",
    "Nosso sistema de [funcionalidade técnica] automatiza completamente o processo de [tarefa]."
  ],
  
  // Seção 4.2: Diferencial Competitivo
  "slide-4-2-1": [
    "Ao contrário de outros produtos, [nome do produto/método] oferece [vantagem exclusiva].",
    "Nossa solução é a única no mercado que garante [resultado específico].",
    "O que diferencia [nome do produto/método] é sua capacidade de [funcionalidade única]."
  ],
  "slide-4-2-2": [
    "Enquanto concorrentes prometem [benefício comum], nós entregamos [benefício superior].",
    "Nossa tecnologia proprietária supera os métodos tradicionais em [percentual]%.",
    "Somos os únicos que oferecem [garantia/recurso exclusivo] no mercado atual."
  ],
  "slide-4-2-3": [
    "O [nome do produto/método] foi eleito [reconhecimento] por [entidade respeitada].",
    "Nenhum outro sistema consegue [resultado específico] no mesmo período de tempo.",
    "Nossa abordagem [característica] nos coloca anos à frente da concorrência."
  ],
  
  // PASSO 5
  // Seção 5.1: Oferta e Bônus
  "slide-5-1-1": [
    "Hoje você pode adquirir o [nome do produto/método] completo por apenas [preço com desconto].",
    "O investimento normal de [preço original] está com [percentual]% de desconto apenas neste lançamento.",
    "Por tempo limitado, oferecemos [condição especial] para novos clientes."
  ],
  "slide-5-1-2": [
    "Além do programa principal, você receberá [número] bônus exclusivos no valor de [valor total].",
    "O primeiro bônus é [nome do bônus 1], que sozinho vale [valor] e vai ajudar você a [benefício].",
    "Incluímos também [bônus especial] que não está disponível para compra separadamente."
  ],
  "slide-5-1-3": [
    "O valor total de tudo o que você recebe hoje ultrapassa [valor], mas seu investimento é apenas [preço final].",
    "Dividimos em até [número] parcelas para facilitar seu acesso a esta solução transformadora.",
    "Considerando o [retorno esperado], este investimento se paga em menos de [tempo curto]."
  ],
  
  // Seção 5.2: Urgência e Escassez
  "slide-5-2-1": [
    "Esta oferta especial estará disponível apenas pelos próximos [tempo limite].",
    "Apenas [número limitado] vagas estão disponíveis nesta condição especial.",
    "Os primeiros [número] compradores receberão [bônus exclusivo] gratuitamente."
  ],
  "slide-5-2-2": [
    "Após [data/evento], o preço voltará ao valor normal de [preço original].",
    "Esta é uma oportunidade única que não se repetirá no futuro próximo.",
    "O acesso ao [bônus especial] será encerrado em [tempo curto]."
  ],
  "slide-5-2-3": [
    "Não deixe que [problema] continue controlando sua vida por mais um dia sequer.",
    "Imagine como será sua vida daqui a [tempo futuro] se você tomar esta decisão agora.",
    "Clique no botão abaixo agora mesmo e transforme sua realidade para sempre."
  ]
}; 
// Adiciona comentário para teste
// Comentário para teste
