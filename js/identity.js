const DOCS='docs.lab.example';
const ok=output=>({output,error:false});
const fail=output=>({output,error:true});
const flag=(sim,name)=>{sim.flags[name]=true;};
export const identityCommands={
 15:['cat atualizacao-plano.txt','update-plan','task-list','update-status',`curl -I https://${DOCS}/`],
 16:['cat identidade-pedido.txt','domain-list','provider-list'],
 17:['cat matriz-identidade.txt','dns-check aurora.lab','time-check'],
 18:['cat samba-plano.txt','domain-list','domain-status aurora.lab','host -t SRV _ldap._tcp.aurora.lab']
};
export function initIdentity(sim){
 if(sim.id===15) sim.lab.update={approved:false,run:false,window:'',scope:'',status:'pending'};
 if(sim.id===16) sim.lab.identityMap={};
 if(sim.id===17) sim.lab.identityPlan={type:'',domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA'};
 if(sim.id===18) sim.lab.samba={domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA',created:false};
}
export function identityCommand(sim,line){
 if(sim.id===15){
  if(line==='cat atualizacao-plano.txt'){flag(sim,'updateRequest');return ok('Janela aprovada: domingo 22h-23h.\nEscopo: security-core.\nValidar depois: docs.lab.example e tarefas completed.\nRetorno: interromper e escalar se status failed.');}
  if(line==='update-plan'){flag(sim,'updatePlan');return ok('security-core: patches de seguranca e componentes base\napps: sem mudanca nesta janela\nimpacto esperado: reinicio curto de componentes internos');}
  if(line==='task-list'){flag(sim,'taskList');return ok('Nenhuma tarefa running antes da manutencao.\nUltima tarefa: T-1042 completed.');}
  if(line==='update-status'){if(!sim.lab.update?.run)return fail('Nenhuma atualizacao executada neste cenario.');flag(sim,'updateStatus');return ok('Update U-1501 completed\nchanged: security-core\nreboot-required: no');}
  if(line===`curl -I https://${DOCS}/`){if(!sim.lab.update?.run)return fail('HTTP 200, mas ainda e teste antes da manutencao. Execute a atualizacao primeiro.');flag(sim,'updateHttp');return ok('HTTP/2 200\nx-ns8-instance: docs1\nx-maintenance-check: after-update');}
 }
 if(sim.id===16){
  if(line==='cat identidade-pedido.txt'){flag(sim,'identityRequest');return ok('RH Aurora: pessoas = Ana, Bruno, Carla.\nDepartamentos: financeiro, suporte.\nPedido: preparar identidade central. Nao criar usuarios ainda.');}
  if(line==='domain-list'){flag(sim,'domainList');return ok('User domains: none');}
  if(line==='provider-list'){flag(sim,'providerList');return ok('Account providers: none configured');}
 }
 if(sim.id===17){
  if(line==='cat matriz-identidade.txt'){flag(sim,'identityMatrix');return ok('Cenario: sem AD corporativo disponivel no laboratorio.\nObjetivo: criar dominio Samba didatico.\nDominio: aurora.lab\nRealm: AURORA.LAB\nNetBIOS: AURORA\nIntegracao de estacao: proxima aula.');}
  if(line==='dns-check aurora.lab'){flag(sim,'dnsCheck');return ok('aurora.lab disponivel no DNS privado do laboratorio.\nSem conflito com dominio de producao.');}
  if(line==='time-check'){flag(sim,'timeCheck');return ok('NTP ativo; desvio estimado < 1s entre cliente e ns8-lab-01.');}
 }
 if(sim.id===18){
  if(line==='cat samba-plano.txt'){flag(sim,'sambaPlan');return ok('Plano aprovado: domain=aurora.lab realm=AURORA.LAB netbios=AURORA.\nCriar dominio Samba no laboratorio.\nNao ingressar estacao nesta aula.');}
  if(line==='domain-list'){flag(sim,'domainList');return ok(sim.lab.samba?.created?'aurora.lab  samba-ad  running':'User domains: none');}
  if(line==='domain-status aurora.lab'){if(!sim.lab.samba?.created)return fail('Dominio aurora.lab ainda nao existe.');flag(sim,'domainStatus');return ok('aurora.lab: running\nprovider: samba-ad\nrealm: AURORA.LAB\nnetbios: AURORA');}
  if(line==='host -t SRV _ldap._tcp.aurora.lab'){if(!sim.lab.samba?.created)return fail('NXDOMAIN: dominio ainda nao criado no cenario.');flag(sim,'srvCheck');return ok('_ldap._tcp.aurora.lab has SRV record 0 100 389 ns8-lab-01.aurora.lab.');}
 }
 return null;
}
export function identityAction(sim,action,values={}){
 if(sim.id===15){
  if(action==='update-approve'){
   if(!['updateRequest','updatePlan','taskList'].every(k=>sim.flags[k])) return 'Leia plano, escopo e tarefas antes de aprovar.';
   if(values.window!=='domingo-22h'||values.scope!=='security-core') return 'A janela aprovada é domingo 22h e o escopo é security-core.';
   sim.lab.update={approved:true,run:false,window:values.window,scope:values.scope,status:'approved'};sim.flags.updateApproved=true;for(const k of ['updateRun','updateStatus','updateHttp','updateVerified'])sim.flags[k]=false;return 'Janela aprovada no cenário. Execute a atualização simulada.';
  }
  if(action==='update-run'){if(!sim.lab.update?.approved)return 'Aprove a janela correta antes de executar.';sim.lab.update.run=true;sim.lab.update.status='completed';sim.flags.updateRun=true;for(const k of ['updateStatus','updateHttp','updateVerified'])sim.flags[k]=false;return 'Atualização simulada executada. Consulte update-status e teste a aplicação.';}
  if(action==='update-validate'){if(sim.lab.update?.run&&sim.flags.updateStatus&&sim.flags.updateHttp){sim.flags.updateVerified=true;return 'Manutenção encerrada com status completed e HTTP 200 pós-mudança.';}return 'Faltam update-status e curl depois da execução.';}
  if(action==='update-reset'){sim.lab.update={approved:false,run:false,window:'',scope:'',status:'pending'};for(const k of ['updateApproved','updateRun','updateStatus','updateHttp','updateVerified'])sim.flags[k]=false;return 'Atualização voltou ao estado pendente no cenário.';}
 }
 if(sim.id===16){
  if(action==='identity-map'){
   sim.lab.identityMap={...values};
   const good=values.person==='user'&&values.department==='group'&&values.domain==='user-domain'&&values.backend==='provider';
   sim.flags.identityMapped=good;
   return good?'Conceitos classificados. Valide o estado inicial de identidade.':'Há conceitos trocados. Separe pessoa, grupo, domínio e provedor.';
  }
  if(action==='identity-validate'){if(sim.flags.identityMapped&&sim.flags.domainList&&sim.flags.providerList){sim.flags.identityVerified=true;return 'Identidade validada: nenhum domínio ativo; próxima etapa é planejar provedor.';}return 'Classifique conceitos e consulte domain-list/provider-list antes de validar.';}
 }
 if(sim.id===17){
  if(action==='identity-plan'){
   sim.lab.identityPlan={...values};
   const good=values.type==='samba-ad-lab'&&values.domain==='aurora.lab'&&values.realm==='AURORA.LAB'&&values.netbios==='AURORA';
   sim.flags.identityPlan=good;
   sim.flags.identityPlanVerified=false;
   return good?'Plano de identidade correto. Valide a arquitetura.':'O plano não bate com matriz, domínio, realm ou NetBIOS aprovados.';
  }
  if(action==='identity-plan-validate'){if(sim.flags.identityPlan&&sim.flags.dnsCheck&&sim.flags.timeCheck){sim.flags.identityPlanVerified=true;return 'Plano aprovado para criar domínio Samba de laboratório na próxima aula.';}return 'Faltam DNS, horário ou plano correto.';}
 }
 if(sim.id===18){
  if(action==='samba-create'){
   if(!sim.flags.sambaPlan||!sim.flags.domainList)return 'Leia o plano e consulte domain-list antes de criar.';
   if(values.domain!=='aurora.lab'||values.realm!=='AURORA.LAB'||values.netbios!=='AURORA')return 'Use exatamente aurora.lab, AURORA.LAB e AURORA.';
   sim.lab.samba={domain:values.domain,realm:values.realm,netbios:values.netbios,created:true};sim.flags.sambaCreated=true;for(const k of ['domainStatus','srvCheck','sambaVerified'])sim.flags[k]=false;return 'Domínio Samba criado no cenário. Valide status e SRV.';
  }
  if(action==='samba-validate'){if(sim.lab.samba?.created&&sim.flags.domainStatus&&sim.flags.srvCheck){sim.flags.sambaVerified=true;return 'Domínio validado: running e SRV LDAP resolvido. Join de estação fica pendente.';}return 'Consulte domain-status e SRV antes de validar.';}
  if(action==='samba-reset'){sim.lab.samba={domain:'aurora.lab',realm:'AURORA.LAB',netbios:'AURORA',created:false};for(const k of ['sambaCreated','domainStatus','srvCheck','sambaVerified'])sim.flags[k]=false;return 'Domínio removido do cenário.';}
 }
 return null;
}
