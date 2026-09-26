const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';
export const mission28={
 id:28,xp:410,level:'Nextcloud e identidade · 60-75 min',title:'Quem entra no Nextcloud piloto?',
 summary:'Integre o piloto ao domínio e valide acesso de usuários permitidos e negados.',
 call:'CH-NS8-028 · nextcloud1 está running. A Aurora quer liberar o piloto para financeiro e diretoria. O chamado autoriza configurar o público do app e testar Ana, Mariana e Bruno.',
 impact:'Aplicação funcionando com login amplo demais vira vazamento. Aplicação funcionando sem usuários certos vira vitrine vazia.',
 senior:'O Júnior celebrou a tela de login. O Sênior perguntou: “Quem entra?” A pergunta parecia simples, mas definia o risco. Na Aurora fictícia, o aceite só começou quando Ana e Mariana entraram e Bruno ficou fora.',
 concept:'Integração de identidade conecta aplicação a usuários e grupos existentes. O teste precisa incluir usuário permitido e usuário negado. Nesta aula, financeiro e diretoria entram; suporte não entra. A configuração é educativa e não expõe senhas.',
 example:'Você lê cat nextcloud-identidade.txt, consulta app-auth-status nextcloud1 e grupos. No painel, define financeiro+diretoria. Depois roda login-test ana cloud, login-test mariana cloud e login-test bruno cloud.',
 glossary:[['Público do app','Grupos autorizados a usar a aplicação','Quem recebe a chave da sala.'],['Login permitido','Usuário autorizado entra','Chave correta abre.'],['Login negado','Usuário fora do escopo bloqueado','Porta nega quem deve negar.'],['Integração','Uso de identidade central','Um cadastro alimenta vários serviços.']],
 recall:{question:'Por que testar Bruno se ele não deve usar o piloto?',answer:'Porque o teste negativo prova que a restrição funciona. Só testar usuários permitidos não comprova controle de acesso.'},
 labIntro:'Onde executar: terminal e painel educativo de identidade do app.',
 labSteps:['Execute whoami, hostname, cat nextcloud-identidade.txt, app-auth-status nextcloud1, group-list financeiro e group-list diretoria.', 'No painel, configure público financeiro+diretoria.', 'Execute login-test ana cloud, login-test mariana cloud e login-test bruno cloud.', 'Valide a identidade do piloto.'],
 objectives:[['identity','Confirmar operador'],['host','Confirmar nó'],['cloudIdentityPlan','Ler plano'],['cloudAuthStatus','Consultar auth do app'],['financeGroup','Conferir financeiro'],['boardGroup','Conferir diretoria'],['cloudAudienceSet','Configurar público'],['anaCloudLogin','Testar Ana'],['marianaCloudLogin','Testar Mariana'],['brunoCloudDenied','Testar Bruno negado'],['cloudIdentityVerified','Validar identidade']],
 hints:['O público correto é financeiro+diretoria.', 'Bruno precisa ser negado.', 'Não use todos os usuários para facilitar.'],
 testking:[q('n28-negative','Negado','Por que Bruno entra no teste?',2,['Para liberar suporte','Para testar disco','Para provar restrição'],['Não é o escopo.','Disco já foi tratado.','Negação esperada faz parte da segurança.'],'Porta boa também nega.'),q('n28-groups','Grupos','Quem deve entrar no piloto?',0,['Financeiro e diretoria','Todos os usuários','Somente admins'],['É o público aprovado.','Amplo demais.','Não atende usuários do piloto.'],'Convidados certos, sala certa.'),q('n28-sso','Integração','Qual benefício da identidade central?',1,['Criar senhas soltas','Usar grupos e usuários existentes','Desativar logs'],['Senha solta cria silo.','Esse é o ganho principal.','Logs continuam necessários.'],'Um crachá para serviços autorizados.')],
 decisionPrompt:'Como liberar o piloto?',
 decisions:[{id:'all',label:'Liberar todos para evitar chamado',correct:false,consequence:'Você amplia acesso sem necessidade.'},{id:'groups',label:'Liberar financeiro+diretoria e testar Bruno negado',correct:true,consequence:'Acesso ficou controlado e provado.'},{id:'admin',label:'Liberar só admin',correct:false,consequence:'Usuários do piloto não testam a aplicação.'}],
 procedure:['Defina grupos autorizados.', 'Configure app para usar identidade central conforme suporte.', 'Teste usuários permitidos e negados.', 'Registre evidências sem expor senhas.', 'Revise grupos antes de expandir piloto.'],
 validation:'Evidência: plano lido, auth do app consultado, grupos conferidos, público configurado, Ana/Mariana entram e Bruno é negado. Retorno: limpar público invalida os testes.',
 challenge:'Escreva por que o teste negativo protege a entrega do piloto.',
 diaryPlaceholder:'Nextcloud público financeiro+diretoria; Ana OK; Mariana OK; Bruno negado...',
 closing:'O piloto autentica quem deve. Agora falta publicar o nome da aplicação com rota e TLS coerentes.',
 sources:[['Nextcloud',docs+'applications/nextcloud'],['Domínios de usuários',docs+'installation/user_domains']]
};
