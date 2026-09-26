const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission31={
  id:31,xp:440,level:'Correio eletrônico · 60-75 min',title:'Fluxo de e-mail: SMTP, IMAP, MX e portas',
  summary:'Compreenda a separação entre transmissão MTA e entrega aos clientes MUA e audite as portas essenciais.',
  call:'CH-NS8-031 · A diretoria da Aurora quer implantar o servidor de e-mail próprio no NS8 (@aurora.lab). O Júnior foi encarregado de auditar o fluxo antes da instalação: verificar o registro MX no DNS, testar se as portas de submissão (587), entrega MTA (25) e sincronização IMAP (993) estão mapeadas.',
  impact:'Confundir porta 25 com 587 ou não planejar o registro MX impede a recepção de mensagens externas e causa bloqueio imediato por provedores que filtram portas não autenticadas.',
  senior:'O Sênior desenhou três caixas na lousa de vidro: "Um carteiro que viaja de cidade em cidade (SMTP porta 25) não é a mesma pessoa que entrega a correspondência na sua mão (IMAP porta 993). Antes de subir o módulo de e-mail no NS8, você precisa saber exatamente por onde as cartas entram, onde ficam guardadas e como o aplicativo do usuário conversa com a portaria."',
  concept:'O ecossistema de e-mail corporativo é composto por agentes distintos: o MUA (Mail User Agent como Thunderbird ou Outlook), o MTA (Mail Transfer Agent como Postfix, que usa SMTP para envio) e o MDA/IMAP (como Dovecot, que armazena e sincroniza mensagens). O registro DNS MX (Mail Exchanger) aponta qual servidor recebe mensagens para o domínio. A porta 587 é reservada para submissão autenticada com TLS, enquanto a porta 25 é usada exclusivamente na troca entre servidores na Internet.',
  example:'No laboratório, você consulta o registro MX com dig +short MX aurora.lab, verifica a resolução do FQDN mail.aurora.lab e simula a conectividade nas portas 25, 587 e 993 usando nc e mail-flow-test.',
  glossary:[['MTA','Agente de transporte de correio (Postfix)','O caminhão de entrega interestadual dos correios.'],['MUA','Cliente de e-mail do usuário (Outlook/Thunderbird)','A caixa de correio fixada na porta da sua casa.'],['MX','Registro DNS que aponta o servidor de correio','O CEP e endereço oficial do centro de distribuição.'],['IMAP','Protocolo de sincronização de caixas de correio','O cofre seguro onde as cartas ficam salvas enquanto você lê no celular ou computador.']],
  recall:{question:'Qual é a diferença fundamental de função entre a porta TCP 25 e a porta TCP 587 no envio de e-mails?',answer:'A porta 25 é utilizada para comunicação MTA-to-MTA (troca direta de mensagens entre servidores na Internet, frequentemente bloqueada para clientes residenciais). A porta 587 é destinada à submissão autenticada com STARTTLS de clientes locais (MUA) para o seu próprio servidor de saída.'},
  labIntro:'Onde executar: terminal e painel educativo de arquitetura de correio eletrônico.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de gerência.',
    'Execute cat fluxo-email.txt para ler o escopo de portas e protocolos aprovados.',
    'Execute dig +short MX aurora.lab para validar o apontamento de recebimento.',
    'Execute mail-flow-test aurora.lab para auditar a conectividade das portas 25, 587 e 993.',
    'No painel educativo, selecione a matriz de portas aprovada e valide a entrega técnica.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readFlowPlan','Ler escopo em fluxo-email.txt'],
    ['checkMxRecord','Auditar registro MX com dig'],
    ['testMailPorts','Testar portas com mail-flow-test'],
    ['validateFlowPlan','Validar matriz de arquitetura no painel']
  ],
  hints:[
    'O comando dig +short MX aurora.lab deve retornar o host de e-mail com prioridade 10.',
    'Utilize mail-flow-test aurora.lab para validar portas e certificados.',
    'No painel educativo, rejeite a opção de usar porta 25 para clientes e aprove a submissão via 587 com TLS.'
  ],
  testking:[
    q('n31-mx','Registro MX','Para que serve o registro DNS do tipo MX?',1,
      ['Para definir o endereço IP da interface de gerenciamento web do cluster',
       'Para indicar aos servidores da Internet qual máquina recebe e-mails daquele domínio',
       'Para criptografar as senhas das caixas postais dos usuários'],
      ['O registro MX trata exclusivamente do roteamento de e-mails, não de HTTP.',
       'Correto! O registro MX (Mail Exchanger) é a placa de sinalização global para onde enviar mensagens destinadas a @dominio.',
       'Criptografia de senhas é atribuição de certificados TLS e hashing no banco de dados.'],
      'É o endereço escrito no envelope que indica em qual agência central a encomenda deve pousar.'
    ),
    q('n31-ports','Portas de Envio','Por que os clientes de e-mail (Outlook/Thunderbird) devem usar a porta 587 em vez da 25?',0,
      ['Porque a porta 587 exige autenticação e criptografia STARTTLS, evitando relays abertos e bloqueios de provedores',
       'Porque a porta 25 foi descontinuada pela IANA e não existe mais em servidores modernos',
       'Porque a porta 587 aumenta a velocidade de download das mensagens em até dez vezes'],
      ['Exato! Provedores bloqueiam a porta 25 na saída residencial/empresarial para conter spams; a 587 requer login e TLS.',
       'A porta 25 continua sendo o padrão obrigatório para entrega entre servidores de correio na Internet.',
       'A porta não altera a largura de banda da conexão de rede.'],
      'A porta 587 é a entrada vip com crachá e revista, enquanto a 25 é a doca de carga pesada de carretas.'
    ),
    q('n31-imap','Protocolos de Leitura','Qual a vantagem do protocolo IMAP (porta 993) sobre o protocolo POP3 legado?',2,
      ['O IMAP apaga todas as mensagens do servidor assim que você as lê no computador',
       'O IMAP permite enviar mensagens sem precisar de servidor SMTP',
       'O IMAP sincroniza o estado das mensagens e pastas em tempo real entre múltiplos dispositivos'],
      ['Apagar mensagens locais ao baixar é o comportamento característico do POP3 clássico.',
       'O IMAP é estritamente um protocolo de leitura/gerência de caixas, necessitando do SMTP para envios.',
       'Correto! Com IMAP, se você marcar como lida ou mover uma mensagem no celular, ela reflete no desktop e webmail.'],
      'O IMAP é como deixar seus documentos num cofre em nuvem acessível de qualquer lugar; POP3 é rasgar a via original e levar no bolso.'
    )
  ],
  decisionPrompt:'Um colaborador propõe configurar os clientes Outlook para enviar e-mails diretamente pela porta 25 sem autenticação para "evitar erros de senha". Qual a sua decisão?',
  decisions:[
    {id:'allow-25',label:'Aceitar e liberar porta 25 sem autenticação para simplificar',correct:false,consequence:'Grave falha de segurança: seu servidor virará um relay aberto de spam e entrará em blacklists globais em minutos.'},
    {id:'force-587',label:'Exigir porta 587 com STARTTLS e autenticação obrigatória de usuário',correct:true,consequence:'Decisão de excelência! Garante rastreabilidade, protege credenciais e evita bloqueio do IP da empresa.'},
    {id:'disable-mail',label:'Desistir do servidor de e-mail e usar chat apenas',correct:false,consequence:'Não resolve a necessidade corporativa de comunicação formal homologada.'}
  ],
  procedure:[
    'Auditar a configuração do DNS externo garantindo o apontamento do registro MX com prioridade correta.',
    'Verificar se as portas de recebimento (TCP 25) e submissão (TCP 587) estão com tráfego liberado no firewall.',
    'Garantir certificado TLS válido cobrindo o FQDN mail.dominio.com para evitar alertas de segurança.',
    'Exigir autenticação obrigatória (SASL) para qualquer submissão de mensagens na porta 587.',
    'Validar a sincronização segura de caixas através do protocolo IMAP sobre TLS (porta 993).'
  ],
  validation:'Evidência: operador e nó confirmados, fluxo-email.txt lido, registro MX conferido, portas auditadas e matriz de arquitetura validada no painel educativo.',
  challenge:'Registre no diário de bordo a função do registro MX, a diferença de papéis entre as portas 25 e 587 e a importância de exigir TLS na submissão de mensagens.',
  diaryPlaceholder:'Registro MX mail.aurora.lab prioridade 10; porta 25 para tráfego MTA-to-MTA; porta 587 para submissão autenticada MUA com STARTTLS; IMAP 993 seguro...',
  closing:'Você validou a fundação de rede e protocolos do correio eletrônico. Na próxima aula, você vai implantar o módulo de e-mail no NethServer 8 a partir do Software Center.',
  sources:[['NethServer Mail Documentation',docs+'applications/mail/'],['RFC 5321 - SMTP Protocol','https://datatracker.ietf.org/doc/html/rfc5321']]
};
