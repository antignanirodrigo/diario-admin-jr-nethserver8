const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission41={
  id:41,xp:490,level:'Segurança e Borda · 60-75 min',title:'Modelo de segurança: host firewall vs UTM NethSecurity',
  summary:'Compreenda a separação entre a borda UTM dedicada (NethSecurity) e o firewall de host local do NethServer 8.',
  call:'CH-NS8-041 · A gerência de infraestrutura da Aurora questionou por que o NethServer 8 não possui mais o módulo de firewall de borda com Multi-WAN e IPS embutido, como existia no legado NethServer 7. O Júnior precisa auditar a arquitetura moderna, inspecionar o firewall de host local (nftables/firewalld) no NS8 e validar a comunicação com o gateway de borda dedicado NethSecurity 8.',
  impact:'Tentar transformar o nó de aplicações NS8 em gateway de borda diretamente exposto à Internet sem appliance de firewall degrada o desempenho dos containers e compromete o tráfego da empresa a cada reinicialização de aplicação.',
  senior:'O Sênior desenhou a topologia clássica do NS7 e colocou um grande "X" vermelho sobre ela: "No passado, ter firewall, roteador, servidor de arquivos e correio na mesma máquina parecia prático. Mas se uma atualização do Nextcloud travasse a máquina, a fábrica inteira perdia a conexão de Internet. No NethServer 8, a Nethesis separou o mundo: o NethSecurity 8 é um UTM de borda baseado em OpenWrt com inspeção pesada, e o NS8 cuida estritamente de orquestrar aplicações. O NS8 tem seu próprio firewall de host, mas a sentinela da portaria é o NethSecurity."',
  concept:'A arquitetura de segurança do ecossistema Nethesis moderno divide responsabilidades em camadas complementares (defesa em profundidade): 1) NethSecurity 8 atua como o UTM de borda (Unified Threat Management), operando com kernel OpenWrt enrijecido, gerenciamento Multi-WAN com failover, inspeção profunda de pacotes (DPI), controle de banda e IPS/IDS (Suricata e CrowdSec); 2) NethServer 8 atua como o orquestrador de aplicações em containers (Podman), possuindo um firewall de host local (baseado em nftables) que protege suas portas locais e isola as redes dos containers, comunicando-se com a borda através de roteamento padrão.',
  example:'No laboratório, você estuda a matriz de responsabilidades com cat modelo-seguranca-escopo.txt, verifica as regras e portas ativas no firewall de host local com host-firewall-status e testa a comunicação com o gateway de borda NethSecurity com border-gateway-probe 192.168.50.1.',
  glossary:[['UTM','Gerenciamento Unificado de Ameaças (NethSecurity 8)','A guarita blindada na entrada do condomínio com cancela, raio-X e detector de metais.'],['Host Firewall','Firewall local do sistema operacional do nó (nftables)','A porta trancada com chave e olho mágico de um apartamento específico.'],['Defesa em Profundidade','Estratégia de múltiplas camadas de proteção independentes','Muralha externa, portão da garagem e porta da sala, cada um com sua própria tranca.'],['NethSecurity 8','Appliance de segurança dedicado desenvolvido pela Nethesis','A viatura especializada de patrulha e controle de fronteira.']],
  recall:{question:'Por que o NethServer 8 desacoplou as funções de roteador/firewall de borda, transferindo-as para o appliance NethSecurity 8?',answer:'Para isolar o ciclo de vida dos serviços: um firewall de borda exige estabilidade extrema e não deve reiniciar ou ter sua rede interrompida por atualizações de aplicações web, além de permitir hardware dedicado e kernel otimizado para roteamento (OpenWrt).' },
  labIntro:'Onde executar: terminal simulado e painel de classificação arquitetural de segurança.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de gerência.',
    'Execute cat modelo-seguranca-escopo.txt para estudar a separação entre borda e host.',
    'Execute host-firewall-status para auditar as zonas e portas escutando no Linux local.',
    'Execute border-gateway-probe 192.168.50.1 para testar a rota e o acesso ao NethSecurity na porta 9090.',
    'No painel educativo, classifique as atribuições de cada camada e homologue o modelo de segurança.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readSecurityScope','Ler escopo em modelo-seguranca-escopo.txt'],
    ['checkHostFirewall','Auditar firewall de host com host-firewall-status'],
    ['probeBorderGateway','Testar gateway de borda com border-gateway-probe'],
    ['securityModelVerified','Homologar separação arquitetural no painel']
  ],
  hints:[
    'Consulte modelo-seguranca-escopo.txt para memorizar os papéis de NS8 e NethSecurity.',
    'O comando host-firewall-status mostra as zonas public e trusted do host.',
    'Utilize border-gateway-probe 192.168.50.1 para validar a porta de gestão 9090 do appliance.'
  ],
  testking:[
    q('n41-decoupling','Desacoplamento NS8 vs NethSecurity','Por que o NethServer 8 não atua mais como roteador e firewall de borda UTM?',0,
      ['Porque firewalls de borda exigem kernel de roteamento dedicado e não devem sofrer paradas por causa de apps',
       'Porque a Nethesis foi proibida por lei internacional de desenvolver firewalls',
       'Porque o Linux Rocky Linux não possui capacidade de filtrar pacotes IP'],
      ['Correto! A separação garante estabilidade de rede contínua para a empresa enquanto o NS8 orquestra containers.',
       'A Nethesis desenvolveu ativamente o NethSecurity 8 exatamente para ser o seu produto de firewall de ponta.',
       'O Rocky Linux e o kernel Linux possuem nftables avançado, mas são voltados a servidores, não a appliances de borda.'],
      'O motorista de ônibus não deve ser a mesma pessoa que faz a manutenção do asfalto na estrada.'
    ),
    q('n41-layers','Camadas de Segurança','Qual é a função do firewall de host (nftables/firewalld) que roda dentro do nó do NethServer 8?',1,
      ['Substituir completamente o roteador da operadora de telecomunicações',
       'Proteger as portas locais do nó Linux e controlar o isolamento entre interfaces de rede e containers',
       'Bloquear spams de e-mail antes que eles cheguem no cabo de fibra óptica'],
      ['O firewall de host atua estritamente na interface da máquina virtual, não na borda da Internet.',
       'Exato! O firewall local fecha portas não utilizadas do nó e garante que apenas serviços autorizados recebam tráfego.',
       'A filtragem de spam é responsabilidade da instância de e-mail (Rspamd) ou de scanners de borda.'],
      'É o trinco da porta do seu quarto: protege o seu cômodo mesmo que a porta da frente da casa esteja aberta.'
    ),
    q('n41-netsec','Papel do NethSecurity 8','O que o NethSecurity 8 oferece como sentinela de borda da rede?',2,
      ['Apenas uma planilha de Excel com a lista dos IPs dos computadores',
       'Um visualizador de fotos corporativas integrado ao Nextcloud',
       'UTM completo com Multi-WAN, failover de operadoras, DPI, IPS Suricata, CrowdSec e OpenVPN de acesso'],
      ['O NethSecurity é um sistema operacional completo baseado em OpenWrt, não um arquivo de planilha.',
       'Visualização de fotos e colaboração é papel do Nextcloud no NethServer 8.',
       'Correto! O NethSecurity 8 concentra todas as defesas ativas de borda e gerencia os links de Internet corporativos.'],
      'É o batalhão de segurança que vigia os portões da fronteira para proteger a cidade que vive em paz atrás dos muros.'
    )
  ],
  decisionPrompt:'Um analista júnior de outra equipe propõe conectar o nó do NS8 diretamente ao modem de Internet sem nenhum firewall de borda, alegando que "o Linux já tem firewall". Qual decisão técnica você impõe?',
  decisions:[
    {id:'direct-modem',label:'Aceitar a ligação direta no modem para economizar uma VM ou appliance',correct:false,consequence:'Risco crítico: o servidor de aplicações ficará diretamente exposto a scans automatizados, ataques DDoS e tentativas de invasão.'},
    {id:'border-netsec',label:'Exigir o posicionamento do NethSecurity 8 na borda e manter o NS8 em zona protegida LAN/DMZ',correct:true,consequence:'Decisão segura! O tráfego de entrada passa por inspeção profunda e o NS8 recebe apenas conexões limpas e filtradas.'},
    {id:'disable-firewall',label:'Desativar o firewall do host NS8 para evitar conflitos de portas com o modem',correct:false,consequence:'Falha de segurança elementar: expõe o nó a qualquer máquina comprometida na rede interna.'}
  ],
  procedure:[
    'Identifique a topologia de rede e assegure que o NethSecurity 8 é o gateway padrão do cluster.',
    'Verifique se as interfaces de rede do NS8 estão atribuídas às zonas corretas no firewall de host.',
    'Certifique-se de que portas administrativas (SSH 22, Cluster Admin 443) não estão expostas diretamente.',
    'Valide a resolução de nomes e a rota padrão apontando para a interface LAN do NethSecurity.',
    'Documente os papéis e limites operacionais de cada produto no guia de arquitetura da empresa.'
  ],
  validation:'Evidência: separação entre borda e host compreendida, zonas do firewall local auditadas e rota de comunicação com o NethSecurity na porta 9090 confirmada com sucesso.',
  challenge:'Anote por que a Nethesis desacoplou o firewall de borda no NethSecurity 8 e descreva a função do firewall de host do NS8.',
  diaryPlaceholder:'NS8 desacoplou UTM para isolar ciclo de vida; NethSecurity 8 na borda (OpenWrt); host firewall nftables ativo...',
  closing:'Você alinhou a arquitetura ao padrão oficial de segurança da Nethesis. Na próxima missão, você vai integrar o NethSecurity Controller e gerenciar o encaminhamento de portas de borda.',
  sources:[['Security Architecture',docs+'administrator-manual/security/'],['NethSecurity 8 Documentation','https://docs.nethsecurity.org/']]
};
