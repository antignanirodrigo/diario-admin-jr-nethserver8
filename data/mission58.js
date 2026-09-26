const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission58={
  id:58,xp:350,level:'Operação Avançada · 45-60 min',title:'Monitoramento avançado, métricas e alertas',
  summary:'Implante observabilidade contínua no cluster NS8: configure métricas Prometheus para nós e containers e estabeleça alertas proativos via webhook.',
  call:'CH-NS8-058 · Projeto Observabilidade 360. A equipe de NOC da Teseo precisa de visibilidade em tempo real sobre a saúde dos nós e dos containers Podman do NethServer 8. Administrar às cegas sem métricas históricas impede a detecção prévia de vazamentos de memória ou picos anômalos de processador. O Júnior deve habilitar o coletor de métricas Prometheus do cluster, configurar os limiares críticos de alerta (CPU > 85% e RAM > 90%), integrar o canal de notificações via Webhook com o Mattermost corporativo e validar o disparo de um alerta sintético de teste.',
  impact:'Monitoramento proativo permite identificar tendências de esgotamento de recursos e gargalos de performance horas antes que os usuários finais sejam afetados por lentidões ou quedas.',
  senior:'O Sênior apontou para o grande painel de monitoramento na parede da central de operações: "Veja isso, Júnior. Antigamente, o sysadmin só descobria que o disco estava cheio quando o telefone do diretor tocava furioso. No NS8 moderno, nós expomos métricas abertas em padrão Prometheus para cada nó e container. Mas atenção: métrica sem alerta inteligente só serve para olhar gráfico bonito. Alerta profissional precisa ter limiar calibrado e canal direto — se o alarme tocar à toa a toda hora, a equipe ignora; se tocar na hora certa, salva a operação."',
  concept:'A arquitetura de observabilidade do NethServer 8 apoia-se em três camadas integradas: 1) Métricas de Sistema e Podman: o daemon do nó expõe endpoints compatíveis com Prometheus scraping, medindo CPU, memória, I/O de disco e tráfego de rede por container e por host; 2) Limiares de Alerta (Thresholds): regras declarativas que disparam eventos caso uma métrica ultrapasse a margem segura de forma sustentada (ex: CPU > 85% por mais de 5 minutos, ou RAM > 90%); 3) Canais de Notificação: barramento de eventos capaz de despachar payloads JSON via Webhook para plataformas de chat corporativo (Mattermost/Slack) ou sistemas de chamados, assegurando notificação imediata do plantão de TI.',
  example:'No laboratório, você lê o plano com cat monitoramento-metricas-plano.txt, inspeciona os coletores ativos com cluster-metrics-status, ajusta as regras de alerta com cluster-alerts-configure --threshold-cpu 85 --threshold-ram 90 --channel webhook, valida o canal disparando um teste com cluster-metrics-test e homologa a observabilidade no painel.',
  glossary:[['Prometheus Metrics','Padrão aberto de coleta e armazenamento de séries temporais de telemetria','O velocímetro e termômetro do painel do carro que registram o comportamento do motor a cada segundo.'],['Threshold (Limiar)','Valor de corte numérico a partir do qual um evento de alerta é disparado','A boia da caixa-d’água que apita se o nível subir demais antes de transbordar pelo teto.'],['Webhook','Mecanismo HTTP para envio automático de dados entre sistemas em resposta a eventos','Um mensageiro que corre entregar uma carta urgente assim que um sino toca na torre.'],['Synthetic Probe','Teste simulado gerado intencionalmente para validar se o sistema de alerta está funcionando','O teste semanal da sirene de incêndio do prédio para certificar que os alto-falantes funcionam.']],
  recall:{question:'Qual é a desvantagem de configurar limiares de alerta excessivamente baixos (ex: 50% de CPU)?',answer:'Gera "fadiga de alertas" (alarm fatigue): a equipe passa a receber dezenas de falsos positivos por segundo e acaba ignorando avisos reais quando um problema crítico de fato ocorrer.'},
  labIntro:'Onde executar: console de telemetria e observabilidade do nó líder ns8-lab-01.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador no nó líder.',
    'Execute cat monitoramento-metricas-plano.txt para revisar métricas-alvo e endpoints.',
    'Execute cluster-metrics-status para verificar os coletores nos nós 1 e 2.',
    'Execute cluster-alerts-configure --threshold-cpu 85 --threshold-ram 90 --channel webhook para definir os limites.',
    'Execute cluster-metrics-test para despachar um alerta sintético e validar a entrega.',
    'No painel educativo, homologue a prontidão da stack de observabilidade e alertas.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readMonitoringPlan','Ler plano em monitoramento-metricas-plano.txt'],
    ['checkMetricsStatus','Verificar coletores com cluster-metrics-status'],
    ['configureClusterAlerts','Configurar limiares com cluster-alerts-configure'],
    ['testAlertWebhook','Disparar teste de alerta com cluster-metrics-test'],
    ['validateObservability','Homologar observabilidade e telemetria no painel']
  ],
  hints:[
    'O comando cluster-metrics-status confirma se os agentes de métricas estão operando na porta 9100.',
    'Use cluster-alerts-configure passando as flags exatas de CPU (85), RAM (90) e channel (webhook).',
    'Execute cluster-metrics-test para comprovar o envio e recebimento com baixa latência.'
  ],
  testking:[
    q('n58-metrics','Vantagem de Métricas em Padrão Aberto','Por que o NethServer 8 expõe telemetria no padrão Prometheus?',0,
      ['Porque permite integração universal com Grafana, sistemas de NOC corporativos e dashboards centralizados',
       'Porque obriga o usuário a comprar placas de vídeo caras para desenhar gráficos',
       'Porque substitui o sistema de arquivos Linux por planilhas de cálculo'],
      ['Exato! Prometheus é o padrão da indústria para observabilidade nativa de containers.',
       'Métricas de telemetria consomem pouquíssimos recursos e dispensam placas gráficas dedicadas.',
       'Sistemas de arquivos do host (XFS/ext4) permanecem gerenciados normalmente pelo kernel Linux.'],
      'É a tomada elétrica padrão: qualquer eletrodoméstico moderno se conecta sem precisar de adaptador artesanal.'
    ),
    q('n58-threshold','Calibração de Limiares','O que é "fadiga de alertas" (alert fatigue) em equipes de operações de TI?',1,
      ['Uma doença que atinge servidores quando os ventiladores giram devagar',
       'A perda de atenção da equipe decorrente de excesso de notificações inúteis ou falsos alarmes diários',
       'O desgaste físico do teclado do administrador após digitar muitos comandos'],
      ['Ventiladores lentos geram alertas térmicos legítimos de hardware, não fadiga psicológica da equipe.',
       'Correto! Quando alarmes tocam constantemente sem necessidade, o time perde a sensibilidade aos alertas críticos.',
       'Fadiga de alertas é um fenômeno operacional humano bem documentado na engenharia de software.'],
      'É o alarme do carro que dispara com qualquer ventinho na rua: logo os vizinhos nem olham mais para a janela.'
    ),
    q('n58-webhook','Função dos Webhooks','Qual é o papel do Webhook na entrega de notificações de incidentes?',2,
      ['Tocar uma buzina mecânica instalada no teto do data center',
       'Desconectar a internet da empresa para evitar que o usuário perceba o erro',
       'Enviar instantaneamente um payload estruturado para canais corporativos como Mattermost ou PagerDuty'],
      ['Buzinas mecânicas são dispositivos analógicos que não integram com telemetria digital.',
       'Cortar a internet deliberadamente viola as metas de disponibilidade de qualquer negócio.',
       'Correto! Webhooks transportam os dados do incidente em milissegundos para o canal onde a equipe já trabalha.'],
      'É o mensageiro eletrônico que entrega a notificação diretamente na mão do médico de plantão.'
    )
  ],
  decisionPrompt:'Ao configurar os alertas do cluster, a equipe pergunta em qual canal as notificações de falha crítica devem ser entregues. Qual é a melhor recomendação?',
  decisions:[
    {id:'alert-spam-email',label:'Enviar um e-mail individual a cada 30 segundos para toda a diretoria da empresa',correct:false,consequence:'Cria sobrecarga de mensagens, lota caixas postais e gera reclamações da alta gerência.'},
    {id:'alert-dedicated-webhook',label:'Integrar via Webhook com canal dedicado #infra-alertas no Mattermost com menção ao plantão',correct:true,consequence:'Excelente decisão! Centraliza os avisos no local correto de trabalho, com histórico e colaboração imediata.'},
    {id:'alert-disable',label:'Desativar todos os alertas para que o sistema pareça 100% perfeito aos olhos dos chefes',correct:false,consequence:'Comportamento irresponsável que esconde falhas e leva a desastres irreversíveis.'}
  ],
  procedure:[
    'Revise o plano de monitoramento e os requisitos de SLA do ambiente.',
    'Verifique o status operacional dos exporters de nós e containers Podman.',
    'Configure os limiares de alerta com tolerância a picos efêmeros (bursts).',
    'Conecte o endpoint Webhook do canal #infra-alertas da organização.',
    'Dispare uma sonda sintética de alerta e confirme a recepção no canal.',
    'Valide a prontidão da esteira de observabilidade no painel de controle.'
  ],
  validation:'Evidência: telemetria Prometheus ativa em todos os nós, limiares de CPU (85%) e RAM (90%) estabelecidos, sonda sintética entregue no Mattermost com 42ms de latência e procedimento homologado.',
  challenge:'Documente a taxa de amostragem das métricas, os limiares configurados e o payload JSON capturado no teste do Webhook.',
  diaryPlaceholder:'Telemetria Prometheus ativada; limiares configurados (CPU 85%, RAM 90%); webhook Mattermost testado com sucesso...',
  closing:'Você garantiu que o cluster NethServer 8 seja monitorado com padrão profissional de NOC. Na próxima missão, aplicará o hardening final, gestão de segredos e conformidade de segurança!',
  sources:[['Observability & Metrics',docs+'administrator-manual/monitoring/'],['Prometheus & Alerting',docs+'administrator-manual/monitoring/#alerts']]
};
