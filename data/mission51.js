const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission51={
  id:51,xp:500,level:'Especialista · 60-70 min',title:'Arquitetura multi-nó: plano de controle e WireGuard mesh',
  summary:'Planeje a expansão horizontal do cluster NS8, compreenda o papel do líder e prepare a malha interna WireGuard Mesh.',
  call:'CH-NS8-051 · A Aurora está contratando dezenas de novos profissionais e o nó líder atual (ns8-lab-01) ultrapassou 60% de consumo de memória RAM com o catálogo de aplicações em execução. A gerência de infraestrutura autorizou a adição de um segundo servidor físico (nó worker) para dividir a carga. O Júnior deve analisar a arquitetura multi-nó do NethServer 8, inspecionar a interface de malha WireGuard interna (wg0) e gerar o token criptográfico de ingresso que permitirá o join do futuro nó.',
  impact:'Compreender a separação de papéis entre o nó líder (control plane) e os nós workers impede que operadores tentem gerenciar clusters como servidores isolados, viabiliza o roteamento transparente de tráfego e garante escalabilidade horizontal sem reconfigurar clientes.',
  senior:'O Sênior chamou o Júnior para a sala de reuniões e abriu o diagrama de blocos do cluster: "Júnior, até hoje nós trabalhamos com o NS8 em nó único. Mas a grande beleza do NethServer 8 sobre qualquer outro sistema do mercado é que ele é um cluster nativo. O primeiro nó que criamos na Aula 9 é o Leader. Ele gerencia o Redis de estado global, a interface web do Cluster Admin e a chave mestra da malha WireGuard. Quando adicionamos workers, eles não precisam de um painel web próprio; eles simplesmente se conectam à malha WireGuard 10.5.4.0/24 e executam containers. Vamos gerar o token e preparar a expansão."',
  concept:'A arquitetura de cluster do NethServer 8 opera sobre um modelo Leader-Worker coordenado por uma rede mesh WireGuard ponto a ponto no kernel do Linux. O nó Líder (Leader) hospeda a autoridade de certificação do cluster, a API de orquestração e o banco de dados Redis onde o estado global de nós e aplicações é registrado. Cada novo nó Worker recebe um endereço IP interno na faixa privada da VPN (por exemplo, 10.5.4.2/24) e uma chave pública ChaCha20-Poly1305. O tráfego de controle e os dados entre containers trafegam exclusivamente por esse túnel criptografado com latência próxima de zero.',
  example:'No laboratório, você inspeciona a topologia planejada com cat cluster-multinode-plano.txt, lista os nós atuais com cluster-nodes-list, audita a interface da malha com cluster-vpn-mesh-status, gera o segredo de pareamento com cluster-join-token-generate e homologa o plano no painel educativo.',
  glossary:[['Cluster Leader','Nó primário que hospeda a autoridade de controle e o banco Redis do cluster','O maestro da orquestra que define o ritmo e indica quais músicos tocam em cada momento.'],['Cluster Worker','Nó adicional dedicado à execução de containers e alívio de processamento','Os músicos talentosos que executam suas partituras em sincronia com o maestro.'],['WireGuard Mesh','Malha de túneis criptografados em nível de kernel interligando todos os nós','Uma rodovia subterrânea privativa e blindada entre os prédios da mesma empresa.'],['Join Token','Segredo criptográfico temporário usado para autenticar o ingresso de um nó','O convite VIP numerado e carimbado que autoriza a entrada de um novo sócio no clube.']],
  recall:{question:'Qual é a função da interface WireGuard wg0 (10.5.4.0/24) em uma infraestrutura multi-nó do NethServer 8?',answer:'Ela interliga todos os nós do cluster em uma malha criptografada segura e de altíssima velocidade para transporte do plano de controle, sincronização do Redis e comunicação direta entre containers em nós diferentes.'},
  labIntro:'Onde executar: console do nó líder (ns8-lab-01) e painel de topologia de nós do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão no nó líder ns8-lab-01.',
    'Execute cat cluster-multinode-plano.txt para revisar o endereçamento planejado do cluster.',
    'Execute cluster-nodes-list para verificar o inventário atual de nós.',
    'Execute cluster-vpn-mesh-status para inspecionar a interface WireGuard wg0 e chave pública.',
    'Execute cluster-join-token-generate para gerar a credencial temporária de ingresso.',
    'No painel educativo, confirme os parâmetros do plano multi-nó e homologue o planejamento.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readClusterPlan','Ler plano em cluster-multinode-plano.txt'],
    ['listClusterNodes','Listar nós com cluster-nodes-list'],
    ['checkVpnMesh','Inspecionar malha WireGuard com cluster-vpn-mesh-status'],
    ['generateJoinToken','Gerar token de ingresso com cluster-join-token-generate'],
    ['validateMultiNodePlan','Homologar plano multi-nó no painel educativo']
  ],
  hints:[
    'O nó líder é ns8-lab-01 (192.168.50.10) e o futuro worker será ns8-worker-02 (192.168.50.11).',
    'A malha WireGuard utiliza a sub-rede privada 10.5.4.0/24.',
    'Gere o token com cluster-join-token-generate e valide o planejamento multi-nó no painel.'
  ],
  testking:[
    q('n51-roles','Papel do Nó Líder vs Worker','Qual é a responsabilidade exclusiva do nó Líder no cluster NS8?',0,
      ['Hospedar a API de orquestração do cluster, o painel Cluster Admin e o banco Redis de estado global',
       'Formatar os discos rígidos dos clientes Windows da rede a cada reinicialização',
       'Impedir que novos servidores sejam conectados à rede local corporativa'],
      ['Exato! O líder atua como cérebro de orquestração, mantendo a coerência e as políticas de todo o cluster.',
       'Ação absurda e destrutiva que jamais ocorre no gerenciamento de clusters.',
       'O objetivo do cluster multi-nó é justamente facilitar a expansão horizontal, não impedi-la.'],
      'É a diretoria central da empresa, onde as decisões e contratos são mantidos em arquivo central.'
    ),
    q('n51-wg','Tráfego na Malha WireGuard','Que tipo de dados trafega através da interface wg0 (10.5.4.0/24) entre os nós do cluster?',1,
      ['Músicas piratas e downloads de torrents de usuários domésticos',
       'Tráfego de controle do cluster, sincronização de estado Redis e comunicação interna entre containers',
       'Apenas impressões de documentos enviadas via cabo paralelo analógico'],
      ['A rede WireGuard do cluster é restrita exclusivamente ao plano de controle e serviços de nós.',
       'Correto! A interface wg0 provê transporte criptografado e eficiente de controle e dados entre nós.',
       'Cabo paralelo é um padrão de hardware legado que não tem relação com túneis VPN IP.'],
      'É o ramal telefônico interno e criptografado que liga os gabinetes dos diretores diretamente.'
    ),
    q('n51-token','Segurança do Token de Ingresso','Por que o comando cluster-join-token-generate produz um token temporário com expiração programada?',2,
      ['Porque o servidor quebra se o token durar mais de cinco minutos',
       'Para obrigar o administrador a comprar licenças comerciais adicionais a cada hora',
       'Para garantir que um invasor que descubra um token antigo não consiga anexar um servidor malicioso ao cluster'],
      ['A expiração é uma medida de controle criptográfico de segurança, não um bug do sistema.',
       'O NethServer 8 é software livre e de código aberto, sem bloqueios artificiais de licença.',
       'Correto! Tokens efêmeros reduzem a janela de oportunidade de ataques de anexação não autorizada de nós.'],
      'É a senha descartável de um minuto no aplicativo do banco que expira logo após você entrar.'
    )
  ],
  decisionPrompt:'O gerente de TI sugere instalar uma segunda instância do painel Cluster Admin no nó worker para que ele tenha sua própria interface de login web separada. Qual é a orientação técnica correta?',
  decisions:[
    {id:'split-brain-admin',label:'Instalar dois painéis web independentes para cada nó e gerenciar cada um por si',correct:false,consequence:'Grave erro arquitetural: divide o gerenciamento, impede a orquestração centralizada e induz a falhas de consistência (split-brain).'},
    {id:'unified-control-plane',label:'Manter o Cluster Admin centralizado no nó líder e operar o cluster como uma entidade única e unificada',correct:true,consequence:'Excelente decisão arquitetural! Segue o padrão oficial do NS8, simplifica o gerenciamento e mantém o controle centralizado.'},
    {id:'no-cluster',label:'Desistir do cluster e colocar cada aplicação em computadores de mesa comuns',correct:false,consequence:'Abordagem amadora que destrói a resiliência e a governança de TI da empresa.'}
  ],
  procedure:[
    'Inspecione a utilização de recursos no nó atual através do painel de monitoramento.',
    'Verifique o endereçamento IP da rede física e garanta conectividade com o novo host.',
    'Audite a interface WireGuard wg0 do nó líder e confirme a chave pública.',
    'Gere o token criptográfico de ingresso temporário para autorizar o novo nó.',
    'Valide as diretivas de segurança contra split-brain e confirme a centralização do plano de controle.',
    'Registre o plano de expansão no manual de infraestrutura da organização.'
  ],
  validation:'Evidência: sessão confirmada no líder ns8-lab-01, malha WireGuard wg0 operacional (10.5.4.1/24), token de ingresso gerado e plano multi-nó homologado com sucesso no painel educativo.',
  challenge:'Documente a topologia de nós do cluster, anote o IP interno WireGuard do líder e registre o token gerado para o ingresso do worker.',
  diaryPlaceholder:'Plano multi-nó aprovado; nó líder ns8-lab-01 em 10.5.4.1/24; token de join gerado; pronto para adicionar ns8-worker-02...',
  closing:'Excelente trabalho! O planejamento da arquitetura multi-nó está concluído e o token gerado. Na Aula 52, você executará o join do nó ns8-worker-02 ao cluster!',
  sources:[['Multi-node Cluster Architecture',docs+'administrator-manual/cluster/'],['WireGuard Control Mesh',docs+'administrator-manual/cluster/#wireguard-mesh']]
};
