const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission43={
  id:43,xp:510,level:'Segurança e Borda · 60-75 min',title:'Proxy reverso Traefik: roteamento HTTP e certificados',
  summary:'Descubra como o Traefik unifica o roteamento de aplicações web, gerencia certificados TLS e injeta cabeçalhos de segurança.',
  call:'CH-NS8-043 · O NethServer 8 hospeda múltiplos serviços web que escutam na mesma porta HTTPS 443 do nó: o Nextcloud (cloud.lab.example), o webmail e o próprio painel administrativo. O Júnior precisa auditar o proxy reverso Traefik, validar o roteamento por cabeçalho Host e SNI, conferir os certificados TLS e aplicar cabeçalhos de segurança (HSTS, nosniff, frame-options) para elevar a nota de segurança da empresa.',
  impact:'Rotas mal configuradas no proxy reverso causam vazamento de cabeçalhos internos, vulnerabilidades a clickjacking e erros de certificado que impedem os navegadores dos usuários de carregar o sistema.',
  senior:'O Sênior sentou-se na cadeira ao lado e apontou para o endereço na barra do navegador: "Júnior, imagine um prédio com 20 escritórios diferentes, mas apenas uma porta giratória na calçada. O Traefik é o recepcionista elegante da portaria. Quando o visitante chega e diz Quero falar com o Nextcloud, o Traefik confere o crachá TLS, aplica a revista de segurança (cabeçalhos HTTP) e entrega o envelope no andar exato sem que o visitante precise saber onde fica o servidor nos fundos."',
  concept:'No NethServer 8, o Traefik é o proxy reverso nativo integrado ao core do cluster. Ele monitora a criação e remoção de containers e atualiza suas tabelas de roteamento dinamicamente sem necessidade de reiniciar serviços (zero-downtime). O Traefik analisa o SNI (Server Name Indication) na negociação TLS e o cabeçalho HTTP "Host" para direcionar a conexão ao container correto. Ele também é responsável por obter e renovar certificados Let\'s Encrypt automaticamente via ACME e por injetar cabeçalhos de segurança HTTP recomendados pelas diretrizes da OWASP (como Strict-Transport-Security, X-Frame-Options e X-Content-Type-Options).',
  example:'No laboratório, você inspeciona a configuração com cat traefik-rotas-escopo.txt, lista as rotas ativas com traefik-routes-list, audita os certificados com traefik-cert-audit cloud.lab.example, aplica os cabeçalhos de proteção com traefik-security-headers-apply cloud.lab.example --hsts --nosniff e valida os headers retornados com curl -I https://cloud.lab.example/.',
  glossary:[['Traefik','Proxy reverso e balanceador moderno baseado em Go','O recepcionista inteligente da recepção que direciona cada visitante ao andar certo.'],['SNI','Server Name Indication (extensão do protocolo TLS)','A etiqueta com o nome da empresa colada no lado de fora do envelope lacrado.'],['HSTS','Strict-Transport-Security (obrigatoriedade de HTTPS)','A regra irrevogável de que ninguém pode entrar descalço ou sem identificação criptografada.'],['Clickjacking','Ataque que sobrepõe frames invisíveis para enganar o clique','Um vidro invisível colocado sobre um botão de pagamento para o usuário assinar sem ver.']],
  recall:{question:'Como o Traefik consegue encaminhar requisições para dezenas de aplicações diferentes se todas utilizam o mesmo endereço IP e a mesma porta TCP 443?',answer:'O Traefik inspeciona o Server Name Indication (SNI) durante o handshake TLS e o cabeçalho HTTP "Host:" no payload da requisição, consultando sua tabela de roteamento dinâmica para encaminhar o fluxo ao container correspondente.'},
  labIntro:'Onde executar: terminal simulado e módulo de publicação HTTP do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador da sessão.',
    'Execute cat traefik-rotas-escopo.txt para conhecer as aplicações e domínios mapeados.',
    'Execute traefik-routes-list para auditar as rotas ativas e backends em container.',
    'Execute traefik-cert-audit cloud.lab.example para verificar validade e emissor do TLS.',
    'Execute traefik-security-headers-apply cloud.lab.example --hsts --nosniff para enrijecer a rota.',
    'Execute curl -I https://cloud.lab.example/ para comprovar a presença dos cabeçalhos HSTS e SAMEORIGIN.',
    'No painel educativo, confirme os cabeçalhos ativos e valide a publicação.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readTraefikPlan','Ler escopo em traefik-rotas-escopo.txt'],
    ['listTraefikRoutes','Listar rotas com traefik-routes-list'],
    ['auditTraefikCerts','Auditar certificados com traefik-cert-audit'],
    ['applySecurityHeaders','Aplicar headers de segurança no Traefik'],
    ['verifyHardenedHttp','Comprovar headers via curl'],
    ['traefikConfigVerified','Homologar proxy reverso no painel']
  ],
  hints:[
    'O comando traefik-routes-list exibe os roteadores e middlewares ativos.',
    'Aplique a proteção utilizando traefik-security-headers-apply com os parâmetros corretos.',
    'Execute curl -I para auditar se strict-transport-security e x-frame-options aparecem na resposta.'
  ],
  testking:[
    q('n43-sni','Roteamento por SNI e Host','Qual mecanismo permite ao Traefik escolher o certificado e o container correto antes mesmo de descriptografar a URL?',0,
      ['A extensão SNI (Server Name Indication) enviada no início do aperto de mão TLS',
       'O endereço MAC da placa de rede do computador de onde partiu o clique',
       'A cor do cabo de rede conectado na tomada da operadora'],
      ['Exato! O cliente envia o FQDN no campo SNI durante o ClientHello, permitindo ao Traefik carregar o certificado correto.',
       'O endereço MAC não atravessa roteadores de Internet e não indica o domínio solicitado.',
       'Características físicas do cabeamento não carregam informações de camada de aplicação.'],
      'É o carteiro que lê o nome da empresa na etiqueta externa antes de quebrar o lacre do pacote.'
    ),
    q('n43-hsts','Função do Cabeçalho HSTS','Para que serve o cabeçalho Strict-Transport-Security (HSTS) injetado pelo Traefik?',2,
      ['Para impedir que os usuários consigam acessar o sistema durante os fins de semana',
       'Para aumentar o tamanho das fontes dos títulos nas páginas do Nextcloud',
       'Para instruir o navegador a nunca usar HTTP inseguro, forçando conexões HTTPS estritas em acessos futuros'],
      ['O HSTS trata de segurança e criptografia de transporte, não de bloqueio de horários.',
       'Estilos visuais e tipografia são renderizados por folhas CSS, sem relação com cabeçalhos de transporte.',
       'Correto! O HSTS bloqueia ataques de downgrade (SSL Stripping) garantindo que o browser só conecte via HTTPS.'],
      'É o aviso na porta do banco: "A partir de hoje, qualquer tentativa de entrar desarmado ou sem crachá é barrada."'
    ),
    q('n43-dynamic','Configuração Dinâmica do Traefik','O que acontece no Traefik quando uma nova aplicação é instalada no Cluster Admin do NS8?',1,
      ['O administrador é obrigado a reiniciar o sistema operacional inteiro para compilar o Apache',
       'O Traefik descobre dinamicamente a nova rota via eventos do cluster e a ativa em milissegundos sem reiniciar',
       'Todas as outras aplicações do cluster são apagadas para dar espaço à nova'],
      ['O NS8 e o Traefik operam com alta disponibilidade e zero-downtime, sem reinicializações brutas.',
       'Correto! O Traefik possui provedor de configuração dinâmico nativo, lendo novos serviços sem derrubar rotas existentes.',
       'O isolamento entre instâncias no NS8 garante que nenhuma aplicação interfira nas outras.'],
      'É a secretária eletrônica que anota um novo ramal no quadro sem precisar desligar a central telefônica da firma.'
    )
  ],
  decisionPrompt:'Um estagiário propõe desativar o Traefik e mapear portas aleatórias nos containers (ex: Nextcloud na 8081, Webmail na 8082, ERP na 8083) para os usuários digitarem na URL. Qual sua decisão?',
  decisions:[
    {id:'random-ports',label:'Aceitar a ideia das portas altas para não precisar gerenciar o proxy reverso',correct:false,consequence:'Péssima usabilidade e risco de segurança: usuários precisarão decorar portas não padrão e certificados TLS precisarão ser gerados individualmente.'},
    {id:'traefik-unified',label:'Manter todas as aplicações atrás do Traefik na porta padrão 443 com FQDNs próprios',correct:true,consequence:'Decisão segura e profissional! Navegação limpa (https://cloud..., https://mail...), certificados automáticos e proteção unificada.'},
    {id:'http-only',label:'Retirar o TLS e deixar tudo em HTTP puro na porta 80 para facilitar o acesso',correct:false,consequence:'Risco operacional inadmissível: senhas e arquivos trafegarão em texto claro na rede, sujeitos a interceptação imediata.'}
  ],
  procedure:[
    'Crie as rotas públicas na seção Settings > HTTP Settings ou nas configurações da aplicação.',
    'Assegure que os apontamentos DNS (tipo A ou CNAME) resolvem para o IP público da empresa.',
    'Habilite a geração de certificado automático (Let\'s Encrypt) ou vincule a CA corporativa.',
    'Ative os middlewares de segurança: HSTS, X-Frame-Options (SAMEORIGIN) e X-Content-Type-Options (nosniff).',
    'Audite o cabeçalho retornado usando curl ou ferramentas online de segurança (ex: SSL Labs).'
  ],
  validation:'Evidência: rotas Traefik listadas, certificado TLS validado, cabeçalhos de proteção (HSTS e nosniff) aplicados com sucesso e resposta HTTP 200 confirmada via curl.',
  challenge:'Anote como o Traefik usa o SNI para roteamento e comprove que o cabeçalho HSTS está ativo na resposta do curl.',
  diaryPlaceholder:'Traefik roteia via SNI/Host; certificado validado; headers HSTS e nosniff ativos em cloud.lab.example...',
  closing:'As aplicações web estão protegidas e roteadas profissionalmente. Na próxima missão, você vai desvendar os túneis e a malha VPN segura do ecossistema.',
  sources:[['HTTP Settings and Traefik',docs+'administrator-manual/http_settings/'],['Traefik Documentation','https://doc.traefik.io/traefik/']]
};
