const ok=output=>({output,error:false});
const fail=output=>({output,error:true});
const flag=(sim,name)=>{sim.flags[name]=true;};
export const fileCommands={
 19:['cat join-plano.txt','client-dns-check','client-time-check','domain-discover aurora.lab','join-status win10-lab'],
 20:['cat incidente-auth.txt','client-dns-check','time-check','user-status bruno','auth-log bruno','domain-discover aurora.lab','login-test bruno'],
 21:['cat armazenamento-plano.txt','disk-usage','volume-list','user-domain-status','samba-capacity'],
 22:['cat compartilhamento-pedido.txt','samba-status','group-list financeiro','share-list','share-status financeiro','access-test ana financeiro','access-test bruno financeiro'],
 23:['cat matriz-acesso.txt','group-list financeiro','group-list diretoria','acl-status financeiro'],
 24:['cat acesso-negado.txt','acl-status financeiro','user-groups ana','user-groups carla','access-test carla financeiro'],
 25:['cat entrega-arquivos.txt','share-list','access-test ana financeiro','access-test carla financeiro','access-test bruno financeiro','backup-plan-check','restore-drill --simulate'],
 26:['cat selecao-app.txt','app-catalog','identity-readiness','storage-readiness','publication-readiness'],
 27:['cat implantacao-nextcloud.txt','identity-readiness','storage-readiness','publication-readiness','install-nextcloud --simulate','app-status nextcloud1'],
 28:['cat nextcloud-identidade.txt','app-auth-status nextcloud1','group-list financeiro','group-list diretoria','login-test ana cloud','login-test mariana cloud','login-test bruno cloud'],
 29:['cat publicacao-cloud.txt','dig +short cloud.lab.example','route-status cloud.lab.example','cert-status cloud.lab.example','curl -I https://cloud.lab.example/'],
 30:['cat entrega-nextcloud.txt','app-status nextcloud1','login-test ana cloud','login-test mariana cloud','login-test bruno cloud','upload-test ana cloud','share-test ana mariana cloud','nextcloud-backup-plan']
};
export function initFiles(sim){
 if(sim.id===19) {sim.hostname='win10-lab';sim.lab.join={domain:'aurora.lab',client:'win10-lab',joined:false};}
 if(sim.id===20) {sim.hostname='win10-lab';sim.lab.auth={dns:'wrong',fixed:false};}
 if(sim.id===21) sim.lab.storage={volume:'',owner:'',growth:''};
 if(sim.id===22) sim.lab.share={name:'financeiro',group:'financeiro',permission:'',created:false};
 if(sim.id===23) sim.lab.acl={financeiro:'',diretoria:'',suporte:''};
 if(sim.id===24) sim.lab.carla={fixed:false};
 if(sim.id===25) sim.lab.fileHandoff={checklist:false};
 if(sim.id===26) sim.lab.appSelection={app:'',audience:'',fqdn:''};
 if(sim.id===27) sim.lab.nextcloud={instance:'nextcloud1',fqdn:'cloud.lab.example',audience:'financeiro-diretoria',configured:false,installed:false};
 if(sim.id===28) sim.lab.cloudIdentity={audience:''};
 if(sim.id===29) sim.lab.cloudPublish={route:'oldapp'};
 if(sim.id===30) sim.lab.cloudHandoff={checklist:false};
}
export function fileCommand(sim,line){
 if(sim.id===19){
  if(line==='cat join-plano.txt'){flag(sim,'joinPlan');return ok('Estacao: win10-lab\nDominio: aurora.lab\nPre-check: DNS, horario e descoberta.\nEscopo: join simulado; login de usuario fica para proxima aula.');}
  if(line==='client-dns-check'){flag(sim,'clientDns');return ok('DNS primario: 192.168.50.10\nSRV lookup: disponivel\nEstado: OK para aurora.lab');}
  if(line==='client-time-check'){flag(sim,'clientTime');return ok('Cliente win10-lab sincronizado com ns8-lab-01; desvio < 1s.');}
  if(line==='domain-discover aurora.lab'){flag(sim,'domainDiscover');return ok('_ldap._tcp.aurora.lab -> ns8-lab-01.aurora.lab:389\n_kerberos._tcp.aurora.lab -> ns8-lab-01.aurora.lab:88');}
  if(line==='join-status win10-lab'){if(!sim.lab.join?.joined)return fail('win10-lab ainda nao ingressou no dominio.');flag(sim,'joinStatus');return ok('win10-lab: joined aurora.lab\ncomputer account: WIN10-LAB$\nlast check: OK');}
 }
 if(sim.id===20){
  if(line==='cat incidente-auth.txt'){flag(sim,'authIncident');return ok('Usuario: bruno\nEstacao: win10-lab\nSintoma: dominio nao encontrado no login.\nPedido do gestor: resetar senha, mas diagnosticar antes.');}
  if(line==='client-dns-check'){if(sim.lab.auth?.dns==='wrong'){flag(sim,'clientDnsBad');return ok('DNS primario: 192.168.50.53\nResultado: nao resolve SRV de aurora.lab para o cliente.');}flag(sim,'clientDnsFixed');return ok('DNS primario: 192.168.50.10\nResultado: SRV de aurora.lab resolvido.');}
  if(line==='time-check'){flag(sim,'timeCheck');return ok('win10-lab e ns8-lab-01 com horario sincronizado; desvio < 1s.');}
  if(line==='user-status bruno'){flag(sim,'userStatus');return ok('bruno: enabled\npassword: valid\nlocked: no\ngroups: suporte');}
  if(line==='auth-log bruno'){flag(sim,'authLog');return ok('Tentativa bruno@win10-lab: domain controller not found by client DNS.\nSem evidencia de senha expirada ou conta bloqueada.');}
  if(line==='domain-discover aurora.lab'){if(sim.lab.auth?.dns!=='fixed')return fail('Falha: cliente ainda usa DNS que nao resolve o dominio.');flag(sim,'domainDiscover');return ok('_ldap._tcp.aurora.lab -> ns8-lab-01.aurora.lab:389');}
  if(line==='login-test bruno'){if(!sim.flags.domainDiscover)return fail('Descubra o dominio depois da correcao antes do login-test.');flag(sim,'loginTest');return ok('Login bruno em win10-lab: OK\nSenha nao foi alterada.');}
 }
 if(sim.id===21){
  if(line==='cat armazenamento-plano.txt'){flag(sim,'storagePlan');return ok('Pedido futuro: compartilhamento FINANCEIRO.\nDono do dado: financeiro.\nCrescimento: moderado.\nNao criar pasta nesta aula.');}
  if(line==='disk-usage'){flag(sim,'diskUsage');return ok('/ 31G usados de 40G\n/srv/disk1 12G usados de 200G\nalerta: nao usar disco do sistema para dados crescentes.');}
  if(line==='volume-list'){flag(sim,'volumeList');return ok('/srv/disk1 200G SSD volume de dados\n/mnt/backup destino backup simulado');}
  if(line==='user-domain-status'){flag(sim,'domainStatus');return ok('aurora.lab: running\nprovider: samba-ad\ngroups: financeiro, suporte');}
  if(line==='samba-capacity'){flag(sim,'sambaCapacity');return ok('Samba file server: planejado\nvolume recomendado: /srv/disk1\nbackup: pendente de politica');}
 }
 if(sim.id===22){
  if(line==='cat compartilhamento-pedido.txt'){flag(sim,'shareRequest');return ok('Criar compartilhamento: financeiro\nDescricao: Documentos Financeiro\nGrupo principal: financeiro\nPermissao: grupo financeiro leitura/escrita; demais sem acesso.');}
  if(line==='samba-status'){flag(sim,'sambaStatus');return ok('samba-file-server: running\nDomain: aurora.lab\nVolume: /srv/disk1');}
  if(line==='group-list financeiro'){flag(sim,'groupList');return ok('financeiro: ana, carla\nsuporte: bruno');}
  if(line==='share-list'){flag(sim,'shareList');return ok(sim.lab.share?.created?'financeiro  group=financeiro  permission=rw-main-only':'nenhum compartilhamento criado');}
  if(line==='share-status financeiro'){if(!sim.lab.share?.created)return fail('Compartilhamento financeiro ainda nao existe.');flag(sim,'shareStatus');return ok('financeiro: available\ngroup: financeiro\npermission: main group read/write; others no access\nguest: disabled');}
  if(line==='access-test ana financeiro'){if(!sim.lab.share?.created)return fail('Crie o compartilhamento antes do teste.');flag(sim,'accessAllowed');return ok('ana -> financeiro: allowed read/write');}
  if(line==='access-test bruno financeiro'){if(!sim.lab.share?.created)return fail('Crie o compartilhamento antes do teste.');flag(sim,'accessDenied');return ok('bruno -> financeiro: denied');}
 }
 if(sim.id===23){
  if(line==='cat matriz-acesso.txt'){flag(sim,'aclMatrix');return ok('Matriz FINANCEIRO:\nfinanceiro: leitura+gravacao\ndiretoria: leitura\nsuporte: sem acesso\nProibido: Everyone RW.');}
  if(line==='group-list financeiro'){flag(sim,'financeGroup');return ok('financeiro: ana, carla');}
  if(line==='group-list diretoria'){flag(sim,'boardGroup');return ok('diretoria: mariana');}
  if(line==='acl-status financeiro'){flag(sim,'aclStatus');return ok('financeiro share ACL atual:\nfinanceiro: RW\nsuporte: none\ndiretoria: nao configurado');}
 }
 if(sim.id===24){
  if(line==='cat acesso-negado.txt'){flag(sim,'denyIncident');return ok('Carla deveria gravar em FINANCEIRO, mas recebe acesso negado.\nAna grava normalmente.\nNao abrir Everyone; investigar grupo e ACL.');}
  if(line==='acl-status financeiro'){flag(sim,'aclStatus');return ok('financeiro: RW\ndiretoria: R\nsuporte: none\nACL conforme matriz.');}
  if(line==='user-groups ana'){flag(sim,'anaGroups');return ok('ana: financeiro, domain users');}
  if(line==='user-groups carla'){if(sim.lab.carla?.fixed){flag(sim,'carlaGroupsAfter');return ok('carla: financeiro, domain users');}flag(sim,'carlaGroupsBefore');return ok('carla: domain users');}
  if(line==='access-test carla financeiro'){if(!sim.lab.carla?.fixed){flag(sim,'carlaDenied');return fail('carla -> financeiro: denied\nMotivo provavel: usuario fora do grupo financeiro.');}flag(sim,'carlaAllowed');return ok('carla -> financeiro: allowed read/write');}
 }
 if(sim.id===25){
  if(line==='cat entrega-arquivos.txt'){flag(sim,'handoffFiles');return ok('Aceite do servidor de arquivos:\n- share financeiro disponivel\n- ana e carla gravam\n- bruno negado\n- backup planejado\n- restore drill simulado');}
  if(line==='share-list'){flag(sim,'shareList');return ok('financeiro  group=financeiro  acl=financeiro:RW,diretoria:R,suporte:none');}
  if(line==='access-test ana financeiro'){flag(sim,'anaAllowed');return ok('ana -> financeiro: allowed read/write');}
  if(line==='access-test carla financeiro'){flag(sim,'carlaAllowed');return ok('carla -> financeiro: allowed read/write');}
  if(line==='access-test bruno financeiro'){flag(sim,'brunoDenied');return ok('bruno -> financeiro: denied');}
  if(line==='backup-plan-check'){flag(sim,'backupPlan');return ok('Backup planejado: diario 22h; retencao 14 dias; destino /mnt/backup simulado.');}
  if(line==='restore-drill --simulate'){if(!sim.flags.backupPlan)return fail('Confira backup-plan-check antes do restore drill.');flag(sim,'restoreDrill');return ok('Restore drill simulado: arquivo financeiro-teste.xlsx recuperavel em ambiente isolado.');}
 }
 if(sim.id===26){
  if(line==='cat selecao-app.txt'){flag(sim,'appSelectionRequest');return ok('Objetivo: colaboracao de documentos para financeiro e diretoria.\nEscolher aplicacao piloto. Nao instalar nesta aula.');}
  if(line==='app-catalog'){flag(sim,'appCatalog');return ok('nextcloud - arquivos e colaboracao\nmail - correio\nmattermost - mensagens\nstatus: disponiveis para avaliacao');}
  if(line==='identity-readiness'){flag(sim,'identityReady');return ok('Identidade: aurora.lab running; grupos financeiro e diretoria disponiveis.');}
  if(line==='storage-readiness'){flag(sim,'storageReady');return ok('Armazenamento: /srv/disk1 escolhido; crescimento moderado; backup planejado.');}
  if(line==='publication-readiness'){flag(sim,'publicationReady');return ok('FQDN aprovado para piloto: cloud.lab.example\nTLS: CA de laboratorio\nRota: pendente de instalacao.');}
 }
 if(sim.id===27){
  if(line==='cat implantacao-nextcloud.txt'){flag(sim,'nextcloudPlan');return ok('Instalar piloto: instance=nextcloud1 fqdn=cloud.lab.example audience=financeiro+diretoria.\nValidar running; login e publicacao ficam nas proximas aulas.');}
  if(line==='identity-readiness'){flag(sim,'identityReady');return ok('aurora.lab running; financeiro e diretoria disponiveis.');}
  if(line==='storage-readiness'){flag(sim,'storageReady');return ok('/srv/disk1 disponivel para dados da aplicacao; backup planejado.');}
  if(line==='publication-readiness'){flag(sim,'publicationReady');return ok('FQDN cloud.lab.example aprovado; DNS privado preparado; rota pendente.');}
  if(line==='install-nextcloud --simulate'){if(!sim.lab.nextcloud?.configured)return fail('Configure nextcloud1 no painel antes da instalacao simulada.');sim.lab.nextcloud.installed=true;flag(sim,'nextcloudInstalled');return ok('Instalacao simulada de nextcloud1 concluida.\nEstado inicial: starting -> running.');}
  if(line==='app-status nextcloud1'){if(!sim.lab.nextcloud?.installed)return fail('nextcloud1 ainda nao foi instalada no cenario.');flag(sim,'nextcloudStatus');return ok('nextcloud1: running\nfqdn: cloud.lab.example\nidentity: pending tests\npublication: pending route');}
 }
 if(sim.id===28){
  if(line==='cat nextcloud-identidade.txt'){flag(sim,'cloudIdentityPlan');return ok('Liberar Nextcloud piloto para financeiro e diretoria.\nUsuarios de teste: ana, mariana.\nUsuario fora do escopo: bruno.');}
  if(line==='app-auth-status nextcloud1'){flag(sim,'cloudAuthStatus');return ok('nextcloud1 auth: domain aurora.lab available\naudience: not configured');}
  if(line==='group-list financeiro'){flag(sim,'financeGroup');return ok('financeiro: ana, carla');}
  if(line==='group-list diretoria'){flag(sim,'boardGroup');return ok('diretoria: mariana');}
  if(line==='login-test ana cloud'){if(sim.lab.cloudIdentity?.audience!=='financeiro-diretoria')return fail('Publico do app ainda nao configurado.');flag(sim,'anaCloudLogin');return ok('ana -> cloud: login OK');}
  if(line==='login-test mariana cloud'){if(sim.lab.cloudIdentity?.audience!=='financeiro-diretoria')return fail('Publico do app ainda nao configurado.');flag(sim,'marianaCloudLogin');return ok('mariana -> cloud: login OK');}
  if(line==='login-test bruno cloud'){if(sim.lab.cloudIdentity?.audience!=='financeiro-diretoria')return fail('Publico do app ainda nao configurado.');flag(sim,'brunoCloudDenied');return ok('bruno -> cloud: denied');}
 }
 if(sim.id===29){
  if(line==='cat publicacao-cloud.txt'){flag(sim,'cloudPublishPlan');return ok('Publicar Nextcloud piloto em https://cloud.lab.example/\nDNS esperado: 192.168.50.10\nRota correta: cloud.lab.example -> nextcloud1');}
  if(line==='dig +short cloud.lab.example'){flag(sim,'cloudDns');return ok('192.168.50.10');}
  if(line==='route-status cloud.lab.example'){if(sim.lab.cloudPublish?.route==='nextcloud1')flag(sim,'cloudRouteAfter');else flag(sim,'cloudRouteBefore');return ok(`cloud.lab.example -> ${sim.lab.cloudPublish?.route||'oldapp'}`);}
  if(line==='cert-status cloud.lab.example'){flag(sim,'cloudCert');return ok('certificate: lab-ca valid\nsubject: cloud.lab.example\nexpires: simulated');}
  if(line==='curl -I https://cloud.lab.example/'){if(sim.lab.cloudPublish?.route!=='nextcloud1')return fail('HTTP 502\nRota ainda nao aponta para nextcloud1.');flag(sim,'cloudHttp');return ok('HTTP/2 200\nx-ns8-instance: nextcloud1\ncontent-type: text/html');}
 }
 if(sim.id===30){
  if(line==='cat entrega-nextcloud.txt'){flag(sim,'cloudHandoffPlan');return ok('Aceite Nextcloud piloto: app running, Ana/Mariana entram, Bruno negado, upload e compartilhamento OK, backup planejado, runbook registrado.');}
  if(line==='app-status nextcloud1'){flag(sim,'cloudAppStatus');return ok('nextcloud1: running\nfqdn: cloud.lab.example\nroute: active\nbackup: planned');}
  if(line==='login-test ana cloud'){flag(sim,'anaCloudLogin');return ok('ana -> cloud: login OK');}
  if(line==='login-test mariana cloud'){flag(sim,'marianaCloudLogin');return ok('mariana -> cloud: login OK');}
  if(line==='login-test bruno cloud'){flag(sim,'brunoCloudDenied');return ok('bruno -> cloud: denied');}
  if(line==='upload-test ana cloud'){flag(sim,'cloudUpload');return ok('upload ana/orcamento-piloto.xlsx: OK');}
  if(line==='share-test ana mariana cloud'){if(!sim.flags.cloudUpload)return fail('Faça upload-test antes do share-test.');flag(sim,'cloudShare');return ok('share ana -> mariana: OK\nmariana can read shared file.');}
  if(line==='nextcloud-backup-plan'){flag(sim,'cloudBackupPlan');return ok('Nextcloud backup plan: daily 22h; app config + data; restore drill scheduled.');}
 }
 return null;
}
export function fileAction(sim,action,values={}){
 if(sim.id===19){
  if(action==='join-run'){if(!['joinPlan','clientDns','clientTime','domainDiscover'].every(k=>sim.flags[k]))return 'Valide plano, DNS, horário e descoberta antes do join.';if(values.client!=='win10-lab'||values.domain!=='aurora.lab')return 'Use win10-lab e aurora.lab conforme o chamado.';sim.lab.join={client:'win10-lab',domain:'aurora.lab',joined:true};sim.flags.joinRun=true;sim.flags.joinStatus=false;sim.flags.joinVerified=false;return 'Join simulado executado. Consulte join-status win10-lab.';}
  if(action==='join-validate'){if(sim.lab.join?.joined&&sim.flags.joinStatus){sim.flags.joinVerified=true;return 'Ingresso validado. Login de usuário continua pendente para a próxima aula.';}return 'Consulte join-status após o join.';}
  if(action==='join-reset'){sim.lab.join={domain:'aurora.lab',client:'win10-lab',joined:false};for(const k of ['joinRun','joinStatus','joinVerified'])sim.flags[k]=false;return 'Join removido do cenário.';}
 }
 if(sim.id===20){
  if(action==='client-dns-fix'){if(!['authIncident','clientDnsBad','timeCheck','userStatus','authLog'].every(k=>sim.flags[k]))return 'Leia incidente, DNS, horário, usuário e log antes de corrigir.';if(values.dns!=='192.168.50.10')return 'O DNS correto da estação neste laboratório é 192.168.50.10.';sim.lab.auth.dns='fixed';sim.lab.auth.fixed=true;sim.flags.clientDnsFixed=true;for(const k of ['domainDiscover','loginTest','authVerified'])sim.flags[k]=false;return 'DNS do cliente corrigido no cenário. Rode client-dns-check, domain-discover e login-test.';}
  if(action==='auth-validate'){if(sim.lab.auth?.fixed&&sim.flags.domainDiscover&&sim.flags.loginTest){sim.flags.authVerified=true;return 'Incidente encerrado: causa era DNS do cliente, não senha de Bruno.';}return 'Faltam descoberta do domínio e login-test após a correção.';}
  if(action==='auth-reset'){sim.lab.auth={dns:'wrong',fixed:false};for(const k of ['clientDnsFixed','domainDiscover','loginTest','authVerified'])sim.flags[k]=false;return 'DNS incorreto restaurado; conclusão invalidada.';}
 }
 if(sim.id===21){
  if(action==='storage-select'){if(!['storagePlan','diskUsage','volumeList','domainStatus','sambaCapacity'].every(k=>sim.flags[k]))return 'Consulte plano, disco, volumes, domínio e capacidade antes de escolher.';const good=values.volume==='/srv/disk1'&&values.owner==='financeiro'&&values.growth==='moderado';sim.lab.storage={...values};sim.flags.storageSelected=good;sim.flags.storageVerified=false;return good?'Volume de dados selecionado. Valide o plano.':'Escolha /srv/disk1, dono financeiro e crescimento moderado.';}
  if(action==='storage-validate'){if(sim.flags.storageSelected){sim.flags.storageVerified=true;return 'Plano validado: dados do financeiro irão para /srv/disk1; share fica para a próxima aula.';}return 'Selecione o volume correto antes de validar.';}
 }
 if(sim.id===22){
  if(action==='share-create'){if(!['shareRequest','sambaStatus','groupList','shareList'].every(k=>sim.flags[k]))return 'Leia pedido, Samba, grupo e lista atual antes de criar.';const name=(values.name||'').trim().toLowerCase();if(name!=='financeiro'||values.group!=='financeiro'||values.permission!=='rw-main-only')return 'Use financeiro, grupo financeiro e permissão grupo RW/demais sem acesso.';sim.lab.share={name:'financeiro',group:'financeiro',permission:'rw-main-only',created:true};sim.flags.shareCreated=true;for(const k of ['shareStatus','accessAllowed','accessDenied','shareVerified'])sim.flags[k]=false;return 'Compartilhamento financeiro criado no cenário. Teste acesso permitido e negado.';}
  if(action==='share-validate'){if(sim.lab.share?.created&&sim.flags.shareStatus&&sim.flags.accessAllowed&&sim.flags.accessDenied){sim.flags.shareVerified=true;return 'Compartilhamento validado com teste positivo e negativo.';}return 'Faltam status, teste da Ana e teste do Bruno.';}
  if(action==='share-reset'){sim.lab.share={name:'financeiro',group:'financeiro',permission:'',created:false};for(const k of ['shareCreated','shareStatus','accessAllowed','accessDenied','shareVerified'])sim.flags[k]=false;return 'Compartilhamento removido do cenário.';}
 }
 if(sim.id===23){
  if(action==='acl-map'){if(!['aclMatrix','financeGroup','boardGroup','aclStatus'].every(k=>sim.flags[k]))return 'Leia matriz, grupos e ACL atual antes de aplicar.';const good=values.financeiro==='rw'&&values.diretoria==='r'&&values.suporte==='none';sim.lab.acl={...values};sim.flags.aclMapped=good;sim.flags.aclVerified=false;return good?'Matriz aplicada no cenário. Valide a ACL.':'Use financeiro RW, diretoria R e suporte sem acesso.';}
  if(action==='acl-validate'){if(sim.flags.aclMapped){sim.flags.aclVerified=true;return 'Matriz de acesso validada.';}return 'Aplique a matriz correta antes de validar.';}
  if(action==='acl-reset'){sim.lab.acl={financeiro:'',diretoria:'',suporte:''};sim.flags.aclMapped=false;sim.flags.aclVerified=false;return 'ACL voltou ao estado inicial.';}
 }
 if(sim.id===24){
  if(action==='carla-fix'){if(!['denyIncident','aclStatus','anaGroups','carlaGroupsBefore','carlaDenied'].every(k=>sim.flags[k]))return 'Compare incidente, ACL, Ana, Carla e teste negado antes de corrigir.';if(values.group!=='financeiro')return 'A correção autorizada é adicionar Carla ao grupo financeiro.';sim.lab.carla.fixed=true;sim.flags.carlaFixed=true;sim.flags.carlaGroupsAfter=false;sim.flags.carlaAllowed=false;sim.flags.denyVerified=false;return 'Carla adicionada ao grupo financeiro no cenário. Repita user-groups e access-test.';}
  if(action==='deny-validate'){if(sim.lab.carla?.fixed&&sim.flags.carlaGroupsAfter&&sim.flags.carlaAllowed){sim.flags.denyVerified=true;return 'Incidente encerrado sem abrir ACL: Carla no grupo e acesso permitido.';}return 'Faltam grupo atualizado e teste de acesso da Carla.';}
  if(action==='carla-reset'){sim.lab.carla.fixed=false;for(const k of ['carlaFixed','carlaGroupsAfter','carlaAllowed','denyVerified'])sim.flags[k]=false;return 'Carla removida do grupo financeiro no cenário.';}
 }
 if(sim.id===25){
  if(action==='file-handoff-checklist'){const needed=['path','positive','negative','backup','restore','owner'];const ok=needed.every(k=>values[k]);sim.lab.fileHandoff.checklist=ok;sim.flags.fileHandoffChecklist=ok;sim.flags.fileHandoffVerified=false;return ok?'Checklist de entrega completo. Valide o aceite.':'Marque todos os itens de aceite.';}
  if(action==='file-handoff-validate'){if(sim.flags.fileHandoffChecklist&&['shareList','anaAllowed','carlaAllowed','brunoDenied','backupPlan','restoreDrill'].every(k=>sim.flags[k])){sim.flags.fileHandoffVerified=true;return 'Servidor de arquivos entregue com evidências completas.';}return 'Faltam testes, backup/restore ou checklist.';}
 }
 if(sim.id===26){
  if(action==='app-selection'){if(!['appSelectionRequest','appCatalog','identityReady','storageReady','publicationReady'].every(k=>sim.flags[k]))return 'Leia pedido e readiness antes de selecionar.';const good=values.app==='nextcloud'&&values.audience==='financeiro-diretoria'&&values.fqdn==='cloud.lab.example';sim.lab.appSelection={...values};sim.flags.appSelected=good;sim.flags.appSelectionVerified=false;return good?'Nextcloud piloto selecionado. Valide a decisão sem instalar.':'Use Nextcloud, financeiro+diretoria e cloud.lab.example.';}
  if(action==='app-selection-validate'){if(sim.flags.appSelected){sim.flags.appSelectionVerified=true;return 'Seleção aprovada: instalação fica para a próxima aula.';}return 'Selecione a aplicação piloto correta antes de validar.';}
 }
 if(sim.id===27){
  if(action==='nextcloud-config'){if(!['nextcloudPlan','identityReady','storageReady','publicationReady'].every(k=>sim.flags[k]))return 'Leia plano e readiness antes de configurar.';const good=values.instance==='nextcloud1'&&values.fqdn==='cloud.lab.example'&&values.audience==='financeiro-diretoria';sim.lab.nextcloud={...sim.lab.nextcloud,...values,configured:good,installed:false};sim.flags.nextcloudConfigured=good;for(const k of ['nextcloudInstalled','nextcloudStatus','nextcloudVerified'])sim.flags[k]=false;return good?'nextcloud1 configurado para instalação simulada.':'Use nextcloud1, cloud.lab.example e financeiro+diretoria.';}
  if(action==='nextcloud-validate'){if(sim.lab.nextcloud?.installed&&sim.flags.nextcloudStatus){sim.flags.nextcloudVerified=true;return 'Implantação inicial validada: nextcloud1 running; testes funcionais pendentes.';}return 'Instale e consulte app-status nextcloud1 antes de validar.';}
  if(action==='nextcloud-reset'){sim.lab.nextcloud={instance:'nextcloud1',fqdn:'cloud.lab.example',audience:'financeiro-diretoria',configured:false,installed:false};for(const k of ['nextcloudConfigured','nextcloudInstalled','nextcloudStatus','nextcloudVerified'])sim.flags[k]=false;return 'Nextcloud removido do cenário.';}
 }
 if(sim.id===28){
  if(action==='cloud-audience'){if(!['cloudIdentityPlan','cloudAuthStatus','financeGroup','boardGroup'].every(k=>sim.flags[k]))return 'Leia plano, auth e grupos antes de configurar público.';if(values.audience!=='financeiro-diretoria')return 'O público aprovado é financeiro+diretoria.';sim.lab.cloudIdentity.audience='financeiro-diretoria';sim.flags.cloudAudienceSet=true;for(const k of ['anaCloudLogin','marianaCloudLogin','brunoCloudDenied','cloudIdentityVerified'])sim.flags[k]=false;return 'Público do Nextcloud configurado. Teste Ana, Mariana e Bruno.';}
  if(action==='cloud-identity-validate'){if(sim.flags.cloudAudienceSet&&sim.flags.anaCloudLogin&&sim.flags.marianaCloudLogin&&sim.flags.brunoCloudDenied){sim.flags.cloudIdentityVerified=true;return 'Identidade do piloto validada com acesso permitido e negado.';}return 'Faltam testes de Ana, Mariana e Bruno.';}
 }
 if(sim.id===29){
  if(action==='cloud-route-apply'){if(!['cloudPublishPlan','cloudDns','cloudRouteBefore','cloudCert'].every(k=>sim.flags[k]))return 'Leia plano, DNS, rota atual e certificado antes de aplicar.';if(values.target!=='nextcloud1')return 'O destino correto é nextcloud1.';sim.lab.cloudPublish.route='nextcloud1';sim.flags.cloudRouteSet=true;for(const k of ['cloudRouteAfter','cloudHttp','cloudPublishVerified'])sim.flags[k]=false;return 'Rota aplicada para nextcloud1. Repita route-status e curl.';}
  if(action==='cloud-publish-validate'){if(sim.lab.cloudPublish?.route==='nextcloud1'&&sim.flags.cloudRouteAfter&&sim.flags.cloudHttp){sim.flags.cloudPublishVerified=true;return 'Publicação validada: DNS, rota e HTTPS coerentes.';}return 'Faltam route-status e curl após a alteração.';}
  if(action==='cloud-route-reset'){sim.lab.cloudPublish.route='oldapp';for(const k of ['cloudRouteSet','cloudRouteAfter','cloudHttp','cloudPublishVerified'])sim.flags[k]=false;return 'Rota restaurada para oldapp.';}
 }
 if(sim.id===30){
  if(action==='cloud-handoff-checklist'){const needed=['status','logins','negative','upload','share','backup','runbook'];const ok=needed.every(k=>values[k]);sim.lab.cloudHandoff.checklist=ok;sim.flags.cloudHandoffChecklist=ok;sim.flags.cloudHandoffVerified=false;return ok?'Checklist do Nextcloud completo. Valide a entrega.':'Marque todos os itens do aceite.';}
  if(action==='cloud-handoff-validate'){if(sim.flags.cloudHandoffChecklist&&['cloudAppStatus','anaCloudLogin','marianaCloudLogin','brunoCloudDenied','cloudUpload','cloudShare','cloudBackupPlan'].every(k=>sim.flags[k])){sim.flags.cloudHandoffVerified=true;return 'Nextcloud piloto entregue com aceite funcional.';}return 'Faltam testes funcionais, backup ou checklist.';}
 }
 return null;
}
