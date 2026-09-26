const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission49={
  id:49,xp:450,level:'Avançado · 50-60 min',title:'Cofre de senhas corporativo: Vaultwarden',
  summary:'Implante o Vaultwarden no NS8 para gerenciar senhas com criptografia ponta a ponta, coleções seguras e compatibilidade Bitwarden.',
  call:'CH-NS8-049 · A auditoria de segurança da Aurora encontrou um hábito perigoso espalhado por vários setores: senhas de switches, bancos de dados e contas de sistemas escritas em post-its amarelos sob teclados e planilhas desprotegidas no desktop. O Júnior foi incumbido de implantar o Vaultwarden no NethServer 8, desativar o registro público aberto de usuários, criar a organização de TI com coleções seguras de credenciais e publicar o endpoint seguro vault.aurora.lab.',
  impact:'O uso de um cofre de senhas corporativo com criptografia de ponta a ponta (Zero-Knowledge) elimina o compartilhamento inseguro de credenciais, reduz o risco de ataques por roubo de senhas e viabiliza a conformidade com as normas ISO 27001 e LGPD.',
  senior:'O Sênior recolheu três papéis adesivos colados na moldura do monitor de um servidor e os rasgou na frente do Júnior: "Júnior, post-it e planilha compartilhada são um convite aberto para o desastre. O Vaultwarden é uma das ferramentas mais fantásticas que você pode oferecer para a empresa: ele é escrito em Rust, consome menos de 60 MB de memória RAM e implementa 100% da API oficial do Bitwarden. As senhas são criptografadas no navegador do usuário antes de viajar pela rede; o nosso servidor sequer sabe o que está armazenado lá dentro. Vamos blindar essas credenciais agora."',
  concept:'O Vaultwarden é uma implementação alternativa leve em Rust da API de backend do Bitwarden. Ele adota a arquitetura de criptografia de ponta a ponta (Zero-Knowledge Encryption): a chave mestra do usuário é derivada no cliente utilizando PBKDF2 ou Argon2 com chave simétrica AES-256; o servidor armazena unicamente blobs criptografados. No NethServer 8, o Vaultwarden opera conteinerizado sob o Traefik com suporte a WebSockets para sincronização imediata de novos itens adicionados em extensões de navegadores e aplicativos mobile.',
  example:'No laboratório, você inspeciona a política em cat vaultwarden-escopo.txt, instala a aplicação com app-install vaultwarden --instance vaultwarden1, restringe o cadastro com vaultwarden-admin-policy --disable-open-registration, cria as coleções com vaultwarden-org-create --name "Aurora-TI" --collection "Servidores,Switches" e valida o endpoint com curl -I https://vault.aurora.lab/.',
  glossary:[['Vaultwarden','Servidor de cofre de senhas leve em Rust compatível com Bitwarden','O cofre suíço com caixas de segurança individuais onde cada cliente tem sua própria chave exclusiva.'],['Zero-Knowledge','Arquitetura de segurança onde o servidor não possui conhecimento dos dados em texto claro','O cofre que guarda uma mensagem lacrada sem que o chaveiro ou os guardas consigam ler o bilhete.'],['Argon2 / PBKDF2','Funções de derivação de chaves criptográficas resistentes a ataques de força bruta','Um mecanismo de engrenagens reforçado que exige milhões de giros para transformar sua senha na chave mestra.'],['Organizational Collection','Grupo de credenciais compartilhadas com controle granular de acesso entre equipes','A gaveta de ferramentas trancada compartilhada entre os mecânicos autorizados da oficina.']],
  recall:{question:'O que significa o conceito de Zero-Knowledge na arquitetura do Vaultwarden / Bitwarden?',answer:'Significa que toda a criptografia e descriptografia dos dados ocorre exclusivamente no dispositivo do usuário antes do envio; o servidor armazena apenas dados cifrados e nunca tem acesso à senha mestre nem ao conteúdo das credenciais em texto claro.'},
  labIntro:'Onde executar: console de operações e cofre de senhas corporativo do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e o nó.',
    'Execute cat vaultwarden-escopo.txt para revisar a política de cadastro e coleções.',
    'Execute app-install vaultwarden --instance vaultwarden1 para iniciar o container.',
    'Execute vaultwarden-admin-policy --disable-open-registration para restringir novos cadastros a convites.',
    'Execute vaultwarden-org-create --name "Aurora-TI" --collection "Servidores,Switches" para estruturar o cofre corporativo.',
    'Execute curl -I https://vault.aurora.lab/ para checar o cabeçalho HTTP 200 e notificações WebSocket.',
    'No painel educativo, confirme a política de cadastro e as coleções de TI e homologue a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readScope','Ler escopo em vaultwarden-escopo.txt'],
    ['installVaultwarden','Instalar instância com app-install vaultwarden'],
    ['enforceAdminPolicy','Restringir cadastro com vaultwarden-admin-policy'],
    ['createOrgCollections','Criar organização e coleções com vaultwarden-org-create'],
    ['verifyVaultHttp','Auditar resposta web com curl em vault.aurora.lab'],
    ['validateVaultwarden','Homologar Vaultwarden no painel educativo']
  ],
  hints:[
    'Consulte cat vaultwarden-escopo.txt para validar a diretiva de registro restrito.',
    'Use vaultwarden-admin-policy --disable-open-registration para fechar o auto-cadastro público.',
    'O FQDN vault.aurora.lab deve responder com status HTTP/2 200 OK sob Traefik.'
  ],
  testking:[
    q('n49-zero-k','Criptografia Zero-Knowledge','Por que mesmo se um invasor tiver acesso ao banco de dados do Vaultwarden ele não conseguirá ler as senhas?',0,
      ['Porque as credenciais são cifradas com AES-256 no navegador do usuário antes de viajar e a chave mestra nunca é enviada ao servidor',
       'Porque o banco de dados apaga as senhas a cada 10 segundos automaticamente',
       'Porque as senhas são escritas em hebraico antigo sem vogais'],
      ['Exato! A arquitetura Zero-Knowledge garante que apenas o detentor da senha mestra possa decifrar os dados localmente.',
       'Se o banco apagasse os dados, os usuários perderiam todas as suas credenciais permanentemente.',
       'Criptografia digital matemática moderna não utiliza idiomas antigos para prover sigilo.'],
      'É guardar um documento trancado em uma caixa de titânio cuja chave física só fica no seu bolso.'
    ),
    q('n49-reg-policy','Política de Registro de Usuários','Por que é fundamental desativar o registro aberto (SIGNUPS_ALLOWED=false) no Vaultwarden corporativo?',1,
      ['Para impedir que os diretores acessem suas senhas nos finais de semana',
       'Para evitar que qualquer pessoa externa na Internet crie contas arbitrárias e consuma espaço no servidor',
       'Porque o software trava se tiver mais de dois usuários cadastrados'],
      ['O registro restrito a convites da TI não afeta o acesso legítimo dos diretores já cadastrados.',
       'Correto! Um cofre corporativo deve admitir exclusivamente usuários convidados e auditados pela equipe de TI.',
       'O Vaultwarden suporta centenas de usuários corporativos com altíssima performance.'],
      'É manter a portaria do condomínio com lista de convidados aprovados, em vez de deixar a catraca liberada para quem passar na calçada.'
    ),
    q('n49-compat','Compatibilidade Bitwarden','Quais clientes e aplicativos os colaboradores da empresa podem utilizar para se conectar ao Vaultwarden?',2,
      ['Apenas um terminal Linux rodando scripts bash rudimentares',
       'Nenhum aplicativo externo, sendo obrigatório imprimir as senhas em folhas A4',
       'Todas as extensões oficiais para Chrome/Firefox/Edge e apps móveis oficiais do Bitwarden apontando para vault.aurora.lab'],
      ['O Vaultwarden é feito para usuários finais comuns, suportando interfaces gráficas completas.',
       'Imprimir senhas em papel anula todo o propósito de segurança do sistema.',
       'Correto! A compatibilidade 100% com a API oficial do Bitwarden permite usar todo o ecossistema oficial de clientes.'],
      'É poder usar qualquer aparelho de telefone comum para discar para a linha telefônica da empresa.'
    )
  ],
  decisionPrompt:'Um colaborador do financeiro insiste em utilizar uma senha mestra simples de 6 caracteres ("123456") no cofre para não esquecer. Como a administração do Vaultwarden deve proceder?',
  decisions:[
    {id:'allow-weak-master',label:'Permitir a senha fraca para não estressar o colaborador',correct:false,consequence:'Gravíssimo risco: se a senha mestra for fraca, um ataque de dicionário offline quebra a chave e expõe todo o cofre.'},
    {id:'enforce-policy-mfa',label:'Aplicar política de senha mestra complexa (mínimo 14 caracteres) e exigir autenticação em dois fatores (2FA TOTP)',correct:true,consequence:'Excelente prática de segurança! Protege o cofre contra ataques de força bruta e assegura conformidade total com a governança da empresa.'},
    {id:'write-master-desktop',label:'Gravar a senha mestra em um arquivo txt público na área de trabalho',correct:false,consequence:'Violação primária de confidencialidade que anula a segurança do cofre corporativo.'}
  ],
  procedure:[
    'Analise as configurações de persistência e variáveis de ambiente do container Vaultwarden.',
    'Instale a instância vaultwarden1 vinculando o volume ao armazenamento persistente.',
    'Acesse as diretivas administrativas e desative o cadastro público aberto de novas contas.',
    'Configure o envio de convites corporativos através do servidor de e-mail mail1.',
    'Crie a organização oficial da Aurora e configure as coleções departamentais de TI.',
    'Publique a rota vault.aurora.lab no proxy Traefik com TLS obrigatório e verifique a extensão web.'
  ],
  validation:'Evidência: instância vaultwarden1 instalada, cadastro público restrito a convites administrativos, organização Aurora-TI com coleções estruturadas, rota vault.aurora.lab respondendo via Traefik e homologação concluída no painel educativo.',
  challenge:'Documente o provisionamento da instância vaultwarden1, confirme o bloqueio de auto-registro e teste o acesso HTTPS ao cofre digital.',
  diaryPlaceholder:'Vaultwarden provisionado; cadastro restrito (SIGNUPS_ALLOWED=false); coleções Aurora-TI criadas; vault.aurora.lab ativo no Traefik...',
  closing:'Excelente! O cofre corporativo Vaultwarden protege todas as credenciais sensíveis da Aurora com criptografia Zero-Knowledge. Na Aula 50, você executará a Revisão Integrada 10 e homologará o catálogo de aplicações!',
  sources:[['Vaultwarden in NS8',docs+'administrator-manual/applications/vaultwarden/'],['Zero-Knowledge Architecture','https://bitwarden.com/help/security-faq/']]
};
