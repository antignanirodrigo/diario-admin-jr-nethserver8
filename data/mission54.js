const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission54={
  id:54,xp:500,level:'Especialista · 60-70 min',title:'Armazenamento distribuído: volumes e compartilhamentos de rede',
  summary:'Integre armazenamento de rede corporativo (NFSv4.2) ao cluster NS8 para viabilizar volumes compartilhados entre múltiplos nós.',
  call:'CH-NS8-054 · À medida que novas aplicações são migradas entre os nós do cluster, a cópia manual de volumes locais começa a demonstrar limites com arquivos grandes de centenas de gigabytes. O comitê de infraestrutura disponibilizou um storage corporativo NAS de alta performance no IP 192.168.50.20 com export NFSv4.2. O Júnior deve analisar as estratégias de armazenamento em cluster, montar o volume compartilhado /srv/shared-nfs em todos os membros do cluster e validar a consistência de I/O e locking de arquivos.',
  impact:'Contar com armazenamento centralizado e compartilhado em rede permite que qualquer nó do cluster assuma ou mova cargas instantaneamente sem replicação massiva de dados, além de simplificar a política de backup centralizado no storage corporativo.',
  senior:'O Sênior desenhou dois computadores conectados a uma caixa azul rotulada NAS no quadro: "Júnior, este é o divisor de águas entre um cluster amador e um cluster empresarial. Quando os volumes residem no disco local da máquina, mover uma aplicação pesada exige esperar minutos ou horas enquanto os dados são transmitidos pela rede. Mas quando montamos um volume NFS compartilhado e rápido no caminho /srv/shared-nfs em todos os nós, o container pode iniciar em qualquer máquina em dois segundos, porque os dados já estão ali acessíveis para todos. Vamos integrar esse storage agora."',
  concept:'O armazenamento em clusters NethServer 8 suporta dois padrões principais: 1) Volumes Locais de Nós: alta velocidade I/O baseada em NVMe/SSD local no caminho /var/lib/nethserver, ideal para bancos de dados de altíssima transacionalidade, porém vinculados ao nó de execução; 2) Armazenamento de Rede Compartilhado (NFSv4.2 / iSCSI): ponto de montagem unificado (ex: /srv/shared-nfs) montado identicamente em todos os nós líderes e workers, provendo concorrência POSIX, locking de arquivos e failover imediato de aplicações entre membros do cluster.',
  example:'No laboratório, você estuda os pontos de montagem com cat storage-distribuido-plano.txt, audita os discos locais com node-storage-audit, monta o compartilhamento corporativo com cluster-nfs-mount --server 192.168.50.20 --path /srv/shared-nfs, testa a leitura/escrita e trava de arquivo com cluster-storage-validate e homologa o volume no painel educativo.',
  glossary:[['NFSv4.2','Protocolo padrão de sistema de arquivos distribuído de alto desempenho com suporte a locking nativo','A biblioteca pública da cidade onde qualquer cidadão autorizado pode ler e guardar documentos.'],['File Locking','Mecanismo que impede que dois nós gravem sobre o mesmo arquivo simultaneamente','A trava do banheiro: quando alguém está dentro, a maçaneta avisa que o compartimento está ocupado.'],['Shared Storage','Armazenamento externo acessível por múltiplos servidores de um cluster','A geladeira coletiva da república onde todos os moradores guardam seus alimentos.'],['POSIX Permissions','Padrão de permissões de leitura, escrita e execução por usuário e grupo no Linux','O crachá funcional que define quem pode abrir cada gaveta do armário compartilhado.']],
  recall:{question:'Qual é a grande vantagem do armazenamento compartilhado NFS para a tolerância a falhas de um cluster de aplicações?',answer:'Se um nó falhar repentinamente, o container correspondente pode ser iniciado imediatamente em outro nó do cluster sem necessidade de restaurar ou migrar terabytes de arquivos, pois os dados já estão acessíveis na rede.'},
  labIntro:'Onde executar: console de armazenamento do nó líder e visualizador de volumes do cluster.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão no nó líder ns8-lab-01.',
    'Execute cat storage-distribuido-plano.txt para verificar o IP do NAS e o caminho NFS.',
    'Execute node-storage-audit para auditar os discos locais dos nós líderes e workers.',
    'Execute cluster-nfs-mount --server 192.168.50.20 --path /srv/shared-nfs para montar o volume nos nós.',
    'Execute cluster-storage-validate para validar integridade de I/O, trava de arquivos e latência.',
    'No painel educativo, confirme os pontos de montagem distribuídos e homologue o armazenamento.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readStoragePlan','Ler plano em storage-distribuido-plano.txt'],
    ['auditNodeStorage','Auditar discos locais com node-storage-audit'],
    ['mountClusterNfs','Montar volume compartilhado com cluster-nfs-mount'],
    ['validateStorageIo','Validar I/O e locking com cluster-storage-validate'],
    ['validateDistributedStorage','Homologar armazenamento compartilhado no painel educativo']
  ],
  hints:[
    'O storage NAS está disponível no IP 192.168.50.20 sob export /export/aurora-cluster.',
    'Utilize cluster-nfs-mount especificando o caminho local de montagem /srv/shared-nfs.',
    'O comando cluster-storage-validate certificará latência inferior a 1ms e locking POSIX.'
  ],
  testking:[
    q('n54-locking','Importância do File Locking no NFS','Por que o suporte a File Locking no protocolo NFSv4.2 é vital para aplicações conteinerizadas em cluster?',0,
      ['Para impedir que dois nós ou processos alterem o mesmo arquivo ao mesmo tempo e corrompam os dados',
       'Para trancar o teclado físico do administrador sempre que ele digitar rápido demais',
       'Para apagar todos os arquivos do disco a cada dez minutos'],
      ['Exato! O locking atômico garante consistência transacional e integridade de arquivos de banco e anexos.',
       'Locking de arquivo é uma operação de sistema de arquivos e não trava teclados físicos.',
       'Ação destrutiva absurda: storages preservam dados com redundância, nunca apagam arquivos aleatoriamente.'],
      'É colocar uma senha no cofre para garantir que duas pessoas não mexam na mesma pasta ao mesmo tempo.'
    ),
    q('n54-nfs-adv','Vantagem sobre Cópia Local','Qual é a maior vantagem operacional do volume compartilhado NFS durante a movimentação de serviços?',1,
      ['Exigir que o administrador compre cabos de fibra ótica de 100 metros para cada mesa',
       'Permitir que qualquer nó execute a aplicação instantaneamente sem precisar esperar a cópia de centenas de gigabytes de dados',
       'Eliminar a necessidade de usar computadores para trabalhar na empresa'],
      ['Equipamentos de rede dependem da infraestrutura do datacenter e não exigem compras avulsas para cada mesa.',
       'Correto! O tempo de failover e migração cai de horas para segundos porque o armazenamento é desacoplado do nó host.',
       'Serviços de cluster existem para empoderar o uso de computadores com segurança e alta performance.'],
      'É deixar os livros na estante central da biblioteca para qualquer aluno poder consultar em qualquer mesa.'
    ),
    q('n54-perm','Mapeamento de Usuários e UID','O que deve ser garantido entre os nós para que containers rootless acessem arquivos no NFS compartilhado?',2,
      ['Todos os colaboradores devem saber a senha de root do storage',
       'Os cabos de rede devem ser pintados de verde fluorescente',
       'Mapeamento consistente de UID/GID e permissões POSIX idênticas em todos os membros do cluster'],
      ['Senhas de gerência de storage devem ser mantidas restritas e nunca distribuídas a usuários finais.',
       'A cor física da capa externa dos cabos de rede não altera o funcionamento lógico do sistema de arquivos.',
       'Correto! Como os containers no NS8 rodam rootless, os IDs de usuário nos nós devem mapear para as mesmas permissões no NFS.'],
      'É garantir que o mesmo número de crachá de funcionário dê acesso às mesmas portas em todas as filiais da empresa.'
    )
  ],
  decisionPrompt:'Um operador sugere montar o compartilhamento NFS diretamente sobre a pasta raiz / do sistema operacional para facilitar o acesso de todos os comandos. Como você avalia essa proposta?',
  decisions:[
    {id:'mount-root',label:'Aceitar e montar o NFS na raiz / substituindo os arquivos do sistema operacional',correct:false,consequence:'Catástrofe técnica: sobrescrever a raiz / do sistema paralisa o nó, corrompe o kernel e impede a inicialização.'},
    {id:'mount-dedicated-path',label:'Rejeitar e manter a montagem no caminho dedicado e isolado /srv/shared-nfs',correct:true,consequence:'Excelente prática de engenharia de sistemas! Preserva a integridade do sistema operacional e isola os dados persistentes.'},
    {id:'cancel-nfs',label:'Desconectar todos os storages e proibir o uso de rede na empresa',correct:false,consequence:'Decisão absurda que paralisa as operações e quebra a infraestrutura corporativa.'}
  ],
  procedure:[
    'Verifique a conectividade de rede com o storage NAS corporativo (192.168.50.20).',
    'Audite o particionamento e pontos de montagem locais dos nós líderes e workers.',
    'Dispare a montagem unificada no caminho corporativo padrão /srv/shared-nfs.',
    'Execute testes de escrita, leitura e locking de arquivos simultâneos a partir dos membros do cluster.',
    'Inspecione o consumo e espaço disponível com o utilitário df em ambos os nós.',
    'Documente o volume compartilhado no mapa de recursos distribuídos da Aurora.'
  ],
  validation:'Evidência: discos locais auditados em ambos os nós, volume NFSv4.2 montado com sucesso em /srv/shared-nfs, teste de I/O e locking homologado com status PASS e validação concluída no painel educativo.',
  challenge:'Documente o endereço IP do storage NAS, anote o ponto de montagem compartilhado e confirme que o canary file de teste foi validado com sucesso.',
  diaryPlaceholder:'Storage NFS 192.168.50.20 montado em /srv/shared-nfs em todos os nós; locking e I/O validados (0.8ms); armazenamento distribuído ativo...',
  closing:'Parabéns! O cluster agora possui armazenamento compartilhado de alto desempenho. Na Aula 55, você executará a Revisão Integrada 11 com simulação de falha de nó e resiliência!',
  sources:[['Cluster Shared Storage',docs+'administrator-manual/cluster/#storage'],['NFSv4.2 Best Practices','https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_file_systems/mounting-nfs-shares_managing-file-systems']]
};
