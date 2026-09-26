const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission32={
  id:32,xp:450,level:'Instalação de serviço · 60-75 min',title:'Planejamento de domínio e instalação do Mail Server',
  summary:'Instale a instância mail1 do NethServer 8 a partir do Software Center e conecte-a ao domínio corporativo.',
  call:'CH-NS8-032 · Com a arquitetura aprovada, a Aurora autorizou a instalação do serviço de e-mail. Você deve verificar os pré-requisitos de sistema no nó ns8-node-01, selecionar o aplicativo oficial "Mail Server" no Software Center do NS8 e provisionar a instância mail1 vinculada ao domínio aurora.lab.',
  impact:'Instalar o serviço de correio sem armazenamento suficiente ou com FQDN incorreto gera falhas em cascata no banco de dados do Dovecot e interrupções durante o recebimento de anexos pesados.',
  senior:'O Sênior sentou ao lado do Júnior e alertou: "O servidor de e-mail é a aplicação mais sensível do datacenter. Se o servidor web cair 10 minutos, o usuário dá F5. Se o servidor de e-mail cair e devolver erro permanente, o cliente cancela o contrato e você perde propostas comerciais. Instalação de correio exige checar espaço em disco, logs de inicialização e saúde do container antes de anunciar que está pronto."',
  concept:'No NethServer 8, o serviço de correio é distribuído como uma aplicação containerizada (instância mail1) gerenciada por Podman e systemd. Ele orquestra o Postfix (MTA de alta performance), o Dovecot (armazenamento Maildir e servidor IMAP/LMTP) e o Rspamd (motor inteligente de antispam e assinatura DKIM). Durante a criação, define-se o domínio principal, as interfaces de escuta e o armazenamento dedicado.',
  example:'No laboratório, você executa cat plano-instalacao-mail.txt, confere se o nó possui ao menos 2 GB livres para o serviço, instala a instância mail1 via CLI ou pelo painel educativo e valida com app-status mail1.',
  glossary:[['mail1','Nome da primeira instância do módulo de e-mail no NS8','O novo departamento de correspondência criado dentro da empresa.'],['Dovecot','Servidor seguro de armazenamento IMAP e entrega local','O arquivo blindado onde cada colaborador tem sua pasta de cartas.'],['Postfix','Software livre de transporte de e-mail padrão da indústria','O centro de triagem que processa e encaminha envelopes postais.'],['Rspamd','Sistema moderno de análise estatística e filtragem de spam','O scanner de segurança que inspeciona pacotes contra ameaças.']],
  recall:{question:'Quais são os três componentes de software fundamentais que o NethServer 8 integra dentro da instância de correio mail1?',answer:'O Postfix (responsável pelo envio e recepção SMTP), o Dovecot (responsável pelo armazenamento Maildir e protocolo IMAP) e o Rspamd (responsável pela filtragem de antispam, antivírus e assinatura digital DKIM).'},
  labIntro:'Onde executar: terminal e painel educativo do Software Center do NethServer 8.',
  labSteps:[
    'Execute whoami e hostname para confirmar o ambiente de execução.',
    'Execute cat plano-instalacao-mail.txt e verifique os parâmetros de FQDN e armazenamento.',
    'Execute app-catalog list | grep mail para verificar a disponibilidade do pacote oficial.',
    'No painel educativo, selecione o Mail Server e clique em "Instalar Instância mail1".',
    'Execute app-status mail1 para validar o status running de todos os containers internos.',
    'Valide a instalação e registre o procedimento de homologação.'
  ],
  objectives:[
    ['identity','Confirmar operador'],
    ['host','Confirmar nó'],
    ['readMailPlan','Ler plano em plano-instalacao-mail.txt'],
    ['checkMailCatalog','Consultar catálogo de aplicações'],
    ['installMailInstance','Instalar instância mail1 no painel'],
    ['checkMailStatus','Validar status com app-status mail1'],
    ['mailInstalledVerified','Homologar instalação da instância']
  ],
  hints:[
    'Consulte app-catalog list | grep mail para confirmar que o módulo oficial está listado.',
    'No painel educativo, acione o botão "Instalar Instância mail1".',
    'Após a instalação, execute app-status mail1 para verificar que Postfix e Dovecot estão ativos.'
  ],
  testking:[
    q('n32-arch','Arquitetura de E-mail do NS8','Como o NethServer 8 executa o servidor de e-mail?',0,
      ['Como uma instância containerizada independente com Postfix, Dovecot e Rspamd gerenciada pelo cluster',
       'Como um plugin simples do Apache que só envia mensagens via PHP mail()',
       'Como uma máquina virtual Windows Server rodando Exchange emulado'],
      ['Exato! O NS8 encapsula a stack completa de correio em containers seguros com isolamento de processos.',
       'PHP mail() não é um servidor de correio corporativo completo, apenas uma função de envio web.',
       'O NS8 não usa Windows nem emula o Microsoft Exchange.'],
      'É como uma cabine pré-fabricada de alta tecnologia montada dentro do hangar da empresa.'
    ),
    q('n32-fqdn','FQDN do Correio','Por que o FQDN configurado na instância de correio deve ser idêntico ao hostname de saída da máquina?',1,
      ['Porque o Postfix recusa inicializar se o nome tiver menos de 30 letras',
       'Porque servidores de destino conferem se o HELO/EHLO do SMTP bate com o DNS reverso (PTR) do IP',
       'Porque o protocolo IMAP só funciona se o nome do servidor começar com a letra M'],
      ['Não existe restrição arbitrária de quantidade de letras.',
       'Correto! Se o servidor diz "Olá, sou mail.empresa.com", mas seu IP reverso aponta para outro nome, o e-mail é marcado como spam imediatamente.',
       'Protocolos de rede seguem padrões RFC universais e não regras alfabéticas.'],
      'É como o motorista mostrar um documento de identificação cujo nome bate exatamente com o crachá do caminhão.'
    ),
    q('n32-storage','Armazenamento de E-mail','O que acontece se a partição de armazenamento de mensagens (/var/vmail) atingir 100% de uso?',2,
      ['As mensagens continuam chegando normalmente e são salvas na memória RAM provisoriamente',
       'O NethServer 8 apaga automaticamente os e-mails da diretoria para liberar espaço',
       'O Postfix passa a adiar e rejeitar novas mensagens recebidas com erro de I/O temporário (452 Insufficient system storage)'],
      ['A memória RAM não armazena caixas de correio permanentes.',
       'O sistema nunca deleta dados de usuários arbitrariamente sem intervenção humana.',
       'Correto! O MTA suspende o recebimento para proteger a integridade dos bancos de dados e evitar corrupção de mensagens.'],
      'Quando o almoxarifado lota até o teto, o estoquista fecha o portão e diz para o caminhoneiro esperar lá fora.'
    )
  ],
  decisionPrompt:'Durante a instalação do módulo de correio, qual política de armazenamento adotar para o volume de dados?',
  decisions:[
    {id:'default-root',label:'Instalar na partição raiz de 20 GB sem monitoramento de disco',correct:false,consequence:'Risco operacional crítico: o acúmulo de anexos travará todo o sistema operacional do host.'},
    {id:'dedicated-volume',label:'Alocar volume dedicado e isolado para /var/vmail com monitoramento de quota',correct:true,consequence:'Excelente decisão de engenharia! Isola o sistema operacional e garante expansão sem parada de serviço.'},
    {id:'tmp-storage',label:'Direcionar caixas de correio para a pasta temporária /tmp',correct:false,consequence:'Desastre completo: todo o correio corporativo seria apagado no próximo reinício do servidor.'}
  ],
  procedure:[
    'Auditar a capacidade de disco disponível garantindo espaço dedicado para o armazenamento Maildir.',
    'Acessar o Software Center do NethServer 8 e localizar a aplicação oficial Mail Server.',
    'Provisionar a instância mail1 configurando o FQDN principal e vinculando ao domínio corporativo.',
    'Acompanhar a inicialização dos containers Postfix, Dovecot e Rspamd via logs do sistema.',
    'Validar a saúde do serviço com app-status mail1 e testar a escuta dos daemons de correio.'
  ],
  validation:'Evidência: operador e nó confirmados, plano lido, catálogo auditado, instância mail1 instalada com sucesso e status running confirmado nos containers.',
  challenge:'Explique ao Sênior por que o NethServer 8 isola o Postfix e o Dovecot em containers e qual o impacto de configurar o FQDN de HELO corretamente.',
  diaryPlaceholder:'Instância mail1 implantada com sucesso; FQDN mail.aurora.lab; Postfix e Dovecot running; volume dedicado para caixas validado...',
  closing:'Parabéns! O serviço de correio mail1 está ativo no nó. Na próxima aula, você vai criar as primeiras caixas postais corporativas e configurar aliases de departamento.',
  sources:[['Instalação do Módulo Mail no NS8',docs+'applications/mail/#installation'],['Guia de Arquitetura de Containers NS8',docs+'architecture/containers/']]
};
