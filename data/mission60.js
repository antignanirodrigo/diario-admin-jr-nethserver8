const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission60={
  id:60,xp:1000,level:'⭐ Certificação Final · 90-120 min',title:'Marco de revisão integrada 12: certificação final de administrador NethServer 8',
  isReview:true,
  summary:'Consolide a jornada completa de 60 missões: execute a simulação de operação autônoma, homologue todos os serviços corporativos e conquiste a Certificação Final de Administrador NethServer 8.',
  call:'CH-NS8-060 · Chamado de Conclusão e Certificação Final de Administrador Pleno. A diretoria executiva da Teseo IT Solutions e os gestores da Aurora convocaram o Júnior para conduzir a Prova de Aceite e Certificação Operacional de toda a infraestrutura construída ao longo das 60 missões do curso. O Júnior deve assumir a operação autônoma total: auditar os nós e a malha do cluster, validar a prontidão do plano de desastres e backups, rodar os testes sintéticos ponta a ponta de todas as aplicações em produção e certificar a conformidade dos seis grandes pilares da infraestrutura empresarial.',
  impact:'Concluir a certificação final comprova que o profissional domina a engenharia, governança, operação e resiliência do NethServer 8 em escala corporativa, estando plenamente capacitado para planejar, implantar e manter ambientes críticos reais.',
  senior:'O Sênior caminhou até a estação do Júnior, acompanhado pelos diretores e pelos engenheiros da equipe. O semblante era de imenso orgulho profissional: "Olhe para trás, Júnior. Sessenta missões atrás, você estava diante de uma tela preta avaliando se uma VM limpa servia para laboratório. Hoje, você orquestrou um cluster multi-nó de alta disponibilidade, integrou segurança de borda com NethSecurity UTM, construiu servidores de e-mail e arquivos, implantou Nextcloud, Roundcube, Mattermost, Guacamole e Vaultwarden com autenticação Samba AD, blindou o ambiente com backups Restic e observabilidade Prometheus. Você não é mais o iniciante hesitante da Missão 1. Você é o Administrador de Infraestruturas NethServer 8 da nossa equipe. Assuma o teclado e homologue sua vitória!"',
  concept:'A certificação de excelência em NethServer 8 consolida o domínio prático dos seis pilares de uma infraestrutura moderna de código aberto: 1) Base & Hypervisor: provisionamento enxuto de sistemas Rocky Linux 9 e arquitetura conteinerizada com Podman rootless; 2) Identidade & Diretório: domínio Samba Active Directory com replicação de contas e gestão de permissões; 3) Serviços de Colaboração & Comunicação: correio eletrônico corporativo (Postfix, Dovecot, Rspamd), chat de equipe e sincronização de arquivos em nuvem privada; 4) Segurança de Borda & Roteamento: integração UTM com NethSecurity 8, terminação TLS automática no proxy Traefik e malha WireGuard isolada; 5) Armazenamento & Resiliência: volumes NFSv4.2 compartilhados, balanceamento multi-nó e recuperação autônoma de nós; 6) Governança, BCP & Observabilidade: backups deduplicados em S3, RTO/RPO estritos, métricas Prometheus e auditoria ISO 27001.',
  example:'No laboratório, você lê o chamado final com cat operacao-autonoma-chamado.txt, roda a varredura completa com cluster-full-diagnostics, testa a prontidão de desastres com cluster-bcp-readiness-probe, dispara os testes ponta a ponta de todas as aplicações com cluster-end-to-end-acceptance, preenche o checklist dos seis pilares e homologa a Certificação Final.',
  glossary:[['Autonomous Operation','Capacidade técnica de operar, manter e recuperar a infraestrutura com total independência','O piloto que conclui o treinamento de comandante e passa a pilotar o avião comercial com autonomia total.'],['End-to-End Acceptance','Homologação de ponta a ponta que valida cada serviço pelo ponto de vista do usuário final','A vistoria pré-entrega de um novo condomínio: testa cada interruptor, elevador, portão e torneira de todos os apartamentos.'],['Full Cluster Diagnostics','Verificação unificada e holística de todos os subsistemas de rede, nós, banco e containers','O check-up médico completo: audita coração, pulmões, sangue e reflexos com um único laudo consolidado.'],['BCP Readiness','Comprovação de prontidão e garantia matemática de recuperação de dados em caso de sinistro','O simulado de abandono de edifício que comprova que todos saem em segurança em menos de 3 minutos.']],
  recall:{question:'Quais são os seis pilares fundamentais dominados pelo Administrador de Infraestruturas NethServer 8?',answer:'Infraestrutura base e containers Podman; Identidade e autenticação Samba AD; Colaboração e correio corporativo; Armazenamento compartilhado e cotas; Segurança de borda NethSecurity e Traefik; Governança contínua, disaster recovery e observabilidade.'},
  labIntro:'Onde executar: console de homologação executiva e certificação final no nó líder ns8-lab-01.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de diplomação no líder ns8-lab-01.',
    'Execute cat operacao-autonoma-chamado.txt para revisar os termos da prova de aceite final.',
    'Execute cluster-full-diagnostics para inspecionar o status global dos 2 nós e 6 aplicações.',
    'Execute cluster-bcp-readiness-probe para certificar a saúde dos backups em nuvem S3.',
    'Execute cluster-end-to-end-acceptance para validar requisições sintéticas em todos os FQDNs.',
    'No painel educativo, selecione os seis pilares dominados e homologue a Certificação Final.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readGraduationTicket','Ler chamado final em operacao-autonoma-chamado.txt'],
    ['runFullDiagnostics','Executar diagnóstico global com cluster-full-diagnostics'],
    ['probeBcpReadiness','Sondar prontidão de recuperação com cluster-bcp-readiness-probe'],
    ['runEndToEndAcceptance','Executar homologação ponta a ponta com cluster-end-to-end-acceptance'],
    ['review12Certified','Homologar Certificação Final de Administrador NS8']
  ],
  hints:[
    'O comando cluster-full-diagnostics valida simultaneamente nós, banco Redis e rotas WireGuard.',
    'Comprove a integridade dos snapshots e RTO com cluster-bcp-readiness-probe.',
    'Execute cluster-end-to-end-acceptance para obter o status de 6/6 aplicações aceitas.'
  ],
  testking:[
    q('n60-architecture','Visão Holística da Arquitetura NS8','Como a combinação de Podman rootless, Redis central e WireGuard mesh diferencia o NS8 de soluções legadas?',0,
      ['Proporciona desacoplamento total, escalabilidade multi-nó transparente, comunicação encriptada nativa e segurança por isolamento de usuário',
       'Permite instalar joguinhos de computador antigos dentro do servidor de produção',
       'Elimina completamente a necessidade de backups e eletricidade no datacenter'],
      ['Exato! Essa arquitetura moderna transforma o NethServer 8 em uma plataforma de nuvem privada robusta e expansível.',
       'Ambientes de missão crítica corporativa são dedicados exclusivamente a serviços de negócios.',
       'Infraestruturas físicas dependem de energia elétrica contínua e backups regulares em qualquer cenário.'],
      'É a diferença entre um carro dos anos 1970 com carburador e um veículo elétrico moderno com computador de bordo e sensores inteligentes.'
    ),
    q('n60-synergy','Sinergia entre NethServer 8 e NethSecurity 8','Qual é a relação operacional estratégica entre o NethServer 8 e a borda com NethSecurity 8?',1,
      ['Eles são o mesmo software antigo empacotado duas vezes no mesmo CD-ROM',
       'NethSecurity atua como firewall UTM na fronteira da WAN (DPI, IPS, VPN roadwarrior), enquanto o NS8 atua como servidor de serviços e dados na LAN corporativa',
       'O NethSecurity é apenas um tema visual colorido para o painel web'],
      ['São projetos distintos e especializados: NS8 roda sobre distribuições Linux enterprise, enquanto NethSecurity roda sobre OpenWrt hardened.',
       'Correto! A separação de responsabilidades entre borda UTM e hospedeiro de aplicações garante defesa em profundidade.',
       'NethSecurity é uma appliance de firewall de classe corporativa, não mero enfeite estético.'],
      'É o castelo medieval: o NethSecurity é a muralha externa com fosso e arqueiros; o NethServer é a cidade interna com comércios, bancos e moradias.'
    ),
    q('n60-autonomy','Perfil do Administrador Certificado','O que caracteriza um verdadeiro Administrador de Sistemas Pleno em NethServer 8?',2,
      ['Decorar comandos de cabeça e aplicá-los sem nunca ler mensagens de erro ou logs',
       'Recorrer à formatação do sistema diante de qualquer incidente leve de produção',
       'Capacidade analítica de diagnosticar causas-raiz, aplicar governança, garantir resiliência e manter serviços operando com foco no negócio da organização'],
      ['Decorar comandos sem compreender a arquitetura leva a desastres operacionais graves.',
       'Formatar o sistema é confissão de despreparo técnico e causa perda inadmissível de dados corporativos.',
       'Correto! A maestria reside no método científico de diagnóstico, mitigação de riscos e postura profissional madura.'],
      'É o médico cirurgião: estuda a anatomia, investiga os sintomas, opera com precisão e garante que o paciente se recupere com saúde integral.'
    )
  ],
  decisionPrompt:'Com o cluster 100% auditado e todos os serviços aprovados, a alta diretoria solicita o parecer formal para a entrada definitiva em operação produtiva autônoma. Qual é a sua declaração oficial?',
  decisions:[
    {id:'postpone-indefinitely',label:'Pedir mais seis meses de adiamento por receio de operar um ambiente de produção real',correct:false,consequence:'Demonstra insegurança injustificada após ter validado e testado exaustivamente todos os subsistemas.'},
    {id:'certify-and-operate',label:'Declarar a infraestrutura homologada, resiliente, segura e apta para produção, assumindo a liderança operacional autônoma',correct:true,consequence:'Parabéns! Uma declaração madura, confiante e respaldada por 60 missões de dedicação técnica impecável!'},
    {id:'abandon-systems',label:'Desistir da carreira de TI e vender artesanato na praia',correct:false,consequence:'Você chegou ao topo da formação técnica; não desperdice o conhecimento de excelência que conquistou!'}
  ],
  procedure:[
    'Assuma o terminal com a autoridade técnica construída ao longo do curso.',
    'Execute a rotina diagnóstica global abrangendo nós líderes, workers e pods.',
    'Verifique o status de prontidão e retenção criptográfica das rotinas de BCP.',
    'Conduza a bateria de testes de aceitação e latência em todas as aplicações web.',
    'Valide os seis pilares estratégicos de infraestrutura no checklist executivo.',
    'Receba a homologação final e celebre a conquista da Certificação NethServer 8!'
  ],
  validation:'Evidência: diagnóstico de cluster 100% HEALTHY, BCP readiness 100% auditado, bateria de 6/6 aplicações aceitas de ponta a ponta, seis pilares de conformidade certificados e Certificação Final de Administrador NethServer 8 homologada.',
  challenge:'Documente o laudo executivo final, a lista de aplicações operando em alta disponibilidade e a conquista formal da sua Certificação de Administrador NethServer 8.',
  diaryPlaceholder:'Operação autônoma homologada; cluster multi-nó 100% saudável; 6/6 aplicações aceitas; certificação final de Administrador NethServer 8 conquistada com honra...',
  closing:'⭐ PARABÉNS, ADMINISTRADOR NETHSERVER 8! Você concluiu com bravura e maestria todas as 60 missões do curso. Você agora possui o conhecimento técnico de ponta para liderar projetos de TI corporativos com total autonomia, segurança e confiabilidade!',
  sources:[['NethServer 8 Complete Manual',docs],['Enterprise Deployment & Certification',docs+'administrator-manual/deployment/']]
};
