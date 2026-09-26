import {inventoryFields, initialInventory, validateInventory, INVENTORY_REVISION} from '../js/inventory.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {TerminalSimulator,missionEvidence,correctMap,FQDN,TARGET} from '../js/simulator.js';
import {missions} from '../data/missions.js';
import {awardMission} from '../js/progress.js';
import {renderLab} from '../js/lab.js';

function run(sim, lines) { for (const line of lines) assert.equal(sim.execute(line).error,false,line); }
function ready(sim) { const e=missionEvidence(sim.id,sim); return missions[sim.id].objectives.every(([key])=>e[key]); }
function investigate(sim) {run(sim,['ip -br addr','ip route','cat /etc/resolv.conf','timedatectl',`dig +short ${FQDN}`]);}
test('sessenta missões com questões e conteúdo completo',()=>{
  assert.equal(Object.keys(missions).length,60);
  for(const m of Object.values(missions)) {
    assert.equal(m.testking.length,3); assert.equal(m.steps.length,10); assert.equal(m.images.length,2);
    for(const q of m.testking) assert.equal(q.choices.filter(c=>c.correct).length,1);
    for(const k of ['senior','concept','labIntro','validation','closing']) assert.ok(m[k].length>60);
    assert.ok(renderLab(m.id,new TerminalSimulator(m.id)).includes('PAINEL EDUCATIVO'));
  }
});
test('Aula 1 rejeita bases inadequadas, exige leitura e aceita VM limpa',()=>{
  const sim=new TerminalSimulator(1);
  for(const candidate of ['lxc','reused','']) {sim.act('plan',{candidate}); assert.equal(ready(sim),false);}
  sim.act('plan',{candidate:'vm'}); assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat chamado.txt']); assert.equal(ready(sim),true);
  sim.act('plan',{candidate:'lxc'}); assert.equal(ready(sim),false);
});
test('Aula 2 exige mapa, incidente e retorno; desligar novamente invalida retorno',()=>{
  const sim=new TerminalSimulator(2);
  run(sim,['cat topologia.txt']); sim.act('map',correctMap); sim.act('on'); assert.equal(ready(sim),false);
  sim.act('off'); assert.equal(sim.lab.nodeOn,false); assert.equal(ready(sim),false);
  sim.act('on'); assert.equal(ready(sim),true);
  const restored=new TerminalSimulator(2); restored.restore(sim.snapshot()); assert.equal(ready(restored),true);
  restored.act('off'); assert.equal(ready(restored),false);
});
test('Aula 3 não concede evidência de destino no host errado',()=>{
  const sim=new TerminalSimulator(3);
  run(sim,['whoami','hostname','pwd','ls']);
  assert.equal(sim.execute('cat LEIA-ME.txt').error,true);
  assert.equal(ready(sim),false);
  run(sim,[`ssh junior@${TARGET}`,'whoami','hostname','pwd','ls','cat LEIA-ME.txt']);
  assert.equal(ready(sim),true); sim.execute('exit'); assert.equal(ready(sim),false);
});
test('Aula 4 bloqueia mudança prematura e exige DNS/HTTP após alteração',()=>{
  const sim=new TerminalSimulator(4);
  sim.act('dns',{dns:TARGET}); assert.equal(sim.lab.dns,'192.168.50.99');
  assert.equal(sim.execute(`curl -I https://${FQDN}/cluster-admin/`).error,true);
  investigate(sim); sim.act('dns',{dns:'8.8.8.8'}); assert.equal(sim.lab.dns,'192.168.50.99');
  sim.act('dns',{dns:TARGET}); assert.equal(ready(sim),false);
  run(sim,[`dig +short ${FQDN}`,`curl -I https://${FQDN}/cluster-admin/`]); assert.equal(ready(sim),true);
  sim.act('rollback'); assert.equal(ready(sim),false); assert.equal(sim.flags.http,false);
});
const correctInventory=()=>({...Object.fromEntries(inventoryFields.map(([k,l,v])=>[k,v])),diagnosis:'stale-draft'});
function collectInventoryEvidence(sim) {run(sim,['whoami','hostname','cat pedido-inventario.txt','cat rascunho.txt','cat /home/junior/rede-aprovada.txt','cat vm-aprovada.txt','cat escopo.txt']);}
test('Aula 5 exige fontes e valida cada divergência separadamente',()=>{
  const sim=new TerminalSimulator(5);
  sim.act('inventory',correctInventory()); assert.equal(ready(sim),false);
  assert.throws(()=>sim.exportInventory());
  collectInventoryEvidence(sim);
  sim.act('inventory',{...initialInventory});
  assert.deepEqual(Object.keys(sim.lab.inventoryErrors).sort(),['apps','diagnosis','disk','dns','ip','owner']);
  for(const [key] of inventoryFields) {const values=correctInventory();values[key]='errado';assert.ok(validateInventory(values)[key],key);}
  sim.act('inventory',correctInventory()); assert.equal(sim.flags.inventory,true); assert.equal(ready(sim),false);
  const output=sim.exportInventory(); assert.match(output,/80/); assert.match(output,/PENDENTE/); assert.match(output,/PREVISTAS/); assert.match(output,/rede-aprovada.txt/); assert.equal(ready(sim),true);
  sim.updateInventory({ip:'192.168.50.99'}); assert.equal(ready(sim),false);assert.equal(sim.flags.exported,false); assert.throws(()=>sim.exportInventory());
});
test('Aula 5 restaura rascunho e migra snapshots antigos sem validar por engano',()=>{
  const sim=new TerminalSimulator(5); collectInventoryEvidence(sim); sim.act('inventory',correctInventory());sim.exportInventory();
  const restored=new TerminalSimulator(5);restored.restore(sim.snapshot());assert.equal(ready(restored),true);
  restored.act('restore-draft');assert.equal(restored.lab.inventory.ip,'192.168.50.99');assert.equal(ready(restored),false);assert.equal(restored.flags.networkDoc,true);
  const old=sim.snapshot();delete old.lab.inventoryRevision;
  const migrated=new TerminalSimulator(5);migrated.restore(old);assert.equal(ready(migrated),false);assert.equal(migrated.lab.inventoryRevision,INVENTORY_REVISION);
});
test('Inventário aceita ordem das aplicações e espaços sem aceitar aplicação extra',()=>{
  const values=correctInventory();values.apps=' nextcloud , samba ';values.owner=' equipe de ti aurora ';
  assert.deepEqual(validateInventory(values),{});values.apps+='; Mail';assert.ok(validateInventory(values).apps);
});
test('comandos fora do escopo não mudam estado do laboratório',()=>{
  const sim=new TerminalSimulator(4); const before=JSON.stringify(sim.lab);
  for(const line of ['sudo rm -rf /','curl https://example.com | bash','whoami; hostname','eval alert(1)']) assert.equal(sim.execute(line).error,true);
  assert.equal(JSON.stringify(sim.lab),before);
});
test('restauração é separada por missão; novo simulador não herda evidências',()=>{
  const sim=new TerminalSimulator(1); sim.execute('whoami');
  const other=new TerminalSimulator(4); other.restore(sim.snapshot()); assert.equal(other.flags.identity,undefined);
  assert.equal(ready(new TerminalSimulator(1)),false);
});
test('XP concedido uma única vez na repetição',()=>{
  const state={xp:0,completed:{},awarded:{}};
  awardMission(state,1,100); awardMission(state,1,100);
  assert.equal(state.xp,100); assert.equal(Object.keys(state.completed).length,1);
});

