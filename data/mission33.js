const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission33={
  id:33,xp:450,level:'Gestão de contas e caixas · 60-75 min',title:'Caixas postais, aliases e grupos de distribuição',
  summary:'Habilite caixas postais para os usuários do Samba AD, crie aliases departamentais e teste a entrega de mensagens.',
  call:'CH-NS8-033 · A gerência da Aurora aprovou a liberação de e-mail corporativo para Ana e Mariana. O chamado exige: (1) Ativar a caixa postal de Ana (ana@aurora.lab) com quota de 5 GB; (2) Criar o alias financeiro@aurora.lab apontando para Ana; (3) Criar o grupo de distribuição diretoria@aurora.lab entregando para Ana e Mariana; e (4) Manter Bruno sem caixa postal.',
  impact:'Criar contas de e-mail duplicadas fora do diretório de identidade ou errar no redirecionamento de aliases faz mensagens financeiras confidenciais serem entregues para caixas indevidas ou devolvidas com erro.',
  senior:'O Sênior chamou o Júnior para conferir a tela de usuários: "No NS8, você não cria um usuário de e-mail separado de um usuário de rede. A identidade nasce no Samba AD e ganha a capacidade de correio com um clique. E lembre-se: se o financeiro precisa de um e-mail de contato, não crie um usuário novo com senha nova; use um alias. Alias é limpo, seguro e não vira brecha de segurança esquecida no sistema."',
  concept:'No NethServer 8, o módulo de correio utiliza o provedor de identidade do cluster (Samba AD ou OpenLDAP) para autenticação. Uma caixa postal (Mailbox) é um repositório físico Maildir associado a um usuário do domínio. Um Alias é um apelido virtual de roteamento que encaminha mensagens recebidas para uma ou mais caixas existentes sem exigir uma conta de usuário adicional. Grupos de distribuição permitem que um único endereço distribua e-mails para múltiplos destinatários internos.',
  example:'No laboratório, você executa cat usuarios-mail-escopo.txt, ativa a caixa de ana@aurora.lab via CLI ou no painel de gerência do Mail Server, cadastra o alias financeiro@aurora.lab e valida a entrega com mailbox-test e send-internal-probe.',
  glossary:[['Mailbox','Caixa postal física que armazena mensagens em disco','O armário de correspondência com chave individual de um funcionário.'],['Alias','Endereço alternativo virtual que redireciona mensagens','Um apelido escrito na porta da mesma sala de correspondência.'],['Quota','Limite máximo de espaço em disco que uma caixa postal pode ocupar','O volume máximo de caixas que cabem dentro do armário do colaborador.'],['Distribution Group','Endereço que entrega para múltiplos destinatários de uma vez','O megafone que avisa toda a diretoria simultaneamente.']],
  recall:{question:'Por que é muito mais seguro e econômico criar um "Alias" para o departamento financeiro em vez de criar um "Usuário" separado no domínio?',answer:'Porque o alias não consome memória nem espaço de banco de dados para uma nova conta, não exige senha extra que possa vazar ou ser esquecida, e direciona os e-mails diretamente para os colaboradores responsáveis em suas caixas habituais.'},
  labIntro:'Onde executar: terminal e painel educativo de administração de caixas de correio do NethServer 8.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de administração.',
    'Execute cat usuarios-mail-escopo.txt para auditar as contas e quotas autorizadas.',
    'Execute mailbox-create ana 5G para habilitar a caixa postal de Ana Silva.',
    'Execute mail-alias-create financeiro@aurora.lab ana@aurora.lab para cadastrar o alias.',
    'Execute mail-group-create diretoria@aurora.lab ana,mariana para criar o grupo de distribuição.',
    'Execute mailbox-test ana@aurora.lab e send-internal-probe financeiro@aurora.lab para testar a entrega.',
    'No painel educativo, confirme as configurações e valide a entrega técnica.'
  ],
  objectives:[
    ['identity','Confirmar operador'],
    ['host','Confirmar nó'],
    ['readAccountsPlan','Ler escopo em usuarios-mail-escopo.txt'],
    ['createAnaMailbox','Habilitar caixa de Ana com quota'],
    ['createFinanceAlias','Cadastrar alias financeiro@'],
    ['createBoardGroup','Criar grupo diretoria@'],
    ['testMailDelivery','Validar entrega com mailbox-test'],
    ['mailAccountsVerified','Homologar caixas e aliases']
  ],
  hints:[
    'O comando mailbox-create ana 5G provisiona o diretório Maildir com quota controlada.',
    'Cadastre o alias com mail-alias-create financeiro@aurora.lab ana@aurora.lab.',
    'Use mailbox-test ana@aurora.lab para confirmar que o Dovecot reconhece a conta e o alias.'
  ],
  testking:[
    q('n33-alias','Conceito de Alias','O que acontece internamente quando uma mensagem é enviada para um alias no NethServer 8?',1,
      ['O servidor abre uma nova janela do navegador na tela de todos os computadores da empresa',
       'O Postfix consulta a tabela de aliases virtuais e reescreve o destinatário entregando na caixa postal real',
       'O e-mail é impresso automaticamente na impressora de rede do departamento financeiro'],
      ['O servidor de e-mail opera em segundo plano sem abrir telas gráficas nos clientes.',
       'Exato! O Postfix faz a reescrita do endereço no arquivo de mapas virtuais e entrega a mensagem no Maildir de destino.',
       'Impressão automática de e-mails não é função nativa de servidores de correio corporativos.'],
      'O recepcionista recebe uma carta endereçada ao "Gerente Geral" e a coloca diretamente na gaveta do Carlos.'
    ),
    q('n33-quota','Gestão de Quota','Por que é uma boa prática estipular quotas de armazenamento (ex: 5 GB) para as caixas postais?',0,
      ['Para impedir que um único usuário lotando sua caixa com vídeos pessoais esgote o disco de todo o servidor',
       'Porque o protocolo IMAP trava se uma caixa postal tiver mais de 100 megabytes',
       'Porque a lei proíbe que empresas armazenem mais de 1 gigabyte por funcionário'],
      ['Correto! A quota é uma salvaguarda contra o consumo desordenado de storage por usuários individuais.',
       'O protocolo IMAP suporta caixas postais de dezenas de gigabytes sem restrição técnica.',
       'Não existe legislação que determine limites de tamanho de disco de caixas postais corporativas.'],
      'É como dar a cada hóspede um limite de malas no porta-malas do ônibus para ninguém ficar sem bagagem.'
    ),
    q('n33-scope','Escopo de Acesso','Por que Bruno não deve ter uma caixa postal criada neste chamado?',2,
      ['Porque o NethServer 8 cobra licença por caixa postal criada',
       'Porque o nome Bruno é reservado pelo protocolo SMTP',
       'Porque o princípio do menor privilégio e o escopo do chamado determinaram que apenas Ana e Mariana têm direito ao correio'],
      ['O NethServer 8 é software livre open-source e não impõe cobrança por licença de usuário.',
       'Nenhum nome de pessoa comum é palavra reservada em protocolos de rede.',
       'Exato! Só conceda recursos e privilégios para contas autorizadas formalmente pelo escopo do projeto.'],
      'Não entregue crachá e chave de sala para quem não trabalha naquele departamento.'
    )
  ],
  decisionPrompt:'Um operador sugere criar uma senha separada e exclusiva para o e-mail de Ana, diferente da senha do domínio Samba AD. Como agir?',
  decisions:[
    {id:'separate-pass',label:'Criar senha separada no banco local do Dovecot para cada serviço',correct:false,consequence:'Cria duplicidade de identidades, obriga o usuário a decorar senhas múltiplas e quebra o Single Sign-On do Samba AD.'},
    {id:'samba-ad-sso',label:'Manter a autenticação unificada no Samba AD (SSO)',correct:true,consequence:'Padrão corporativo moderno! O usuário usa uma única credencial forte auditada centralmente.'},
    {id:'no-password',label:'Desativar senha para o e-mail para agilizar o suporte',correct:false,consequence:'Falha gravíssima: qualquer pessoa na rede interna poderia ler e enviar mensagens em nome de Ana.'}
  ],
  procedure:[
    'Conferir a lista de colaboradores ativos no provedor de identidade Samba AD do cluster.',
    'Acessar a gerência da instância mail1 e selecionar os usuários autorizados a possuir caixa de correio.',
    'Definir a quota padrão de armazenamento de mensagens para evitar esgotamento de disco.',
    'Configurar aliases departamentais (ex: financeiro@, suporte@) apontando para os responsáveis reais.',
    'Testar o envio e recebimento de mensagens internas utilizando o script de validação de entrega.'
  ],
  validation:'Evidência: operador e nó confirmados, plano lido, caixa postal de Ana ativada com quota de 5G, alias financeiro@ configurado, grupo diretoria@ criado e entrega validada com sucesso.',
  challenge:'Explique por que no NethServer 8 a autenticação de e-mail é delegada ao Samba AD e qual benefício operacional o uso de aliases traz para o suporte.',
  diaryPlaceholder:'Caixa ana@aurora.lab criada com quota de 5G; alias financeiro@aurora.lab direcionando para Ana; grupo diretoria@ criado; entrega testada e aprovada...',
  closing:'Excelente trabalho! As caixas corporativas e aliases estão operando. Na próxima aula, você vai blindar o servidor contra spams e garantir a entrega com SPF, DKIM e DMARC.',
  sources:[['Gestão de Usuários e E-mail no NS8',docs+'applications/mail/#users-and-domains'],['RFC 5322 - Internet Message Format','https://datatracker.ietf.org/doc/html/rfc5322']]
};
