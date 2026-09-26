const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission35={
  id:35,xp:480,level:'⭐ Revisão Integrada · 75-90 min',isReview:true,title:'⭐ Revisão 07: Incidente em filas de correio e telemetria',
  summary:'Consolide todo o módulo de e-mail diagnosticando mensagens represadas na fila do Postfix, corrigindo o bloqueio de saída e liberando a entrega.',
  call:'CH-NS8-035 · INCIDENTE CRÍTICO DE PLANTÃO: A diretoria da Aurora emitiu contratos com prazo fatal e nenhuma mensagem externa está sendo entregue aos destinatários. O chamado de alta pressão exige: (1) Inspecionar a fila de correio ativa; (2) Analisar os logs de transporte do Postfix; (3) Identificar a causa raiz do bloqueio; (4) Corrigir o encaminhamento de saída; e (5) Esvaziar e descarregar a fila com sucesso comprovado.',
  impact:'Mensagens acumuladas em fila correm risco de expirar o tempo limite de retenção (bounce) ou de congestionar o banco de dados do MTA, gerando perda irreversível de acordos comerciais e quebra de SLA da empresa.',
  senior:'O Sênior aproximou sua cadeira e serviu uma xícara de café para o Júnior: "Plantão de e-mail é onde a calma separa quem decora receita de quem entende arquitetura. Quando a diretoria grita que o e-mail não chega, o operador amador apaga a fila ou reinicia o servidor loucamente. O administrador sênior digita mailq, abre os logs e deixa o Postfix falar onde está a pedra no caminho. Siga o método: inspecione a fila, leia o erro, corrija a rota e descarregue a carga."',
  concept:'As mensagens enviadas pelo Postfix passam por diferentes filas internas: incoming (recebimento), active (processamento imediato), deferred (adiadas por falha temporária como timeout ou recusa remota) e hold (retidas por política ou quarentena). Comandos como mailq listam as mensagens represadas e seus respectivos Queue IDs. A análise de logs (journalctl ou /var/log/maillog) revela os códigos de status SMTP (ex: 450, 451, 550, 554). Após sanar o bloqueio de rede ou rota, a fila é descarregada com postfix flush.',
  example:'No laboratório, você executa mailq e observa 12 mensagens com status Connection timed out to port 25. Lê o log com mail-log-view, aplica a correção de rota com mail-relay-fix, força o reprocessamento com postfix-flush e valida que a fila esvaziou e os status viraram 250 2.0.0 Ok.',
  glossary:[['mailq','Utilitário que inspeciona a fila de mensagens do Postfix','O painel de controle que mostra os aviões de carga parados na pista esperando decolagem.'],['Deferred Queue','Fila de mensagens aguardando nova tentativa após erro transitório','A sala de espera de encomendas que encontraram a porta fechada.'],['postfix flush','Comando que força o reprocessamento imediato de todas as mensagens na fila','O apito do supervisor autorizando todas as carretas retidas a saírem de uma vez.'],['SMTP 250 OK','Código universal de sucesso indicando que a mensagem foi aceita','O recibo assinado confirmando que a encomenda foi entregue em mãos.']],
  recall:{question:'Por que jamais devemos executar comandos destrutivos como "postsuper -d ALL" para resolver um problema de mensagens represadas na fila de e-mail?',answer:'Porque o comando "postsuper -d ALL" deleta sumariamente todas as mensagens da fila sem tentar entregá-las e sem avisar os remetentes, destruindo propostas comerciais, contratos e comunicações corporativas legítimas que estavam apenas aguardando a correção da rota de rede.'},
  labIntro:'Onde executar: terminal simulado e painel educativo de triagem e contingência de correio eletrônico.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de plantão.',
    'Execute cat chamado-incidente-email.txt para ler os detalhes do alerta de entrega.',
    'Execute mailq para auditar o volume e os motivos de retenção das mensagens na fila.',
    'Execute mail-log-view para inspecionar os registros de erro de transporte do Postfix.',
    'Execute mail-relay-fix para corrigir o apontamento de saída e restabelecer o canal SMTP.',
    'Execute postfix-flush para forçar a reentrega imediata de todas as mensagens da fila deferred.',
    'Execute mailq novamente para comprovar que a fila esvaziou (Mail queue is empty).',
    'No painel educativo, feche o checklist de revisão do Módulo 7 e homologue a resolução.'
  ],
  objectives:[
    ['identity','Confirmar operador'],
    ['host','Confirmar nó'],
    ['readIncidentTicket','Ler chamado em chamado-incidente-email.txt'],
    ['inspectMailQueue','Inspecionar fila com mailq'],
    ['examineMailLogs','Analisar logs de erro com mail-log-view'],
    ['fixOutboundRoute','Corrigir rota de saída com mail-relay-fix'],
    ['flushMailQueue','Descarregar fila com postfix-flush'],
    ['verifyQueueEmpty','Confirmar fila vazia com mailq'],
    ['review7Certified','Homologar Marco de Revisão Integrada']
  ],
  hints:[
    'O comando mailq lista o status de mensagens retidas na fila.',
    'Analise as últimas entradas com mail-log-view para identificar o erro de conexão.',
    'Após executar mail-relay-fix, utilize postfix-flush para despachar as mensagens represadas.'
  ],
  testking:[
    q('n35-queue','Diagnóstico de Fila','Ao executar mailq, você vê mensagens com a mensagem "Connection timed out to port 25". Qual é a provável causa raiz?',0,
      ['A porta de saída TCP 25 está sendo bloqueada pelo firewall de borda ou pelo provedor de internet (ISP)',
       'O disco rígido do servidor queimou e precisa ser substituído fisicamente',
       'Os usuários esqueceram a senha de acesso ao webmail'],
      ['Exato! Time out na porta 25 indica falha de conectividade ou bloqueio de firewall na rota de saída.',
       'Se o disco tivesse queimado, o sistema operacional e o comando mailq nem responderiam.',
       'Erros de autenticação de usuários ocorrem na porta 587 ou IMAP 993, não no tráfego de saída do MTA.'],
      'É o caminhão dos correios preso no pedágio porque a cancela da rodovia está temporariamente trancada.'
    ),
    q('n35-flush','Reprocessamento da Fila','O que o comando "postfix flush" realiza após a correção de um problema de rede?',1,
      ['Formata o banco de dados do Dovecot e recria as caixas do zero',
       'Varre a fila deferred e tenta reenviar imediatamente todas as mensagens pendentes sem esperar o tempo de retry agendado',
       'Desconecta todos os computadores da rede interna para economizar memória'],
      ['O comando flush não altera o armazenamento de caixas postais nem toca no Dovecot.',
       'Correto! O Postfix normalmente espera intervalos exponenciais (5m, 10m, 20m) para retentar; o flush força a saída na hora.',
       'O comando opera estritamente no subsistema de filas do Postfix sem interferir na rede.'],
      'É o operador liberando a cancela e autorizando todas as carretas que estavam aguardando no acostamento a seguir viagem.'
    ),
    q('n35-triage','Conduta Profissional do Sênior','Qual é o procedimento técnico correto ao assumir um incidente com fila de e-mails cheia?',2,
      ['Deletar todas as mensagens da fila para que o painel volte a ficar verde rapidamente',
       'Trocar a distribuição Linux do servidor imediatamente sem fazer backup',
       'Identificar a causa raiz nos logs, corrigir o enlace/rota, forçar o flush e acompanhar o status 250 OK'],
      ['Apagar mensagens destrói dados corporativos vitais e configura negligência técnica grave.',
       'Reinstalar o sistema operacional durante um incidente cria tempo de inatividade inaceitável e destrói evidências.',
       'Padrão Sênior! Diagnostique com fatos, resolva a causa real, libere a retenção e comprove o resultado.'],
      'O cirurgião estanca a hemorragia antes de liberar o paciente, em vez de esconder o prontuário na gaveta.'
    )
  ],
  decisionPrompt:'Com a diretoria pressionando por resultados imediatos durante o incidente de fila, qual conduta operacional adotar?',
  decisions:[
    {id:'panic-delete',label:'Usar postsuper -d ALL para zerar a fila e dizer que o problema sumiu',correct:false,consequence:'Catástrofe: todos os contratos da empresa foram destruídos permanentemente e você causou prejuízo irreparável.'},
    {id:'methodical-fix',label:'Conduzir triagem metodológica: ler logs, corrigir rota de saída, executar postfix-flush e comprovar entrega',correct:true,consequence:'Atuação profissional de excelência! Mensagens entregues com integridade, causa raiz sanada e confiança restabelecida.'},
    {id:'reboot-host',label:'Reiniciar o servidor físico no botão para ver se resolve',correct:false,consequence:'Além de não resolver o bloqueio de rede, interrompeu os demais serviços em execução no cluster.'}
  ],
  procedure:[
    'Executar mailq para auditar o número de mensagens pendentes, remetentes e motivos de adiamento.',
    'Inspecionar os logs de transporte do Postfix (/var/log/maillog ou journalctl) isolando os códigos de erro.',
    'Sanar a causa raiz (desbloqueio de firewall de borda ou ajuste de relay host autorizado).',
    'Disparar a ordem de esvaziamento imediato com postfix flush para todas as mensagens retidas.',
    'Confirmar que a fila atingiu o status vazio e que as conexões foram concluídas com código SMTP 250 OK.',
    'Preencher o relatório de passagem de turno com a causa raiz, ação corretiva e recomendações preventivas.'
  ],
  validation:'Evidência: operador e nó confirmados, chamado lido, fila auditada, logs inspecionados, rota corrigida, fila esvaziada e marco de revisão do Módulo 7 homologado.',
  challenge:'Escreva o relatório final de passagem de turno detalhando como você identificou a causa raiz do represamento na porta 25 e qual procedimento garantiu a entrega de 100% dos contratos da Aurora.',
  diaryPlaceholder:'Incidente de correio solucionado; causa raiz: bloqueio na porta 25 externa; rota ajustada; postfix-flush executado; fila esvaziada; status=sent comprovado...',
  closing:'⭐ Parabéns pela conquista do Marco de Revisão Integrada do Módulo 7! Você dominou arquitetura de correio, DNS, entregabilidade e resolução de crises sob pressão. O próximo módulo abrirá um pilar vital da empresa: Backup Corporativo e Restauração.',
  sources:[['Postfix Queue Management Official Manual','http://www.postfix.org/QSHAPE_README.html'],['Resolução de Problemas no NS8 Mail',docs+'applications/mail/#troubleshooting']]
};
