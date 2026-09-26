const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission55={
  id:55,xp:600,level:'⭐ Revisão Integrada 11 · 75-90 min',title:'Marco de revisão integrada: resiliência de cluster e recuperação de falhas',
  isReview:true,
  summary:'Consolide os pilares de alta disponibilidade do Módulo 11: simule a queda de um nó worker, diagnostique a rede e execute a recuperação completa do cluster.',
  call:'CH-NS8-055 · Marco de Certificação do Módulo 11. O comitê de continuidade de negócios da Teseo e da Aurora agendou um teste de estresse não anunciado no datacenter: uma falha física abrupta de conectividade será simulada no nó worker (ns8-worker-02). O Júnior deve liderar o plantão de emergência: detectar a perda de batimento cardíaco (heartbeat) do nó, verificar como o líder e o proxy Traefik reagem à indisponibilidade parcial, acionar os protocolos de recuperação e religamento do nó worker e auditar a re-convergência da malha WireGuard para certificar a resiliência estelar do cluster.',
  impact:'Provar a resiliência e capacidade de recuperação em ambiente simulado assegura que quando um servidor físico queimar ou um cabo de rede for desconectado acidentalmente no mundo real, a equipe de TI saberá restaurar a operação em minutos sem desespero.',
  senior:'O Sênior caminhou calmamente até o rack e desconectou o cabo de rede do nó worker, enquanto os alarmes da console piscaram em vermelho: "Veja a tela, Júnior. No monitor de um leigo, isso parece um desastre. No monitor de um administrador sênior, isso é apenas um teste de resiliência. O nó líder ns8-lab-01 continua de pé. O Traefik identificou que o nó 2 não responde e o WireGuard isolou o peer degradado. Agora é com você: sonde o estado de saúde, entenda a partição, recupere o nó worker e comprove que o cluster se auto-repara sem perder a compostura. Vamos certificar o Módulo 11!"',
  concept:'A resiliência operacional em clusters NethServer 8 apoia-se em quatro pilares de alta disponibilidade: 1) Detecção de Heartbeat: sondagem contínua via WireGuard ping a cada 5 segundos; se um nó não responder após limite tolerável (30s), seu estado é alterado para DEGRADED/UNREACHABLE; 2) Isolamento e Não-Propagação de Falhas: serviços e containers executando nos nós saudáveis continuam operando normalmente sem degradação cascata; 3) Re-convergência Automática do WireGuard: ao restabelecer o link ou reiniciar o host, o daemon WireGuard realiza novo handshake ChaCha20 sem exigir reinicialização do nó líder; 4) Auditoria de Resiliência: checagem sintética de latência, integridade do banco Redis e rotas Traefik.',
  example:'No laboratório, você lê o escopo do exercício com cat resiliencia-cluster-escopo.txt, simula a queda com cluster-failover-simulate --offline-node ns8-worker-02, sonda os alarmes com cluster-health-probe, reconecta o nó com cluster-node-recover --node ns8-worker-02, audita a recuperação com cluster-resilience-audit e homologa o Marco de Revisão no checklist.',
  glossary:[['Heartbeat','Sinal periódico de batimento cardíaco enviado entre nós do cluster','O pulso do paciente na UTI que confirma para os médicos que ele está vivo e respirando.'],['Network Partition','Falha de comunicação onde um nó fica temporariamente isolado dos demais','Um deslizamento de terra que bloqueia a ponte de acesso a uma cidade vizinha.'],['Self-Healing','Capacidade de um sistema de restabelecer conexões e estados assim que o recurso retorna','A pele que cicatriza o corte e fecha o machucado sem precisar trocar de corpo.'],['Re-convergência','Retorno de todos os nós e rotas ao estado consistente de equilíbrio operacional','Os músicos que voltam a tocar no mesmo compasso da orquestra assim que retornam ao palco.']],
  recall:{question:'O que acontece com os serviços hospedados no nó líder (como o Mail Server e o Traefik) quando o nó worker sofre uma queda repentina?',answer:'Eles continuam funcionando normalmente e sem interrupções, pois cada nó possui independência de execução local e a malha do NS8 isola a falha impedindo que ela contamine os nós saudáveis.'},
  labIntro:'Onde executar: console de resiliência do nó líder e painel de auditoria de desastres.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão no líder ns8-lab-01.',
    'Execute cat resiliencia-cluster-escopo.txt para revisar os parâmetros da simulação de falha.',
    'Execute cluster-failover-simulate --offline-node ns8-worker-02 para disparar a queda do worker.',
    'Execute cluster-health-probe para inspecionar os alertas e o status UNREACHABLE do nó 2.',
    'Execute cluster-node-recover --node ns8-worker-02 para restabelecer o nó e a malha WireGuard.',
    'Execute cluster-resilience-audit para certificar que ambos os nós voltaram ao status 100% ONLINE.',
    'No painel educativo, confirme os cinco marcos do Módulo 11 e homologue a certificação estelar.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readDrillScope','Ler escopo em resiliencia-cluster-escopo.txt'],
    ['simulateNodeFailover','Simular queda do nó worker com cluster-failover-simulate'],
    ['probeClusterHealth','Sondar saúde do cluster com cluster-health-probe'],
    ['recoverClusterNode','Recuperar nó worker com cluster-node-recover'],
    ['runResilienceAudit','Auditar recuperação com cluster-resilience-audit'],
    ['review11Certified','Homologar Marco de Revisão Integrada 11']
  ],
  hints:[
    'O comando cluster-failover-simulate simula a desconexão temporária do nó ns8-worker-02.',
    'Use cluster-health-probe para comprovar a detecção da falha de heartbeat.',
    'Restaure o nó com cluster-node-recover e audite a re-convergência com cluster-resilience-audit.'
  ],
  testking:[
    q('n55-isolate','Isolamento de Falhas em Cluster','Por que a queda do nó worker não derrubou os serviços que continuavam rodando no nó líder?',0,
      ['Porque os nós operam com isolamento de namespaces e independência de execução coordenada por WireGuard',
       'Porque o nó líder é movido a energia mágica que desafia as leis da física',
       'Porque o nó worker nunca existiu de verdade e era apenas uma ilusão de ótica'],
      ['Exato! A arquitetura distribuída do NS8 é desacoplada: cada nó executa seus containers independentemente.',
       'Termos mágicos ou fantasiosos não têm lugar na engenharia de sistemas de missão crítica.',
       'O servidor worker é uma máquina real que participava ativamente da computação do cluster.'],
      'É o motor bimotor do avião: se uma das turbinas apaga, a outra mantém o voo em segurança até o pouso.'
    ),
    q('n55-healing','Comportamento do WireGuard no Retorno','Como a malha WireGuard se comporta quando o nó worker reconecta o cabo de rede e volta a responder?',1,
      ['O líder precisa ser formatado do zero e reinstalado para reconhecer a nova conexão',
       'O WireGuard restabelece o handshake automaticamente em segundos no nível do kernel sem necessidade de reiniciar o líder',
       'Todos os dados da empresa são criptografados com uma senha secreta desconhecida'],
      ['Reinstalar o líder seria um retrocesso inadmissível para uma simples reconexão de rede.',
       'Correto! O protocolo WireGuard é stateless e renegocia o canal seguro instantaneamente assim que os pacotes voltam a fluir.',
       'Criptografia no NS8 é controlada pela infraestrutura com chaves documentadas e gerenciadas.'],
      'É o fone de ouvido Bluetooth que se reconecta instantaneamente ao seu celular assim que você liga o aparelho.'
    ),
    q('n55-drill','Objetivo dos Disaster Drills','Qual é a importância de simular paradas não programadas em ambiente de homologação ou laboratório?',2,
      ['Para queimar fontes de alimentação e solicitar orçamentos mais caros para a diretoria',
       'Para provocar estresse desnecessário nos colaboradores da empresa durante a madrugada',
       'Para validar procedimentos de emergência, medir tempos de recuperação (RTO) e garantir a prontidão técnica da equipe'],
      ['Exercícios de simulação nunca devem danificar hardware físico deliberadamente.',
       'Treinamentos e testes são planejados para trazer tranquilidade e domínio técnico, não pânico.',
       'Correto! Testar falhas de forma controlada transforma o medo do desconhecido em procedimento padrão documentado.'],
      'É o simulador de voo dos pilotos: eles praticam a falha de motor mil vezes para reagir com perfeição no dia em que ela acontecer.'
    )
  ],
  decisionPrompt:'Após a simulação de resiliência, a diretoria pergunta se a empresa já pode hospedar os sistemas de faturamento crítico no cluster multi-nó com segurança. Qual é o parecer técnico?',
  decisions:[
    {id:'deny-production',label:'Afirmar que o cluster nunca deve ser usado porque computadores sempre podem falhar',correct:false,consequence:'Atitude derrotista que ignora que a finalidade de um cluster é justamente tolerar falhas de computadores.'},
    {id:'certify-production',label:'Aprovar a infraestrutura comprovando que a tolerância a falhas, migração e re-convergência foram 100% homologadas com sucesso',correct:true,consequence:'Parecer técnico brilhante! Demonstra maturidade profissional, embasada em testes empíricos de engenharia e conformidade total.'},
    {id:'shut-cluster',label:'Desligar todos os servidores e voltar a emitir notas fiscais em blocos de papel carbono',correct:false,consequence:'Decisão ridícula que inviabiliza o crescimento da organização no século XXI.'}
  ],
  procedure:[
    'Revise os procedimentos operacionais padrão (SOP) de contingência de datacenter.',
    'Dispare a simulação controlada de falha de link de rede no nó worker alvo.',
    'Audite a detecção imediata do alerta de perda de heartbeat no painel do cluster.',
    'Comprove a continuidade sem impacto dos serviços críticos rodando nos nós saudáveis.',
    'Restaure a conectividade física e acione a recuperação controlada do nó.',
    'Execute a varredura completa de integridade de malha, persistência de dados e rotas Traefik.'
  ],
  validation:'Evidência: simulação de failover executada com isolamento de falha confirmado, recuperação do nó ns8-worker-02 homologada, auditoria de resiliência 100% HEALTHY e certificação estelar do Marco de Revisão Integrada 11 concedida.',
  challenge:'Documente a desconexão do nó 2, registre os alertas de heartbeat capturados e comprove a re-convergência da malha WireGuard.',
  diaryPlaceholder:'Simulação de failover executada em ns8-worker-02; líder permaneceu estável; reconexão WireGuard automática; Marco de Revisão 11 certificado...',
  closing:'⭐ Parabéns! Você concluiu o Módulo 11 com excelência e tornou-se Especialista em Alta Disponibilidade, Cluster Mesh e Multi-Nó no NethServer 8. No Módulo 12, você alcançará o topo com Operação Avançada, Governança e Certificação Final!',
  sources:[['Cluster High Availability',docs+'administrator-manual/cluster/#resilience'],['Disaster Recovery & Node Failure',docs+'administrator-manual/cluster/#node-recovery']]
};
