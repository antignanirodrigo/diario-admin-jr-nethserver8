const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission38={
  id:38,xp:470,level:'Resiliência e Continuidade · 60-75 min',title:'Backup granular: core do cluster vs aplicações',
  summary:'Separe os planos de proteção do sistema base das instâncias de serviço e execute backups com consistência.',
  call:'CH-NS8-038 · O cluster da Aurora possui múltiplos serviços ativos: o core do cluster (configurações e VPN), o domínio Samba AD (samba1), a nuvem de arquivos (nextcloud1) e o servidor de correio (mail1). O Júnior foi encarregado de criar tarefas de backup com agendamentos e retenções independentes para evitar gargalos de I/O na produção.',
  impact:'Tratar todas as aplicações em um único lote gigantesco paralisa o servidor na madrugada, trava bancos de dados em horários críticos e impede restaurações pontuais de serviços individuais.',
  senior:'O Sênior desenhou três relógios de parede no quadro branco: "O core do cluster quase não muda depois que a rede está pronta, então um backup semanal ou após mudanças é suficiente. Mas o e-mail recebe mensagens a cada segundo e o Samba gerencia senhas de login o dia todo. No NS8, nós dividimos as tarefas em planos granulares. Se o Nextcloud precisar de backup às 22h, ele não compete com o banco do e-mail rodando à meia-noite."',
  concept:'No NethServer 8, o subsistema de backup é modular e orientado a instâncias. Há duas categorias principais de planos: 1) Backup do Cluster Core, que salva o estado do Redis, configurações do Cluster Admin, nós e certificados WireGuard; e 2) Backup de Instâncias (como nextcloud1, mail1, samba1). Antes de enviar os dados, o NS8 executa ganchos (pre-backup hooks) que colocam bancos de dados em estado consistente (dump de MariaDB ou PostgreSQL em container), evitando corrupção de tabelas abertas durante a leitura dos blocos pelo Restic.',
  example:'No laboratório, você investiga o escopo com cat escopo-backup-granular.txt, lista as rotinas planejadas com backup-plan-list, dispara um backup manual do core com backup-run core e da instância mail1 com backup-run mail1, inspecionando os snapshots gerados com backup-snapshot-list.',
  glossary:[['Cluster Core Backup','Cópia das configurações e identidade do cluster','A planta arquitetônica e o registro de imóveis da sede corporativa.'],['Instance Backup','Cópia dedicada aos dados de uma aplicação','O cofre específico do departamento contábil ou da sala de correspondências.'],['Pre-backup Hook','Script que prepara o banco de dados antes da cópia','Pedir para o contador pausar a digitação por dois segundos para tirar uma cópia limpa do livro-razão.'],['Crash Consistency','Estado íntegro dos dados sem transações corrompidas','Garantir que todas as contas batem antes de carimbar o fechamento do dia.']],
  recall:{question:'Por que o NS8 executa um pre-backup hook para descarregar o banco de dados antes que o Restic leia o volume de dados da aplicação?',answer:'Porque arquivos de banco de dados ativos em disco contêm transações na memória. Copiar os arquivos sem um dump ou freeze prévio pode gerar um backup inconsistente e corrompido, incapaz de iniciar após a restauração.'},
  labIntro:'Onde executar: terminal simulado e módulo de agendamento de backups do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar a estação de administração.',
    'Execute cat escopo-backup-granular.txt para conferir instâncias e janelas recomendadas.',
    'Execute backup-plan-list para auditar as rotinas registradas no cluster.',
    'Execute backup-run core para disparar o backup de metadados do cluster.',
    'Execute backup-run mail1 para disparar o backup consistente da aplicação de e-mail.',
    'Execute backup-snapshot-list para comprovar os snapshots indexados no repositório.',
    'No painel educativo, homologue a matriz de agendamento granular e valide a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readGranularPlan','Ler escopo em escopo-backup-granular.txt'],
    ['listBackupPlans','Auditar planos com backup-plan-list'],
    ['runCoreBackup','Disparar backup com backup-run core'],
    ['runMailBackup','Disparar backup com backup-run mail1'],
    ['listBackupSnapshots','Listar snapshots com backup-snapshot-list'],
    ['granularBackupVerified','Homologar rotinas no painel educativo']
  ],
  hints:[
    'Consulte backup-plan-list para verificar se os planos core e mail1 estão cadastrados.',
    'Dispare manualmente o backup de core e da aplicação mail1 para gerar snapshots válidos.',
    'Execute backup-snapshot-list para auditar os identificadores e timestamps dos snapshots criados.'
  ],
  testking:[
    q('n38-gran','Granularidade de Backup','Qual é o benefício de criar planos de backup separados por instância no NS8?',1,
      ['Diminuir a criptografia para economizar bateria nos servidores de arquivos',
       'Permitir agendamentos escalonados e restaurações pontuais sem afetar outras aplicações',
       'Evitar a necessidade de senhas para as caixas de correio dos usuários'],
      ['A criptografia é obrigatória e idêntica em todos os planos, mantendo padrão de segurança elevado.',
       'Correto! Separar instâncias permite agendar janelas em horários distintos e restaurar apenas a aplicação com problema.',
       'Autenticação de caixas de correio é controlada pelo Dovecot/Samba, não pelos agendamentos de backup.'],
      'É poder chamar a manutenção apenas para a máquina de café sem precisar evacuar o prédio inteiro.'
    ),
    q('n38-hook','Pre-backup Hooks e Consistência','Para que serve o hook executado pelo NS8 antes de iniciar o Restic em uma aplicação com banco de dados?',0,
      ['Para gerar um dump consistente e garantir que o snapshot contenha dados sem corrupção transacional',
       'Para apagar todos os logs de sistema antigos e liberar espaço no disco local',
       'Para desinstalar o container e reinstalá-lo do zero a cada madrugada'],
      ['Exato! O hook garante a consistência do banco de dados (ACID), evitando tabelas corrompidas no restore.',
       'Limpeza de logs de sistema obedece a políticas de rotação do journald, não interfere no hook do Restic.',
       'Desinstalar a aplicação causaria indisponibilidade prolongada e desnecessária para os usuários.'],
      'É avisar o fotógrafo da firma para todo mundo olhar para frente e ficar parado antes do clique da foto.'
    ),
    q('n38-core','Backup do Cluster Core','O que está contido no backup classificado como "Core" no NethServer 8?',2,
      ['As caixas de correio e todos os arquivos em PDF dos usuários da rede',
       'As imagens completas de todos os sistemas operacionais instalados na empresa',
       'Configurações globais do cluster, estado do Redis, malha VPN WireGuard e certificados administrativos'],
      ['Caixas de e-mail e arquivos pessoais pertencem aos backups das instâncias mail1 e nextcloud1.',
       'Imagens completas de SO (bare metal) são atribuições de hipervisores como o Proxmox VE, não do NS8 core.',
       'Correto! O Core contém o esqueleto administrativo e os metadados necessários para reerguer a orquestração do cluster.'],
      'É a escritura, o contrato social e a chave-mestra do condomínio, não os móveis dentro de cada apartamento.'
    )
  ],
  decisionPrompt:'O coordenador solicita agendar o backup do Nextcloud (600 GB) e do servidor de Mail às 09:30 da manhã, durante o pico de expediente. Qual conduta técnica deve ser adotada?',
  decisions:[
    {id:'schedule-morning',label:'Agendar às 09:30, pois backups durante o dia garantem que haverá operadores olhando a tela',correct:false,consequence:'Risco operacional severo: a sobrecarga de I/O em disco e rede degradará o desempenho de todos os usuários no pico.'},
    {id:'schedule-offhours',label:'Remanejar os backups pesados para a madrugada em horários desfasados (ex: 23:00 e 02:00)',correct:true,consequence:'Decisão segura! Os backups rodam durante a janela de baixa atividade com impacto zero nos usuários da Aurora.'},
    {id:'disable-backup',label:'Suspender os backups de dados e manter apenas o backup de configurações para não gastar disco',correct:false,consequence:'Falha de resiliência inaceitável: em caso de pane, todos os e-mails e arquivos recentes serão perdidos.'}
  ],
  procedure:[
    'Crie um plano específico para o Cluster Core com execução semanal ou em pós-configuração.',
    'Crie planos independentes para cada instância de aplicação produtiva (nextcloud1, mail1, samba1).',
    'Escalone os horários de início com janelas mínimas de intervalo para não saturar I/O e link de rede.',
    'Habilite notificações por e-mail no Cluster Admin para receber alertas em caso de falha de rotina.',
    'Audite semanalmente se os snapshots estão sendo gerados e indexados com sucesso no cofre remoto.'
  ],
  validation:'Evidência: planos granulares identificados, execução manual de core e aplicação concluída com sucesso e snapshots indexados no repositório com integridade confirmada.',
  challenge:'Anote o horário definido para o backup das aplicações e explique a função do pre-backup hook para a integridade de bancos de dados.',
  diaryPlaceholder:'Planos core e mail1 criados; pre-backup hook garante dump atômico; janelas escalonadas na madrugada...',
  closing:'Você garantiu a consistência dos backups por aplicação. Na próxima missão, você vai vivenciar o momento da verdade: a restauração pontual em simulação de desastre.',
  sources:[['Configuring Backup',docs+'administrator-manual/backup/#configuring-a-backup'],['Application Hooks',docs+'developer-manual/']]
};
