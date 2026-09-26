const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission42={
  id:42,xp:500,level:'Segurança e Borda · 60-75 min',title:'NethSecurity Controller e roteamento de borda',
  summary:'Integre o NethSecurity Controller ao appliance de borda e configure o encaminhamento seletivo de portas (Port Forwarding).',
  call:'CH-NS8-042 · A Aurora instalou um appliance NethSecurity 8 no IP 192.168.50.1 como gateway de Internet. O Júnior deve conectar o aplicativo NethSecurity Controller instalado no NS8 ao firewall remoto, autenticar a sessão mTLS e aplicar regras de NAT / Port Forwarding seletivas para publicar apenas os serviços autorizados (HTTP 80, HTTPS 443, SMTP 25 e Submission 587), mantendo a gerência protegida.',
  impact:'Configurar DMZ indiscriminada para o IP do NS8 expõe a porta de administração do cluster e as portas dos bancos de dados à Internet, abrindo portas para ataques de força bruta imediatos.',
  senior:'O Sênior apontou para o console do NethSecurity rodando na porta 9090: "Júnior, a regra de ouro do administrador de redes é o princípio da mínima exposição. A Internet só precisa enxergar as vitrines da loja: o site na porta 443 e o correio na 25. O escritório da gerência, as planilhas e os cofres ficam nos fundos. Nós vamos usar o NethSecurity Controller para publicar cirurgicamente as portas certas sem jamais abrir brechas."',
  concept:'O NethSecurity Controller é a aplicação oficial no NethServer 8 que permite gerenciar centralizadamente um ou mais appliances NethSecurity 8 remotos. A comunicação entre o NS8 e o NethSecurity utiliza uma API REST protegida por certificados mútuos (mTLS). Para expor serviços do cluster à Internet, o NethSecurity cria regras de Destination NAT (Port Forwarding) no seu subsistema nftables, redirecionando o tráfego que chega na interface WAN para o IP privado do NS8 nas portas 80/443 (Traefik) e 25/587 (Postfix).',
  example:'No laboratório, você lê o plano com cat integracao-nethsec-plano.txt, verifica o controller com nethsec-controller-status, pareia o appliance com nethsec-appliance-pair --host 192.168.50.1, aplica o encaminhamento com nethsec-nat-apply --port-map "80:80,443:443,25:25,587:587" e audita a tabela com nethsec-audit-forwarding.',
  glossary:[['NethSecurity Controller','App do NS8 para orquestrar firewalls remotos','A central de comando remoto que envia instruções para as guaritas de segurança.'],['Port Forwarding','Redirecionamento de porta de WAN para IP interno','O telefonista que atende a ligação no número geral da empresa e transfere para o ramal certo.'],['mTLS','TLS Mútuo com verificação de certificados nos dois lados','Dois agentes secretos que só conversam depois de conferir a senha e a insígnia um do outro.'],['DMZ Cega','Exposição irrestrita de todas as portas de uma máquina interna','Derrubar todo o muro do condomínio e deixar a casa no meio da rodovia federal.']],
  recall:{question:'Por que um administrador nunca deve configurar o IP do cluster NS8 como "Default DMZ Host" no firewall de borda NethSecurity?',answer:'Porque a DMZ cega redireciona todas as 65.535 portas para o servidor, expondo portas administrativas críticas (SSH 22, Cluster Admin 443, WireGuard e bancos internos) a ataques automatizados de varredura na Internet.'},
  labIntro:'Onde executar: terminal simulado e módulo de integração NethSecurity do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e nó.',
    'Execute cat integracao-nethsec-plano.txt para ler os parâmetros do gateway.',
    'Execute nethsec-controller-status para confirmar que o serviço de controlador está online.',
    'Execute nethsec-appliance-pair --host 192.168.50.1 para autenticar o firewall via mTLS.',
    'Execute nethsec-nat-apply --port-map "80:80,443:443,25:25,587:587" para publicar as portas de serviço.',
    'Execute nethsec-audit-forwarding para auditar as regras ativas na borda.',
    'No painel educativo, confirme o pareamento e a matriz de NAT e valide a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readIntegrationPlan','Ler escopo em integracao-nethsec-plano.txt'],
    ['checkControllerStatus','Auditar controller com nethsec-controller-status'],
    ['pairAppliance','Parear firewall com nethsec-appliance-pair'],
    ['applyNatRules','Aplicar regras com nethsec-nat-apply'],
    ['auditForwarding','Auditar portas com nethsec-audit-forwarding'],
    ['nethsecIntegrationVerified','Homologar integração no painel educativo']
  ],
  hints:[
    'O comando nethsec-appliance-pair estabelece a sessão mTLS na porta 9090.',
    'Aplique a matriz autorizada usando nethsec-nat-apply com as portas 80, 443, 25 e 587.',
    'Verifique se nethsec-audit-forwarding lista as 4 regras como ALLOW e LOGGED.'
  ],
  testking:[
    q('n42-ctrl','Função do NethSecurity Controller','O que o NethSecurity Controller permite ao administrador do NS8?',1,
      ['Desinstalar o sistema operacional do firewall e transformá-lo em uma impressora',
       'Centralizar a gerência de políticas, VPNs e regras de NAT de appliances NethSecurity remotos',
       'Mudar a senha do Wi-Fi de todos os vizinhos do quarteirão sem autorização'],
      ['O appliance continua sendo um firewall dedicado; o controller não o desinstala.',
       'Correto! O controller conecta-se ao NethSecurity para orquestrar regras e monitorar o status de borda.',
       'O sistema respeita limites legais e gerencia apenas os dispositivos corporativos autorizados.'],
      'É o painel central da construtora que monitora as câmeras e cancelas de todas as filiais da empresa.'
    ),
    q('n42-nat','Port Forwarding Seletivo','Por que apenas as portas 80, 443, 25 e 587 devem ser encaminhadas da WAN para o NS8?',0,
      ['Porque são as portas de serviços públicos essenciais (Web/Traefik e E-mail), mantendo as demais fechadas',
       'Porque o protocolo IP só aceita números de portas que terminam em algarismos ímpares',
       'Porque as outras 65.000 portas do servidor são automaticamente deletadas pelo Linux'],
      ['Exato! Aplicações web usam 80/443 e o correio usa 25/587; gerência e bancos de dados não devem ser expostos.',
       'O protocolo TCP/IP aceita portas de 1 a 65535 independentemente de paridade numérica.',
       'Portas de rede não são deletadas; elas são estados de escuta ou filtragem no firewall.'],
      'Você abre a porta da frente para os clientes entrarem na loja, mas mantém a porta dos fundos trancada.'
    ),
    q('n42-mgmt','Proteção da Porta de Gerência','Como a interface de gerenciamento do NethSecurity (porta 9090) e do NS8 (443/cluster-admin) deve ser acessada?',2,
      ['Aberta para qualquer IP do planeta na WAN sem senha',
       'Apenas por usuários que enviarem um telegrama impresso para o datacenter',
       'Restrita à rede local LAN interna ou mediante túnel VPN autenticado com múltiplos fatores (MFA)'],
      ['Expor portas administrativas na Internet é a principal causa de incidentes de ransomware no mundo.',
       'Acesso administrativo remoto seguro é realizado através de túneis criptografados como OpenVPN ou WireGuard.',
       'Correto! Acesso à gerência exige estar fisicamente na LAN ou conectado via VPN com criptografia e MFA.'],
      'O painel do cofre do banco só pode ser operado de dentro da agência, nunca pela calçada da rua.'
    )
  ],
  decisionPrompt:'O diretor solicita acesso ao painel Cluster Admin a partir do celular dele enquanto viaja na praia. O Júnior deve liberar a porta 443 do Cluster Admin na WAN sem restrição?',
  decisions:[
    {id:'open-wan',label:'Liberar a porta na WAN pública para atender ao pedido imediato do diretor',correct:false,consequence:'Risco operacional crítico: o painel de administração sofrerá tentativas de invasão e força bruta constantes da Internet.'},
    {id:'require-vpn',label:'Negar a abertura na WAN; orientar o diretor a conectar primeiro na VPN corporativa do NethSecurity',correct:true,consequence:'Decisão correta e profissional! A administração permanece invisível para o mundo externo e acessível com segurança.'},
    {id:'change-port',label:'Mudar a porta do Cluster Admin para 44444 e deixar exposta achando que ninguém vai achar',correct:false,consequence:'Segurança por obscurantismo é inútil: scanners automatizados (como Shodan) encontram a porta em poucos minutos.'}
  ],
  procedure:[
    'Instale e ative o app NethSecurity Controller no catálogo de aplicações do NS8.',
    'Gere o token de pareamento mTLS no NethSecurity 8 (porta 9090) e insira no controller.',
    'Cadastre as regras de Port Forwarding estritamente para as portas produtivas (80, 443, 25, 587).',
    'Certifique-se de que a regra possui registro de log e monitoramento ativo contra ameaças.',
    'Valide a conectividade externa nos serviços publicados e confirme que as portas administrativas permanecem bloqueadas.'
  ],
  validation:'Evidência: NethSecurity Controller pareado com sucesso no nó 192.168.50.1, mTLS ativo, regras de NAT seletivas aplicadas e auditoria de encaminhamento confirmada.',
  challenge:'Documente as portas redirecionadas para o NS8, explique a rejeição da DMZ e confirme como a gerência foi isolada.',
  diaryPlaceholder:'NethSecurity Controller pareado com 192.168.50.1; Port Forwarding 80,443,25,587 aplicado; DMZ rejeitada...',
  closing:'A borda está integrada e o tráfego externo flui com segurança. Na próxima missão, você vai dominar o Traefik, o proxy reverso inteligente que recebe as conexões web no NS8.',
  sources:[['NethSecurity Controller App',docs+'administrator-manual/nethsecurity/'],['Port Forwarding in NS8',docs+'administrator-manual/security/#port-forwarding']]
};