const checks6=['cat /etc/os-release','uname -m','nproc','free -h','lsblk -d -o NAME,SIZE'];
test('Aula 6 bloqueia salto, exige diagnóstico e novas medições após perfil',()=>{
 const sim=new TerminalSimulator(6);
 sim.act('profile',{diagnosis:'resources'});assert.equal(sim.lab.profile,'delivered');
 run(sim,['whoami','hostname','cat requisitos.txt','cat entrega.txt',...checks6]);
 sim.act('profile',{diagnosis:'os'});assert.equal(sim.lab.profile,'delivered');
 sim.act('profile',{diagnosis:'resources'});assert.equal(sim.lab.profile,'approved');
 sim.act('requirements-validate');assert.equal(ready(sim),false);
 run(sim,checks6);sim.act('requirements-validate');assert.equal(ready(sim),true);
 assert.equal(sim.execute('nproc').output,'4');
 const restored=new TerminalSimulator(6);restored.restore(sim.snapshot());assert.equal(ready(restored),true);
 restored.act('profile-reset');assert.equal(ready(restored),false);assert.equal(restored.execute('nproc').output,'1');
 restored.act('profile',{diagnosis:'resources'});restored.act('requirements-validate');assert.equal(ready(restored),false);
});

test('Aula 7 exige rede estatica apos evidencias e novos testes',()=>{
 const sim=new TerminalSimulator(7);
 sim.act('network-profile',{profile:'static'});assert.equal(sim.lab.network,'dhcp');
 run(sim,['whoami','hostname','cat plano-rede.txt','ip -br addr','ip route','cat /etc/resolv.conf','timedatectl',`dig +short ${FQDN}`,'curl -I https://distfeed.nethserver.org/']);
 sim.act('network-profile',{profile:'dhcp'});assert.equal(sim.lab.network,'dhcp');
 sim.act('network-profile',{profile:'static'});assert.equal(sim.lab.network,'static');assert.equal(ready(sim),false);
 run(sim,['ip -br addr','ip route','cat /etc/resolv.conf','timedatectl',`dig +short ${FQDN}`,'curl -I https://distfeed.nethserver.org/']);
 sim.act('network-validate');assert.equal(ready(sim),true);
 sim.act('network-reset');assert.equal(ready(sim),false);
});

test('Aula 8 separa instalacao, reboot, acesso e cluster pendente',()=>{
 const sim=new TerminalSimulator(8);
 assert.equal(sim.execute('install-ns8 --simulate').error,true);
 run(sim,['whoami','hostname','cat preflight.txt','install-ns8 --simulate']);
 assert.equal(sim.execute(`curl -I https://${FQDN}/cluster-admin/`).error,true);
 run(sim,['reboot-simulado','status-ns8',`curl -I https://${FQDN}/cluster-admin/`]);
 sim.act('access-log',{state:'created'});assert.equal(ready(sim),false);
 sim.act('access-log',{state:'not-created'});assert.equal(ready(sim),true);
 sim.act('install-reset');assert.equal(ready(sim),false);
});

