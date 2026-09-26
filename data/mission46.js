const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission46={
  id:46,xp:450,level:'Avançado · 50-60 min',title:'Catálogo de aplicações: instalação do Roundcube Webmail',
  summary:'Expanda o Software Center do NS8 implantando o Roundcube Webmail como frontend desacoplado do servidor de e-mail.',
  call:'CH-NS8-046 · A diretoria e os gerentes da Aurora solicitaram acesso imediato ao correio eletrônico corporativo via navegador web para evitar a necessidade de configurar clientes pesados como Outlook ou Thunderbird em laptops domésticos. O Júnior deve instalar a aplicação Roundcube Webmail a partir do catálogo oficial do NethServer 8, apontando o backend IMAP/SMTP para a instância mail1 já existente e publicando a rota segura webmail.aurora.lab.',
  impact:'Disponibilizar uma interface webmail corporativa segura e moderna reduz drasticamente o volume de chamados de suporte para configuração de clientes desktop, além de assegurar que os colaboradores acessem seus e-mails institucionais sob TLS sem expor senhas em texto puro.',
  senior:'O Sênior sentou-se ao lado do Júnior e sorriu: "No NethServer 7 do passado, o webmail vinha grudado no mesmo monólito do Postfix e Dovecot. Se o Apache do webmail caísse, tudo parava. No NS8, a arquitetura é linda porque é desacoplada: o Mail Server (mail1) roda em seus próprios containers e o Roundcube roda em uma instância independente de frontend. Se você precisar atualizar o Roundcube ou trocar de webmail amanhã, o serviço de envio e recebimento de e-mails nem percebe. Vamos publicar esse frontend agora."',
  concept:'A arquitetura de catálogo de aplicações (Software Center) do NethServer 8 gerencia instâncias modulares conteinerizadas via Podman. O Roundcube Webmail opera como um cliente web HTTP/HTTPS (PHP 8.2 + Nginx) que se comunica internamente através da rede virtual do cluster com os daemons Dovecot (IMAP porta 993) e Postfix (SMTP Submission porta 587) da instância mail1. A publicação externa é delegada automaticamente ao proxy reverso Traefik com terminação TLS e redirecionamento HTTPS obrigatório.',
  example:'No laboratório, você inspeciona o plano em cat roundcube-plano.txt, busca a aplicação com app-catalog-search roundcube, instala a instância com app-install roundcube --instance roundcube1, verifica o status com app-status roundcube1 e valida o endpoint web com curl -I https://webmail.aurora.lab/.',
  glossary:[['Roundcube','Webmail open-source moderno baseado em PHP e AJAX','A agência dos correios com balcão de atendimento e caixas de correspondência no navegador.'],['Desacoplamento','Separação arquitetural entre a interface web e os serviços de backend','O balcão de atendimento da lanchonete separado da cozinha onde os pratos são preparados.'],['IMAP over TLS','Protocolo de leitura de mensagens cifrado na porta 993','Um mensageiro que transporta sua correspondência lacrada dentro de uma maleta blindada.'],['MUA Web','Mail User Agent que opera inteiramente dentro de um browser','Um leitor de cartas que funciona na nuvem sem precisar instalar nada no computador local.']],
  recall:{question:'Por que no NethServer 8 a instalação do Roundcube Webmail é separada da instalação do Mail Server principal?',answer:'Porque o NS8 adota uma arquitetura conteinerizada desacoplada: o Mail Server (mail1) cuida de MTA/IMAP com alta estabilidade, enquanto o Roundcube roda como aplicação frontend independente, permitindo atualizações de interface sem impactar a recepção de e-mails.'},
  labIntro:'Onde executar: console de operações e catálogo de aplicações do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador e o nó.',
    'Execute cat roundcube-plano.txt para ler os parâmetros da instância roundcube1.',
    'Execute app-catalog-search roundcube para localizar o pacote no repositório oficial.',
    'Execute app-install roundcube --instance roundcube1 para provisionar o container.',
    'Execute app-status roundcube1 para verificar a saúde da instância e conexão IMAP.',
    'Execute curl -I https://webmail.aurora.lab/ para auditar o cabeçalho HTTP 200.',
    'No painel educativo, confirme os parâmetros de backend mail1 e FQDN webmail.aurora.lab e homologue a instalação.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readPlan','Ler plano em roundcube-plano.txt'],
    ['searchCatalog','Buscar pacote com app-catalog-search roundcube'],
    ['installRoundcube','Instalar instância com app-install roundcube'],
    ['checkAppStatus','Verificar status com app-status roundcube1'],
    ['verifyWebmailHttp','Auditar resposta web com curl em webmail.aurora.lab'],
    ['validateRoundcube','Homologar Roundcube Webmail no painel educativo']
  ],
  hints:[
    'Execute app-catalog-search roundcube para verificar a disponibilidade da imagem oficial.',
    'Utilize app-install roundcube --instance roundcube1 para iniciar o container do webmail.',
    'Acesse https://webmail.aurora.lab via curl para validar a terminação Traefik.'
  ],
  testking:[
    q('n46-arch','Desacoplamento de Aplicações','Qual é a principal vantagem arquitetural de rodar o Roundcube em um container separado do Mail Server no NS8?',1,
      ['Consumir o dobro de memória RAM para impressionar os diretores',
       'Permitir atualizações e manutenções na interface web sem interromper a recepção e envio de e-mails do Postfix/Dovecot',
       'Eliminar a necessidade de certificados TLS no servidor web'],
      ['O objetivo arquitetural é a resiliência e modularidade, não o desperdício de memória.',
       'Correto! O desacoplamento isola falhas e atualizações: o core de e-mails continua ativo mesmo se o webmail reiniciar.',
       'Certificados TLS continuam obrigatórios para garantir a confidencialidade do tráfego web.'],
      'É poder reformar a recepção da clínica médica sem precisar fechar o centro cirúrgico.'
    ),
    q('n46-conn','Comunicação Backend','Como a instância roundcube1 se comunica com o servidor de correio da organização?',0,
      ['Através da rede interna do Podman conectando-se a mail1 nas portas 993 (IMAPS) e 587 (Submission)',
       'Gravando arquivos de texto diretamente na pasta /tmp do host Rocky Linux',
       'Enviando sinais de fumaça digitais pela interface de rede sem criptografia'],
      ['Exato! O Roundcube atua como um cliente padrão de e-mail (MUA), conectando-se aos daemons autenticados.',
       'Containers rootless não devem compartilhar pastas inseguras em /tmp para troca de mensagens.',
       'A comunicação é padronizada via protocolos RFC seguros (IMAPS e SMTP Submission).'],
      'É o caixa do banco consultando o cofre central através do ramal telefônico seguro.'
    ),
    q('n46-pub','Publicação no Traefik','Quem realiza a publicação externa e a terminação HTTPS para webmail.aurora.lab no NS8?',2,
      ['O Apache instalado manualmente fora dos containers no Rocky Linux',
       'O firewall físico de outro departamento',
       'O proxy reverso Traefik nativo do cluster NS8, roteando as requisições para o container do Roundcube'],
      ['O NS8 gerencia o roteamento via Traefik; não se instala Apache solto no sistema operacional base.',
       'O firewall de borda apenas encaminha o tráfego da WAN para o Traefik.',
       'Correto! O Traefik intercepta a porta 443, valida o certificado TLS e repassa as requisições HTTP para a porta do container.'],
      'É a recepcionista do edifício que recebe os visitantes na entrada e os encaminha para a sala correta.'
    )
  ],
  decisionPrompt:'Após a homologação do Roundcube, o gerente de operações pergunta se é seguro desativar o acesso direto IMAP na WAN e manter apenas o Roundcube publicado externamente para os colaboradores comuns. Qual é a recomendação correta?',
  decisions:[
    {id:'open-all-ports',label:'Abrir todas as portas IMAP e POP3 na WAN sem qualquer restrição',correct:false,consequence:'Exposição desnecessária: clientes desktop na WAN atacados por força bruta aumentam a superfície de risco.'},
    {id:'webmail-only-wan',label:'Manter apenas o Webmail (porta 443 via Traefik) na WAN e restringir IMAP direto para a VPN/LAN',correct:true,consequence:'Excelente decisão de segurança! Reduz a exposição a ataques de força bruta contra o Dovecot e centraliza o acesso web seguro com MFA.'},
    {id:'block-webmail',label:'Bloquear o Webmail para economizar largura de banda do datacenter',correct:false,consequence:'Decisão retrógrada que quebra o requisito de negócio e a produtividade da equipe em home office.'}
  ],
  procedure:[
    'Localize o módulo Roundcube Webmail no Software Center do NethServer 8.',
    'Configure a instância com backend apontando para o serviço mail1 local.',
    'Defina o FQDN público webmail.aurora.lab e habilite a terminação TLS no Traefik.',
    'Inicie o container e monitore os logs de inicialização do PHP-FPM e Nginx.',
    'Valide a conectividade IMAP autenticando com uma conta corporativa de teste.',
    'Documente o endereço de acesso oficial no portal de suporte ao usuário.'
  ],
  validation:'Evidência: instância roundcube1 instalada, conectada com sucesso ao backend mail1:993, rota webmail.aurora.lab respondendo com HTTP 200 TLS no Traefik e homologação concluída no painel educativo.',
  challenge:'Documente os parâmetros da instância roundcube1, teste a conexão IMAP interna e confirme a publicação do FQDN webmail.aurora.lab.',
  diaryPlaceholder:'Instância roundcube1 provisionada; backend mail1:993/587 validado; FQDN webmail.aurora.lab ativo no Traefik com TLS...',
  closing:'Excelente trabalho! O Roundcube Webmail está homologado e integrado ao Mail Server. Na Aula 47, você implantará o chat corporativo Mattermost integrado ao Samba AD!',
  sources:[['Roundcube in NS8',docs+'administrator-manual/applications/roundcube/'],['Software Center Catalog',docs+'administrator-manual/software_center/']]
};
