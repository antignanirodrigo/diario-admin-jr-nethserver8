const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission52={
  id:52,xp:500,level:'Especialista · 60-70 min',title:'Expansão horizontal: ingressando o nó worker no cluster',
  summary:'Execute o join do novo servidor Rocky Linux 9 ao cluster NS8, estabeleça o túnel WireGuard e ative o nó worker.',
  call:'CH-NS8-052 · A equipe de datacenter finalizou a montagem física da nova máquina no rack, instalou o Rocky Linux 9 limpo e configurou o endereço IP estático 192.168.50.11 com hostname ns8-worker-02. O Júnior deve checar os pré-requisitos de conectividade e hardware da máquina remota, executar o procedimento de join ao cluster utilizando o token de autenticação gerado na aula anterior e comprovar que o novo nó passa a constar como membro ativo e saudável no cluster.',
  impact:'Adicionar nós de forma padronizada dobra a capacidade de computação e memória do datacenter da Aurora, prepara a infraestrutura para balanceamento de carga e garante redundância operacional sem downtime.',
  senior:'O Sênior aproximou-se do rack onde o novo servidor brilhava com os LEDs azuis: "Júnior, observe a elegância deste momento. O servidor ns8-worker-02 acabou de ser ligado. Nós não precisamos instalar Apache, banco de dados ou painel nele. Quando dispararmos o cluster-node-add com o token de autenticação, o agente do líder vai conectar, verificar a integridade da base, subir o módulo WireGuard no kernel e registrar o nó no Redis do cluster. Em menos de trinta segundos, nossa capacidade de processamento salta de 8 GB para 16 GB de RAM. Execute o join!"',
  concept:'O procedimento de ingresso (join) de um nó worker no NethServer 8 realiza as seguintes etapas automatizadas: 1) Validação de Pré-Requisitos: verificação do sistema operacional (Rocky Linux 9), sincronismo de relógio via NTP e resolução DNS externa; 2) Troca de Chaves Criptográficas: geração do par de chaves WireGuard local e registro da chave pública no nó líder; 3) Configuração da Interface wg0: atribuição automática do endereço IP virtual (10.5.4.2/24) e teste de handshake; 4) Registro de Inventário: publicação da capacidade de vCPUs, RAM e discos no banco de estado distribuído do cluster.',
  example:'No laboratório, você lê o escopo com cat worker-join-escopo.txt, valida os requisitos com node-prereq-check ns8-worker-02, executa o ingresso com cluster-node-add --host 192.168.50.11 --token AURORA-JOIN-TOKEN, consulta o estado com cluster-nodes-status e valida a expansão no painel educativo.',
  glossary:[['Cluster Join','Processo de anexar um novo servidor físico ou VM à infraestrutura do cluster','Conectar um novo vagão motorizado à composição do trem em movimento.'],['Node Prereqs','Lista de exigências mínimas de SO, relógio, rede e pacotes no host remoto','A inspeção veicular obrigatória antes de permitir que o caminhão ingresse na rodovia.'],['Cluster Handshake','Negociação de certificados TLS e chaves WireGuard entre líder e worker','O cumprimento formal entre os diplomatas onde ambos conferem suas credenciais oficiais.'],['Capacidade Agregada','Soma total de recursos de CPU, memória e armazenamento de todos os nós','O somatório da força de todos os operários trabalhando juntos na mesma obra.']],
  recall:{question:'Quais são os três requisitos mandatórios que a nova máquina deve cumprir antes de receber o comando de join ao cluster NS8?',answer:'1) Sistema operacional suportado limpo (ex: Rocky Linux 9) sem outros serviços instalados; 2) Endereço IP estático na mesma rede com resolução DNS externa funcional; 3) Relógio de sistema perfeitamente sincronizado com servidor NTP confiável.'},
  labIntro:'Onde executar: console de orquestração do nó líder e visualizador de topologia de nós.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão no líder ns8-lab-01.',
    'Execute cat worker-join-escopo.txt para analisar as especificações da nova VM.',
    'Execute node-prereq-check ns8-worker-02 para validar SO, relógio, CPU e RAM do alvo.',
    'Execute cluster-node-add --host 192.168.50.11 --token AURORA-JOIN-TOKEN para ingressar o nó.',
    'Execute cluster-nodes-status para confirmar os dois nós com status ONLINE.',
    'No painel educativo, confirme os nós ativos no cluster e homologue a expansão horizontal.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readWorkerScope','Ler escopo em worker-join-escopo.txt'],
    ['checkNodePrereqs','Verificar pré-requisitos com node-prereq-check'],
    ['addWorkerNode','Ingressar nó com cluster-node-add'],
    ['checkClusterStatus','Confirmar membros com cluster-nodes-status'],
    ['validateWorkerEnrollment','Homologar nó worker no painel educativo']
  ],
  hints:[
    'Execute node-prereq-check ns8-worker-02 antes de disparar o comando de adição.',
    'O comando de adição aceita o host 192.168.50.11 e o token gerado na aula anterior.',
    'Ao rodar cluster-nodes-status, confirme que ns8-lab-01 é Leader e ns8-worker-02 é Worker.'
  ],
  testking:[
    q('n52-clean','Estado da Base do Worker','Por que o servidor worker deve conter uma instalação limpa do Rocky Linux 9 sem serviços pré-existentes?',1,
      ['Porque o NS8 só roda em máquinas que nunca foram ligadas antes na fábrica',
       'Para evitar conflitos de portas, colisões de regras de firewall e dependências corrompidas durante o provisionamento',
       'Porque o Linux proíbe que máquinas antigas rodem containers'],
      ['Máquinas podem ser reaproveitadas, desde que seu sistema operacional seja reinstalado do zero de forma limpa.',
       'Correto! Serviços concorrentes (como outro Apache, MySQL ou Docker solto) interferem na orquestração nativa do NS8.',
       'O Linux suporta containers em qualquer hardware compatível, desde que o ambiente seja padronizado.'],
      'É limpar totalmente o terreno antes de erguer uma nova ala do hospital para evitar fundações podres.'
    ),
    q('n52-time','Importância do NTP no Join','O que acontece se o relógio do nó worker estiver 15 minutos defasado em relação ao líder no momento do join?',0,
      ['O handshake TLS e a autenticação do token falham imediatamente por rejeição de certificados expirados ou inválidos',
       'O servidor acelera a velocidade da ventoinha do processador até explodir',
       'O relógio da parede da empresa para de funcionar'],
      ['Exato! Certificados criptográficos e tokens baseiam-se em carimbos de tempo rígidos; divergências quebram a confiança TLS.',
       'Defasagem de horário é uma questão lógica de software e não provoca danos mecânicos em ventoinhas.',
       'Relógios físicos analógicos são independentes do protocolo NTP dos computadores.'],
      'É tentar embarcar no avião com uma passagem cuja data e horário não batem com o relógio do aeroporto.'
    ),
    q('n52-ip','Endereçamento WireGuard do Worker','Como o nó worker recebe seu endereço IP interno na rede virtual do cluster (wg0)?',2,
      ['O administrador deve negociar o endereço com a operadora de telefonia celular',
       'O endereço é sorteado aleatoriamente por um jogo de dados na tela',
       'O nó líder atribui automaticamente o próximo endereço disponível (10.5.4.2/24) durante a sincronização do join'],
      ['Operadoras de telecomunicações não gerenciam sub-redes VPN internas privadas de clusters locais.',
       'Sistemas de cluster corporativo utilizam algoritmos determinísticos de alocação de rede, não sorteios aleatórios.',
       'Correto! A autoridade de orquestração do líder reserva e configura o IP virtual do novo membro de forma transparente.'],
      'É o síndico do edifício entregando a chave e o número oficial da vaga de garagem do novo morador.'
    )
  ],
  decisionPrompt:'Um estagiário pergunta se é necessário criar contas de usuários locais e senhas idênticas na máquina do nó worker para que os serviços funcionem. Como você esclarece a dúvida técnica?',
  decisions:[
    {id:'duplicate-users',label:'Criar manualmente os mesmos usuários e senhas locais no arquivo /etc/passwd do worker',correct:false,consequence:'Grave erro conceitual: cria redundância inútil e quebra a centralização do diretório de identidades Samba AD.'},
    {id:'explain-centralized-id',label:'Explicar que usuários e autenticações são providos centralmente pelo cluster e os nós executam apenas os containers',correct:true,consequence:'Excelente didática e precisão técnica! Os nós workers operam como nós de computação sem necessidade de contas locais manuais.'},
    {id:'disable-auth',label:'Remover a autenticação de todos os servidores para não ter dúvidas de senhas',correct:false,consequence:'Destruição total da segurança da organização, expondo os dados a qualquer usuário.'}
  ],
  procedure:[
    'Confirme a instalação limpa do Rocky Linux 9 e o IP estático na máquina ns8-worker-02.',
    'Execute a checagem prévia de requisitos de CPU, memória e sincronismo de horário.',
    'Dispare o comando cluster-node-add fornecendo o FQDN/IP e o token de ingresso válido.',
    'Acompanhe o estabelecimento do túnel WireGuard e a injeção do agente de orquestração.',
    'Audite o status do cluster conferindo a presença do líder e do novo worker ativos.',
    'Atualize a documentação de inventário físico e virtual com a capacidade agregada total.'
  ],
  validation:'Evidência: pré-requisitos validados com sucesso em ns8-worker-02, join executado com túnel WireGuard 10.5.4.2 ativo, comando cluster-nodes-status exibindo 2 nós ONLINE e homologação concluída no painel educativo.',
  challenge:'Documente o IP do nó worker, registre o resultado da checagem prévia de pré-requisitos e comprove que o cluster reconhece os 2 nós como operacionais.',
  diaryPlaceholder:'Pré-requisitos de ns8-worker-02 aprovados; cluster-node-add executado; túnel wg0 (10.5.4.2) estabelecido; 2 nós ONLINE no cluster...',
  closing:'Parabéns! O nó worker ns8-worker-02 está integrado ao cluster com sucesso. Na Aula 53, você aprenderá a migrar e balancear cargas de trabalho entre os nós!',
  sources:[['Adding Cluster Nodes',docs+'administrator-manual/cluster/#adding-a-node'],['Node Enrollment Workflow',docs+'administrator-manual/cluster/#enrollment']]
};