test('Aula 9 cria cluster apenas com modo, rotulo e VPN aprovados',()=>{
 const sim=new TerminalSimulator(9);
 sim.act('cluster-create',{mode:'create',label:'aurora-lab',vpn:'10.5.4.0/24'});assert.equal(sim.lab.cluster,'none');
 run(sim,['whoami','hostname','cat cluster-plano.txt',`dig +short ${FQDN}`]);
 sim.act('cluster-create',{mode:'join',label:'aurora-lab',vpn:'10.5.4.0/24'});assert.equal(sim.lab.cluster,'none');
 sim.act('cluster-create',{mode:'create',label:'aurora-lab',vpn:'10.10.0.0/16'});assert.equal(sim.lab.cluster,'none');
 sim.act('cluster-create',{mode:'create',label:'aurora-lab',vpn:'10.5.4.0/24'});assert.equal(ready(sim),false);
 sim.act('cluster-validate');assert.equal(ready(sim),true);
 sim.act('cluster-reset');assert.equal(ready(sim),false);
});

test('Aula 10 exige troca de senha e checklist completo sem segredo',()=>{
 const sim=new TerminalSimulator(10);
 sim.act('password-change');assert.equal(sim.lab.adminPassword,'default');
 run(sim,['whoami','hostname','cat entrega-inicial.txt','status-cluster']);
 sim.act('password-change');assert.equal(sim.lab.adminPassword,'changed');
 sim.act('handoff-checklist',{url:true,owner:true,single:true,pending:false,next:true});assert.equal(ready(sim),false);
 sim.act('handoff-checklist',{url:true,owner:true,single:true,pending:true,next:true});
 sim.act('handoff-validate');assert.equal(ready(sim),true);
 sim.act('password-reset');assert.equal(ready(sim),false);
});

test('Aula 11 inventaria áreas sem criar recursos',()=>{
 const sim=new TerminalSimulator(11);
 sim.act('inventory-validate');assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat mapa-cluster.txt','status-cluster','inventario-admin']);
 sim.act('areas-map',{nodes:'software',apps:'node',users:'domains',settings:'settings'});assert.equal(ready(sim),false);
 sim.act('areas-map',{nodes:'node',apps:'software',users:'domains',settings:'settings'});
 sim.act('inventory-validate');assert.equal(ready(sim),true);
});

test('Aula 12 instala somente docs1 autorizada',()=>{
 const sim=new TerminalSimulator(12);
 assert.equal(sim.execute('install-app --simulate docs1').error,true);
 run(sim,['whoami','hostname','cat app-pedido.txt','software-center-list']);
 sim.act('app-select',{app:'mail1',node:'ns8-lab-01',volume:'default'});assert.equal(ready(sim),false);
 sim.act('app-select',{app:'docs1',node:'ns8-lab-01',volume:'default'});
 run(sim,['install-app --simulate docs1','app-status docs1']);
 sim.act('app-validate');assert.equal(ready(sim),true);
 sim.act('app-remove');assert.equal(ready(sim),false);
});

test('Aula 13 exige rota corrigida e testes depois da mudança',()=>{
 const sim=new TerminalSimulator(13);
 sim.act('route-apply',{target:'docs1'});assert.equal(sim.lab.route,'oldapp');
 run(sim,['whoami','hostname','cat rota-pedido.txt',`dig +short docs.lab.example`,`route-status docs.lab.example`]);
 assert.equal(sim.execute(`curl -I https://docs.lab.example/`).error,true);
 sim.act('route-apply',{target:'oldapp'});assert.equal(sim.lab.route,'oldapp');
 sim.act('route-apply',{target:'docs1'});assert.equal(ready(sim),false);
 run(sim,[`route-status docs.lab.example`,`curl -I https://docs.lab.example/`]);
 sim.act('route-validate');assert.equal(ready(sim),true);
 sim.act('route-reset');assert.equal(ready(sim),false);
});

test('Aula 14 acompanha tarefa e logs antes de encerrar',()=>{
 const sim=new TerminalSimulator(14);
 sim.act('task-advance');assert.equal(sim.lab.task,'running');
 run(sim,['whoami','hostname','cat incidente-log.txt','task-list','app-log docs1']);
 assert.equal(sim.execute('task-watch T-1042').error,true);
 sim.act('task-advance');assert.equal(sim.lab.task,'completed');assert.equal(ready(sim),false);
 run(sim,['task-watch T-1042',`curl -I https://docs.lab.example/`]);
 sim.act('log-validate');assert.equal(ready(sim),true);
 sim.act('task-reset');assert.equal(ready(sim),false);
});

