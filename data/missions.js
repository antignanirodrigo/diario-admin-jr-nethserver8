import {mission6} from './mission6.js';
import {mission5} from './mission5.js';
import {mission7} from './mission7.js';
import {mission8} from './mission8.js';
import {mission9} from './mission9.js';
import {mission10} from './mission10.js';
import {mission11} from './mission11.js';
import {mission12} from './mission12.js';
import {mission13} from './mission13.js';
import {mission14} from './mission14.js';
import {mission15} from './mission15.js';
import {mission16} from './mission16.js';
import {mission17} from './mission17.js';
import {mission18} from './mission18.js';
import {mission19} from './mission19.js';
import {mission20} from './mission20.js';
import {mission21} from './mission21.js';
import {mission22} from './mission22.js';
import {mission23} from './mission23.js';
import {mission24} from './mission24.js';
import {mission25} from './mission25.js';
import {mission26} from './mission26.js';
import {mission27} from './mission27.js';
import {mission28} from './mission28.js';
import {mission29} from './mission29.js';
import {mission30} from './mission30.js';
import {mission31} from './mission31.js';
import {mission32} from './mission32.js';
import {mission33} from './mission33.js';
import {mission34} from './mission34.js';
import {mission35} from './mission35.js';
import {mission36} from './mission36.js';
import {mission37} from './mission37.js';
import {mission38} from './mission38.js';
import {mission39} from './mission39.js';
import {mission40} from './mission40.js';
import {mission41} from './mission41.js';
import {mission42} from './mission42.js';
import {mission43} from './mission43.js';
import {mission44} from './mission44.js';
import {mission45} from './mission45.js';
import {mission46} from './mission46.js';
import {mission47} from './mission47.js';
import {mission48} from './mission48.js';
import {mission49} from './mission49.js';
import {mission50} from './mission50.js';
import {mission51} from './mission51.js';
import {mission52} from './mission52.js';
import {mission53} from './mission53.js';
import {mission54} from './mission54.js';
import {mission55} from './mission55.js';
import {mission56} from './mission56.js';
import {mission57} from './mission57.js';
import {mission58} from './mission58.js';
import {mission59} from './mission59.js';
import {mission60} from './mission60.js';
const quiz = (id, title, question, correct, answers, reasons, analogy) => ({id, title, question, choices: answers.map((text, i) => ({id: String(i), text, correct: i === correct, why: `${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const steps = ['Chamado', 'História', 'Conceitos', 'Recall', 'Laboratório', 'Questões', 'Decisão', 'Procedimento', 'Diário', 'Encerramento'];
const docs = 'https://docs.nethserver.org/docs/administrator-manual/';
export const missionTitles = ['Recebi um NS8. Por onde começo?', 'Um nó já é um cluster?', 'Estou no servidor certo?', 'O nome aponta para o lugar errado', 'Posso já instalar, ou falta inventário?'];
export const missions = {
  1: {
    id: 1, xp: 100, level: 'Fundamentos · 35–45 min', title: missionTitles[0],
    summary: 'Entenda o papel do NS8 e selecione uma base válida para o laboratório da empresa.',
    call: 'CH-NS8-001 · A empresa fictícia Aurora quer centralizar arquivos e colaboração para 12 pessoas. O gestor enviou três máquinas candidatas e pediu: “Pode instalar hoje?”. Você deve avaliar a base antes de aprovar qualquer instalação.',
    impact: 'Uma aplicação não corrige uma base inadequada. Escolher a máquina errada pode exigir reconstrução do laboratório e ainda ensinar um procedimento sem suporte.',
    senior: 'O Sênior abriu o inventário antes do instalador. Anos antes, ele havia recebido um servidor reaproveitado cheio de serviços desconhecidos. A implantação pareceu rápida, até uma disputa por portas derrubar o atendimento. Ao lado do Júnior, apontou os três candidatos: “Primeiro precisamos saber o que estamos construindo e sobre qual chão”. Nesta história fictícia, a lição é concreta: avaliar a plataforma faz parte do trabalho, mesmo quando o pedido só menciona instalar.',
    concept: 'NethServer 8 é uma plataforma para administrar aplicações por uma interface web. Ele coordena aplicações em containers sobre um Linux compatível. O Linux fornece a base; o NS8 organiza a operação das aplicações. Containers compartilham o kernel do host, enquanto uma VM possui seu próprio sistema operacional e kernel. A instalação de NS8 dentro de Proxmox LXC não é suportada.',
    example: 'No laboratório, uma VM Rocky Linux 9 limpa, com 4 vCPU, 8 GB de RAM e SSD virtual de 80 GB, será a candidata. Esses números são uma escolha didática; dimensionar 12 usuários exige medir aplicações, volume de dados e carga. Os mínimos oficiais são 2 cores/vCPU x86-64, 2 GB de RAM e SSD de 40 GB.',
    glossary: [['NS8', 'Administrador de aplicações', 'Como uma central que organiza serviços de uma empresa.'], ['Host', 'Máquina que fornece a base de execução', 'O prédio onde os serviços trabalham.'], ['VM', 'Máquina virtual com sistema operacional próprio', 'Um escritório com infraestrutura própria dentro de um edifício.'], ['Container', 'Ambiente de execução que compartilha o kernel do host', 'Uma sala organizada, sem construir outro edifício.']],
    recall: {question: 'Antes de instalar: o que o NS8 administra e qual diferença de suporte existe entre VM e LXC?', answer: 'NS8 administra aplicações em containers sobre Linux compatível. Uma VM pode hospedar o nó; instalar o NS8 dentro de LXC não é suportado. O uso interno de containers pelo NS8 não autoriza colocá-lo dentro de qualquer container.'},
    labIntro: 'Onde executar: painel educativo abaixo. Você está avaliando candidatos, sem instalar NS8 real. Leia o inventário, escolha a base e valide a proposta. Use o terminal para confirmar identidade e ler o pedido.',
    labSteps: ['Execute whoami e hostname para identificar a sessão.', 'Leia cat /home/junior/chamado.txt e compare os três candidatos no painel.', 'Selecione uma base compatível e use Validar proposta. Leia o motivo de rejeição se houver.', 'Confirme a leitura do inventário e registre por que a candidata atende ao laboratório, sem prometer desempenho de produção.'],
    objectives: [['identity', 'Identificar o operador com whoami'], ['host', 'Confirmar a estação com hostname'], ['request', 'Ler cat /home/junior/chamado.txt'], ['plan', 'Validar a VM limpa como base do laboratório']],
    hints: ['NS8 utiliza containers internamente. Isso não significa que sua instalação em LXC tenha suporte.', 'Observe a virtualização e o estado do Linux. A candidata reaproveitada contém serviços existentes.', 'Use whoami, hostname e cat /home/junior/chamado.txt. No painel, escolha VM Rocky Linux 9 limpa e clique em Validar proposta.'],
    testking: [
      quiz('n1-1', 'Função da plataforma', 'Qual descrição representa NS8?', 1, ['Uma nova versão do Bash', 'Uma plataforma para administrar aplicações em containers', 'Um hypervisor que substitui o Proxmox'], ['Bash é uma shell; não define a plataforma NS8.', 'NS8 coordena aplicações e oferece administração pela web.', 'O hypervisor pode hospedar a VM; NS8 opera dentro da base Linux.'], 'A central organiza os serviços; não é a fundação inteira do prédio.'),
      quiz('n1-2', 'Base suportada', 'Por que rejeitar o candidato LXC?', 0, ['A instalação NS8 em LXC não é suportada', 'NS8 nunca usa containers', 'LXC e VM são a mesma tecnologia'], ['A restrição é sobre onde instalar o nó NS8.', 'NS8 usa containers para suas aplicações; são camadas diferentes.', 'Uma VM tem kernel próprio; LXC compartilha o kernel do host.'], 'Usar salas no prédio não permite instalar o prédio dentro de uma sala.'),
      quiz('n1-3', 'Capacidade', 'A VM supera os mínimos. O que isso prova?', 2, ['Que atende qualquer empresa', 'Que backups são dispensáveis', 'Que atende à base deste exercício, não a qualquer carga real'], ['Capacidade depende das aplicações e da carga.', 'Capacidade e recuperação são responsabilidades diferentes.', 'O mínimo é um ponto de partida. Produção exige avaliação de consumo e crescimento.'], 'Um carro comportar passageiros não prova que consiga transportar qualquer carga.')
    ],
    decisionPrompt: 'O gestor pede a instalação imediata. Qual resposta técnica cabe neste momento?',
    decisions: [{id:'lxc',label:'Usar LXC porque é mais leve',correct:false,consequence:'Você escolheu uma base sem suporte para a instalação NS8.'},{id:'plan',label:'Aprovar a VM limpa para o laboratório e registrar os limites',correct:true,consequence:'A base foi avaliada. A instalação ocorrerá em outra etapa, após validar a rede.'},{id:'old',label:'Reaproveitar o servidor com serviços desconhecidos',correct:false,consequence:'Portas, recursos e dependências existentes não foram avaliados.'}],
    procedure: ['Registre objetivo, responsável, aplicações desejadas e ambiente.', 'Confira requisitos e compatibilidade na documentação atual.', 'Escolha Linux limpo em máquina física ou VM e dimensione a carga.', 'Documente rede, acesso e plano de reconstrução antes de instalar.'],
    validation: 'Evidência: VM limpa selecionada, contexto identificado e proposta validada. Retorno: nenhuma instalação ocorreu; corrija a seleção e valide novamente. Em ambiente real, preserve o inventário e mantenha a VM de laboratório isolada dos serviços da empresa.',
    challenge: 'Registre o candidato escolhido, o motivo para rejeitar LXC e o que ainda falta avaliar antes de produção.', diaryPlaceholder: 'VM Rocky Linux 9; base limpa; LXC sem suporte; carga ainda não medida...',
    closing: 'Você aprovou uma base de laboratório com justificativa. Na próxima missão, vai descobrir por que uma única máquina já pode formar um cluster NS8.',
    sources: [['Introdução', docs+'about/introduction'], ['Requisitos', docs+'installation/system_requirements']]
  },
  2: {
    id: 2, xp: 120, level: 'Arquitetura · 35–45 min', title: missionTitles[1],
    summary: 'Separe as camadas do ambiente e descubra o que um cluster de um nó realmente oferece.',
    call: 'CH-NS8-002 · O inventário descreve um cluster Aurora com apenas o nó ns8-lab-01 e uma aplicação nextcloud1. O gestor pergunta: “Se é cluster, ele continua funcionando quando desligarmos essa máquina?”. Você precisa explicar a topologia e o impacto.',
    impact: 'Confundir organização do cluster com tolerância a falhas leva a promessas de disponibilidade que a arquitetura não sustenta.',
    senior: 'O Sênior desenhou um único retângulo no quadro e colocou a aplicação dentro. O Júnior procurou uma segunda máquina na sala. “Não está faltando um servidor?”, perguntou. O Sênior apagou a palavra “redundância” da anotação do chamado: “Estamos descrevendo como o sistema é administrado. Ainda não desenhamos como ele sobrevive a uma falha”. A conversa fictícia terminou com um mapa de dependências, não com uma promessa de disponibilidade.',
    concept: 'Um nó NS8 é uma máquina física ou virtual participante do cluster. O cluster tem um líder; pode operar somente com ele ou receber workers. Uma aplicação é um serviço administrado pelo NS8 e pode envolver vários containers. O container executa componentes; o nó oferece recursos. Perder o único nó interrompe os serviços que dependem dele.',
    example: 'Proxmox hospeda a VM ns8-lab-01. Essa VM é o nó líder do cluster Aurora. A instância nextcloud1 pertence ao conjunto de aplicações administradas. Seus componentes executam em containers. Esta organização não cria uma cópia automática em outra máquina.',
    glossary: [['Nó', 'Máquina do cluster', 'Uma filial com recursos para trabalhar.'], ['Cluster', 'Conjunto administrado, inclusive com um só nó', 'Uma empresa pode começar com uma única filial.'], ['Aplicação', 'Serviço administrado, como Nextcloud', 'O departamento que entrega uma função ao usuário.'], ['Líder', 'Nó que centraliza a administração do cluster', 'A sede administrativa, que também pode prestar serviços.']],
    recall: {question: 'Um cluster de um nó é inválido? Ele garante continuidade após perder esse nó?', answer: 'É um cluster válido e funcional. Com um só nó, os serviços nele executados ficam indisponíveis se a máquina falhar. O nome cluster não comprova failover automático.'},
    labIntro: 'Onde executar: mapa educativo de arquitetura. Classifique as quatro camadas, valide e desligue virtualmente o único nó. Observe o impacto; depois religue. Esses botões só alteram o cenário desta aula.',
    labSteps: ['Leia cat /home/junior/topologia.txt para conhecer os componentes.', 'Relacione Aurora, ns8-lab-01, nextcloud1 e seu componente de execução às camadas corretas.', 'Clique em Validar mapa. Em seguida, use Desligar nó simulado e observe a aplicação.', 'Religue o nó simulado e verifique que o serviço voltou. Explique por que isso não demonstra failover.'],
    objectives: [['topology', 'Ler cat /home/junior/topologia.txt'], ['mapped', 'Validar as quatro camadas do mapa'], ['outage', 'Observar o impacto da perda do único nó'], ['recovered', 'Religar o nó e confirmar retorno no cenário']],
    hints: ['A máquina, o conjunto administrado e o serviço não são a mesma entidade.', 'Aurora é o cluster; ns8-lab-01 é o nó; nextcloud1 é a aplicação; o componente de execução está em container.', 'Após validar o mapa, desligue e religue o nó nos botões educativos. Sem outra cópia do serviço, não existe destino para failover neste cenário.'],
    testking: [
      quiz('n2-1', 'Quantidade de nós', 'Um NS8 com um único nó é chamado de quê?', 2, ['Um container sem cluster', 'Uma instalação inválida', 'Um cluster de nó único'], ['Nó e container representam camadas diferentes.', 'A documentação prevê operação com um só nó.', 'O cluster pode conter somente o líder e continua funcional.'], 'Uma empresa com uma filial continua sendo uma empresa.'),
      quiz('n2-2', 'Disponibilidade', 'O único nó parou. A aplicação desse nó continua automaticamente em outro lugar?', 0, ['Não há outro nó nem mecanismo demonstrado neste cenário', 'Sim, porque a palavra cluster garante isso', 'Sim, porque o DNS guarda os dados'], ['A dependência de um único nó é um ponto de falha deste cenário.', 'Disponibilidade exige arquitetura e mecanismos específicos.', 'DNS traduz nomes; não executa nem replica a aplicação.'], 'Trocar a placa da porta não transfere o escritório para outro prédio.'),
      quiz('n2-3', 'Camadas', 'Qual relação é correta?', 1, ['Todo container é uma VM', 'Uma aplicação pode usar vários containers em um nó', 'Todo nó é apenas um usuário'], ['Containers e máquinas virtuais têm isolamento e kernel diferentes.', 'Serviços podem distribuir componentes em containers, mantendo a aplicação como unidade de administração.', 'O nó é uma máquina; identidades são outra camada.'], 'Um departamento pode ocupar várias salas da mesma filial.')
    ],
    decisionPrompt: 'Como responder à promessa de continuidade sem o único servidor?',
    decisions: [{id:'ha',label:'Garantir disponibilidade porque existe um cluster',correct:false,consequence:'O exercício demonstrou a interrupção do serviço ao perder o nó.'},{id:'dns',label:'Trocar o DNS para criar redundância',correct:false,consequence:'Um nome novo não cria uma instância com os dados da aplicação.'},{id:'limits',label:'Documentar a dependência e planejar recuperação conforme o serviço',correct:true,consequence:'Você separou arquitetura de administração, continuidade e recuperação.'}],
    procedure: ['Inventarie líder, workers, aplicações e dependências.', 'Registre onde cada aplicação e seus dados residem.', 'Descreva o impacto da perda de cada nó.', 'Planeje e teste recuperação; só declare alta disponibilidade após demonstrar os mecanismos específicos.'],
    validation: 'Evidência: mapa correto, aplicação indisponível com nó desligado e retorno após religar. Retorno: use Religar nó simulado. Este exercício simplifica a recuperação: uma pane real pode exigir reparo de dados, restauração e verificações adicionais.',
    challenge: 'Descreva as quatro camadas e a evidência que desmente a promessa de failover automático neste cenário.', diaryPlaceholder: 'Aurora = cluster; ns8-lab-01 = nó; ao desligar o nó...',
    closing: 'O mapa e o ensaio mostraram a dependência do único nó. Na próxima missão, você vai confirmar que sua sessão está na máquina prevista antes de qualquer mudança.',
    sources: [['Requisitos e nó único',docs+'installation/system_requirements'], ['Introdução e aplicações',docs+'about/introduction']]
  },
  3: {
    id: 3, xp: 140, level: 'Terminal e SSH · 40–50 min', title: missionTitles[2],
    summary: 'Investigue uma sessão no host errado e entre no nó de laboratório autorizado.',
    call: 'CH-NS8-003 · Você abriu uma sessão que parece familiar, mas o chamado autoriza somente ns8-lab-01, com IP 192.168.50.10. A primeira tarefa é identificar a sessão e ler o procedimento do laboratório. Não há autorização para mudar configurações.',
    impact: 'Um comando correto na máquina errada continua sendo um erro operacional. O nome no prompt pode ser personalizado e precisa de confirmação.',
    senior: 'O Sênior reparou que o Júnior já havia aproximado as mãos do teclado. Em vez de ditar comandos, pediu que lesse o hostname. A saída mostrou srv-arquivo-01. Houve silêncio. “O procedimento pode estar perfeito e a sessão ainda estar errada”, disse ele, apontando o IP autorizado no ticket. Nesta cena fictícia, a intervenção evita que a pressa escolha o alvo no lugar do operador.',
    concept: 'SSH abre uma sessão remota. whoami mostra o usuário efetivo; hostname, o nome configurado do sistema; pwd, o diretório atual. ls lista entradas, cd muda o diretório e cat lê um arquivo. Esses comandos de orientação não alteram configurações. A identidade do servidor também deve ser conferida pela chave SSH em um acesso real.',
    example: 'Nesta simulação: whoami → junior; hostname → srv-arquivo-01. O alvo é outro. Execute ssh junior@192.168.50.10; depois whoami, hostname, pwd, ls e cat /home/junior/LEIA-ME.txt. A simulação omite autenticação e verificação de chave; um SSH real não deve ignorá-las.',
    glossary: [['SSH', 'Protocolo de acesso remoto protegido', 'Um canal de comunicação cuja identidade precisa ser conferida.'], ['Shell', 'Interpretador da sessão de comandos', 'O atendente que interpreta suas instruções.'], ['Caminho absoluto', 'Endereço de arquivo iniciado por /', 'Um endereço completo, independente de onde você esteja.'], ['Prompt', 'Indicador configurável da sessão', 'Uma etiqueta útil, mas que não substitui a conferência do documento.']],
    recall: {question: 'Quais três comandos confirmam usuário, máquina e diretório? O que fazer se a máquina divergir do chamado?', answer: 'whoami, hostname e pwd. Se o host divergir, interrompa mudanças e abra a sessão autorizada. No acesso real, valide também a identidade SSH por um canal confiável.'},
    labIntro: 'Onde executar: terminal educativo abaixo. Você começa em srv-arquivo-01 e deve chegar a ns8-lab-01. Não digite senhas reais. O simulador aceita somente comandos documentados em help.',
    labSteps: ['Execute whoami e hostname na sessão inicial; registre a divergência.', 'Abra ssh junior@192.168.50.10. A conexão é inteiramente simulada.', 'No destino, confirme whoami, hostname e pwd; liste com ls.', 'Leia cat /home/junior/LEIA-ME.txt e identifique ambiente, IP e regra de operação.'],
    objectives: [['wrongHost', 'Identificar a divergência com hostname na sessão inicial'], ['connected', 'Abrir ssh junior@192.168.50.10'], ['identity', 'Confirmar whoami no destino'], ['host', 'Confirmar hostname no destino'], ['location', 'Consultar pwd no destino'], ['listed', 'Listar arquivos com ls'], ['guide', 'Ler cat /home/junior/LEIA-ME.txt']],
    hints: ['Leia o hostname antes de abrir a nova sessão. A evidência da divergência é parte da missão.', 'O destino autorizado é 192.168.50.10 com usuário junior. A sintaxe é ssh usuario@destino.', 'Execute hostname; ssh junior@192.168.50.10; whoami; hostname; pwd; ls; cat /home/junior/LEIA-ME.txt, um comando por vez.'],
    testking: [
      quiz('n3-1', 'Divergência', 'hostname retorna srv-arquivo-01, mas o ticket cita ns8-lab-01. Qual ação cabe?', 1, ['Renomear o servidor atual', 'Parar alterações e acessar o destino autorizado', 'Usar sudo antes de investigar'], ['Renomear não transforma uma máquina em outra e altera o ambiente sem necessidade.', 'A evidência mostra que o alvo ainda não foi confirmado.', 'Elevar privilégio aumenta o impacto sem resolver o contexto.'], 'Encontrar a sala errada não autoriza trocar o número da porta.'),
      quiz('n3-2', 'Diretório atual', 'O que pwd informa?', 2, ['A senha do usuário', 'O IP do servidor', 'O caminho do diretório atual'], ['pwd não revela credenciais.', 'Endereços são consultados com ferramentas de rede.', 'pwd imprime o local atual na árvore de diretórios.'], 'É o marcador “você está aqui” de um mapa.'),
      quiz('n3-3', 'Primeiro acesso real', 'Em um SSH real, como tratar uma chave de host desconhecida?', 0, ['Verificar a impressão digital por canal confiável antes de aceitar', 'Aceitar sempre, porque o simulador não pede chave', 'Desativar a verificação para todos os hosts'], ['Isso ajuda a comprovar a identidade do destino.', 'A simplificação educativa não é um procedimento de autenticação real.', 'Remover a conferência elimina uma proteção contra servidor impostor.'], 'A etiqueta do endereço não substitui conferir a identidade de quem abriu a porta.')
    ],
    decisionPrompt: 'Após ler o procedimento, qual entrega está autorizada?',
    decisions: [{id:'observe',label:'Registrar contexto e evidências, sem alterar a configuração',correct:true,consequence:'A sessão autorizada e a regra do laboratório foram verificadas.'},{id:'root',label:'Virar root e instalar tudo',correct:false,consequence:'O ticket autoriza orientação e leitura, não instalação.'},{id:'rename',label:'Renomear a máquina inicial para coincidir com o ticket',correct:false,consequence:'Alterar a etiqueta não corrige o alvo da conexão.'}],
    procedure: ['Leia o ativo e o escopo autorizado no chamado.', 'Valide a identidade SSH por canal confiável no acesso real.', 'Confirme usuário, hostname, IP e diretório; compare com o inventário.', 'Leia o procedimento local, guarde evidências e só avance com escopo claro.'],
    validation: 'Evidência: divergência inicial identificada, sessão final junior@ns8-lab-01 e LEIA-ME lido. Retorno: exit volta à sessão de origem no simulador; as evidências finais precisam ser demonstradas no destino. Nenhuma configuração real foi modificada.',
    challenge: 'Anote o hostname inicial, o IP autorizado, o hostname final, a pasta atual e a regra contida no LEIA-ME.', diaryPlaceholder: 'Inicial srv-arquivo-01; destino 192.168.50.10; final ns8-lab-01...',
    closing: 'Você comprovou a troca para o destino autorizado e leu a regra do laboratório. Agora pode investigar a rede sem confundir uma falha de DNS com um servidor parado.',
    sources: [['SSH: manual OpenBSD', 'https://man.openbsd.org/ssh'], ['Requisitos do nó',docs+'installation/system_requirements']]
  },
  4: {
    id: 4, xp: 160, level: 'Rede e DNS · 45–60 min', title: missionTitles[3],
    summary: 'Compare IP, rota, DNS e horário; corrija o registro errado no laboratório e teste outra vez.',
    call: 'CH-NS8-004 · O painel de ns8-lab-01.lab.example não abre pelo nome. O inventário espera 192.168.50.10, mas há suspeita de DNS desatualizado. O ticket autoriza corrigir somente o registro A desse nome no DNS externo de laboratório, depois de coletar evidências.',
    impact: 'Reiniciar uma aplicação saudável não muda o endereço que o DNS entrega ao cliente. Uma intervenção na camada errada prolonga a indisponibilidade.',
    senior: 'O Sênior observou o Júnior alternar entre o navegador e o rack. Antes de tocar no botão de reiniciar, colocou duas saídas lado a lado: IP do nó e resposta DNS. Os últimos números eram diferentes. “O mapa está levando o cliente à porta errada”, comentou. O caso fictício termina com uma alteração pequena no DNS e um novo teste, sem atribuir a falha à aplicação antes de haver evidência.',
    concept: 'IP identifica uma interface; prefixo define a rede local; gateway é o próximo salto para destinos fora dela. DNS relaciona nomes a endereços. FQDN é o nome completo, como ns8-lab-01.lab.example. O nome deve apontar para endereço alcançável e corresponder ao certificado usado. Relógio coerente é necessário para avaliar validade de certificados e outras autenticações. O resolvedor do nó NS8 deve ser externo aos serviços DNS do próprio NS8.',
    example: 'Neste cenário, ip -br addr mostra 192.168.50.10/24, ip route mostra gateway 192.168.50.1 e dig +short ns8-lab-01.lab.example retorna 192.168.50.99. Corrigir o registro A para .10 e testar novamente trata a divergência observada. O domínio .example é reservado a exemplos e aqui usa DNS privado simulado; não se solicita certificado público para ele.',
    glossary: [['IP / prefixo', 'Endereço e limite da rede', 'Número da porta e região do bairro.'], ['Gateway', 'Próximo salto para outras redes', 'Saída do bairro para outros destinos.'], ['DNS / FQDN', 'Resolução do nome completo para endereço', 'Uma agenda que precisa apontar para a porta certa.'], ['Sincronização de horário', 'Relógio alinhado a uma referência', 'O relógio usado para conferir a validade de um ingresso.']],
    recall: {question: 'IP do nó é .10, mas o nome resolve para .99. Que camada apresenta uma divergência? Um ping isolado prova que o painel HTTPS funciona?', answer: 'A resolução de nomes diverge do inventário. Compare e corrija o registro autorizado, depois teste novamente. Ping verifica resposta ICMP, não a aplicação HTTPS nem a validade do certificado.'},
    labIntro: 'Onde executar: terminal no nó ns8-lab-01 e editor educativo de registro A em DNS externo. As respostas são simuladas. O botão muda apenas o registro do cenário e invalida a evidência HTTP anterior para exigir um novo teste.',
    labSteps: ['Execute ip -br addr, ip route e cat /etc/resolv.conf. Compare com o inventário.', 'Execute timedatectl e dig +short ns8-lab-01.lab.example; observe .99 no DNS.', 'Após coletar essas evidências, no painel ajuste somente o registro A para 192.168.50.10 e aplique.', 'Repita dig +short ns8-lab-01.lab.example e curl -I https://ns8-lab-01.lab.example/cluster-admin/. Leia o resultado HTTP.'],
    objectives: [['address', 'Consultar ip -br addr'], ['route', 'Consultar ip route'], ['resolver', 'Ler cat /etc/resolv.conf'], ['clock', 'Consultar timedatectl'], ['badDns', 'Demonstrar a divergência DNS antes da correção'], ['dnsFixed', 'Aplicar registro A correto no painel'], ['dnsRetested', 'Repetir dig após a alteração'], ['http', 'Testar curl -I no endereço completo do painel']],
    hints: ['Separe alcance de IP, resolução do nome e resposta HTTP. Compare as saídas antes de alterar.', 'O inventário do painel informa .10. A consulta DNS inicial retorna .99. O DNS externo usado pelo nó é 192.168.50.53.', 'Colete ip -br addr, ip route, cat /etc/resolv.conf, timedatectl e dig +short ns8-lab-01.lab.example. Aplique 192.168.50.10 no registro A e repita dig e curl -I https://ns8-lab-01.lab.example/cluster-admin/.'],
    testking: [
      quiz('n4-1', 'Divergência por camada', 'O registro A retorna .99 e o inventário validado informa .10. Qual hipótese tem evidência direta?', 2, ['Falta de memória', 'Senha de administrador incorreta', 'Registro DNS apontando para endereço diferente do esperado'], ['Não há medição de memória neste diagnóstico.', 'A resolução ocorre antes da autenticação no painel.', 'As duas fontes divergem justamente na tradução de nome para IP.'], 'Se a agenda aponta para outra porta, verifique o endereço antes de trocar a fechadura.'),
      quiz('n4-2', 'Teste suficiente?', 'ping responde. O que isso permite afirmar?', 0, ['O destino respondeu ao ICMP nesse teste', 'O HTTPS e o certificado estão corretos', 'O usuário consegue entrar no painel'], ['Esse é o alcance da evidência coletada.', 'HTTPS usa outra camada, porta e validação.', 'Autenticação precisa de um teste próprio.'], 'Ouvir a campainha não comprova que o atendimento do escritório funciona.'),
      quiz('n4-3', 'Resolvedor do nó', 'Qual opção evita a dependência DNS circular descrita para o nó NS8?', 1, ['Usar o DNS de uma aplicação do próprio NS8 como resolvedor do nó', 'Usar um resolvedor externo adequado à rede', 'Usar sempre 127.0.0.1'], ['O nó pode ficar dependente do serviço que precisa iniciar ou atualizar.', 'O resolvedor externo evita essa dependência e precisa resolver os nomes exigidos.', 'O endereço de loopback aponta para o próprio nó e contraria a orientação documentada.'], 'A equipe que mantém a agenda precisa conseguir consultá-la mesmo antes de abrir o escritório.')
    ],
    decisionPrompt: 'Com a divergência confirmada, qual mudança atende ao escopo do chamado?',
    decisions: [{id:'dns',label:'Corrigir o registro A autorizado e repetir os testes',correct:true,consequence:'Você tratou a causa demonstrada e verificou novamente DNS e HTTP.'},{id:'restart',label:'Reiniciar todos os serviços',correct:false,consequence:'A alteração não corrige a resposta DNS errada e pode ampliar o impacto.'},{id:'tls',label:'Ignorar a validação TLS para sempre',correct:false,consequence:'Ignorar a identidade não corrige o endereço do nome e enfraquece a conexão.'}],
    procedure: ['Compare inventário com IP, rota, resolvedor, relógio e consulta DNS.', 'Registre o valor anterior e autorize a alteração do registro específico.', 'Altere pelo gerenciador responsável pelo DNS; não edite resolv.conf se gerenciado por outra ferramenta.', 'Considere TTL e caches em ambiente real, consulte novamente e teste HTTPS e autenticação separadamente.'],
    validation: 'Evidência: registro .99 antes, .10 depois e resposta HTTP 200 no cenário. Retorno: Restaurar registro inicial volta a .99 e remove as validações DNS/HTTP posteriores. Em produção, só reverta se a mudança provocar regressão; um valor comprovadamente incorreto não deve ser restaurado por rotina. A simulação aplica DNS imediatamente, omite caches/TTL e assume certificado de CA de laboratório confiável.',
    challenge: 'Documente IP, gateway, resolvedor, resultado DNS antes/depois e limite da evidência HTTP: receber uma página não comprova autenticação.', diaryPlaceholder: 'IP .10; gateway .1; DNS externo .53; registro .99 → .10; HTTP 200...',
    closing: 'Você localizou e corrigiu uma divergência DNS com testes antes e depois. Na aula 5, você vai reconciliar um inventário que ainda contém valores antigos e entregar a documentação corrigida.',
    sources: [['Rede, DNS e requisitos',docs+'installation/system_requirements'], ['Acesso ao painel',docs+'installation/install']]
  },
  5: mission5,
  6: mission6,
  7: mission7,
  8: mission8,
  9: mission9,
  10: mission10,
  11: mission11,
  12: mission12,
  13: mission13,
  14: mission14,
  15: mission15,
  16: mission16,
  17: mission17,
  18: mission18,
  19: mission19,
  20: mission20,
  21: mission21,
  22: mission22,
  23: mission23,
  24: mission24,
  25: mission25,
  26: mission26,
  27: mission27,
  28: mission28,
  29: mission29,
  30: mission30,
  31: mission31,
  32: mission32,
  33: mission33,
  34: mission34,
  35: mission35,
  36: mission36,
  37: mission37,
  38: mission38,
  39: mission39,
  40: mission40,
  41: mission41,
  42: mission42,
  43: mission43,
  44: mission44,
  45: mission45,
  46: mission46,
  47: mission47,
  48: mission48,
  49: mission49,
  50: mission50,
  51: mission51,
  52: mission52,
  53: mission53,
  54: mission54,
  55: mission55,
  56: mission56,
  57: mission57,
  58: mission58,
  59: mission59,
  60: mission60
};
missionTitles[4]=mission5.title;
missionTitles[5]=mission6.title;
missionTitles[6]=mission7.title;
missionTitles[7]=mission8.title;
missionTitles[8]=mission9.title;
missionTitles[9]=mission10.title;
missionTitles[10]=mission11.title;
missionTitles[11]=mission12.title;
missionTitles[12]=mission13.title;
missionTitles[13]=mission14.title;
missionTitles[14]=mission15.title;
missionTitles[15]=mission16.title;
missionTitles[16]=mission17.title;
missionTitles[17]=mission18.title;
missionTitles[18]=mission19.title;
missionTitles[19]=mission20.title;
missionTitles[20]=mission21.title;
missionTitles[21]=mission22.title;
missionTitles[22]=mission23.title;
missionTitles[23]=mission24.title;
missionTitles[24]=mission25.title;
missionTitles[25]=mission26.title;
missionTitles[26]=mission27.title;
missionTitles[27]=mission28.title;
missionTitles[28]=mission29.title;
missionTitles[29]=mission30.title;
missionTitles[30]=mission31.title;
missionTitles[31]=mission32.title;
missionTitles[32]=mission33.title;
missionTitles[33]=mission34.title;
missionTitles[34]=mission35.title;
missionTitles[35]=mission36.title;
missionTitles[36]=mission37.title;
missionTitles[37]=mission38.title;
missionTitles[38]=mission39.title;
missionTitles[39]=mission40.title;
missionTitles[40]=mission41.title;
missionTitles[41]=mission42.title;
missionTitles[42]=mission43.title;
missionTitles[43]=mission44.title;
missionTitles[44]=mission45.title;
missionTitles[45]=mission46.title;
missionTitles[46]=mission47.title;
missionTitles[47]=mission48.title;
missionTitles[48]=mission49.title;
missionTitles[49]=mission50.title;
missionTitles[50]=mission51.title;
missionTitles[51]=mission52.title;
missionTitles[52]=mission53.title;
missionTitles[53]=mission54.title;
missionTitles[54]=mission55.title;
missionTitles[55]=mission56.title;
missionTitles[56]=mission57.title;
missionTitles[57]=mission58.title;
missionTitles[58]=mission59.title;
missionTitles[59]=mission60.title;
for (const m of Object.values(missions)) {
  m.steps = steps;
  m.images = [`assets/aula-${m.id}.png`, `assets/aula-${m.id}-p2.png`];
  m.alt = [`Prancha 1 — contexto e conceitos: ${m.title}. Seis quadros; explicação completa no texto.`, `Prancha 2 — prática e validação: ${m.title}. Seis quadros; comandos e resultados descritos no laboratório.`];
  m.artNote = 'Prancha narrativa de apoio. Consulte os passos e as saídas do simulador para executar a atividade; a arte não substitui documentação técnica.';
}
missions[1].artNote += ' O hostname da prancha antecipa o futuro nó. Nesta primeira atividade, o terminal está na estação de avaliação e nenhuma instalação é realizada.';
missions[2].artNote += ' Host identifica a base da máquina; o nó é essa máquina participando do NS8. O bloco Host do desenho não representa um segundo membro do cluster.';
missions[3].artNote += ' A primeira prancha mostra o contexto já confirmado. O laptop pode estar fisicamente no datacenter e ainda usar SSH remoto. A rede 10.10.0.0/24 desenhada é ilustrativa; o destino deste exercício é 192.168.50.10.';
missions[4].artNote += ' A primeira prancha apresenta um exemplo paralelo: app.lab.test retorna 192.0.2.20, quando deveria retornar 192.0.2.10. Neste exercício, use ns8-lab-01.lab.example, com .99 incorreto e 192.168.50.10 correto. getent consulta a resolução do sistema; o laboratório usa dig para consultar DNS.';

missions[5].artNote += ' As telas da arte resumem as evidências. Responsável é quem responde pelo ativo, não necessariamente quem o solicitou. A atividade usa os arquivos e campos do laboratório abaixo.';
missions[7].artNote += ' A prancha mostra DHCP como estado inicial e perfil estático como estado final. O laboratório usa valores privados simulados e não altera rede real.';
missions[8].artNote += ' A arte resume o fluxo de instalação; o comando oficial aparece no texto da aula. O laboratório usa install-ns8 --simulate para não executar instalação real.';
missions[9].artNote += ' O CIDR da VPN é uma escolha de laboratório. Em produção, compare com todas as redes existentes antes de criar o cluster.';
missions[10].artNote += ' Nenhuma senha real deve aparecer na arte, no diário ou no terminal. O objetivo é registrar a evidência de troca, não o segredo.';
missions[11].artNote += ' A tela desenhada resume áreas administrativas. Use o laboratório para classificar as áreas sem criar recursos.';
missions[12].artNote += ' docs1 é uma aplicação fictícia de laboratório, usada para ensinar o fluxo sem depender de um módulo real específico.';
missions[13].artNote += ' O certificado HTTPS é simulado com CA de laboratório. Em produção, valide emissão, cadeia e nome do certificado.';
missions[14].artNote += ' A prancha mostra tarefas e logs resumidos. O encerramento correto depende das evidências do simulador.';
missions[15].artNote += ' A janela e a atualização são simuladas. A arte mostra o fluxo mental de mudança; o laboratório exige evidência antes e depois.';
missions[16].artNote += ' A prancha separa conceitos de identidade. Nenhum usuário real é criado nesta aula.';
missions[17].artNote += ' A arte usa aurora.lab como domínio privado de laboratório. Não misture esse plano com domínio real sem validação própria.';
missions[18].artNote += ' A implantação Samba é educativa. A validação comprova fundação e SRV; join de estação e login ficam para a aula seguinte.';
missions[19].artNote += ' A estação win10-lab é simulada. A prancha deve ser lida como sequência de pré-checagem, não como procedimento completo de Windows real.';
missions[20].artNote += ' O incidente usa DNS de cliente como causa didática. Em produção, senha, bloqueio, horário, grupos e políticas também precisam ser avaliados.';
missions[21].artNote += ' A prancha trata armazenamento como decisão operacional. A criação do compartilhamento fica deliberadamente para a aula seguinte.';
missions[22].artNote += ' A arte deve destacar teste positivo e negativo. Permissões finas por ACL entram na próxima aula.';
missions[23].artNote += ' A matriz é simplificada para o laboratório. Em produção, documente exceções, herança e revisão periódica.';
missions[24].artNote += ' O incidente foca associação de grupo. Outras causas reais incluem cache de sessão, caminho incorreto, token antigo e ACL conflitante.';
missions[25].artNote += ' O restore drill é simulado e não substitui restauração real em ambiente isolado quando houver dados de produção.';
missions[26].artNote += ' A aula seleciona a aplicação. A instalação real e configuração do Nextcloud ficam para a próxima etapa.';
missions[27].artNote += ' A instalação do Nextcloud é simulada. Running não substitui login, publicação e aceite funcional.';
missions[28].artNote += ' O público financeiro+diretoria é didático. Em produção, revise grupos e políticas antes de liberar usuários.';
missions[29].artNote += ' TLS é de laboratório. Em produção, valide cadeia pública, renovação e domínio real.';
missions[30].artNote += ' O aceite funcional é simulado, mas força a disciplina correta: status, login, upload, compartilhamento, negação e backup.';
missions[31].artNote += ' O fluxo de e-mail separa estritamente a submissão de clientes (587 TLS) do tráfego entre servidores (25 MTA).';
missions[32].artNote += ' A instância mail1 agrupa Postfix, Dovecot e Rspamd em containers orquestrados no nó de e-mail.';
missions[33].artNote += ' Aliases e grupos não criam caixas físicas adicionais no Dovecot, apenas regras de encaminhamento no Postfix.';
missions[34].artNote += ' SPF autoriza os IPs emissores, DKIM assina criptograficamente as mensagens e DMARC define a política de quarentena/rejeição.';
missions[35].artNote += ' A triagem de filas do Postfix (mailq) e análise de logs são habilidades centrais do administrador de correio em plantão.';
missions[36].artNote += ' O Restic deduplica blocos e aplica retenção GFS, descartando cópias locais frágeis em favor de repositórios remotos.';
missions[37].artNote += ' As chaves de criptografia client-side AES-256 nunca trafegam em texto claro e devem ser salvas no cofre corporativo.';
missions[38].artNote += ' O pre-backup hook assegura que bancos de dados sejam copiados em estado consistente sem parar o cluster.';
missions[39].artNote += ' A restauração seletiva recupera a aplicação corrompida cirurgicamente sem derrubar os demais serviços produtivos.';
missions[40].artNote += ' A verificação com restic check e a medição do RTO comprovam a maturidade do plano de continuidade de negócios da empresa.';
missions[41].artNote += ' O NethSecurity opera como firewall UTM na borda da rede, enquanto o NS8 protege portas locais com nftables.';
missions[42].artNote += ' O Port Forwarding seletivo expõe exclusivamente portas de serviço (80, 443, 25, 587), mantendo a gerência isolada.';
missions[43].artNote += ' O Traefik orquestra rotas dinâmicas, terminação TLS e cabeçalhos de proteção (HSTS e nosniff) para as aplicações.';
missions[44].artNote += ' A malha interna WireGuard (wg0) interliga nós do cluster e jamais deve ser compartilhada com clientes de home office.';
missions[45].artNote += ' O Threat Shield com CrowdSec e Suricata bloqueia atacantes em tempo real antes que atinjam os containers do NS8.';
missions[46].artNote += ' O Roundcube opera como frontend desacoplado conectando-se a mail1 por IMAP seguro (993) e SMTP (587).';
missions[47].artNote += ' O Mattermost armazena dados no PostgreSQL interno e valida credenciais no Samba AD via LDAP.';
missions[48].artNote += ' O Apache Guacamole traduz sessões RDP para canvas HTML5 sob HTTPS, eliminando clientes VPN de terceiros.';
missions[49].artNote += ' O Vaultwarden adota criptografia Zero-Knowledge no cliente e deve operar com registro público desativado.';
missions[50].artNote += ' A auditoria do catálogo afere a saúde dos containers, o consumo agregado de RAM e a resposta dos FQDNs.';
missions[51].artNote += ' A malha WireGuard (10.5.4.0/24) interliga nós do cluster com chaves criptográficas geridas pelo líder.';
missions[52].artNote += ' O nó worker não possui painel próprio e integra-se ao cluster através do token criptográfico de ingresso.';
missions[53].artNote += ' A migração move os containers para o nó worker e o Traefik redireciona as requisições via WireGuard transparentemente.';
missions[54].artNote += ' O armazenamento compartilhado NFSv4.2 em /srv/shared-nfs permite que qualquer nó acesse dados persistentes sem cópias.';
missions[55].artNote += ' A simulação de failover comprova que a malha WireGuard e o Traefik se auto-recuperam assim que o nó restabelece o link.';
missions[56].artNote += ' A fila Redis do nó líder processa tarefas assincronamente e os locks órfãos são liberados via retry controlado sem reiniciar o host.';
missions[57].artNote += ' O Rolling Update atualiza primeiramente os nós workers mantendo o líder estável para coordenar a consistência do cluster.';
missions[58].artNote += ' Os coletores Prometheus expõem métricas de nós e containers na porta 9100, despachando alertas via Webhook no Mattermost.';
missions[59].artNote += ' A conformidade ISO 27001 exige rotação atômica de chaves de API, zero portas administrativas expostas na WAN e containers rootless.';
missions[60].artNote += ' A certificação final consolida a operação autônoma nos seis pilares de infraestrutura, alta disponibilidade e continuidade de negócios.';
