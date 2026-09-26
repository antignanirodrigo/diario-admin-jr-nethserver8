const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission40={
  id:40,xp:500,level:'⭐ Revisão Integrada 08 · 75-90 min',title:'Marco de revisão integrada: simulação de desastre total',
  isReview:true,
  summary:'Consolide os pilares de continuidade do Módulo 8: audite a integridade do cofre Restic, simule perda do nó e certifique o plano de recuperação.',
  call:'CH-NS8-040 · Marco de Certificação do Módulo 8. O conselho de administração da Aurora marcou uma auditoria externa de Continuidade de Negócios (Business Continuity Plan - BCP). O Júnior deve comprovar na prática que o cluster NS8 é resiliente: rodar a verificação de integridade de blocos no Restic (restic check), simular o procedimento completo de Disaster Recovery e emitir o relatório de conformidade de RTO e RPO.',
  impact:'Planos de contingência que nunca foram testados em simulações práticas quase sempre falham no dia do desastre real por causa de senhas esquecidas, endpoints inacessíveis ou corrupção silenciosa.',
  senior:'O Sênior vestiu o blazer escuro e sentou-se ao lado do Júnior, apontando para a tela do terminal: "Júnior, na TI corporativa existe um ditado brutal: ninguém quer saber de backup até o dia em que o servidor queima; mas quando ele queima, o backup é a única coisa que importa no mundo. Hoje você não é mais o Júnior que tinha medo de olhar o terminal. Você vai auditar o cofre inteiro, checar integridade de blocos e comprovar que se este prédio desaparecer, nós levantamos a Aurora em outro lugar em menos de 30 minutos."',
  concept:'A auditoria de resiliência e continuidade de negócios em clusters NethServer 8 abrange: 1) Validação criptográfica do repositório através do restic check, que percorre toda a árvore de índices, pacotes (packs) e blobs para assegurar que nenhum bit sofreu degradação (bitrot); 2) Simulação de reconstrução em nó limpo (cluster-restore), reimportando configurações do Core e restabelecendo os serviços em ordem de dependência (Domínio Samba primeiro, seguido de Nextcloud e Mail); 3) Mensuração real do RTO (tempo decorrido até a volta dos serviços) contra a meta aprovada pelo negócio.',
  example:'No laboratório, você estuda os critérios da auditoria com cat auditoria-resiliencia-escopo.txt, verifica a saúde dos blocos do cofre com restic-check-repo, executa o simulado completo com dr-drill-simulate --all-apps e gera os indicadores de tempo de recuperação com dr-metrics-report.',
  glossary:[['restic check','Comando que audita a integridade criptográfica de todos os blocos do repositório','Passar o raio-X em todas as malas no depósito para ter certeza de que nenhuma fechadura quebrou.'],['Bitrot','Deterioração silenciosa de dados magnéticos ou semicondutores ao longo do tempo','A tinta de um livro antigo apagando aos poucos pela umidade da estante.'],['BCP','Plano de Continuidade de Negócios (Business Continuity Plan)','O plano mestre da empresa para continuar atendendo clientes caso um terremoto atinja a matriz.'],['Revisão Integrada','Marco que consolida os conhecimentos de todo o módulo operacional','O teste prático da autoescola em trânsito real antes de receber a carteira de habilitação definitiva.']],
  recall:{question:'O que o comando restic check faz no repositório de backup do NethServer 8 e por que ele deve ser executado periodicamente?',answer:'O restic check lê todos os índices e verifica os hashes criptográficos SHA-256 de todos os pacotes e árvores de dados do repositório, garantindo que não houve corrupção silenciosa (bitrot), falha de disco na nuvem ou exclusão acidental de blocos vitais para o restore.'},
  labIntro:'Onde executar: terminal de alta disponibilidade e console integrado de resiliência e auditoria.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de auditoria técnica.',
    'Execute cat auditoria-resiliencia-escopo.txt para conhecer os parâmetros e metas de RTO/RPO.',
    'Execute restic-check-repo para realizar a varredura de integridade em todos os snapshots e índices.',
    'Execute dr-drill-simulate --all-apps para rodar o teste de recuperação automatizada de todo o cluster.',
    'Execute dr-metrics-report para auditar os tempos obtidos contra a meta corporativa de 30 minutos.',
    'No painel educativo, preencha o checklist dos cinco marcos do Módulo 8 e valide a certificação estelar.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readDrAuditPlan','Ler escopo em auditoria-resiliencia-escopo.txt'],
    ['checkRepoIntegrity','Auditar repositório com restic-check-repo'],
    ['simulateDisasterDrill','Simular recuperação com dr-drill-simulate'],
    ['measureRtoMetrics','Auditar métricas com dr-metrics-report'],
    ['review8Certified','Homologar Marco de Revisão Integrada 08']
  ],
  hints:[
    'O comando restic-check-repo deve retornar 0 errors found para aprovação da integridade.',
    'Utilize dr-drill-simulate --all-apps para exercitar a recuperação em cadeia dos serviços.',
    'No painel educativo, marque os cinco itens do checklist de auditoria antes de clicar em Validar Certificação.'
  ],
  testking:[
    q('n40-check','Verificação com Restic Check','Qual é o risco de nunca executar o comando restic check no repositório de backup?',1,
      ['O repositório fica sem internet e para de responder requisições DNS',
       'Descobrir que os dados estão corrompidos ou ilegíveis somente no dia em que você realmente precisar restaurar',
       'O sistema operacional cobrar taxas adicionais por gigabyte armazenado'],
      ['O restic check não atua em resolução DNS de nomes na rede.',
       'Correto! Sem a auditoria preventiva de blocos, falhas de integridade silenciosas só são descobertas na hora do desastre.',
       'O Restic é um software livre de código aberto e não possui cobranças por gigabyte.'],
      'É deixar de conferir o pneu estepe do carro durante três anos e descobrir que ele estava furado no dia em que o pneu principal rasgou na estrada.'
    ),
    q('n40-order','Ordem de Restauração no Desastre','Ao reconstruir um cluster NS8 destruído a partir do backup, qual é a ordem correta de recuperação dos serviços?',0,
      ['Cluster Core e VPN primeiro, depois o domínio de usuários/Samba e por fim as aplicações (Nextcloud e Mail)',
       'Nextcloud primeiro, depois o e-mail e nunca restaurar o Core para economizar tempo',
       'Restaurar aleatoriamente todas as aplicações ao mesmo tempo sem configurar o cluster'],
      ['Exato! Sem o Core e o provedor de identidade (Samba), as aplicações não teriam como autenticar usuários nem montar permissões.',
       'O Nextcloud depende da autenticação dos usuários do domínio para liberar os logins corporativos.',
       'A restauração simultânea desordenada gera conflitos de portas e dependências de autenticação não resolvidas.'],
      'Primeiro você ergue a fundação da casa e liga a fiação elétrica; depois você traz a geladeira e a televisão.'
    ),
    q('n40-rto-eval','Avaliação de Métricas de Continuidade','Se a meta de RTO da Aurora era de até 30 minutos e o relatório técnico dr-metrics-report comprovou 14 minutos e 22 segundos, qual a conclusão da auditoria?',2,
      ['O teste falhou porque o tempo foi menor que o número planejado',
       'O teste é inconclusivo e deve ser repetido cem vezes seguidas',
       'O teste foi um sucesso pleno, provando que a empresa recupera sua operação com folga dentro da tolerância do negócio'],
      ['Um tempo menor é extremamente positivo: significa recuperação mais rápida do que o limite aceitável.',
       'A auditoria valida os dados com evidências de terminal e métricas concretas.',
       'Correto! O negócio volta a operar na metade do tempo máximo estipulado pela diretoria corporativa.'],
      'Se o bombeiro tinha 30 minutos para apagar o fogo e apagou em 14 minutos, a missão foi cumprida com mérito.'
    )
  ],
  decisionPrompt:'O auditor externo solicita a evidência final para conceder a certificação de resiliência ISO/BCP para a infraestrutura da Aurora. Qual pacote de evidências você entrega?',
  decisions:[
    {id:'verbal-promise',label:'Uma declaração verbal garantindo que o sistema é muito estável e nunca caiu',correct:false,consequence:'Auditoria reprovada: auditorias de segurança exigem logs, medições e evidências técnicas irrefutáveis.'},
    {id:'audit-dossier',label:'O relatório com restic check limpo, simulação de DR drill concluída e métricas de RTO/RPO documentadas',correct:true,consequence:'Aprovação com louvor! O dossiê comprova maturidade técnica, testes repetíveis e conformidade corporativa plena.'},
    {id:'postpone-audit',label:'Pedir cancelamento da auditoria alegando que backups são confidenciais e ninguém pode ver',correct:false,consequence:'Inaceitável: a conformidade regulatória exige transparência dos mecanismos de recuperação.'}
  ],
  procedure:[
    'Execute restic check preventivo ao menos uma vez ao mês no repositório de produção.',
    'Realize testes periódicos de restore drill em nós de laboratório sem impacto na rede ativa.',
    'Meça e registre os tempos de RTO e o delta de perda RPO de cada simulação.',
    'Atualize o Plano de Continuidade de Negócios (Runbook de DR) com as instruções passo a passo.',
    'Apresente os resultados à diretoria técnica para homologação e renovação das políticas de proteção.'
  ],
  validation:'Evidência: varredura criptográfica do repositório concluída sem falhas, simulação de recuperação em cadeia executada, métricas de RTO em conformidade com o BCP e checklist de revisão homologado.',
  challenge:'Registre o tempo de RTO obtido na simulação, confirme o resultado de integridade do restic check e anote os 5 pilares do Módulo 8 dominados.',
  diaryPlaceholder:'Restic check 0 errors; DR drill executado com sucesso; RTO 14m22s (meta <30m); checklist Módulo 8 100%...',
  closing:'⭐ Parabéns! Você concluiu com distinção o Módulo 8 e conquistou o título de Especialista em Continuidade e Disaster Recovery no NethServer 8. No Módulo 9, você mergulhará em Segurança de Borda e na integração com o NethSecurity 8!',
  sources:[['Disaster Recovery Guide',docs+'administrator-manual/backup/#disaster-recovery'],['BCP Best Practices','https://www.cisa.gov/resources-tools/resources/business-continuity-planning-suite']]
};