test('Aula 15 atualiza apenas com janela, execução e validação pós-mudança',()=>{
 const sim=new TerminalSimulator(15);
 sim.act('update-approve',{window:'domingo-22h',scope:'security-core'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat atualizacao-plano.txt','update-plan','task-list']);
 sim.act('update-approve',{window:'agora',scope:'security-core'});assert.equal(sim.lab.update.approved,false);
 sim.act('update-approve',{window:'domingo-22h',scope:'security-core'});
 sim.act('update-run');assert.equal(ready(sim),false);
 run(sim,['update-status',`curl -I https://docs.lab.example/`]);
 sim.act('update-validate');assert.equal(ready(sim),true);
 sim.act('update-reset');assert.equal(ready(sim),false);
});

test('Aula 16 separa usuário, grupo, domínio e provedor antes de validar',()=>{
 const sim=new TerminalSimulator(16);
 sim.act('identity-map',{person:'group',department:'user',domain:'provider',backend:'user-domain'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat identidade-pedido.txt','domain-list','provider-list']);
 sim.act('identity-map',{person:'user',department:'group',domain:'user-domain',backend:'provider'});
 sim.act('identity-validate');assert.equal(ready(sim),true);
 const restored=new TerminalSimulator(16);restored.restore(sim.snapshot());assert.equal(ready(restored),true);
 restored.act('identity-map',{person:'user',department:'group',domain:'provider',backend:'user-domain'});assert.equal(ready(restored),false);
});

test('Aula 17 valida plano Samba AD somente com DNS, horário e nomes aprovados',()=>{
 const sim=new TerminalSimulator(17);
 run(sim,['whoami','hostname','cat matriz-identidade.txt']);
 sim.act('identity-plan',{type:'external-ad',domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA'});assert.equal(ready(sim),false);
 run(sim,['dns-check aurora.lab','time-check']);
 sim.act('identity-plan',{type:'samba-ad-lab',domain:'aurora.lab',realm:'aurora.lab',netbios:'AURORA'});assert.equal(ready(sim),false);
 sim.act('identity-plan',{type:'samba-ad-lab',domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA'});
 sim.act('identity-plan-validate');assert.equal(ready(sim),true);
});

test('Aula 18 cria domínio Samba e não aceita nomes divergentes',()=>{
 const sim=new TerminalSimulator(18);
 sim.act('samba-create',{domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat samba-plano.txt','domain-list']);
 sim.act('samba-create',{domain:'empresa.local',realm:'EMPRESA.LOCAL',netbios:'EMPRESA'});assert.equal(sim.lab.samba.created,false);
 sim.act('samba-create',{domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA'});assert.equal(ready(sim),false);
 run(sim,['domain-status aurora.lab','host -t SRV _ldap._tcp.aurora.lab']);
 sim.act('samba-validate');assert.equal(ready(sim),true);
 sim.act('samba-reset');assert.equal(ready(sim),false);
});

test('Aula 19 exige DNS, horário e descoberta antes do join',()=>{
 const sim=new TerminalSimulator(19);
 sim.act('join-run',{client:'win10-lab',domain:'aurora.lab'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat join-plano.txt','client-dns-check','client-time-check','domain-discover aurora.lab']);
 sim.act('join-run',{client:'notebook-rh',domain:'aurora.lab'});assert.equal(sim.lab.join.joined,false);
 sim.act('join-run',{client:'win10-lab',domain:'aurora.lab'});assert.equal(ready(sim),false);
 run(sim,['join-status win10-lab']);
 sim.act('join-validate');assert.equal(ready(sim),true);
 sim.act('join-reset');assert.equal(ready(sim),false);
});

test('Aula 20 corrige DNS do cliente sem resetar senha',()=>{
 const sim=new TerminalSimulator(20);
 sim.act('client-dns-fix',{dns:'192.168.50.10'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat incidente-auth.txt','client-dns-check','time-check','user-status bruno','auth-log bruno']);
 sim.act('client-dns-fix',{dns:'192.168.50.53'});assert.equal(sim.lab.auth.dns,'wrong');
 sim.act('client-dns-fix',{dns:'192.168.50.10'});
 run(sim,['client-dns-check','domain-discover aurora.lab','login-test bruno']);
 sim.act('auth-validate');assert.equal(ready(sim),true);
 sim.act('auth-reset');assert.equal(ready(sim),false);
});

test('Aula 21 planeja armazenamento antes de criar compartilhamento',()=>{
 const sim=new TerminalSimulator(21);
 sim.act('storage-select',{volume:'/srv/disk1',owner:'financeiro',growth:'moderado'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat armazenamento-plano.txt','disk-usage','volume-list','user-domain-status','samba-capacity']);
 sim.act('storage-select',{volume:'/',owner:'financeiro',growth:'moderado'});assert.equal(ready(sim),false);
 sim.act('storage-select',{volume:'/srv/disk1',owner:'financeiro',growth:'moderado'});
 sim.act('storage-validate');assert.equal(ready(sim),true);
});

test('Aula 22 cria share com teste positivo e negativo',()=>{
 const sim=new TerminalSimulator(22);
 sim.act('share-create',{name:'financeiro',group:'financeiro',permission:'rw-main-only'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat compartilhamento-pedido.txt','samba-status','group-list financeiro','share-list']);
 sim.act('share-create',{name:'financeiro',group:'financeiro',permission:'everyone-rw'});assert.equal(sim.lab.share.created,false);
 sim.act('share-create',{name:'financeiro',group:'financeiro',permission:'rw-main-only'});assert.equal(ready(sim),false);
 run(sim,['share-status financeiro','access-test ana financeiro','access-test bruno financeiro']);
 sim.act('share-validate');assert.equal(ready(sim),true);
 sim.act('share-reset');assert.equal(ready(sim),false);
});

test('Aula 23 aplica matriz de ACL sem Everyone',()=>{
 const sim=new TerminalSimulator(23);
 sim.act('acl-map',{financeiro:'rw',diretoria:'r',suporte:'none'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat matriz-acesso.txt','group-list financeiro','group-list diretoria','acl-status financeiro']);
 sim.act('acl-map',{financeiro:'rw',diretoria:'rw',suporte:'rw'});assert.equal(ready(sim),false);
 sim.act('acl-map',{financeiro:'rw',diretoria:'r',suporte:'none'});
 sim.act('acl-validate');assert.equal(ready(sim),true);
 sim.act('acl-reset');assert.equal(ready(sim),false);
});

test('Aula 24 corrige grupo da Carla sem abrir ACL',()=>{
 const sim=new TerminalSimulator(24);
 run(sim,['whoami','hostname','cat acesso-negado.txt','acl-status financeiro','user-groups ana','user-groups carla']);
 assert.equal(sim.execute('access-test carla financeiro').error,true);
 sim.act('carla-fix',{group:'everyone'});assert.equal(sim.lab.carla.fixed,false);
 sim.act('carla-fix',{group:'financeiro'});
 run(sim,['user-groups carla','access-test carla financeiro']);
 sim.act('deny-validate');assert.equal(ready(sim),true);
 sim.act('carla-reset');assert.equal(ready(sim),false);
});

test('Aula 25 exige aceite completo do servidor de arquivos',()=>{
 const sim=new TerminalSimulator(25);
 run(sim,['whoami','hostname','cat entrega-arquivos.txt','share-list','access-test ana financeiro','access-test carla financeiro','access-test bruno financeiro','backup-plan-check','restore-drill --simulate']);
 sim.act('file-handoff-checklist',{path:true,positive:true,negative:true,backup:true,restore:false,owner:true});assert.equal(ready(sim),false);
 sim.act('file-handoff-checklist',{path:true,positive:true,negative:true,backup:true,restore:true,owner:true});
 sim.act('file-handoff-validate');assert.equal(ready(sim),true);
});

test('Aula 26 seleciona aplicação sem instalar',()=>{
 const sim=new TerminalSimulator(26);
 sim.act('app-selection',{app:'nextcloud',audience:'financeiro-diretoria',fqdn:'cloud.lab.example'});assert.equal(ready(sim),false);
 run(sim,['whoami','hostname','cat selecao-app.txt','app-catalog','identity-readiness','storage-readiness','publication-readiness']);
 sim.act('app-selection',{app:'mail',audience:'financeiro-diretoria',fqdn:'cloud.lab.example'});assert.equal(ready(sim),false);
 sim.act('app-selection',{app:'nextcloud',audience:'financeiro-diretoria',fqdn:'cloud.lab.example'});
 sim.act('app-selection-validate');assert.equal(ready(sim),true);
});

test('Aula 27 instala Nextcloud apenas após readiness e configuração',()=>{
 const sim=new TerminalSimulator(27);
 assert.equal(sim.execute('install-nextcloud --simulate').error,true);
 run(sim,['whoami','hostname','cat implantacao-nextcloud.txt','identity-readiness','storage-readiness','publication-readiness']);
 sim.act('nextcloud-config',{instance:'cloud',fqdn:'cloud.lab.example',audience:'financeiro-diretoria'});assert.equal(ready(sim),false);
 sim.act('nextcloud-config',{instance:'nextcloud1',fqdn:'cloud.lab.example',audience:'financeiro-diretoria'});
 run(sim,['install-nextcloud --simulate','app-status nextcloud1']);
 sim.act('nextcloud-validate');assert.equal(ready(sim),true);
 sim.act('nextcloud-reset');assert.equal(ready(sim),false);
});

test('Aula 28 valida identidade do Nextcloud com permitido e negado',()=>{
 const sim=new TerminalSimulator(28);
 run(sim,['whoami','hostname','cat nextcloud-identidade.txt','app-auth-status nextcloud1','group-list financeiro','group-list diretoria']);
 sim.act('cloud-audience',{audience:'todos'});assert.equal(ready(sim),false);
 sim.act('cloud-audience',{audience:'financeiro-diretoria'});
 run(sim,['login-test ana cloud','login-test mariana cloud','login-test bruno cloud']);
 sim.act('cloud-identity-validate');assert.equal(ready(sim),true);
});

test('Aula 29 publica Nextcloud por rota e HTTPS',()=>{
 const sim=new TerminalSimulator(29);
 sim.act('cloud-route-apply',{target:'nextcloud1'});assert.equal(sim.lab.cloudPublish.route,'oldapp');
 run(sim,['whoami','hostname','cat publicacao-cloud.txt','dig +short cloud.lab.example','route-status cloud.lab.example','cert-status cloud.lab.example']);
 assert.equal(sim.execute('curl -I https://cloud.lab.example/').error,true);
 sim.act('cloud-route-apply',{target:'oldapp'});assert.equal(sim.lab.cloudPublish.route,'oldapp');
 sim.act('cloud-route-apply',{target:'nextcloud1'});
 run(sim,['route-status cloud.lab.example','curl -I https://cloud.lab.example/']);
 sim.act('cloud-publish-validate');assert.equal(ready(sim),true);
 sim.act('cloud-route-reset');assert.equal(ready(sim),false);
});

test('Aula 30 exige aceite funcional do Nextcloud',()=>{
 const sim=new TerminalSimulator(30);
 run(sim,['whoami','hostname','cat entrega-nextcloud.txt','app-status nextcloud1','login-test ana cloud','login-test mariana cloud','login-test bruno cloud','upload-test ana cloud','share-test ana mariana cloud','nextcloud-backup-plan']);
 sim.act('cloud-handoff-checklist',{status:true,logins:true,negative:true,upload:true,share:true,backup:false,runbook:true});assert.equal(ready(sim),false);
  sim.act('cloud-handoff-checklist',{status:true,logins:true,negative:true,upload:true,share:true,backup:true,runbook:true});
  sim.act('cloud-handoff-validate');assert.equal(ready(sim),true);
});

test('Aula 31 valida fluxo de correio e matriz de portas',()=>{
  const sim=new TerminalSimulator(31);
  sim.act('flow-matrix-validate',{submission:'25',relay:'25',imap:'143'});assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat fluxo-email.txt','dig +short MX aurora.lab','mail-flow-test aurora.lab']);
  sim.act('flow-matrix-validate',{submission:'25',relay:'25',imap:'993'});assert.equal(ready(sim),false);
  sim.act('flow-matrix-validate',{submission:'587',relay:'25',imap:'993'});
  assert.equal(ready(sim),true);
});

test('Aula 32 homologa instalação do Mail Server',()=>{
  const sim=new TerminalSimulator(32);
  sim.act('install-mail-instance');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat plano-instalacao-mail.txt','app-catalog list | grep mail']);
  sim.act('install-mail-instance');
  run(sim,['app-status mail1']);
  sim.act('mail-install-validate');
  assert.equal(ready(sim),true);
});

test('Aula 33 provisiona caixa ana, alias financeiro e grupo diretoria',()=>{
  const sim=new TerminalSimulator(33);
  sim.act('mail-accounts-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat usuarios-mail-escopo.txt','mailbox-create ana 5G','mail-alias-create financeiro@aurora.lab ana@aurora.lab','mail-group-create diretoria@aurora.lab ana,mariana','mailbox-test ana@aurora.lab','send-internal-probe financeiro@aurora.lab']);
  sim.act('mail-accounts-validate');
  assert.equal(ready(sim),true);
});

test('Aula 34 configura SPF, DKIM e DMARC com auditoria',()=>{
  const sim=new TerminalSimulator(34);
  sim.act('reputation-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat reputacao-escopo.txt','dkim-generate-key aurora.lab','dns-record-apply spf "v=spf1 mx ip4:192.168.50.10 ~all"','dns-record-apply dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@aurora.lab"','mail-reputation-audit aurora.lab']);
  sim.act('reputation-validate');
  assert.equal(ready(sim),true);
});

test('Aula 35 resolve incidente de fila represada e conclui revisão 07',()=>{
  const sim=new TerminalSimulator(35);
  sim.act('review7-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat chamado-incidente-email.txt','mailq','mail-log-view','mail-relay-fix','postfix-flush','mailq']);
  sim.act('review7-checklist',{flow:true,install:true,mailboxes:true,reputation:true,incident:false});assert.equal(ready(sim),false);
  sim.act('review7-checklist',{flow:true,install:true,mailboxes:true,reputation:true,incident:true});
  sim.act('review7-validate');
  assert.equal(ready(sim),true);
});

test('Aula 36 valida estratégia de backup e política de retenção GFS',()=>{
  const sim=new TerminalSimulator(36);
  sim.act('backup-strategy-validate',{daily:'1',weekly:'2',monthly:'6'});assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat estrategia-backup.txt','restic-repo-discover','backup-policy-validate']);
  sim.act('backup-strategy-validate',{daily:'1',weekly:'2',monthly:'6'});assert.equal(ready(sim),false);
  sim.act('backup-strategy-validate',{daily:'7',weekly:'4',monthly:'12'});
  assert.equal(ready(sim),true);
});

test('Aula 37 inicializa repositório S3 com criptografia',()=>{
  const sim=new TerminalSimulator(37);
  sim.act('repo-config-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat repo-credenciais-plano.txt','backup-repo-test s3://aurora-backups/ns8','backup-repo-init','backup-repo-status']);
  sim.act('repo-config-validate');
  assert.equal(ready(sim),true);
});

test('Aula 38 executa backups granulares de core e aplicação',()=>{
  const sim=new TerminalSimulator(38);
  sim.act('granular-backup-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat escopo-backup-granular.txt','backup-plan-list','backup-run core','backup-run mail1','backup-snapshot-list']);
  sim.act('granular-backup-validate');
  assert.equal(ready(sim),true);
});

test('Aula 39 recupera Nextcloud corrompido via restore granular',()=>{
  const sim=new TerminalSimulator(39);
  sim.act('dr-restore-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat chamado-desastre-cloud.txt','app-status nextcloud1','backup-snapshot-list nextcloud1','restore-app nextcloud1 b82f91a --confirm','app-status nextcloud1','curl -I https://cloud.lab.example/']);
  sim.act('dr-restore-validate');
  assert.equal(ready(sim),true);
});

test('Aula 40 audita integridade com restic check e certifica revisão 08',()=>{
  const sim=new TerminalSimulator(40);
  sim.act('review8-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat auditoria-resiliencia-escopo.txt','restic-check-repo','dr-drill-simulate --all-apps','dr-metrics-report']);
  sim.act('review8-checklist',{strategy:true,repo:true,granular:true,restore:true,audit:false});assert.equal(ready(sim),false);
  sim.act('review8-checklist',{strategy:true,repo:true,granular:true,restore:true,audit:true});
  sim.act('review8-validate');
  assert.equal(ready(sim),true);
});

test('Aula 41 valida modelo de segurança entre borda e host',()=>{
  const sim=new TerminalSimulator(41);
  sim.act('security-model-validate',{border:'ns8-core',host:'none',container:'root'});assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat modelo-seguranca-escopo.txt','host-firewall-status','border-gateway-probe 192.168.50.1']);
  sim.act('security-model-validate',{border:'ns8-core',host:'none',container:'root'});assert.equal(ready(sim),false);
  sim.act('security-model-validate',{border:'nethsecurity',host:'nftables',container:'podman'});
  assert.equal(ready(sim),true);
});

test('Aula 42 pareia NethSecurity Controller e aplica Port Forwarding',()=>{
  const sim=new TerminalSimulator(42);
  sim.act('nethsec-integration-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat integracao-nethsec-plano.txt','nethsec-controller-status','nethsec-appliance-pair --host 192.168.50.1','nethsec-nat-apply --port-map "80:80,443:443,25:25,587:587"','nethsec-audit-forwarding']);
  sim.act('nethsec-integration-validate');
  assert.equal(ready(sim),true);
});

test('Aula 43 audita rotas Traefik e aplica headers de proteção',()=>{
  const sim=new TerminalSimulator(43);
  sim.act('traefik-config-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat traefik-rotas-escopo.txt','traefik-routes-list','traefik-cert-audit cloud.lab.example','traefik-security-headers-apply cloud.lab.example --hsts --nosniff','curl -I https://cloud.lab.example/']);
  sim.act('traefik-config-validate');
  assert.equal(ready(sim),true);
});

test('Aula 44 valida malha WireGuard e segmentação de VPNs',()=>{
  const sim=new TerminalSimulator(44);
  sim.act('vpn-architecture-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat vpn-arquitetura-plano.txt','cluster-vpn-status','nethsec-vpn-audit 192.168.50.1','vpn-mesh-ping 10.5.4.1','vpn-security-validate']);
  sim.act('vpn-architecture-validate');
  assert.equal(ready(sim),true);
});

test('Aula 45 resolve incidente de borda e conclui revisão 09',()=>{
  const sim=new TerminalSimulator(45);
  sim.act('review9-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat chamado-incidente-seguranca.txt','nethsec-audit-forwarding','nethsec-nat-revoke --rule admin-wan','nethsec-threatshield-enable','edge-security-audit']);
  sim.act('review9-checklist',{model:true,controller:true,traefik:true,vpn:true,incident:false});assert.equal(ready(sim),false);
  sim.act('review9-checklist',{model:true,controller:true,traefik:true,vpn:true,incident:true});
  sim.act('review9-validate');
  assert.equal(ready(sim),true);
});

test('Aula 46 instala Roundcube Webmail e valida FQDN',()=>{
  const sim=new TerminalSimulator(46);
  sim.act('roundcube-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat roundcube-plano.txt','app-catalog-search roundcube','app-install roundcube --instance roundcube1','app-status roundcube1','curl -I https://webmail.aurora.lab/']);
  sim.act('roundcube-validate');
  assert.equal(ready(sim),true);
});

test('Aula 47 instala Mattermost e integra com Samba AD',()=>{
  const sim=new TerminalSimulator(47);
  sim.act('mattermost-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat mattermost-escopo.txt','app-install mattermost --instance mattermost1','app-auth-bind mattermost1 samba1','mattermost-team-create --name aurora --channel "geral,ti,financeiro"','curl -I https://chat.aurora.lab/']);
  sim.act('mattermost-validate');
  assert.equal(ready(sim),true);
});

test('Aula 48 implanta Apache Guacamole e audita RDP clientless',()=>{
  const sim=new TerminalSimulator(48);
  sim.act('guacamole-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat guacamole-plano.txt','app-install guacamole --instance guacamole1','guacamole-connection-add --name "Estacao-Ana-Win10" --protocol rdp --host 192.168.50.50','guacamole-audit-connections','curl -I https://remote.aurora.lab/']);
  sim.act('guacamole-validate');
  assert.equal(ready(sim),true);
});

test('Aula 49 provisiona Vaultwarden e fecha cadastro aberto',()=>{
  const sim=new TerminalSimulator(49);
  sim.act('vaultwarden-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat vaultwarden-escopo.txt','app-install vaultwarden --instance vaultwarden1','vaultwarden-admin-policy --disable-open-registration','vaultwarden-org-create --name "Aurora-TI" --collection "Servidores,Switches"','curl -I https://vault.aurora.lab/']);
  sim.act('vaultwarden-validate');
  assert.equal(ready(sim),true);
});

test('Aula 50 audita catálogo de aplicações e conclui revisão 10',()=>{
  const sim=new TerminalSimulator(50);
  sim.act('review10-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat auditoria-catalogo-escopo.txt','app-catalog-audit','podman-stats-summary','cluster-app-smoke-test']);
  sim.act('review10-checklist',{roundcube:true,mattermost:true,guacamole:true,vaultwarden:true,governance:false});assert.equal(ready(sim),false);
  sim.act('review10-checklist',{roundcube:true,mattermost:true,guacamole:true,vaultwarden:true,governance:true});
  sim.act('review10-validate');
  assert.equal(ready(sim),true);
});

test('Aula 51 planeja expansão multi-nó e gera join token',()=>{
  const sim=new TerminalSimulator(51);
  sim.act('cluster-plan-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat cluster-multinode-plano.txt','cluster-nodes-list','cluster-vpn-mesh-status','cluster-join-token-generate']);
  sim.act('cluster-plan-validate');
  assert.equal(ready(sim),true);
});

test('Aula 52 ingresse nó worker e valida topologia multi-nó',()=>{
  const sim=new TerminalSimulator(52);
  sim.act('worker-enroll-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat worker-join-escopo.txt','node-prereq-check ns8-worker-02','cluster-node-add --host 192.168.50.11 --token AURORA-JOIN-TOKEN','cluster-nodes-status']);
  sim.act('worker-enroll-validate');
  assert.equal(ready(sim),true);
});

test('Aula 53 migra Nextcloud para worker e audita rotas Traefik',()=>{
  const sim=new TerminalSimulator(53);
  sim.act('workload-migration-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat workload-migration-plano.txt','app-node-list','app-migrate nextcloud1 --target-node ns8-worker-02','traefik-mesh-routes-audit']);
  sim.act('workload-migration-validate');
  assert.equal(ready(sim),true);
});

test('Aula 54 monta armazenamento NFS corporativo e valida locking',()=>{
  const sim=new TerminalSimulator(54);
  sim.act('cluster-storage-validate-action');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat storage-distribuido-plano.txt','node-storage-audit','cluster-nfs-mount --server 192.168.50.20 --path /srv/shared-nfs','cluster-storage-validate']);
  sim.act('cluster-storage-validate-action');
  assert.equal(ready(sim),true);
});

test('Aula 55 simula failover de nó e conclui revisão 11',()=>{
  const sim=new TerminalSimulator(55);
  sim.act('review11-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat resiliencia-cluster-escopo.txt','cluster-failover-simulate --offline-node ns8-worker-02','cluster-health-probe','cluster-node-recover --node ns8-worker-02','cluster-resilience-audit']);
  sim.act('review11-checklist',{mesh:true,join:true,migration:true,storage:true,resilience:false});assert.equal(ready(sim),false);
  sim.act('review11-checklist',{mesh:true,join:true,migration:true,storage:true,resilience:true});
  sim.act('review11-validate');
  assert.equal(ready(sim),true);
});

test('Aula 56 diagnostica fila do Redis e desobstrui tarefa com retry',()=>{
  const sim=new TerminalSimulator(56);
  sim.act('troubleshooting-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat troubleshooting-cluster-guia.txt','cluster-redis-status','cluster-task-list --status failed','cluster-task-retry --task-id T-3091','cluster-health-check']);
  sim.act('troubleshooting-validate');
  assert.equal(ready(sim),true);
});

test('Aula 57 executa rolling update sequencial e audita versoes',()=>{
  const sim=new TerminalSimulator(57);
  sim.act('rolling-update-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat rolling-update-politica.txt','cluster-updates-check','cluster-update-apply --target-node ns8-worker-02 --rolling','cluster-update-apply --target-node ns8-lab-01','cluster-version-audit']);
  sim.act('rolling-update-validate');
  assert.equal(ready(sim),true);
});

