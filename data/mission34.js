const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission34={
  id:34,xp:460,level:'Entregabilidade e Segurança · 60-75 min',title:'Reputação e entregabilidade: SPF, DKIM e DMARC',
  summary:'Configure e valide o triângulo de autenticação de e-mail (SPF, DKIM e DMARC) com DNS reverso para garantir a entrega sem cair na caixa de spam.',
  call:'CH-NS8-034 · Os primeiros e-mails de teste enviados para servidores externos (como Gmail e Outlook.com) estão sendo descartados silenciosamente ou caindo no lixo eletrônico. A auditoria apontou ausência de registro SPF, falta de assinatura criptográfica DKIM no Postfix/Rspamd e política DMARC inexistente. Você deve gerar as chaves e publicar os registros DNS.',
  impact:'Servidores de correio na Internet moderna rejeitam sumariamente conexões vindas de servidores que não comprovam sua autenticidade via SPF e DKIM, paralisando a comunicação de vendas e faturamento da empresa.',
  senior:'O Sênior pegou uma folha timbrada da empresa: "Qualquer um na Internet pode forjar um e-mail dizendo que é o presidente da sua empresa. O protocolo SMTP antigo aceitava qualquer mentira. O SPF diz quem tem autorização para despachar; o DKIM é o lacre de cera com o sinete criptográfico que prova que a carta não foi violada no caminho; e o DMARC diz o que o destinatário deve fazer se o lacre estiver rompido. Sem esses três, o seu servidor é tratado como criminoso até que prove o contrário."',
  concept:'A tríade de segurança de e-mail combate o spoofing e phishing: (1) SPF (Sender Policy Framework): registro DNS TXT que lista os IPs autorizados a enviar mensagens pelo domínio; (2) DKIM (DomainKeys Identified Mail): par de chaves assimétricas onde o servidor assina os cabeçalhos com a chave privada e os destinatários conferem com a chave pública no DNS; (3) DMARC: política que orienta os servidores de destino (none, quarantine, reject) sobre como agir se SPF ou DKIM falharem. Além disso, o DNS Reverso (PTR) deve apontar para o FQDN do servidor.',
  example:'No laboratório, você executa cat reputacao-escopo.txt, gera o seletor DKIM no Rspamd do NS8 com dkim-generate-key aurora.lab, confere o registro SPF gerado e valida a conformidade com mail-reputation-audit aurora.lab.',
  glossary:[['SPF','Lista de servidores IP autorizados a disparar e-mails pelo domínio','A lista na portaria com os nomes e placas dos entregadores autorizados.'],['DKIM','Assinatura digital criptográfica anexada ao cabeçalho da mensagem','O carimbo em alto-relevo e o lacre de cera inviolável no envelope.'],['DMARC','Instrução de governança sobre o que fazer com e-mails falsificados','O protocolo de segurança dizendo: "Se o lacre estiver violado, destrua a carta imediatamente".'],['PTR (Reverso)','Registro DNS que mapeia o IP de volta para o FQDN do servidor','A placa do carro oficial conferida pelo radar de trânsito.']],
  recall:{question:'O que acontece se uma mensagem enviada pela empresa passar pelo SPF, mas falhar na assinatura DKIM e a política DMARC estiver configurada como "p=reject"?',answer:'O servidor de e-mail de destino rejeitará a mensagem imediatamente durante o diálogo SMTP, impedindo que ela chegue à caixa postal do destinatário, pois o alinhamento DMARC exige que as assinaturas e identidades estejam em plena conformidade com a política.'},
  labIntro:'Onde executar: terminal e painel educativo de segurança e entregabilidade do NethServer 8.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão de administração.',
    'Execute cat reputacao-escopo.txt para auditar a política recomendada.',
    'Execute dkim-generate-key aurora.lab para gerar o par de chaves e o seletor no Rspamd.',
    'Execute dns-record-apply spf "v=spf1 mx ip4:192.168.50.10 ~all" para registrar o SPF.',
    'Execute dns-record-apply dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@aurora.lab" para aplicar a política.',
    'Execute mail-reputation-audit aurora.lab para validar a tríade SPF, DKIM, DMARC e PTR.',
    'No painel educativo, confirme o status verde de conformidade e homologue a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador'],
    ['host','Confirmar nó'],
    ['readReputationPlan','Ler escopo em reputacao-escopo.txt'],
    ['generateDkimKey','Gerar chave e seletor DKIM'],
    ['applySpfRecord','Publicar registro SPF no DNS'],
    ['applyDmarcRecord','Publicar registro DMARC no DNS'],
    ['auditReputation','Auditar entregabilidade com mail-reputation-audit'],
    ['mailReputationVerified','Homologar reputação e segurança']
  ],
  hints:[
    'Gere a chave criptográfica com dkim-generate-key aurora.lab.',
    'Aplique os registros DNS de SPF e DMARC com as ferramentas dedicadas.',
    'Execute mail-reputation-audit aurora.lab para validar que todos os testes retornam PASS.'
  ],
  testking:[
    q('n34-spf','Estrutura do Registro SPF','O que significa o termo "~all" no final de um registro SPF (ex: v=spf1 mx ~all)?',1,
      ['Que todos os IPs do planeta estão autorizados a enviar mensagens em nome do domínio',
       'SoftFail: servidores não listados devem ser recebidos com suspeita e encaminhados para análise/spam',
       'Que o servidor de e-mail deve reiniciar todas as madrugadas'],
      ['O sinal "~" indica SoftFail, não liberação geral.',
       'Exato! "-all" significa HardFail (rejeição estrita); "~all" indica SoftFail (marcação para filtragem cautelosa).',
       'SPF é uma política de identidade no DNS e não controla o reinício de serviços do Linux.'],
      'É a recomendação da alfândega: "Se a encomenda não vier com a guia correta, coloque na esteira de inspeção detalhada".'
    ),
    q('n34-dkim','Mecanismo do DKIM','Onde fica armazenada a chave pública do DKIM para que os outros servidores possam conferir as mensagens enviadas?',0,
      ['Em um registro TXT publicado na zona de DNS do domínio (ex: seletor._domainkey.dominio.com)',
       'Em um pendrive físico conectado no servidor do destinatário',
       'No arquivo /etc/passwd de todos os usuários do Linux'],
      ['Correto! A chave pública é consultada pelo destinatário via DNS público no subdomínio _domainkey.',
       'A validação é automatizada pela Internet via DNS sem necessidade de mídias físicas.',
       'O arquivo /etc/passwd trata apenas de contas locais do sistema operacional.'],
      'A chave pública é o aviso publicado no diário oficial do município para que qualquer cidadão possa checar a autenticidade da assinatura.'
    ),
    q('n34-dmarc','Governança DMARC','Qual a principal função do protocolo DMARC em relação ao SPF e ao DKIM?',2,
      ['Substituir o SPF e o DKIM tornando ambos obsoletos',
       'Compactar os anexos de e-mail para economizar largura de banda na rede',
       'Unificar SPF e DKIM, estipular ações de contenção (none, quarantine, reject) e gerar relatórios de abusos para os administradores'],
      ['O DMARC não substitui o SPF e o DKIM, ele depende de ambos para operar.',
       'DMARC não altera o corpo da mensagem nem compacta arquivos anexos.',
       'Exato! O DMARC alinha os dois métodos e instrui o mundo sobre como punir tentativas de falsificação do seu domínio.'],
      'O DMARC é o código de normas da segurança que dita as penalidades aplicadas a quem tentar falsificar a sua identidade.'
    )
  ],
  decisionPrompt:'Um operador sugere não configurar o DKIM nem o DMARC porque "apenas o registro SPF é mais fácil de fazer". Qual a sua decisão?',
  decisions:[
    {id:'spf-only',label:'Aceitar e configurar apenas SPF para economizar tempo',correct:false,consequence:'Risco crítico: servidores como Google e Yahoo rejeitarão mensagens em massa devido às exigências modernas de autenticação de 2024.'},
    {id:'full-triad',label:'Implementar o conjunto completo: SPF, DKIM assinado e política DMARC',correct:true,consequence:'Padrão corporativo ouro! Garante máxima reputação, entregabilidade nas caixas de entrada e relatórios de proteção.'},
    {id:'disable-dns',label:'Remover todos os registros de DNS para evitar erros',correct:false,consequence:'Colapso imediato: o domínio se tornará invisível e nenhum e-mail entrará ou sairá.'}
  ],
  procedure:[
    'Auditar a zona de DNS do domínio corporativo verificando registros existentes.',
    'Gerar o par de chaves criptográficas DKIM de 2048 bits na instância de e-mail do NS8.',
    'Publicar a chave pública no DNS no registro TXT com o seletor apropriado.',
    'Configurar o registro SPF autorizando estritamente o endereço IP público de saída do servidor.',
    'Publicar a política DMARC inicial com envio de relatórios agregados (RUA) para monitoramento.',
    'Executar a ferramenta de auditoria de entregabilidade confirmando o alinhamento total dos registros.'
  ],
  validation:'Evidência: operador e nó confirmados, plano lido, chave DKIM gerada, registros SPF e DMARC aplicados, auditoria com status PASS e homologação no painel.',
  challenge:'Descreva detalhadamente como o SPF, o DKIM e o DMARC trabalham juntos para impedir que criminosos enviem e-mails fingindo ser o departamento financeiro da Aurora.',
  diaryPlaceholder:'Chave DKIM gerada no Rspamd; SPF configurado com ip4 autorizado; DMARC com quarantine aplicado; mail-reputation-audit 100% aprovado...',
  closing:'Excelente trabalho! O domínio @aurora.lab agora tem reputação e blindagem criptográfica. Na próxima aula, você enfrentará a revisão integrada resolvendo um incidente real de fila de e-mails.',
  sources:[['Configuração de DKIM e SPF no NS8',docs+'applications/mail/#security-and-anti-spam'],['DMARC Official Specification','https://dmarc.org/overview/']]
};
