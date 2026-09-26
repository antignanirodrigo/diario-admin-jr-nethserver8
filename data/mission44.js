const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission44={
  id:44,xp:520,level:'Segurança e Borda · 60-75 min',title:'VPN e malha de conectividade: WireGuard e túneis',
  summary:'Diferencie a malha WireGuard interna do cluster NS8 das VPNs de acesso remoto (Roadwarrior) operadas no NethSecurity.',
  call:'CH-NS8-044 · A empresa Aurora possui funcionários trabalhando em regime home office e planeja interligar uma filial remota. O Júnior precisa auditar a arquitetura de túneis: inspecionar a malha interna WireGuard (wg0) que interliga os nós do cluster NS8 na sub-rede 10.5.4.0/24 e verificar o pool de VPN de usuários (OpenVPN / Roadwarrior) provido pelo firewall de borda NethSecurity 8.',
  impact:'Conectar computadores pessoais de usuários remotos diretamente na sub-rede WireGuard do cluster viola a segmentação de rede e expõe a infraestrutura interna a malwares de estações desprotegidas.',
  senior:'O Sênior desenhou duas linhas paralelas no vidro: uma verde e uma laranja. "Júnior, na TI moderna nós não misturamos a rede de tráfego de controle dos servidores com a rede dos laptops dos funcionários. A linha verde é o WireGuard do NS8: ele conecta os nós do cluster entre si com criptografia de ponta a ponta e velocidade brutal de kernel. A linha laranja é a VPN do NethSecurity: nela os funcionários autenticam com MFA, passam por regras de firewall e só acessam o que o perfil autoriza."',
  concept:'A arquitetura de conectividade segura do NethServer 8 opera em dois planos distintos: 1) Plano de Controle e Interconexão de Nós (Cluster Mesh): utiliza WireGuard em nível de kernel (interface wg0) com chaves assimétricas trocadas no ingresso de novos nós, encapsulando o tráfego interno (Redis, migrações e sincronização) em uma sub-rede privada isolada (ex: 10.5.4.0/24); 2) Plano de Acesso de Usuários e Interconexão de Unidades (Roadwarrior & Site-to-Site): é de responsabilidade do NethSecurity 8, que oferece servidores OpenVPN e túneis IPsec com controle granular de acesso, autenticação em diretório corporativo e políticas de inspeção de borda.',
  example:'No laboratório, você analisa o projeto com cat vpn-arquitetura-plano.txt, audita a interface WireGuard do nó com cluster-vpn-status, consulta o pool de Roadwarrior no gateway com nethsec-vpn-audit 192.168.50.1, testa a integridade da malha com vpn-mesh-ping 10.5.4.1 e valida a conformidade das duas camadas com vpn-security-validate.',
  glossary:[['WireGuard Mesh','Malha segura de comunicação entre nós do cluster','O túnel subterrâneo exclusivo e blindado que liga os prédios internos da empresa.'],['Roadwarrior VPN','Conexão VPN de usuários remotos via notebook/celular','O passe de visitante com crachá e revista concedido a quem trabalha de fora da cidade.'],['Site-to-Site VPN','Túnel permanente que liga duas filiais inteiras','A linha telefônica direta e dedicada entre a matriz e a filial.'],['Sub-rede 10.5.4.0/24','Faixa de IPs privada reservada para o cluster NS8','O ramal interno do comitê executivo dos servidores.']],
  recall:{question:'Qual é a finalidade da interface WireGuard (wg0) presente em todo nó do NethServer 8 e por que usuários remotos não devem conectar diretamente nela?',answer:'A interface WireGuard é dedicada à malha de comunicação inter-nós do cluster NS8 (tráfego de controle, orquestração e dados internos). Conectar usuários remotos nela violaria o isolamento de privilégios e a segmentação de segurança do cluster.'},
  labIntro:'Onde executar: terminal simulado e painel de arquitetura de conectividade segura.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de execução.',
    'Execute cat vpn-arquitetura-plano.txt para ler os conceitos de segmentação de VPN.',
    'Execute cluster-vpn-status para auditar a interface wg0, chaves públicas e IP 10.5.4.1.',
    'Execute nethsec-vpn-audit 192.168.50.1 para inspecionar o servidor de VPN no NethSecurity.',
    'Execute vpn-mesh-ping 10.5.4.1 para testar a integridade e latência da malha WireGuard.',
    'Execute vpn-security-validate para comprovar o isolamento entre as duas camadas.',
    'No painel educativo, confirme a separação entre WireGuard de cluster e VPN de usuário e valide a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readVpnPlan','Ler escopo em vpn-arquitetura-plano.txt'],
    ['inspectClusterVpn','Auditar interface WireGuard com cluster-vpn-status'],
    ['auditNethsecVpn','Auditar VPN de borda com nethsec-vpn-audit'],
    ['pingVpnMesh','Testar malha com vpn-mesh-ping'],
    ['validateVpnSecurity','Validar isolamento com vpn-security-validate'],
    ['vpnArchitectureVerified','Homologar arquitetura no painel educativo']
  ],
  hints:[
    'Consulte cluster-vpn-status para verificar o IP 10.5.4.1/24 na interface wg0.',
    'O comando nethsec-vpn-audit 192.168.50.1 consulta o pool de Roadwarrior no NethSecurity.',
    'Execute vpn-security-validate para auditar as regras de segmentação.'
  ],
  testking:[
    q('n44-mesh','WireGuard no NS8','Para que serve a interface WireGuard (wg0) configurada na instalação do NethServer 8?',0,
      ['Para conectar os nós do cluster em uma malha criptografada e privada de alta velocidade',
       'Para permitir que qualquer pessoa na rua acerte a senha do servidor por adivinhação',
       'Para substituir a placa de vídeo física do computador por uma virtual'],
      ['Exato! O WireGuard conecta os nós (líder e workers) de maneira transparente, segura e rápida.',
       'A malha WireGuard requer chaves assimétricas públicas/privadas rigorosamente autorizadas.',
       'O WireGuard é estritamente um protocolo de rede segura em nível de kernel.'],
      'É o cabo de fibra ótica blindado e exclusivo que conecta os dois prédios da mesma empresa.'
    ),
    q('n44-user-vpn','Onde Terminar a VPN de Usuários','Onde devem ser configurados os servidores de VPN para os funcionários que trabalham de casa?',1,
      ['Diretamente na área de trabalho do computador da recepção',
       'No firewall de borda NethSecurity 8, onde o tráfego é inspecionado e submetido a regras de acesso',
       'Em um servidor de Minecraft gratuito baixado da Internet'],
      ['Estações de trabalho locais não são gateways de VPN corporativos e não possuem alta disponibilidade.',
       'Correto! O NethSecurity recebe a conexão de fora, autentica o usuário e aplica políticas de firewall rigorosas.',
       'Softwares não corporativos ou jogos não possuem criptografia homologada para tráfego empresarial.'],
      'O segurança da portaria principal deve checar a documentação de quem chega antes de liberar a entrada.'
    ),
    q('n44-seg','Segmentação de Redes','Por que a rede WireGuard do cluster (10.5.4.0/24) deve ser isolada da rede de usuários remotos?',2,
      ['Porque o protocolo IP proíbe redes com números que começam com o algarismo 1',
       'Porque o roteador queima se duas pessoas usarem a mesma cor de cabo de rede',
       'Para garantir o princípio do menor privilégio e impedir que estações comprometidas acessem o controle do cluster'],
      ['Faixas RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) são padrões abertos.',
       'Roteadores processam pacotes de dados eletronicamente sem relação com a cor da capa plástica do cabo.',
       'Correto! A segmentação impede que um vírus no notebook pessoal do usuário consiga atacar as portas de controle dos servidores.'],
      'O crachá de visitante da cantina não pode abrir a porta do centro de processamento de dados do banco.'
    )
  ],
  decisionPrompt:'Um analista sugere gerar um arquivo de configuração WireGuard do cluster e instalar no notebook pessoal de um vendedor externo para ele acessar os arquivos mais rápido. Qual orientação você dá?',
  decisions:[
    {id:'wg-laptop',label:'Entregar a chave do cluster WireGuard para o vendedor colocar no notebook dele',correct:false,consequence:'Risco crítico de segurança: o notebook do usuário passará a fazer parte da rede de controle dos servidores sem nenhuma filtragem de borda.'},
    {id:'vpn-netsec-client',label:'Configurar a conta do usuário no servidor OpenVPN/Roadwarrior do NethSecurity 8 com MFA',correct:true,consequence:'Decisão correta e segura! O vendedor acessa os arquivos autorizados passando pelo controle de borda do firewall.'},
    {id:'no-vpn',label:'Proibir o vendedor de trabalhar remotamente e exigir que ele venha pessoalmente todo dia',correct:false,consequence:'Inflexibilidade injustificada: a infraestrutura possui soluções seguras de VPN corporativa para trabalho remoto.'}
  ],
  procedure:[
    'Verifique o status da interface WireGuard wg0 em todos os nós participantes do cluster.',
    'Assegure que as portas UDP do WireGuard (padrão 51820) estão liberadas apenas entre nós autorizados.',
    'Configure o servidor OpenVPN ou Roadwarrior no appliance NethSecurity 8.',
    'Vincule a autenticação dos usuários da VPN ao domínio corporativo (Samba AD / LDAP).',
    'Aplique políticas de firewall no NethSecurity limitando os destinos acessíveis pelos usuários remotos.'
  ],
  validation:'Evidência: malha WireGuard interna do cluster inspecionada com handshake ativo, pool de VPN do NethSecurity auditado, teste de ping na malha bem-sucedido e conformidade de segurança validada.',
  challenge:'Anote o IP e porta da interface WireGuard wg0 e registre a diferença entre a VPN do cluster e a VPN de acesso do NethSecurity.',
  diaryPlaceholder:'wg0 ativo em 10.5.4.1/24; malha de cluster isolada; usuários remotos acessam via NethSecurity Roadwarrior com MFA...',
  closing:'Você garantiu a integridade das redes e a segmentação de acessos remotos. Na próxima missão, você consolidará o Módulo 9 com um marco de revisão prática de segurança de borda.',
  sources:[['Cluster VPN',docs+'administrator-manual/cluster/'],['NethSecurity VPN',docs+'administrator-manual/nethsecurity/#vpn']]
};
