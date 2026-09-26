const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';
export const mission29={
 id:29,xp:420,level:'Publicação web · 60-75 min',title:'Nome, rota e TLS contam a mesma história?',
 summary:'Publique o Nextcloud piloto no FQDN aprovado e valide DNS, rota HTTP e certificado de laboratório.',
 call:'CH-NS8-029 · Usuários devem acessar o piloto em https://cloud.lab.example/. O chamado autoriza corrigir DNS/rota da aplicação e validar HTTPS de laboratório.',
 impact:'Aplicação instalada e autenticando ainda pode falhar para o usuário se o nome aponta para lugar errado ou TLS não combina com o FQDN.',
 senior:'O Júnior abriu o app pelo painel interno. O Sênior pediu o endereço do usuário. DNS, rota e certificado estavam em três histórias diferentes. “Usuário não acessa intenção; acessa nome publicado.” Na Aurora fictícia, a entrega só avançou quando cloud.lab.example respondeu certo.',
 concept:'Publicação web junta DNS, rota HTTP/reverse proxy e TLS. DNS leva ao nó; rota entrega a requisição à instância; TLS protege e identifica o nome. Em laboratório, a CA é simulada. Em produção, cadeia, renovação e FQDN público precisam ser validados.',
 example:'Você lê cat publicacao-cloud.txt, roda dig +short cloud.lab.example, route-status cloud.lab.example e cert-status cloud.lab.example. No painel, aplica rota para nextcloud1 e valida curl -I.',
 glossary:[['Rota','Encaminhamento do FQDN para instância','Recepção manda para sala certa.'],['TLS','Proteção e identidade do nome','Crachá criptográfico.'],['Certificado','Prova do FQDN','Documento do endereço.'],['Reverse proxy','Frente HTTP que encaminha requisições','Portaria web.']],
 recall:{question:'DNS correto basta?',answer:'Não. DNS só leva ao servidor. Ainda é preciso validar rota para nextcloud1 e TLS coerente com cloud.lab.example.'},
 labIntro:'Onde executar: terminal e painel educativo de publicação de rotas e certificados HTTPS.',
 labSteps:['Execute whoami, hostname, cat publicacao-cloud.txt, dig +short cloud.lab.example, route-status cloud.lab.example e cert-status cloud.lab.example.', 'No painel, aplique rota cloud.lab.example para nextcloud1.', 'Execute route-status cloud.lab.example e curl -I https://cloud.lab.example/.', 'Valide publicação.'],
 objectives:[['identity','Confirmar operador'],['host','Confirmar nó'],['cloudPublishPlan','Ler plano'],['cloudDns','Consultar DNS'],['cloudRouteBefore','Ver rota antes'],['cloudCert','Ver certificado'],['cloudRouteSet','Aplicar rota'],['cloudRouteAfter','Ver rota depois'],['cloudHttp','Testar HTTPS'],['cloudPublishVerified','Validar publicação']],
 hints:['DNS inicial já aponta para o nó; rota ainda aponta para oldapp.', 'O alvo correto é nextcloud1.', 'Repita route-status e curl depois da alteração.'],
 testking:[q('n29-dns','DNS','DNS correto prova qual parte?',1,['Login funcionando','Nome chega ao endereço esperado','Backup configurado'],['Login é outro teste.','Esse é o alcance do DNS.','Backup é outro tema.'],'Chegar ao prédio não acha a sala.'),q('n29-route','Rota','cloud.lab.example aponta para oldapp. O que fazer?',0,['Aplicar rota para nextcloud1 e retestar','Resetar senha dos usuários','Criar outro domínio'],['Corrige a camada comprovada.','Senha não corrige rota.','Outro domínio foge do plano.'],'Recepção manda para sala certa.'),q('n29-tls','TLS','Em produção, o que não pode faltar?',2,['Ignorar certificado','Usar HTTP puro','Validar cadeia, nome e renovação'],['Ignorar enfraquece segurança.','HTTP puro expõe tráfego.','TLS precisa ser operado.'],'Crachá válido e renovado.')],
 decisionPrompt:'Como publicar o piloto?',
 decisions:[{id:'ip',label:'Mandar acessar pelo IP',correct:false,consequence:'Você ignora FQDN e TLS.'},{id:'route',label:'Alinhar DNS, rota para nextcloud1 e HTTPS',correct:true,consequence:'O acesso do usuário fica coerente.'},{id:'password',label:'Trocar senha dos usuários',correct:false,consequence:'O problema é publicação, não credencial.'}],
 procedure:['Valide DNS do FQDN.', 'Confira rota atual e certificado.', 'Aplique rota para a instância correta.', 'Teste HTTPS e nome.', 'Registre limites de laboratório e pendências de produção.'],
 validation:'Evidência: plano lido, DNS/cert/rota antes consultados, rota corrigida, route-status e curl HTTPS OK. Retorno: restaurar oldapp invalida publicação.',
 challenge:'Explique a diferença entre DNS, rota e TLS usando cloud.lab.example.',
 diaryPlaceholder:'cloud.lab.example -> .10; rota oldapp -> nextcloud1; TLS lab OK; HTTPS 200...',
 closing:'O piloto tem nome publicado. Agora falta fechar aceite funcional com upload, login e backup.',
 sources:[['Nextcloud',docs+'applications/nextcloud'],['Requisitos DNS/TLS',docs+'installation/system_requirements']]
};
