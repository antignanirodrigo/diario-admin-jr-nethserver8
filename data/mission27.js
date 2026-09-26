const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';
export const mission27={
 id:27,xp:400,level:'Nextcloud · 60-75 min',title:'Instalar Nextcloud sem pular pré-requisitos',
 summary:'Implante uma instância Nextcloud educativa somente depois de confirmar identidade, armazenamento e publicação planejada.',
 call:'CH-NS8-027 · A seleção do Nextcloud piloto foi aprovada. O chamado autoriza instalar a instância nextcloud1 no laboratório com FQDN cloud.lab.example e público financeiro+diretoria.',
 impact:'Instalar aplicação antes de confirmar dependências gera serviço que abre, mas não autentica, não publica ou não tem caminho de backup.',
 senior:'O Júnior voltou ao botão instalar. O Sênior não barrou a instalação; barrou a pressa. Pediu três provas: identidade, volume e nome. “Agora sim o botão faz sentido.” Na Aurora fictícia, a instalação foi consequência do plano, não substituto dele.',
 concept:'Aplicações NS8 são instâncias administradas. Nextcloud exige parâmetros como FQDN, integração de usuários conforme suporte do módulo, armazenamento e backup. Esta aula simula a criação da instância nextcloud1 e valida estado running, sem prometer integração completa antes dos testes da próxima aula.',
 example:'Você lê cat implantacao-nextcloud.txt, consulta readiness, configura nextcloud1/cloud.lab.example no painel e executa install-nextcloud --simulate. Depois confere app-status nextcloud1.',
 glossary:[['Instância','Aplicação instalada com nome próprio','Uma unidade do serviço.'],['Readiness','Prontidão de dependências','Lista de portas e insumos antes de abrir a loja.'],['FQDN','Nome de acesso da aplicação','Endereço oficial do serviço.'],['Running','Aplicação em execução','Motor ligado, ainda faltam testes funcionais.']],
 recall:{question:'Por que running não conclui a entrega?',answer:'Porque running só mostra processo ativo. Ainda faltam login, publicação, backup e teste funcional da aplicação.'},
 labIntro:'Onde executar: terminal e painel educativo. A instalação é simulada.',
 labSteps:['Execute whoami, hostname, cat implantacao-nextcloud.txt, identity-readiness, storage-readiness e publication-readiness.', 'No painel, configure nextcloud1, FQDN cloud.lab.example e público financeiro+diretoria.', 'Execute install-nextcloud --simulate e app-status nextcloud1.', 'Valide que a instância está running, mas ainda sem entrega final.'],
 objectives:[['identity','Confirmar operador'],['host','Confirmar nó'],['nextcloudPlan','Ler plano'],['identityReady','Conferir identidade'],['storageReady','Conferir armazenamento'],['publicationReady','Conferir publicação'],['nextcloudConfigured','Configurar instância'],['nextcloudInstalled','Instalar simulado'],['nextcloudStatus','Consultar status'],['nextcloudVerified','Validar implantação inicial']],
 hints:['A instância é nextcloud1 e o FQDN é cloud.lab.example.', 'Não instale antes de ler readiness.', 'Running não é igual a entregue.'],
 testking:[q('n27-running','Running','O app-status running prova o quê?',1,['Entrega completa','Processo da instância em execução','Permissões de usuário finais'],['Entrega exige mais testes.','É o alcance dessa evidência.','Permissões são outro teste.'],'Motor ligado não prova viagem concluída.'),q('n27-before','Antes de instalar','Qual sequência é correta?',0,['Readiness, configuração, instalação, status','Instalar e pensar depois','Trocar DNS público primeiro'],['Reduz improviso.','Gera dívida.','DNS sozinho não instala app.'],'Checklist antes do botão.'),q('n27-fqdn','FQDN','Qual nome aprovado?',2,['nextcloud.local aleatório','IP direto','cloud.lab.example'],['Não foi aprovado.','IP não é nome de serviço.','É o FQDN do piloto.'],'Serviço precisa de endereço estável.')],
 decisionPrompt:'Como executar a instalação?',
 decisions:[{id:'rush',label:'Instalar sem readiness',correct:false,consequence:'Você pula dependências essenciais.'},{id:'planned',label:'Configurar nextcloud1 com FQDN aprovado e instalar simulado',correct:true,consequence:'A implantação inicial fica rastreável.'},{id:'ip',label:'Publicar por IP direto',correct:false,consequence:'Você ignora FQDN/TLS.'}],
 procedure:['Revise plano e dependências.', 'Defina nome da instância, FQDN, público e volume.', 'Instale seguindo documentação do módulo.', 'Valide status técnico.', 'Separe status running de aceite funcional.'],
 validation:'Evidência: plano e readiness lidos, instância configurada, instalação simulada, app-status running e validação inicial. Retorno: resetar app remove status e validação.',
 challenge:'Explique por que a aula não declara Nextcloud entregue mesmo com running.',
 diaryPlaceholder:'nextcloud1; cloud.lab.example; readiness OK; install simulated; running; testes pendentes...',
 closing:'Nextcloud está de pé no laboratório. Agora ele precisa provar autenticação e grupos.',
 sources:[['Nextcloud',docs+'applications/nextcloud'],['Software Center',docs+'installation/software_center']]
};
