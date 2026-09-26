const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission36={
  id:36,xp:450,level:'Resiliência e Continuidade · 60-75 min',title:'Estratégia de backup: Restic, repositórios e retenção',
  summary:'Descubra como o motor Restic opera com snapshots deduplicados e defina uma política de retenção sustentável.',
  call:'CH-NS8-036 · A diretoria da Aurora aprovou a expansão dos serviços no NS8, mas o comitê de segurança exigiu um plano formal de proteção de dados. O Júnior precisa estruturar a política de backup antes de habilitar tarefas automáticas: avaliar o destino remoto, compreender a deduplicação do Restic e definir regras de retenção (diária, semanal e mensal).',
  impact:'Salvar backups no próprio disco local do servidor cria uma falsa sensação de segurança. Se o storage físico ou o hypervisor sofrer pane, dados de produção e cópias de segurança são destruídos simultaneamente.',
  senior:'O Sênior chamou o Júnior para a sala de servidores e apontou para os discos rígidos na gaveta: "Um arquivo compactado jogado na pasta /home não é política de backup, Júnior. No NethServer 8, o motor nativo é o Restic. Ele trata os dados como blocos criptografados e deduplicados. Dez backups seguidos não gastam dez vezes mais espaço, apenas guardam a diferença. Mas para isso funcionar de verdade, o destino precisa estar fora desta máquina."',
  concept:'O NethServer 8 utiliza o Restic como seu subsistema padrão de backup. O Restic opera baseado em snapshots (fotos instantâneas do estado dos dados no tempo). Cada arquivo novo é quebrado em blocos de tamanho variável (chunks) e endereçado pelo hash SHA-256 de seu conteúdo. Se dois arquivos ou duas versões de um banco possuem blocos idênticos, o bloco é armazenado uma única vez no repositório (deduplicação). A política de retenção clássica Grandfather-Father-Son (GFS) permite reter, por exemplo, os últimos 7 dias, 4 semanas e 12 meses sem estourar o disco.',
  example:'No laboratório, você investiga o plano com cat estrategia-backup.txt, testa a conectividade até o bucket S3 simulado com restic-repo-discover e valida as diretrizes de retenção 7D/4W/12M com backup-policy-validate.',
  glossary:[['Restic','Motor nativo de backup moderno do NS8','Um cofre inteligente que só guarda peças que ele ainda não tem repetidas.'],['Snapshot','Registro pontual e imutável do estado dos dados','Uma fotografia com data e hora de toda a biblioteca corporativa.'],['Deduplicação','Técnica de armazenar apenas dados únicos','Se dez pessoas guardam o mesmo anexo de 10 MB, o cofre guarda só 10 MB e anota dez etiquetas.'],['Retenção GFS','Política de descarte programado de cópias antigas','Guardar a foto de cada dia da última semana, mas apenas uma foto por mês dos anos passados.']],
  recall:{question:'Por que o Restic não consome o dobro de espaço no repositório ao realizar um segundo backup de um banco de dados que só mudou 5%?',answer:'Porque o Restic quebra os arquivos em chunks criptografados e deduplicados por hash de conteúdo. Os 95% dos blocos inalterados continuam apontando para os dados já existentes no repositório, gravando no disco apenas os 5% de blocos novos.'},
  labIntro:'Onde executar: terminal simulado e painel educativo de estratégia de proteção de dados.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e nó do cluster.',
    'Execute cat estrategia-backup.txt para ler os requisitos de repositório e retenção.',
    'Execute restic-repo-discover para testar a comunicação de rede com o endpoint de backup.',
    'Execute backup-policy-validate para auditar os parâmetros de expiração de snapshots.',
    'No painel educativo, selecione os parâmetros da política GFS aprovada e homologue o planejamento.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readBackupStrategy','Ler requisitos em estrategia-backup.txt'],
    ['discoverBackupRepo','Descobrir endpoint remoto com restic-repo-discover'],
    ['validateBackupPolicy','Auditar retenção com backup-policy-validate'],
    ['backupStrategyVerified','Homologar estratégia no painel educativo']
  ],
  hints:[
    'Consulte cat estrategia-backup.txt para identificar o endpoint S3 e as quotas de retenção.',
    'O comando restic-repo-discover valida a rota e a porta do repositório remoto.',
    'No painel educativo, selecione 7 diários, 4 semanais e 12 mensais para validar a política corporativa.'
  ],
  testking:[
    q('n36-restic','Arquitetura do Restic no NS8','Como o motor Restic gerencia o armazenamento dos backups no NethServer 8?',0,
      ['Através de snapshots imutáveis com deduplicação por blocos criptografados',
       'Compactando tudo em um único arquivo .tar.gz sem verificação de integridade',
       'Copiando arquivos via FTP simples sem nenhum tipo de criptografia'],
      ['Exato! O Restic divide os dados em blocos, calcula hashes criptográficos e armazena snapshots deduplicados.',
       'O NS8 abandonou abordagens arcaicas baseadas em tarball único devido à lentidão e falta de deduplicação.',
       'O protocolo FTP sem segurança não é suportado pelo subsistema moderno de backup do NS8.'],
      'É como um arquivo moderno onde cada parágrafo repetido aponta para o original em vez de gastar papel novo.'
    ),
    q('n36-repo','Localização do Repositório','Por que um repositório de backup em disco local do próprio servidor é condenado pelo Sênior?',1,
      ['Porque o Restic não suporta sistemas de arquivos locais',
       'Porque falhas no hardware do host ou desastres físicos destroem a produção e o backup juntos',
       'Porque backups locais gastam dez vezes mais memória RAM do que backups na nuvem'],
      ['O Restic até suporta diretórios locais, mas isso viola o princípio básico de resiliência.',
       'Correto! Se o disco pifar ou a sala queimar, todo o esforço de backup local é perdido em segundos.',
       'O consumo de memória do Restic depende do índice de blocos, não da distância física da mídia.'],
      'Guardar a chave cópia de casa dentro do próprio chaveiro que você perdeu na rua não ajuda a entrar em casa.'
    ),
    q('n36-gfs','Política de Retenção GFS','O que a política "Keep 7 daily, 4 weekly, 12 monthly" garante para a empresa?',2,
      ['Que o backup apagará todos os arquivos com mais de 7 dias automaticamente',
       'Que nenhum arquivo novo poderá ser criado se o backup mensal falhar',
       'Recuperabilidade fina para dias recentes e histórico de longo prazo com uso eficiente de storage'],
      ['Ela não apaga tudo após 7 dias; ela preserva os marcos semanais e mensais para auditorias passadas.',
       'A política de retenção atua no repositório de backup, não bloqueia operações correntes do usuário.',
       'Correto! Você consegue recuperar uma pasta apagada anteontem e também conferir o estado da contabilidade do ano passado.'],
      'É o álbum de família: muitas fotos do último passeio no parque, mas só uma foto oficial de cada aniversário antigo.'
    )
  ],
  decisionPrompt:'A diretoria pergunta se a empresa pode simplesmente comprar mais um HD interno e deixar o backup gravando nele para economizar. Qual orientação você apresenta?',
  decisions:[
    {id:'local',label:'Aceitar o HD interno, pois backups locais são mais rápidos e não gastam internet',correct:false,consequence:'Risco operacional severo: em caso de descarga elétrica, roubo ou queima da placa-mãe, produção e backup serão destruídos.'},
    {id:'remote-s3',label:'Exigir repositório remoto offsite (S3/SFTP) seguindo a regra de resiliência 3-2-1',correct:true,consequence:'Decisão segura! O servidor pode sofrer pane total e os dados corporativos permanecerão seguros em cofre externo imutável.'},
    {id:'pendrive',label:'Usar um pendrive USB comum espetado na porta traseira do servidor',correct:false,consequence:'Risco operacional: mídias flash de consumo não possuem confiabilidade nem IOPS para backups corporativos.'}
  ],
  procedure:[
    'Levante os volumes de dados de todas as aplicações ativas no cluster.',
    'Defina o repositório remoto fora da infraestrutura física do cluster (S3 Object Storage ou SFTP isolado).',
    'Estabeleça os tempos de RPO (Recovery Point Objective) e RTO (Recovery Time Objective) de cada serviço.',
    'Configure a regra de retenção adequada (ex: 7 diários, 4 semanais, 12 mensais).',
    'Documente as senhas de criptografia do repositório em cofre de senhas corporativo seguro.'
  ],
  validation:'Evidência: requisitos auditados, conectividade com repositório remoto comprovada e parâmetros de retenção GFS validados. Retorno: o cluster agora possui uma estratégia técnica de proteção contra perda total.',
  challenge:'Anote por que a deduplicação do Restic viabiliza backups diários sem estourar o storage e registre a regra de retenção aprovada.',
  diaryPlaceholder:'Restic deduplica chunks SHA-256; storage offsite S3; política 7D/4W/12M aprovada...',
  closing:'Você estabeleceu a fundação de segurança do cluster da Aurora. Na próxima missão, você vai configurar as credenciais seguras e inicializar o repositório remoto no Cluster Admin.',
  sources:[['Backup and Restore',docs+'administrator-manual/backup/'],['Restic Overview','https://restic.net/']]
};
