const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission56={
  id:56,xp:350,level:'Operação Avançada · 45-60 min',title:'Troubleshooting do cluster e diagnóstico do agente Redis',
  summary:'Investigue filas travadas e tarefas com erro no NS8: inspecione o Redis do nó líder, libere locks órfãos e restabeleça o fluxo assíncrono de operações.',
  call:'CH-NS8-056 · Incidente INC-4022. O helpdesk da Teseo abriu um chamado prioritário: as operações de reconfiguração de serviços no Cluster Admin estão congeladas. A tarefa T-3091 ("Application reconfiguration") falhou e deixou a fila de orquestração bloqueada por um lock não liberado. O Júnior deve acessar a console do líder, investigar o estado do Redis central, inspecionar a causa raiz da tarefa com erro, executar o retry seguro com limpeza de lock e comprovar o restabelecimento do cluster.',
  impact:'Compreender a fila assíncrona do Redis e o ciclo de vida das tarefas do NS8 evita que administradores realizem reinicializações brutas e desnecessárias do servidor em momentos de falha de concorrência.',
  senior:'O Sênior aproximou-se da tela e colocou a mão sobre o ombro do Júnior, que já pretendia reiniciar a máquina virtual inteira: "Calma, garoto! No NethServer 8, o nó líder usa o Redis como um livro-razão de transações em memória. Quando um container demora a responder ou um timeout acontece, a tarefa entra em FAILED e pode segurar um lock de recurso. Se você reiniciar a máquina à força, arrisca corromper o estado do Podman. O caminho profissional é inspecionar o log do journald, examinar a fila no Redis e desobstruir a tarefa cirurgicamente. Vamos ao bisturi!"',
  concept:'Toda mutação de estado no NethServer 8 é assíncrona e orquestrada pelo agente local em comunicação com a fila do Redis central no nó líder. O ciclo de uma tarefa percorre: 1) submission: requisição gerada pela UI ou API com atribuição de Task-ID; 2) tasks:pending: enfileiramento aguardando processamento pelo daemon de nó alvo; 3) tasks:running: aquisição de lock exclusivo de recurso e execução dos scripts do módulo; 4) tasks:completed ou tasks:failed: devolução do código de saída e gravação de stack trace. Quando ocorre timeout de rede ou falha transitória, um lock órfão impede que novas tarefas alterem o mesmo módulo até que o administrador analise o log e comande um retry limpo.',
  example:'No laboratório, você lê o guia com cat troubleshooting-cluster-guia.txt, verifica a conexão do banco com cluster-redis-status, lista tarefas travadas com cluster-task-list --status failed, reexecuta a transação liberando o lock com cluster-task-retry --task-id T-3091 e audita a saúde do cluster com cluster-health-check.',
  glossary:[['Redis Queue','Fila em memória no nó líder que gerencia tarefas assíncronas do cluster','A esteira de pedidos de uma pizzaria: organiza os chamados em ordem e monitora o preparo.'],['Orphan Lock','Trava de exclusão mútua retida por um processo que falhou sem liberá-la','Uma porta trancada por alguém que esqueceu a chave na fechadura ao sair apressado.'],['Task Retry','Reexecução controlada de uma transação após correção da causa temporária','Reenviar um pacote de correio após consertar o endereço com CEP correto.'],['Journald Stack','Log estruturado do systemd que registra a causa raiz exata da falha','A caixa-preta do avião: registra milissegundo a milissegundo o motivo de qualquer incidente.']],
  recall:{question:'Por que reiniciar o servidor líder sem analisar a fila do Redis é uma má prática no NethServer 8?',answer:'Porque a reinicialização não resolve a causa raiz da tarefa com erro, pode corromper volumes Podman e recria a fila no mesmo estado travado se o lock persistir em disco.'},
  labIntro:'Onde executar: console de operações e diagnóstico avançado do nó líder ns8-lab-01.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de diagnóstico no líder.',
    'Execute cat troubleshooting-cluster-guia.txt para revisar os detalhes da tarefa T-3091.',
    'Execute cluster-redis-status para aferir o daemon Redis e o uso de memória.',
    'Execute cluster-task-list --status failed para identificar o lock retido e a mensagem de erro.',
    'Execute cluster-task-retry --task-id T-3091 para liberar a trava e reprocessar o comando.',
    'Execute cluster-health-check para certificar que todas as tarefas e nós estão saudáveis.',
    'No painel educativo, homologue a resolução de falha e a desobstrução da fila.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readTroubleshootingGuide','Ler guia em troubleshooting-cluster-guia.txt'],
    ['checkRedisStatus','Verificar integridade do Redis com cluster-redis-status'],
    ['listFailedTasks','Filtrar tarefas com erro em cluster-task-list'],
    ['retryStuckTask','Liberar lock e reexecutar tarefa com cluster-task-retry'],
    ['runClusterHealthCheck','Executar diagnóstico global com cluster-health-check'],
    ['validateTroubleshooting','Homologar resolução de falha no painel']
  ],
  hints:[
    'O comando cluster-task-list --status failed filtra exclusivamente transações que não concluíram.',
    'Use cluster-task-retry com o identificador T-3091 para limpar o lock e forçar a conclusão.',
    'Finalize com cluster-health-check para comprovar que a fila voltou ao status nominal.'
  ],
  testking:[
    q('n56-redis','Papel do Redis no NS8','Qual é a função do Redis no nó líder do cluster NethServer 8?',0,
      ['Centralizar o estado do cluster, gerenciar filas assíncronas e distribuir tarefas para os daemons dos nós',
       'Armazenar vídeos e arquivos de áudio dos colaboradores da empresa',
       'Substituir o firewall NethSecurity e bloquear ataques DDoS'],
      ['Exato! O Redis é o barramento de comunicação e orquestração do cluster NethServer 8.',
       'O Redis gerencia dados voláteis e filas em memória, não armazenamento de arquivos de mídia.',
       'Segurança e firewall são funções do NethSecurity 8 e do nftables.'],
      'É o despachante de táxis: recebe os passageiros e envia ordens aos motoristas de forma coordenada.'
    ),
    q('n56-lock','Comportamento de Lock Órfão','O que acontece quando uma tarefa do cluster falha abruptamente e retém um lock de recurso?',1,
      ['O cluster é automaticamente formatado e desinstalado sem aviso',
       'Novas modificações no módulo afetado ficam bloqueadas até a expiração ou liberação manual do lock',
       'O cabo de rede da máquina virtual derrete fisicamente'],
      ['O NS8 protege o sistema e nunca formata a máquina por causa de uma falha de tarefa.',
       'Correto! O mecanismo de lock previne condições de corrida e corrupção concorrente de configurações.',
       'Locks de software afetam variáveis e mutexes lógicos, sem nenhum efeito térmico sobre cabos.'],
      'É o semáforo que quebrou no amarelo: enquanto o técnico não resetar o sinal, nenhum carro passa por segurança.'
    ),
    q('n56-diag','Abordagem Profissional de Troubleshooting','Qual é o primeiro passo recomendado para diagnosticar uma falha de orquestração no NS8?',2,
      ['Desligar o disjuntor geral do datacenter imediatamente',
       'Apagar a pasta /etc inteira do servidor Linux',
       'Consultar logs estruturados via journald e inspecionar a fila de tarefas com cluster-task-list'],
      ['Desligar o disjuntor derruba toda a empresa e gera indisponibilidade catastrófica.',
       'Excluir arquivos de configuração destrói a instalação operacional do sistema.',
       'Correto! A análise diagnóstica baseia-se em evidências de log e estado da fila de tarefas.'],
      'É o médico que solicita exames de sangue e raio-X antes de sugerir qualquer procedimento cirúrgico.'
    )
  ],
  decisionPrompt:'Diante de uma tarefa travada em FAILED, qual atitude o administrador de plantão deve tomar?',
  decisions:[
    {id:'reboot-blind',label:'Reiniciar o servidor líder às cegas sem checar o log',correct:false,consequence:'Atitude amadora que arrisca corromper dados e não resolve o lock da fila.'},
    {id:'diagnose-clear',label:'Inspecionar a pilha de erro no journald, limpar o lock órfão e comandar retry da tarefa',correct:true,consequence:'Excelente conduta técnica! Restabelece a operação em segundos com rastreabilidade total.'},
    {id:'delete-cluster',label:'Destruir o cluster e recriar toda a rede do zero',correct:false,consequence:'Desperdício absurdo de tempo e trabalho por falta de conhecimento diagnóstico.'}
  ],
  procedure:[
    'Acesse a console do nó líder com privilégios administrativos.',
    'Consulte o guia de contingência e códigos de erro de tarefas.',
    'Afira a comunicação e disponibilidade do serviço Redis em memória.',
    'Liste as tarefas em estado FAILED e identifique a Task-ID causadora.',
    'Examine a causa raiz e dispare o retry limpando travas órfãs.',
    'Valide a integridade global do cluster com a rotina de health check.'
  ],
  validation:'Evidência: daemon Redis operacional, tarefa T-3091 inspecionada e concluída com retry, zero erros pendentes no cluster-health-check e validação homologada.',
  challenge:'Documente a causa raiz da falha T-3091, o tempo de resposta do Redis e a reexecução bem-sucedida do comando de orquestração.',
  diaryPlaceholder:'Fila Redis inspecionada; tarefa T-3091 travada por timeout de lock; retry aplicado com sucesso; cluster-health-check 100% verde...',
  closing:'Você aprendeu a desobstruir filas de orquestração e diagnosticar o agente central do NS8 com precisão cirúrgica. Na próxima missão, aplicará políticas de atualização contínua e Rolling Updates!',
  sources:[['Task Queue & Architecture',docs+'administrator-manual/architecture/#task-engine'],['Cluster Troubleshooting',docs+'administrator-manual/cluster/#troubleshooting']]
};
