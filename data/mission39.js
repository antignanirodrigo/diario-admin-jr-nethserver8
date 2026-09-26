const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission39={
  id:39,xp:480,level:'Resiliência e Continuidade · 60-75 min',title:'Disaster recovery: procedimento de restauração',
  summary:'Execute a recuperação granular de uma aplicação corrompida a partir de um snapshot Restic sem derrubar o restante do cluster.',
  call:'CH-NS8-039 · Incidente crítico na Aurora: uma falha em lote durante uma automação corrompeu as tabelas do banco de dados e os arquivos do Nextcloud (nextcloud1). Os usuários recebem erro 500 ao acessar a nuvem corporativa. O Júnior deve diagnosticar o estado degradado da instância, escolher o snapshot íntegro mais recente no repositório Restic e executar o restore drill granular.',
  impact:'Reiniciar a máquina ou reinstalar o sistema operacional inteiro causaria horas de parada geral em todos os setores (e-mail, arquivos Samba e logins), além de poder sobrescrever evidências do incidente.',
  senior:'O Sênior colocou a mão no ombro do Júnior, que já estava prestes a reiniciar o servidor físico: "Pare a mão, Júnior. Nunca reinicie uma máquina que sofreu corrupção de dados a quente sem antes entender o que aconteceu. O resto do cluster está saudável: o e-mail está rodando e o Samba está autenticando normalmente. Nosso backup do NS8 é granular por um motivo. Nós vamos recuperar cirurgicamente apenas o Nextcloud a partir do snapshot limpo da madrugada."',
  concept:'O procedimento de restauração de instância no NethServer 8 restaura apenas os volumes e o estado da aplicação afetada. O fluxo consiste em: 1) Parar os containers da instância para evitar escritas concorrentes; 2) Limpar ou mover os volumes de dados corrompidos; 3) Baixar e descompactar os dados do snapshot selecionado do repositório Restic; 4) Restaurar o dump do banco de dados relacional; 5) Executar os hooks de pós-restauração para ajustar permissões e registrar metadados; 6) Reiniciar a instância e validar as rotas HTTP.',
  example:'No laboratório, você investiga o chamado com cat chamado-desastre-cloud.txt, comprova o erro com app-status nextcloud1, lista os snapshots disponíveis com backup-snapshot-list nextcloud1, dispara a recuperação com restore-app nextcloud1 b82f91a --confirm e valida o restabelecimento do serviço com app-status nextcloud1 e curl -I https://cloud.lab.example/.',
  glossary:[['Restore Drill','Treinamento prático de restauração de dados','Simulado de combate a incêndio com mangueira real para ter certeza de que a água sai.'],['RTO','Tempo objetivo de recuperação (Recovery Time Objective)','O cronômetro que mede quantos minutos o negócio tolera ficar com o serviço fora do ar.'],['RPO','Ponto objetivo de recuperação (Recovery Point Objective)','A tolerância máxima de quantas horas de trabalho podem ser perdidas entre um backup e outro.'],['Granular Restore','Restauração seletiva de apenas uma aplicação','Trocar apenas o pneu furado do carro sem precisar comprar outro automóvel.']],
  recall:{question:'Qual é a principal vantagem de realizar um restore granular de aplicação em vez de restaurar um snapshot de disco completo no hypervisor?',answer:'O restore granular do NS8 recupera apenas os dados e banco da aplicação danificada, mantendo os outros serviços do cluster (como correio eletrônico e autenticação de usuários) 100% online e sem perda das transações recentes que ocorreram nas outras áreas.'},
  labIntro:'Onde executar: terminal simulado e console de Disaster Recovery do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de plantão.',
    'Execute cat chamado-desastre-cloud.txt para ler os sintomas e a gravidade do incidente.',
    'Execute app-status nextcloud1 para constatar o estado DEGRADED da aplicação.',
    'Execute backup-snapshot-list nextcloud1 para inspecionar os snapshots íntegros disponíveis.',
    'Execute restore-app nextcloud1 b82f91a --confirm para disparar a recuperação cirúrgica.',
    'Execute app-status nextcloud1 e curl -I https://cloud.lab.example/ para comprovar a volta ao estado RUNNING e HTTP 200.',
    'No painel educativo, confirme a recuperação do serviço e valide o encerramento do chamado.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readDrTicket','Ler chamado em chamado-desastre-cloud.txt'],
    ['checkDegradedApp','Verificar status com app-status nextcloud1'],
    ['listAvailableSnapshots','Listar snapshots com backup-snapshot-list'],
    ['restoreApplication','Executar restore com restore-app'],
    ['verifyRestoredApp','Validar status running com app-status nextcloud1'],
    ['testRestoredHttp','Confirmar HTTP 200 com curl'],
    ['drRestoreVerified','Homologar recuperação no painel educativo']
  ],
  hints:[
    'O comando app-status nextcloud1 exibirá o estado de falha antes do restore.',
    'Identifique o snapshot limpo (b82f91a) em backup-snapshot-list nextcloud1.',
    'Após restore-app, confirme que app-status retorna RUNNING e que curl retorna HTTP/2 200.'
  ],
  testking:[
    q('n39-rto','RTO e RPO na Prática','Em um cenário onde o último backup ocorreu às 04:00 e o desastre aconteceu às 06:00, qual foi a perda potencial (RPO)?',0,
      ['2 horas de alterações nos dados ocorridas entre as 04:00 e as 06:00',
       'Zero horas, porque o Restic recupera arquivos que ainda não foram digitados',
       '24 horas inteiras de todos os dias da semana anterior'],
      ['Exato! O RPO mede o intervalo de tempo entre o último ponto de recuperação válido e o momento da falha.',
       'Nenhum software de backup consegue adivinhar dados criados após o último snapshot sem replicação contínua.',
       'A perda é restrita ao delta entre o snapshot usado e o momento da falha.'],
      'Se você tirou foto do quadro às 4h e o professor apagou às 6h, você perdeu as anotações feitas entre 4h e 6h.'
    ),
    q('n39-step','Ordem de Restauração de Aplicação','Qual a primeira ação técnica executada pelo NS8 ao iniciar a restauração de uma instância?',1,
      ['Formatar o sistema operacional do nó principal e reinstalar o Rocky Linux',
       'Parar os containers da instância para evitar conflito e novas gravações durante a extração dos dados',
       'Aumentar o clock do processador para acelerar o download do S3'],
      ['Reinstalar o sistema operacional é desnecessário e destruiria todos os outros serviços em funcionamento.',
       'Correto! Parar os containers garante que o banco de dados e arquivos estejam inativos para receber os dados do backup de forma atômica.',
       'O clock do processador é gerenciado pelo hypervisor/kernel e não tem relação com o fluxo do restore.'],
      'Antes de trocar o piso da cozinha, você desliga o registro de água e pede para ninguém entrar na sala.'
    ),
    q('n39-verify','Comprovação Pós-Restauração','O que comprova que o restore foi realmente bem-sucedido além do status running no console?',2,
      ['Verificar se a cor do logotipo do servidor mudou no navegador',
       'Confirmar que a data do servidor foi adiantada em uma semana',
       'Testar o acesso funcional do serviço (HTTP 200) e integridade dos arquivos recuperados pelos usuários'],
      ['Aparência visual do logotipo não comprova consistência de banco de dados ou integridade de arquivos.',
       'Alterar o relógio do sistema criaria problemas sérios de certificados TLS e Kerberos no cluster.',
       'Correto! O verdadeiro teste de um restore é o retorno operacional da aplicação com dados coerentes.'],
      'Não basta o motor do carro ligar na oficina; você precisa dar uma volta no quarteirão e conferir se o freio funciona.'
    )
  ],
  decisionPrompt:'Durante a restauração, o gestor pergunta se é necessário restaurar também o servidor de e-mail e o Samba AD para "garantir que tudo fique sincronizado". Qual é a decisão correta?',
  decisions:[
    {id:'restore-all',label:'Restaurar todas as aplicações do cluster para a mesma data de madrugada',correct:false,consequence:'Risco operacional gravíssimo: você causaria a perda desnecessária de todos os e-mails e arquivos salvos no Samba durante a manhã.'},
    {id:'granular-only',label:'Restaurar exclusivamente a instância nextcloud1 afetada, preservando os dados intactos dos demais serviços',correct:true,consequence:'Decisão segura e profissional! Os setores comercial e financeiro continuam trabalhando sem perder mensagens recentes.'},
    {id:'ignore-issue',label:'Deixar o Nextcloud corrompido e pedir aos usuários para usarem pendrives',correct:false,consequence:'Conduta inaceitável: o papel da TI é restabelecer a continuidade de negócios com segurança e rapidez.'}
  ],
  procedure:[
    'Isole a aplicação danificada e notifique os usuários sobre a janela de recuperação.',
    'Consulte a lista de snapshots disponíveis no repositório remoto filtrando pela instância.',
    'Selecione o snapshot mais recente anterior ao incidente com estado de integridade comprovado.',
    'Execute a restauração pelo comando oficial restore-app ou interface de Disaster Recovery do NS8.',
    'Inspecione os logs de término da restauração e verifique o status dos containers e rotas HTTP.',
    'Valide o login de teste e a leitura de dados antes de liberar o acesso geral.'
  ],
  validation:'Evidência: incidente diagnosticado, snapshot consistente localizado, restauração granular executada com sucesso, containers em running e resposta HTTP 200 confirmada via curl.',
  challenge:'Documente o snapshot utilizado na recuperação, o tempo gasto no restore (RTO observado) e confirme que os outros serviços não sofreram perda.',
  diaryPlaceholder:'Restore nextcloud1 executado com snapshot b82f91a; containers online; HTTP 200; e-mail e Samba não afetados...',
  closing:'Você provou na prática a eficácia do plano de continuidade em um momento crítico. Na próxima missão, você vai consolidar o Módulo 8 com uma auditoria de resiliência e simulação de pane total.',
  sources:[['Restore an Application',docs+'administrator-manual/backup/#restore-an-application'],['Disaster Recovery',docs+'administrator-manual/backup/#disaster-recovery']]
};
