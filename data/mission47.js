const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission47={
  id:47,xp:450,level:'Avançado · 50-60 min',title:'Chat corporativo: implantação do Mattermost',
  summary:'Implante o Mattermost no NS8 para colaboração em equipe on-premises e vincule a autenticação ao Samba Active Directory.',
  call:'CH-NS8-047 · A gerência de compliance da Aurora alertou sobre o risco de vazamento de informações estratégicas em aplicativos de mensagens públicos em nuvem. A solicitação é direta: implantar uma plataforma de colaboração e chat em tempo real corporativa, totalmente hospedada dentro dos servidores da empresa (on-premises). O Júnior deve provisionar a aplicação Mattermost no NS8, integrar o diretório de identidades ao domínio Samba AD (samba1) e criar a equipe oficial com os canais padrão.',
  impact:'Centralizar as conversas da empresa em um servidor local garante conformidade estrita com a LGPD e GDPR, impede que segredos industriais fiquem armazenados em servidores de terceiros e simplifica a governança de acessos via credenciais únicas do Active Directory.',
  senior:'O Sênior caminhou até a lousa e desenhou um celular com um aplicativo de mensagens comercial: "Júnior, quando os funcionários usam grupos de chat comerciais gratuitos para trocar senhas de servidores e planilhas financeiras, a empresa perdeu a soberania digital. Com o Mattermost rodando no NS8, o banco de dados PostgreSQL, os anexos e o histórico ficam 100% sob nosso controle. E o melhor: o usuário não precisa criar nova senha, pois o Mattermost lê os mesmos usuários e grupos do Samba AD. Vamos colocar essa colaboração para funcionar."',
  concept:'O Mattermost no NethServer 8 é empacotado como uma aplicação conteinerizada composta por dois serviços principais: o servidor de aplicação Mattermost (Go/React) e o banco de dados relacional PostgreSQL 15. A comunicação externa ocorre via Traefik com suporte a WebSockets para sincronização de mensagens em tempo real. A integração de identidades aproveita o protocolo LDAP contra o provedor local Samba Active Directory (samba1), sincronizando usuários, nomes de exibição e associações a grupos de segurança de forma automatizada.',
  example:'No laboratório, você visualiza o escopo em cat mattermost-escopo.txt, provisiona a aplicação com app-install mattermost --instance mattermost1, conecta a base de contas com app-auth-bind mattermost1 samba1, inicializa a equipe com mattermost-team-create --name aurora --channel "geral,ti,financeiro" e valida a publicação com curl -I https://chat.aurora.lab/.',
  glossary:[['Mattermost','Plataforma open-source de colaboração em equipe e chat seguro','A sala de reuniões virtual privativa dentro do prédio da empresa, trancada com chave digital.'],['WebSocket','Protocolo de comunicação bidirecional em tempo real sobre TCP','Uma linha de rádio aberta e direta onde as duas partes conversam instantaneamente sem precisar rediscar.'],['LDAP Bind','Conexão autenticada para consulta de contas no diretório AD','O crachá que a aplicação apresenta à portaria para saber se o funcionário tem permissão de entrar.'],['On-premises','Instalação local de servidores e dados nas instalações da organização','Guardar seus pertences no cofre do seu quarto em vez de alugar um armário público na estação de trem.']],
  recall:{question:'Qual é a importância de habilitar suporte a WebSockets no proxy reverso Traefik para o Mattermost?',answer:'Os WebSockets permitem conexão persistente bidirecional em tempo real, garantindo que novas mensagens, reações e indicadores de digitação apareçam instantaneamente para todos os membros do canal sem polling contínuo.'},
  labIntro:'Onde executar: terminal de operações do cluster e console de gerenciamento de aplicações.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e o nó.',
    'Execute cat mattermost-escopo.txt para analisar os parâmetros de implantação.',
    'Execute app-install mattermost --instance mattermost1 para subir o container e o PostgreSQL.',
    'Execute app-auth-bind mattermost1 samba1 para vincular a autenticação ao Samba AD.',
    'Execute mattermost-team-create --name aurora --channel "geral,ti,financeiro" para criar o workspace corporativo.',
    'Execute curl -I https://chat.aurora.lab/ para validar o cabeçalho HTTP 200 e suporte WebSocket.',
    'No painel educativo, confirme os canais provisionados e a integração LDAP e homologue a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readScope','Ler escopo em mattermost-escopo.txt'],
    ['installMattermost','Instalar instância com app-install mattermost'],
    ['bindSambaAuth','Vincular autenticação Samba AD com app-auth-bind'],
    ['createTeamChannels','Criar equipe e canais padrão com mattermost-team-create'],
    ['verifyChatHttp','Auditar resposta web com curl em chat.aurora.lab'],
    ['validateMattermost','Homologar Mattermost no painel educativo']
  ],
  hints:[
    'Use cat mattermost-escopo.txt para inspecionar os parâmetros de banco de dados e FQDN.',
    'O comando app-auth-bind mattermost1 samba1 conecta o Mattermost ao diretório corporativo.',
    'Ao rodar curl -I https://chat.aurora.lab/, verifique se a rota HTTP 200 está liberada pelo Traefik.'
  ],
  testking:[
    q('n47-db','Banco de Dados do Mattermost','Qual é o banco de dados utilizado como backend pela instância do Mattermost no NS8?',2,
      ['Arquivos de texto simples em /etc/mattermost.csv',
       'Microsoft Access 97 compartilhado em rede',
       'PostgreSQL conteinerizado gerenciado de forma automatizada pelo Podman'],
      ['Arquivos CSV não oferecem concorrência, integridade transacional nem performance para chat em larga escala.',
       'Access é uma ferramenta legada desktop inadequada para servidores de mensageria modernos.',
       'Correto! O PostgreSQL 15 provê alta performance, integridade ACID e isolamento dentro da rede interna do Podman.'],
      'É o cofre central de arquivos blindado onde todas as conversas são catalogadas com índice instantâneo.'
    ),
    q('n47-ldap','Integração com Samba AD','Por que o administrador deve vincular o Mattermost ao Samba AD via LDAP?',0,
      ['Para permitir que os colaboradores usem a mesma credencial de rede sem duplicar senhas e simplificar o desligamento de contas',
       'Para que o Mattermost apague todas as contas do servidor toda vez que o usuário errar a senha',
       'Porque o Mattermost não possui sistema de autenticação próprio e trava sem o AD'],
      ['Exato! O Single Source of Truth evita senhas divergentes e desativa o acesso ao chat automaticamente quando a conta é revogada no AD.',
       'Contas não são apagadas por erro de digitação; a política de bloqueio obedece às diretivas do domínio.',
       'O Mattermost suporta autenticação local nativa, mas integrá-lo ao AD é a boa prática corporativa obrigatória.'],
      'É usar o mesmo crachá magnético da catraca de entrada para abrir a porta da sala de conferências.'
    ),
    q('n47-ws','Necessidade de WebSockets','Qual protocolo da camada de aplicação permite a entrega instantânea de mensagens entre clientes no Mattermost?',1,
      ['Transferência periódica de arquivos via FTP a cada 5 minutos',
       'Conexão persistente bidirecional via WebSocket negociada sobre HTTPS (WSS)',
       'Sinais de ping ICMP contendo caracteres em formato binário'],
      ['FTP geraria atrasos inaceitáveis e sobrecarga contínua de rede.',
       'Correto! O WebSocket mantém o canal TCP aberto após o handshake HTTP, permitindo envio imediato sem atrasos.',
       'Pacotes ICMP destinam-se a diagnóstico de conectividade, não a transporte de chat corporativo.'],
      'É um walkie-talkie sempre ligado na frequência do time, em vez de enviar cartas pelo correio a cada frase.'
    )
  ],
  decisionPrompt:'O comitê de segurança propõe permitir que usuários criem canais públicos e convidem fornecedores externos anônimos sem aprovação da TI. Qual decisão arquitetural você deve defender?',
  decisions:[
    {id:'allow-open-invite',label:'Permitir convites externos abertos para qualquer pessoa sem controle da TI',correct:false,consequence:'Grave brecha de conformidade: usuários externos não auditados poderiam visualizar discussões internas e vazar dados.'},
    {id:'restrict-external-guests',label:'Habilitar contas de convidados restritas (Guest Accounts) com canais dedicados e aprovação prévia da TI',correct:true,consequence:'Excelente controle! Parceiros externos colaboram apenas nos canais contratados sem acesso aos canais corporativos gerais.'},
    {id:'disable-chat',label:'Proibir o uso de chat na empresa e exigir que tudo volte a ser discutido em memorandos em papel',correct:false,consequence:'Decisão impraticável que paralisa a agilidade operacional da organização.'}
  ],
  procedure:[
    'Inspecione os requisitos de sistema e banco de dados para o Mattermost no Software Center.',
    'Instale a instância mattermost1 alocando o volume de armazenamento para anexos em disco veloz.',
    'Execute a integração LDAP com o serviço de identidades corporativo Samba Active Directory.',
    'Crie a equipe principal da empresa e os canais departamentais estruturados.',
    'Audite a conectividade HTTPS e WebSockets através da rota do proxy Traefik.',
    'Publique as instruções de download dos aplicativos desktop e mobile apontando para o servidor local.'
  ],
  validation:'Evidência: instância mattermost1 provisionada com backend PostgreSQL, autenticação LDAP vinculada ao Samba AD, equipe e canais criados, endpoint chat.aurora.lab respondendo via Traefik e homologação concluída no painel educativo.',
  challenge:'Documente a conexão entre Mattermost e Samba AD, verifique o status do container PostgreSQL e teste a criação de canais departamentais.',
  diaryPlaceholder:'Mattermost provisionado; PostgreSQL ativo; autenticação LDAP vinculada a samba1; canais geral,ti,financeiro criados...',
  closing:'Parabéns! O chat corporativo Mattermost está operando com soberania total e integrado ao Samba AD. Na Aula 48, você implantará o gateway de acesso remoto seguro Apache Guacamole!',
  sources:[['Mattermost in NS8',docs+'administrator-manual/applications/mattermost/'],['LDAP Authentication',docs+'administrator-manual/identity_management/']]
};
