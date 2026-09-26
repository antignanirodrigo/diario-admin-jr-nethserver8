const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission50={
  id:50,xp:550,level:'⭐ Revisão Integrada 10 · 75-90 min',title:'Marco de revisão integrada: auditoria de aplicações e ciclo de vida',
  isReview:true,
  summary:'Consolide o catálogo de aplicações do Módulo 10: audite instâncias conteinerizadas, monitore consumo de recursos e homologue o ciclo de vida.',
  call:'CH-NS8-050 · Marco de Certificação do Módulo 10. Com a expansão dos serviços corporativos na Aurora (Nextcloud, Mail, Roundcube, Mattermost, Guacamole e Vaultwarden), a diretoria executiva solicitou uma auditoria completa de governança e sustentabilidade do catálogo de aplicações. O Júnior deve realizar uma varredura abrangente do parque: auditar a integridade e versões de todas as instâncias ativas, mensurar o consumo consolidado de memória e CPU via Podman, executar testes sintéticos automatizados de ponta a ponta (smoke tests) e certificar o ecossistema com o Marco de Revisão Integrada 10.',
  impact:'Implantar dezenas de aplicações sem governança de ciclo de vida e monitoramento de consumo de recursos causa esgotamento silencioso de memória RAM (Out-Of-Memory Killer), lentidão generalizada nos serviços essenciais e incapacidade de prever quando expandir a infraestrutura para multi-nó.',
  senior:'O Sênior caminhou pelo corredor do datacenter e parou ao lado da mesa do Júnior com duas xícaras de café: "Instalar um container pelo catálogo com três cliques qualquer estagiário faz, Júnior. A verdadeira engenharia de sistemas começa quando você mantém esse ecossistema funcionando em harmonia por meses e anos. Você precisa saber exatamente quanto cada serviço consome, quais rotas estão saudáveis e como os containers se comportam sob carga. Você provou sua competência técnica em cada aplicação individual deste módulo; agora vamos auditar o conjunto e certificar o ecossistema completo."',
  concept:'A governança do catálogo de aplicações no NethServer 8 apoia-se em quatro pilares fundamentais: 1) Inventário e Integridade: conferência de versões de imagens, políticas de auto-restart (always/unless-stopped) e status de integridade (healthcheck) de cada container Podman; 2) Monitoramento de Recursos: medição do footprint de memória RAM e CPU para garantir folga operacional (headroom de ao menos 25%) no nó host; 3) Testes Sintéticos de Ponta a Ponta (Smoke Testing): validação automatizada de requisições HTTP/2 com handshake TLS em todos os FQDNs publicados no Traefik; 4) Ciclo de Vida e Atualizações: procedimentos de atualização in-place de imagens conteinerizadas preservando volumes persistentes de dados.',
  example:'No laboratório, você analisa o plano com cat auditoria-catalogo-escopo.txt, audita as instâncias com app-catalog-audit, inspeciona o consumo de hardware com podman-stats-summary, dispara os testes funcionais sintéticos com cluster-app-smoke-test e homologa a certificação estelar no checklist de revisão.',
  glossary:[['Application Lifecycle','Ciclo de vida completo do software: provisionamento, atualização, monitoramento e descarte','Acompanhar a vida útil de uma frota de carros da compra à revisão preventiva periódica.'],['Podman Stats','Métricas em tempo real de consumo de CPU, memória, I/O e rede por container','O painel de instrumentos do carro mostrando o consumo de combustível e temperatura de cada motor.'],['Smoke Test','Bateria de testes sintéticos rápidos para validar se os serviços essenciais estão vivos','Ligar a chave e testar faróis, buzina e motor antes de sair para uma longa viagem.'],['OOM Killer','Mecanismo do kernel Linux que encerra processos quando a memória RAM se esgota','O salva-vidas que joga a carga pesada para fora do barco para evitar que ele afunde por excesso de peso.']],
  recall:{question:'Quais são as quatro principais verificações que compõem uma auditoria de ciclo de vida de aplicações conteinerizadas no NethServer 8?',answer:'1) Verificação de integridade e status saudável (healthcheck) dos containers; 2) Medição do consumo agregado de memória RAM e CPU no host; 3) Teste sintético de conectividade e TLS em todos os FQDNs públicos; 4) Conferência da persistência de volumes de dados e rotinas de backup ativo.'},
  labIntro:'Onde executar: console de auditoria de aplicações e governança do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e o nó.',
    'Execute cat auditoria-catalogo-escopo.txt para analisar as metas da auditoria global.',
    'Execute app-catalog-audit para listar todas as instâncias em execução e versões de imagem.',
    'Execute podman-stats-summary para auditar o consumo agregado de memória e CPU dos containers.',
    'Execute cluster-app-smoke-test para validar a resposta TLS e HTTP 200 de todos os FQDNs.',
    'No painel educativo, confirme os cinco itens do checklist do Módulo 10 e homologue a certificação estelar.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readAuditScope','Ler escopo em auditoria-catalogo-escopo.txt'],
    ['runCatalogAudit','Auditar instâncias do catálogo com app-catalog-audit'],
    ['monitorPodmanStats','Auditar consumo de recursos com podman-stats-summary'],
    ['runAppSmokeTest','Executar testes sintéticos com cluster-app-smoke-test'],
    ['review10Certified','Homologar Marco de Revisão Integrada 10']
  ],
  hints:[
    'Consulte app-catalog-audit para conferir o status de saúde de todas as 6 aplicações ativas.',
    'O comando podman-stats-summary demonstrará o consumo agregado de RAM e a margem de segurança do nó.',
    'Execute cluster-app-smoke-test para certificar que todos os endpoints web respondem com sucesso.'
  ],
  testking:[
    q('n50-audit','Objetivo da Auditoria de Catálogo','Qual é a principal finalidade técnica de realizar auditorias periódicas nas aplicações do NS8?',1,
      ['Impedir que os usuários acessem a Internet durante a semana',
       'Identificar gargalos de consumo de recursos, containers degradados e garantir a disponibilidade contínua dos serviços',
       'Desinstalar automaticamente todas as aplicações para economizar energia do servidor'],
      ['Auditorias visam assegurar a excelência e disponibilidade dos serviços, não punir usuários.',
       'Correto! A auditoria preventiva detecta esgotamento de recursos e containers instáveis antes que causem paradas não programadas.',
       'Remover aplicações destruiria a produtividade da empresa e violaria os acordos de nível de serviço (SLA).'],
      'É levar a frota de veículos para a revisão mecânica programada antes de pegar a estrada.'
    ),
    q('n50-oom','Prevenção de Out-Of-Memory','Como o administrador evita que uma aplicação pesada acione o OOM Killer do Linux e derrube o nó inteiro?',0,
      ['Monitorando o uso agregado de memória via podman stats e definindo limites de memória por container quando necessário',
       'Desligando a memória swap e jogando água fria sobre a placa-mãe do servidor',
       'Apagando os arquivos do kernel em /boot para liberar espaço na RAM'],
      ['Exato! Monitorar métricas e configurar resource limits (ex: --memory) impede que uma aplicação consuma toda a RAM do host.',
       'Despejar água danifica o hardware físico e desligar swap piora a sensibilidade a picos de memória.',
       'Excluir arquivos de /boot destrói a capacidade de inicialização do sistema operacional.'],
      'É limitar a quantidade de água que cada torneira pode puxar da caixa d\'água para ninguém ficar sem banho.'
    ),
    q('n50-smoke','Vantagem dos Smoke Tests Sintéticos','Por que executar um teste sintético automatizado (smoke test) em todos os FQDNs após uma janela de manutenção?',2,
      ['Para alterar o logotipo da empresa em todos os navegadores',
       'Para reiniciar a rede elétrica da empresa a cada 10 minutos',
       'Para comprovar em segundos que certificados TLS, rotas Traefik e containers de backend estão respondendo corretamente'],
      ['Testes sintéticos validam integridade e resposta de rede, não alteram marcas visuais.',
       'Reinicializações elétricas desnecessárias provocam falhas de hardware e corrupção de sistemas.',
       'Correto! O smoke test valida rapidamente o caminho completo da requisição: DNS -> Firewall -> Traefik -> Container.'],
      'É o piloto de avião que executa a lista de checagem pré-voo em todos os instrumentos antes de decolar.'
    )
  ],
  decisionPrompt:'Após a auditoria, o Júnior nota que o nó atual atingiu 60% de consumo de memória RAM com as 6 aplicações rodando e a empresa planeja adicionar mais dois departamentos. Qual recomendação estratégica deve ser registrada?',
  decisions:[
    {id:'ignore-growth',label:'Ignorar o crescimento e esperar o servidor travar para tomar uma atitude',correct:false,consequence:'Atitude amadora: a omissão causará travamento em horário de expediente com perda de dados.'},
    {id:'plan-multinode',label:'Planejar a expansão para arquitetura multi-nó (adicionando um nó worker ao cluster) ou upgrade de memória',correct:true,consequence:'Excelente visão estratégica de arquitetura! Prepara a infraestrutura para expansão horizontal no Módulo 11 mantendo alta disponibilidade.'},
    {id:'uninstall-roundcube',label:'Desinstalar o Webmail e obrigar os usuários a enviar correspondência por cartas físicas',correct:false,consequence:'Proposta absurda que quebra os processos corporativos da empresa.'}
  ],
  procedure:[
    'Execute a varredura de catálogo conferindo versões de imagem e status de todos os containers.',
    'Monitore a utilização de memória RAM e CPU do nó host e verifique o headroom operacional.',
    'Dispare a suíte de testes sintéticos cobrindo todos os serviços web publicados sob Traefik.',
    'Inspecione a política de backups de cada instância do catálogo no repositório S3 corporativo.',
    'Valide os cinco pilares de governança no checklist consolidado do Módulo 10.',
    'Emita o certificado de conformidade e prepare a transição do cluster para múltiplos nós.'
  ],
  validation:'Evidência: varredura do catálogo concluída com 6/6 instâncias saudáveis, consumo de recursos medido dentro da margem de segurança, smoke test 100% PASS em todos os FQDNs e homologação do Marco de Revisão Integrada 10 aprovada com distinção.',
  challenge:'Documente as versões de todas as aplicações ativas, registre o consumo consolidado de memória e comprove o sucesso dos testes sintéticos em todos os domínios.',
  diaryPlaceholder:'Auditoria do catalogo concluida; 6/6 aplicacoes saudaveis; memoria 4.6/8.0 GB (57%); smoke test 100% PASS; Marco de Revisao 10 homologado...',
  closing:'⭐ Parabéns! Você concluiu o Módulo 10 com excelência e tornou-se Especialista em Catálogo de Aplicações e Serviços no NethServer 8. No Módulo 11, você aprenderá a escalar horizontalmente com Multi-Nó e Cluster Mesh!',
  sources:[['Application Lifecycle',docs+'administrator-manual/applications/'],['Podman Resource Governance','https://docs.podman.io/en/latest/markdown/podman-stats.1.html']]
};
