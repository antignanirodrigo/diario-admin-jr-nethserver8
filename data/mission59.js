const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission59={
  id:59,xp:350,level:'Operação Avançada · 45-60 min',title:'Hardening final, auditoria de conformidade e gestão de segredos',
  summary:'Eleve o cluster ao padrão de auditoria ISO 27001 e LGPD: execute rotação de segredos de API, audite superfícies de ataque de portas e emita o scorecard de segurança.',
  call:'CH-NS8-059 · Auditoria Anual de Segurança e Conformidade. Uma auditoria externa independente da Teseo IT Solutions está avaliando a infraestrutura corporativa da Aurora antes da certificação final de conformidade de dados. Todos os servidores devem passar por hardening rigoroso: tokens de administração de API devem sofrer rotação de chaves sem queda de serviço, nenhuma porta administrativa pode estar exposta na WAN, e a matriz de privilégios de containers deve ser auditada. O Júnior deve conduzir essa homologação de segurança de ponta a ponta.',
  impact:'Práticas contínuas de hardening e rotação de segredos fecham janelas de vulnerabilidade, impedem movimentação lateral de atacantes e atendem a requisitos legais de proteção de dados.',
  senior:'O Sênior caminhava ao lado do auditor externo e fez questão de chamar o Júnior para liderar a apresentação: "Segurança não é um produto que você compra numa caixa e instala; é uma postura diária de governança. No NethServer 8, nós operamos sob a premissa de Zero Trust e privilégio mínimo: todos os containers rodam rootless, as rotas de cluster passam por túneis criptografados WireGuard, e hoje vamos demonstrar a rotação atômica de tokens de API e a varredura de portas abertas. Mostre a eles como se protege um ambiente corporativo moderno, Júnior!"',
  concept:'O framework de hardening e governança do NethServer 8 apoia-se em quatro pilares de segurança por design: 1) Ciclo de Vida de Segredos: rotação atômica de tokens JWT e chaves de API com sobreposição de validade (grace period), permitindo que agentes atualizem suas credenciais sem interrupção de chamadas; 2) Superfície de Ataque Mínima: auditoria de portas locais (nftables) e de borda (NethSecurity), assegurando que apenas 80/tcp, 443/tcp e 51820/udp (WireGuard) tenham regras estritas de acesso; 3) Containers Rootless e Namespaces de Usuário: isolamento do kernel que impede que um eventual comprometimento de um container conceda privilégios de root no host Linux; 4) Security Scorecard: consolidação de métricas de conformidade com nota e apontamentos de melhoria.',
  example:'No laboratório, você lê os requisitos com cat hardening-governanca-escopo.txt, rotaciona os tokens com cluster-secrets-rotate --scope admin-api, audita a exposição de portas com cluster-firewall-compliance-audit, gera o scorecard com cluster-security-scorecard e homologa o hardening no painel.',
  glossary:[['Zero Trust','Princípio de segurança que nunca confia e sempre verifica qualquer requisição','A guarita de um condomínio fechado que confere o documento de todos os motoristas, inclusive dos próprios moradores.'],['Secret Rotation','Troca periódica de chaves criptográficas, senhas e tokens de API','Trocar o segredo da fechadura do cofre a cada seis meses para que chaves antigas percam a validade.'],['Rootless Container','Execução de container dentro de um namespace de usuário sem permissão de root no host','Um inquilino que tem chave do seu próprio apartamento, mas não tem a chave-mestra do edifício todo.'],['Security Scorecard','Relatório consolidado que pontua a maturidade das defesas da infraestrutura','O boletim escolar com notas de cada matéria que atesta se o aluno passou de ano com mérito.']],
  recall:{question:'O que significa o conceito de "Grace Period" durante uma rotação de chaves ou tokens de API?',answer:'É o intervalo de tempo em que a chave antiga continua temporariamente válida após a geração da nova, permitindo que todos os nós e agentes atualizem suas conexões sem rejeição imediata de chamadas.'},
  labIntro:'Onde executar: console de governança e segurança do nó líder ns8-lab-01.',
  labSteps:[
    'Execute whoami e hostname para confirmar o acesso como operador de segurança no líder.',
    'Execute cat hardening-governanca-escopo.txt para revisar os critérios de conformidade.',
    'Execute cluster-secrets-rotate --scope admin-api para renovar chaves e tokens de controle.',
    'Execute cluster-firewall-compliance-audit para verificar ausência de portas perigosas expostas.',
    'Execute cluster-security-scorecard para compilar a pontuação de conformidade e isolamento.',
    'No painel educativo, homologue a conformidade e o hardening de segurança do cluster.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readHardeningScope','Ler escopo em hardening-governanca-escopo.txt'],
    ['rotateClusterSecrets','Rotacionar tokens de API com cluster-secrets-rotate'],
    ['auditFirewallCompliance','Escanear portas expostas com cluster-firewall-compliance-audit'],
    ['generateSecurityScorecard','Gerar scorecard com cluster-security-scorecard'],
    ['validateHardeningGovernance','Homologar conformidade de segurança no painel']
  ],
  hints:[
    'A rotação de segredos via cluster-secrets-rotate opera de forma atômica e transparente.',
    'O comando cluster-firewall-compliance-audit checa portas WAN e LAN em ambos os nós do cluster.',
    'Finalize gerando o scorecard com cluster-security-scorecard para atestar a nota máxima A+.'
  ],
  testking:[
    q('n59-secrets','Vantagem da Rotação Periódica de Segredos','Por que organizações maduras realizam rotação periódica de tokens e senhas de API?',0,
      ['Para limitar a janela de oportunidade de exploração caso um token tenha vazado inadvertidamente em algum momento',
       'Para esquecer as senhas propositalmente e bloquear o acesso de todos os colaboradores',
       'Porque o disco rígido do servidor apaga as senhas antigas quando a memória RAM esfria'],
      ['Exato! Reduz o tempo de vida útil de credenciais vazadas e previne acessos persistentes não autorizados.',
       'A rotação corporativa é automatizada e atualiza os cofres seguros sem bloquear os operadores legítimos.',
       'Discos rígidos magnéticos ou SSDs gravam dados persistentes independente da temperatura.'],
      'É o cartão de acesso do hotel: ao fim da hospedagem a chave magnética deixa de abrir a porta do quarto.'
    ),
    q('n59-rootless','Benefício de Containers Rootless','Qual é o impacto defensivo de executar aplicações em containers Rootless no Podman?',1,
      ['Os containers ficam mais lentos e consomem dez vezes mais memória de vídeo',
       'Mesmo que um invasor explore uma vulnerabilidade no container, ele permanece sem privilégios de root no host Linux',
       'O sistema operacional exclui todos os arquivos da empresa a cada reinicialização'],
      ['Containers rootless têm a mesma performance nativa de namespaces Linux sem penalidade de vídeo.',
       'Correto! O atacante fica contido no UID mapeado do usuário e não consegue comprometer o kernel nem o host.',
       'A persistência de dados em volumes é mantida integralmente independentemente do modo rootless.'],
      'É o cofre do quarto do hotel: mesmo que alguém consiga abrir o cofre, não consegue invadir a tesouraria central do hotel.'
    ),
    q('n59-compliance','Auditoria de Portas','O que a auditoria de conformidade de firewall do cluster deve comprovar?',2,
      ['Que todas as 65.535 portas TCP estão abertas para qualquer pessoa na internet testar',
       'Que a conexão com a internet foi substituída por disquetes de 3.5 polegadas',
       'Que apenas portas de serviço indispensáveis estão ativas e que nenhuma interface de gerência está exposta na WAN'],
      ['Abrir todas as portas é uma falha grave de segurança que expõe o ambiente a invasões maciças.',
       'Disquetes são mídias legadas obsoletas incompatíveis com servidores corporativos modernos.',
       'Correto! Princípio da menor exposição: somente serviços homologados com TLS/VPN são acessíveis.'],
      'É a fortaleza que mantém os portões fechados e permite a entrada apenas por uma porta guardada por sentinelas.'
    )
  ],
  decisionPrompt:'O auditor de segurança questiona se o painel administrativo do Cluster Admin (porta 9090) pode ficar aberto diretamente para a internet pública sem VPN. Qual é a resposta correta?',
  decisions:[
    {id:'allow-wan-admin',label:'Permitir abertura na WAN para facilitar o acesso de casa sem precisar de VPN',correct:false,consequence:'Risco crítico! Expõe a gerência do cluster a ataques de força bruta e exploração de dia-zero.'},
    {id:'deny-wan-admin',label:'Negar veementemente: interfaces de gerência só podem ser acessadas via LAN interna ou VPN autenticada',correct:true,consequence:'Resposta perfeita! Alinhada 100% com as melhores práticas internacionais e normas ISO 27001.'},
    {id:'disable-firewall',label:'Desativar o firewall do servidor para agilizar os testes de auditoria',correct:false,consequence:'Violação gravíssima de segurança que desclassifica a empresa na auditoria imediatamente.'}
  ],
  procedure:[
    'Revise os requisitos mandatórios de conformidade e governança da ISO 27001 / LGPD.',
    'Dispare a rotina controlada de rotação de chaves criptográficas e tokens de API do cluster.',
    'Execute a varredura detalhada de portas TCP e UDP nos nós líder e worker.',
    'Certifique que não há interfaces administrativas expostas em zonas públicas não confiáveis.',
    'Gere o relatório consolidado de segurança (Scorecard) e valide os índices obtidos.',
    'Registre a evidência no Runbook de Operações de Segurança da organização.'
  ],
  validation:'Evidência: tokens de administração rotacionados, auditoria de firewall com 0 portas não autorizadas, Scorecard de Segurança com nota A+ (100/100) e conformidade homologada com sucesso.',
  challenge:'Documente a lista de portas autorizadas, a impressão digital do novo token de API e a nota final do Scorecard de Segurança.',
  diaryPlaceholder:'Rotação de segredos de API executada; varredura de portas 100% em conformidade; Security Scorecard emitido com nota A+...',
  closing:'O cluster NethServer 8 foi blindado e certificado sob os mais rigorosos padrões de segurança da informação. Agora, você está pronto para o desafio final: a Missão 60 e a Certificação de Administrador NethServer 8!',
  sources:[['Security & Hardening',docs+'administrator-manual/security/'],['API & Secrets Governance',docs+'administrator-manual/api/#secrets']]
};
