const FQDN='ns8-lab-01.lab.example';
const DOCS='docs.lab.example';
const IP='192.168.50.10';
const ok=output=>({output,error:false});
const fail=output=>({output,error:true});
const flag=(sim,name)=>{sim.flags[name]=true;};
export const operationCommands={
 11:['cat mapa-cluster.txt','status-cluster','inventario-admin'],
 12:['cat app-pedido.txt','software-center-list','install-app --simulate docs1','app-status docs1'],
 13:['cat rota-pedido.txt',`dig +short ${DOCS}`,`route-status ${DOCS}`,`curl -I https://${DOCS}/`],
 14:['cat incidente-log.txt','task-list','app-log docs1','task-watch T-1042',`curl -I https://${DOCS}/`]
};
export function initOperations(sim){
 if(sim.id===11) sim.lab.areas={};
 if(sim.id===12) sim.lab.app={selected:'',installed:false};
 if(sim.id===13) sim.lab.route='oldapp';
 if(sim.id===14) sim.lab.task='running';
}
export function operationCommand(sim,line){
 if(sim.id===11){
  if(line==='cat mapa-cluster.txt'){flag(sim,'adminMap');return ok('Cluster Admin: Nodes, Software Center, User domains, Settings.\nEstado esperado: lider ns8-lab-01, sem apps e sem dominios nesta etapa.');}
  if(line==='status-cluster'){flag(sim,'clusterStatus');return ok('Cluster: aurora-lab\nLeader: ns8-lab-01\nNodes: 1\nHealth: OK');}
  if(line==='inventario-admin'){flag(sim,'adminInventory');return ok('Nodes: ns8-lab-01\nApplications: none\nUser domains: none\nPending: install docs1 pilot');}
 }
 if(sim.id===12){
  if(line==='cat app-pedido.txt'){flag(sim,'appRequest');return ok('Autorizado: instalar uma aplicacao piloto docs1 no no ns8-lab-01 usando volume padrao.\nNao instalar mail1 nem nextcloud1 nesta aula.');}
  if(line==='software-center-list'){flag(sim,'catalog');return ok('docs1 - Documentacao interna (piloto ficticio)\nnextcloud1 - Colaboracao\nmail1 - Correio\nStatus: nenhuma instalada');}
  if(line==='install-app --simulate docs1'){if(sim.lab.app?.selected!=='docs1')return fail('Selecione docs1 no painel antes da instalacao simulada.');sim.lab.app.installed=true;flag(sim,'appInstalled');return ok('Instalacao simulada de docs1 concluida no no ns8-lab-01.');}
  if(line==='app-status docs1'){if(!sim.lab.app?.installed)return fail('docs1 ainda nao foi instalada no cenario.');flag(sim,'appStatus');return ok('docs1: running\nnode: ns8-lab-01\nroute: pending\nbackup: pending');}
 }
 if(sim.id===13){
  if(line==='cat rota-pedido.txt'){flag(sim,'routeRequest');return ok('Publicar docs1 em https://docs.lab.example/\nDNS esperado: docs.lab.example -> 192.168.50.10\nRota atual suspeita: oldapp');}
  if(line===`dig +short ${DOCS}`){flag(sim,'routeDns');return ok(IP);}
  if(line===`route-status ${DOCS}`){if(sim.lab.route==='docs1')flag(sim,'routeAfter');else flag(sim,'routeBefore');return ok(`${DOCS} -> ${sim.lab.route}`);}
  if(line===`curl -I https://${DOCS}/`){if(sim.lab.route!=='docs1')return fail('HTTP 502\nRota aponta para oldapp neste cenario.');flag(sim,'routeHttp');return ok('HTTP/2 200\nx-ns8-instance: docs1\n[Certificado de laboratorio confiavel]');}
 }
 if(sim.id===14){
  if(line==='cat incidente-log.txt'){flag(sim,'logIncident');return ok('Relato: docs1 ficou carregando apos ajuste de rota.\nEscopo: investigar tarefas e logs. Nao reinstalar.');}
  if(line==='task-list'){flag(sim,'taskList');return ok(`T-1042 configure docs1 route ${sim.lab.task}`);}
  if(line==='app-log docs1'){flag(sim,'appLog');return ok('docs1: waiting for route task T-1042\nno fatal error detected\nlast known HTTP probe pending');}
  if(line==='task-watch T-1042'){if(sim.lab.task!=='completed')return fail('T-1042 ainda esta running. Use Avancar tarefa no painel.');flag(sim,'taskWatch');return ok('T-1042 completed\nroute docs.lab.example applied');}
  if(line===`curl -I https://${DOCS}/`){if(sim.lab.task!=='completed')return fail('HTTP 503\nOperacao ainda em andamento.');flag(sim,'logHttp');return ok('HTTP/2 200\nx-ns8-instance: docs1');}
 }
 return null;
}
export function operationAction(sim,action,values={}){
 if(sim.id===11){
  if(action==='areas-map'){sim.lab.areas={...values};sim.flags.areasMapped=values.nodes==='node'&&values.apps==='software'&&values.users==='domains'&&values.settings==='settings';return sim.flags.areasMapped?'Áreas mapeadas. Valide o inventário inicial.':'Há áreas trocadas. Separe nó, aplicações, identidades e configurações.';}
  if(action==='inventory-validate'){if(sim.flags.areasMapped&&sim.flags.adminInventory){sim.flags.inventoryVerified=true;return 'Inventário inicial validado: cluster saudável, sem apps e sem domínios.';}return 'Mapeie as áreas e consulte inventario-admin antes de validar.';}
 }
 if(sim.id===12){
  if(action==='app-select'){if(values.app!=='docs1'||values.node!=='ns8-lab-01'||values.volume!=='default')return 'Use docs1, ns8-lab-01 e volume padrão conforme o chamado.';sim.lab.app={selected:'docs1',installed:false};sim.flags.appSelected=true;sim.flags.appInstalled=false;sim.flags.appStatus=false;sim.flags.appVerified=false;return 'docs1 selecionada para instalação simulada.';}
  if(action==='app-validate'){if(sim.lab.app?.installed&&sim.flags.appStatus){sim.flags.appVerified=true;return 'Aplicação piloto validada como running; rota e backup continuam pendentes.';}return 'Instale e consulte app-status docs1 antes de validar.';}
  if(action==='app-remove'){sim.lab.app={selected:'',installed:false};for(const k of ['appSelected','appInstalled','appStatus','appVerified'])sim.flags[k]=false;return 'Aplicação removida do cenário.';}
 }
 if(sim.id===13){
  if(action==='route-apply'){if(!sim.flags.routeRequest||!sim.flags.routeDns||!sim.flags.routeBefore)return 'Leia pedido, DNS e rota atual antes de alterar.';if(values.target!=='docs1')return 'O alvo autorizado é docs1.';sim.lab.route='docs1';sim.flags.routeFixed=true;sim.flags.routeAfter=false;sim.flags.routeHttp=false;sim.flags.routeVerified=false;return 'Rota aplicada para docs1. Repita route-status e curl.';}
  if(action==='route-validate'){if(sim.lab.route==='docs1'&&sim.flags.routeAfter&&sim.flags.routeHttp){sim.flags.routeVerified=true;return 'Publicação validada: DNS, rota e HTTPS coerentes.';}return 'Ainda faltam route-status e curl depois da alteração.';}
  if(action==='route-reset'){sim.lab.route='oldapp';for(const k of ['routeFixed','routeAfter','routeHttp','routeVerified'])sim.flags[k]=false;return 'Rota voltou para oldapp; validação removida.';}
 }
 if(sim.id===14){
  if(action==='task-advance'){if(!sim.flags.taskList||!sim.flags.appLog)return 'Consulte tarefas e log antes de avançar.';sim.lab.task='completed';sim.flags.taskAdvanced=true;sim.flags.taskWatch=false;sim.flags.logHttp=false;sim.flags.logVerified=false;return 'Tarefa T-1042 concluída no cenário.';}
  if(action==='log-validate'){if(sim.lab.task==='completed'&&sim.flags.taskWatch&&sim.flags.logHttp){sim.flags.logVerified=true;return 'Incidente encerrado por evidência: tarefa completed e HTTP 200.';}return 'Acompanhe task-watch e teste HTTP final antes de validar.';}
  if(action==='task-reset'){sim.lab.task='running';for(const k of ['taskAdvanced','taskWatch','logHttp','logVerified'])sim.flags[k]=false;return 'Tarefa voltou para running; conclusão invalidada.';}
 }
 return null;
}
