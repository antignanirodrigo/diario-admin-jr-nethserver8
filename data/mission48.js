const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission48={
  id:48,xp:450,level:'Avançado · 50-60 min',title:'Gateway de acesso remoto: Apache Guacamole',
  summary:'Implante o Apache Guacamole no NS8 para disponibilizar acesso RDP e SSH clientless via HTML5 no navegador web.',
  call:'CH-NS8-048 · A equipe de suporte e vários consultores externos precisam acessar servidores Linux e estações de trabalho Windows internas da Aurora durante o regime de plantão. No entanto, muitos utilizam computadores pessoais ou tablets onde é inviável ou inseguro instalar clientes VPN pesados. O Júnior deve implantar o Apache Guacamole no NethServer 8, configurar o túnel RDP para a estação piloto win10-lab e disponibilizar o gateway seguro remote.aurora.lab com renderização HTML5 no navegador.',
  impact:'O acesso remoto clientless elimina os custos e a fragilidade de suporte com clientes VPN de terceiros, centraliza o controle de acesso com auditoria e gravação de sessões em vídeo e impede que vírus do computador doméstico do colaborador se espalhem diretamente pela rede interna corporativa.',
  senior:'O Sênior apontou para o tablet em sua mão, onde uma área de trabalho do Windows 10 e um console Linux rodavam perfeitamente dentro de abas do Chrome: "Júnior, a era de abrir portas RDP 3389 para a Internet ou obrigar o usuário leigo a compilar clientes VPN morreu. Com o Apache Guacamole no NS8, o protocolo proprietário pesado (RDP ou VNC) fica confinado entre o servidor guacd e a máquina de destino na LAN interna. O usuário de fora enxerga apenas um canvas HTML5 limpo, seguro e criptografado com TLS. Isso é segurança e elegância técnica."',
  concept:'O Apache Guacamole no NethServer 8 opera através de uma arquitetura em duas camadas conteinerizadas: 1) O Guacamole Client (aplicação web Java/Tomcat servida sob o proxy Traefik); 2) O daemon guacd (serviço de backend em C/libguac que traduz protocolos remotos nativos como RDP porta 3389, SSH porta 22 e VNC porta 5900 para instruções de desenho vetorial no canvas HTML5). Como nenhum plugin ou software cliente é exigido, a experiência do usuário é 100% nativa em qualquer navegador web moderno compatível com padrões W3C.',
  example:'No laboratório, você inspeciona a arquitetura com cat guacamole-plano.txt, instala o serviço com app-install guacamole --instance guacamole1, registra a conexão de desktop com guacamole-connection-add --name "Estacao-Ana-Win10" --protocol rdp --host 192.168.50.50, audita as conexões com guacamole-audit-connections e testa a URL com curl -I https://remote.aurora.lab/.',
  glossary:[['Apache Guacamole','Gateway de acesso remoto clientless via HTML5','O vidro da cabine de visitantes do presídio: você vê e fala perfeitamente sem contato físico direto.'],['guacd','Daemon proxy do Guacamole que traduz RDP/SSH para canvas HTML5','O tradutor simultâneo que escuta o idioma complexo da máquina e desenha na tela do seu navegador.'],['Clientless','Acesso remoto que não exige instalação de software ou agentes na ponta','Entrar em uma loja virtual sem precisar baixar um programa exclusivo no seu computador.'],['Session Recording','Gravação em vídeo das ações executadas durante a sessão remota','A câmera de segurança que filma todas as gavetas abertas pelo técnico durante a manutenção.']],
  recall:{question:'Por que o tráfego RDP ou SSH nunca sai para a Internet aberta quando se utiliza o Apache Guacamole?',answer:'Porque o tráfego RDP/SSH ocorre exclusivamente na rede local entre o daemon guacd e a máquina de destino; para a Internet, trafega apenas uma conexão HTTPS/WebSocket transportando a renderização visual do canvas HTML5.'},
  labIntro:'Onde executar: console de operações e gateway de acesso remoto do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e o nó.',
    'Execute cat guacamole-plano.txt para ler os alvos de acesso remoto autorizados.',
    'Execute app-install guacamole --instance guacamole1 para subir o guacd e o Tomcat.',
    'Execute guacamole-connection-add --name "Estacao-Ana-Win10" --protocol rdp --host 192.168.50.50 para mapear a estação.',
    'Execute guacamole-audit-connections para auditar os parâmetros de cifra e gravação de sessão.',
    'Execute curl -I https://remote.aurora.lab/ para checar o cabeçalho HTTP 200 e cookies de sessão.',
    'No painel educativo, confirme as conexões cadastradas e homologue a entrega do gateway remoto.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readPlan','Ler plano em guacamole-plano.txt'],
    ['installGuacamole','Instalar instância com app-install guacamole'],
    ['addRdpConnection','Mapear estação RDP com guacamole-connection-add'],
    ['auditGuacamoleConnections','Auditar conexões com guacamole-audit-connections'],
    ['verifyRemoteHttp','Auditar resposta web com curl em remote.aurora.lab'],
    ['validateGuacamole','Homologar Guacamole no painel educativo']
  ],
  hints:[
    'Verifique o IP da estação Windows em cat guacamole-plano.txt antes de adicionar a conexão.',
    'Utilize guacamole-connection-add especificando o protocolo rdp e o host 192.168.50.50.',
    'Após a auditoria de conexões, valide a terminação HTTPS em https://remote.aurora.lab/.'
  ],
  testking:[
    q('n48-guacd','Papel do Daemon guacd','Qual é a função do daemon guacd na arquitetura do Apache Guacamole?',1,
      ['Gerenciar a cobrança de mensalidades dos usuários em bitcoins',
       'Conectar-se diretamente aos servidores via RDP/SSH/VNC e traduzir as telas para o protocolo do Guacamole',
       'Formatar o disco rígido da estação de trabalho sempre que o usuário fizer logout'],
      ['O Guacamole é um software open-source e não realiza cobranças financeiras.',
       'Correto! O guacd atua como ponte de baixo nível entre os protocolos de desktop remoto e a interface web.',
       'Ação destrutiva absurda: o Guacamole apenas renderiza a sessão sem formatar discos.'],
      'É o intérprete poliglota que atende a ligação externa e traduz tudo para o idioma que o cliente compreende.'
    ),
    q('n48-html5','Vantagem do Acesso Clientless','Qual é a principal vantagem operacional do acesso remoto clientless via HTML5?',0,
      ['Funcionar em qualquer navegador moderno sem necessidade de instalar softwares ou plugins no dispositivo do usuário',
       'Permitir que invasores anônimos acessem o servidor sem senha',
       'Exigir monitores de tubo CRT analógicos para poder exibir a imagem'],
      ['Exato! Reduz custos de suporte, evita problemas de compatibilidade de sistema operacional e garante acesso seguro universal.',
       'O Guacamole exige autenticação robusta com suporte a LDAP, 2FA e permissões granulares.',
       'Qualquer monitor digital moderno com navegador compatível com HTML5 funciona perfeitamente.'],
      'É poder assistir a um vídeo no YouTube direto pelo navegador sem ter que comprar um aparelho de DVD dedicado.'
    ),
    q('n48-rdp-sec','Segurança contra Malware','Por que o Guacamole protege a rede interna contra malwares presentes no computador doméstico do usuário?',2,
      ['Porque o Guacamole envia um antivírus que vasculha o computador pessoal sem autorização',
       'Porque o Guacamole só funciona se o computador do usuário estiver desligado',
       'Porque nenhum pacote IP da rede local trafega até a máquina pessoal; apenas imagens e eventos de teclado/mouse são transmitidos'],
      ['Nenhum software deve violar a privacidade ou realizar buscas arbitrárias sem consentimento.',
       'Se o computador estiver desligado, o usuário não consegue operar a sessão.',
       'Correto! Não há túnel IP de camada 3 entre a máquina do usuário e a rede corporativa, impedindo a propagação de worms ou ransomware.'],
      'É como assistir a um animal perigoso através de um vidro blindado no zoológico: você observa os movimentos, mas ele não pode morder você.'
    )
  ],
  decisionPrompt:'Um operador sugere abrir a porta 3389 diretamente no firewall de borda para contornar o Guacamole quando algum usuário reclamar de lentidão no canvas. Qual é a sua resposta técnica?',
  decisions:[
    {id:'open-rdp-wan',label:'Abrir a porta 3389 na WAN para agradar o usuário',correct:false,consequence:'Catástrofe de segurança: a porta 3389 na Internet é o alvo prioritário de ransomware com exploração de BlueKeep e força bruta.'},
    {id:'deny-and-tune',label:'Negar veementemente a exposição de RDP na WAN e otimizar a compactação e qualidade de cor no Guacamole',correct:true,consequence:'Decisão exemplar de segurança! Mantém a borda blindada e resolve a lentidão ajustando taxa de quadros e compactação JPEG/WebP.'},
    {id:'remove-remote',label:'Revogar o acesso remoto de todos os colaboradores permanentemente',correct:false,consequence:'Bloqueio desproporcional que inviabiliza as operações de suporte e plantão da empresa.'}
  ],
  procedure:[
    'Verifique os recursos de CPU e memória para o daemon guacd no Software Center.',
    'Instale a instância guacamole1 assegurando a persistência das configurações no PostgreSQL.',
    'Cadastre as conexões autorizadas para servidores internos de infraestrutura e estações de trabalho.',
    'Habilite a gravação de sessão em vídeo para auditoria de conexões administrativas críticas.',
    'Publique o FQDN remote.aurora.lab com terminação TLS e cabeçalhos de segurança no Traefik.',
    'Realize o teste de acesso autenticando como operador e operando a área de trabalho remota via navegador.'
  ],
  validation:'Evidência: instância guacamole1 instalada com daemon guacd ativo, conexão RDP win10-lab cadastrada e auditada, rota remote.aurora.lab respondendo com HTTP 200 TLS no Traefik e homologação concluída no painel educativo.',
  challenge:'Documente a criação da instância guacamole1, mapeie a estação Windows 10 na porta 3389 interna e comprove a integridade do gateway remote.aurora.lab.',
  diaryPlaceholder:'Guacamole provisionado; daemon guacd ativo; conexao Estacao-Ana-Win10 mapeada; gateway remote.aurora.lab homologado...',
  closing:'Excelente! O Apache Guacamole provê acesso remoto veloz e seguro sem clientes pesados. Na Aula 49, você implantará o cofre corporativo de senhas Vaultwarden!',
  sources:[['Guacamole in NS8',docs+'administrator-manual/applications/guacamole/'],['Clientless Remote Access','https://guacamole.apache.org/doc/gug/']]
};