test('Aula 58 configura metricas Prometheus e valida webhook de alerta',()=>{
  const sim=new TerminalSimulator(58);
  sim.act('observability-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat monitoramento-metricas-plano.txt','cluster-metrics-status','cluster-alerts-configure --threshold-cpu 85 --threshold-ram 90 --channel webhook','cluster-metrics-test']);
  sim.act('observability-validate');
  assert.equal(ready(sim),true);
});

test('Aula 59 rotaciona segredos de API e homologa conformidade ISO 27001',()=>{
  const sim=new TerminalSimulator(59);
  sim.act('hardening-governance-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat hardening-governanca-escopo.txt','cluster-secrets-rotate --scope admin-api','cluster-firewall-compliance-audit','cluster-security-scorecard']);
  sim.act('hardening-governance-validate');
  assert.equal(ready(sim),true);
});

test('Aula 60 homologa operacao autonoma e conclui certificacao final',()=>{
  const sim=new TerminalSimulator(60);
  sim.act('review12-validate');assert.equal(ready(sim),false);
  run(sim,['whoami','hostname','cat operacao-autonoma-chamado.txt','cluster-full-diagnostics','cluster-bcp-readiness-probe','cluster-end-to-end-acceptance']);
  sim.act('review12-checklist',{infra:true,identity:true,collab:true,storage:true,security:true,continuity:false});assert.equal(ready(sim),false);
  sim.act('review12-checklist',{infra:true,identity:true,collab:true,storage:true,security:true,continuity:true});
  sim.act('review12-validate');
  assert.equal(ready(sim),true);
});



