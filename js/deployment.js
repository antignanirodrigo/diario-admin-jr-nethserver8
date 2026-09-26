const FQDN='ns8-lab-01.lab.example';
const STATIC_IP='192.168.50.10';
const DHCP_IP='192.168.50.77';
const DNS='192.168.50.53';
const VPN='10.5.4.0/24';
const ok=output=>({output,error:false});
const fail=output=>({output,error:true});
const phase=(sim)=>sim.id===7?(sim.lab.network==='static'?'after':'before'):'';
const flag=(sim,name)=>{sim.flags[name]=true;};
export const deploymentCommands={
 7:['cat plano-rede.txt','ip -br addr','ip route','cat /etc/resolv.conf','timedatectl',`dig +short ${FQDN}`,'curl -I https://distfeed.nethserver.org/'],
 8:['cat preflight.txt','install-ns8 --simulate','reboot-simulado','status-ns8',`curl -I https://${FQDN}/cluster-admin/`],
 9:['cat cluster-plano.txt',`dig +short ${FQDN}`,'status-cluster'],
 10:['cat entrega-inicial.txt','status-cluster']
};
export function initDeployment(sim){
 if(sim.id===7) sim.lab.network='dhcp';
 if(sim.id===8) sim.lab.install='clean';
 if(sim.id===9) sim.lab.cluster='none';
 if(sim.id===10) sim.lab.adminPassword='default';
}
export function deploymentCommand(sim,line){
 if(sim.id===7){
  const p=phase(sim);
  if(line==='cat plano-rede.txt'){flag(sim,'networkPlan');return ok('Plano aprovado: ns8-lab-01.lab.example -> 192.168.50.10/24\nGateway: 192.168.50.1\nDNS externo: 192.168.50.53\nPerfil atual entregue: DHCP 192.168.50.77');}
  if(line==='ip -br addr'){flag(sim,p+'_ip');return ok(`lo UNKNOWN 127.0.0.1/8\nens18 UP ${sim.lab.network==='static'?STATIC_IP:DHCP_IP}/24`);}
  if(line==='ip route'){flag(sim,p+'_route');return ok(`default via 192.168.50.1 dev ens18\n192.168.50.0/24 dev ens18 proto kernel scope link src ${sim.lab.network==='static'?STATIC_IP:DHCP_IP}`);}
  if(line==='cat /etc/resolv.conf'){flag(sim,p+'_dns');return ok(`# DNS externo do laboratorio\nnameserver ${DNS}`);}
  if(line==='timedatectl'){flag(sim,p+'_clock');return ok('System clock synchronized: yes\nNTP service: active\nTime zone: Etc/UTC (UTC, +0000)');}
  if(line===`dig +short ${FQDN}`){flag(sim,p+'_fqdn');return ok(sim.lab.network==='static'?STATIC_IP:DHCP_IP);}
  if(line==='curl -I https://distfeed.nethserver.org/'){flag(sim,p+'_net');return ok('HTTP/2 200\n[Simulacao: conectividade HTTPS de saida disponivel]');}
 }
 if(sim.id===8){
  if(line==='cat preflight.txt'){flag(sim,'preflight');return ok('Preflight: recursos aprovados; IP estatico 192.168.50.10; DNS externo 192.168.50.53; FQDN resolvido; Internet OK.\nEscopo: instalar base e testar Cluster Admin. Nao criar cluster nesta aula.');}
  if(line==='install-ns8 --simulate'){if(!sim.flags.preflight)return fail('Leia cat preflight.txt antes de instalar.');sim.lab.install='installed';flag(sim,'installRun');return ok('Instalacao NS8 SIMULADA concluida.\nRepresenta: curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash\nProxima acao: reboot.');}
  if(line==='reboot-simulado'){if(sim.lab.install!=='installed')return fail('Nada instalado para reiniciar neste cenario.');sim.lab.install='rebooted';flag(sim,'rebooted');return ok('Reboot simulado concluido. Sistema voltou com componentes base do NS8.');}
  if(line==='status-ns8'){if(sim.lab.install!=='rebooted')return fail('Verifique depois do reboot-simulado.');flag(sim,'status');return ok('ns8-core: active\ncluster-admin: active\ncluster: not-created');}
  if(line===`curl -I https://${FQDN}/cluster-admin/`){if(!sim.flags.status)return fail('Confirme status-ns8 antes do primeiro acesso.');flag(sim,'firstAccess');return ok('HTTP/2 200\ncontent-type: text/html\n[Cluster Admin respondeu; cluster ainda nao criado.]');}
 }
 if(sim.id===9){
  if(line==='cat cluster-plano.txt'){flag(sim,'clusterPlan');return ok('Caso: novo cluster Aurora, sem cluster anterior e sem backup.\nLeader FQDN: ns8-lab-01.lab.example\nRotulo: aurora-lab\nVPN aprovada: 10.5.4.0/24\nRedes existentes: 192.168.50.0/24 e 10.10.0.0/16');}
  if(line===`dig +short ${FQDN}`){flag(sim,'leaderFqdn');return ok(STATIC_IP);}
  if(line==='status-cluster'){return ok(sim.lab.cluster==='created'?'Cluster: aurora-lab\nLeader: ns8-lab-01\nNodes: 1\nVPN: 10.5.4.0/24\nHA: nao demonstrada':'Cluster: not-created');}
 }
 if(sim.id===10){
  if(line==='cat entrega-inicial.txt'){flag(sim,'handoffPlan');return ok('Entrega inicial: URL https://ns8-lab-01.lab.example/cluster-admin/\nResponsavel: Equipe TI Aurora\nObrigatorio: trocar senha admin padrao, registrar limite de no unico e pendencias.\nNao registrar senha em texto claro.');}
  if(line==='status-cluster'){flag(sim,'clusterStatus');return ok('Cluster: aurora-lab\nLeader: ns8-lab-01\nNodes: 1\nAdmin password: '+(sim.lab.adminPassword==='changed'?'changed':'default')+'\nApplications: none');}
 }
 return null;
}
export function deploymentAction(sim,action,values={}){
 if(sim.id===7){
  if(action==='network-profile'){
   if(!['networkPlan','before_ip','before_route','before_dns','before_clock','before_fqdn','before_net'].every(k=>sim.flags[k])) return 'Colete plano e seis testes antes de aplicar o perfil estatico.';
   if(values.profile!=='static') return 'O chamado autoriza o perfil estatico aprovado. DHCP nao libera a instalacao.';
   sim.lab.network='static';sim.flags.networkProfile=true;for(const k of ['after_ip','after_route','after_dns','after_clock','after_fqdn','after_net','networkVerified'])sim.flags[k]=false;return 'Perfil estatico aplicado no cenario. Repita os seis testes.';
  }
  if(action==='network-validate'){
   if(sim.lab.network==='static'&&['after_ip','after_route','after_dns','after_clock','after_fqdn','after_net'].every(k=>sim.flags[k])){sim.flags.networkVerified=true;return 'Rede validada: IP estatico, DNS externo, FQDN e saida HTTPS coerentes.';}
   return 'Ainda faltam testes pos-alteracao.';
  }
  if(action==='network-reset'){sim.lab.network='dhcp';for(const k of Object.keys(sim.flags))if(k.startsWith('after_')||['networkProfile','networkVerified'].includes(k))sim.flags[k]=false;return 'DHCP restaurado no cenario; validacao final removida.';}
 }
 if(sim.id===8){
  if(action==='access-log'){if(!sim.flags.firstAccess)return 'Teste o primeiro acesso HTTPS antes de registrar.';if(values.state!=='not-created')return 'Nesta aula o cluster ainda deve ficar pendente.';sim.flags.accessLogged=true;return 'Primeiro acesso registrado corretamente: painel responde, cluster pendente.';}
  if(action==='install-reset'){sim.lab.install='clean';for(const k of ['installRun','rebooted','status','firstAccess','accessLogged'])sim.flags[k]=false;return 'Estado pre-instalacao restaurado no cenario.';}
 }
 if(sim.id===9){
  if(action==='cluster-create'){
   if(!sim.flags.clusterPlan||!sim.flags.leaderFqdn)return 'Leia o plano e valide o FQDN do lider antes de criar.';
   if(values.mode!=='create')return 'Join e Restore nao combinam com este chamado inicial.';
   if((values.label||'').trim()!=='aurora-lab'||(values.vpn||'').trim()!==VPN)return 'Use rotulo aurora-lab e VPN 10.5.4.0/24 aprovados.';
   sim.lab.cluster='created';sim.flags.clusterCreated=true;sim.flags.clusterVerified=false;return 'Cluster aurora-lab criado no cenario. Valide o resumo.';
  }
  if(action==='cluster-validate'){if(sim.lab.cluster==='created'){sim.flags.clusterVerified=true;return 'Resumo validado: um unico no lider, sem HA demonstrada.';}return 'Crie o cluster antes de validar.';}
  if(action==='cluster-reset'){sim.lab.cluster='none';sim.flags.clusterCreated=false;sim.flags.clusterVerified=false;return 'Cluster removido no cenario; voltou ao estado instalado sem cluster.';}
 }
 if(sim.id===10){
  if(action==='password-change'){if(!sim.flags.clusterStatus)return 'Confira status-cluster antes de trocar o estado da credencial.';sim.lab.adminPassword='changed';sim.flags.passwordChanged=true;sim.flags.handoffVerified=false;return 'Senha padrao removida no cenario. Nao registre o segredo no diario.';}
  if(action==='handoff-checklist'){if(!sim.flags.passwordChanged)return 'Troque a senha padrao antes do checklist final.';const needed=['url','owner','single','pending','next'];const ok=needed.every(k=>values[k]);sim.flags.handoffChecklist=ok;return ok?'Checklist completo. Valide a entrega inicial.':'Marque todos os itens do checklist.';}
  if(action==='handoff-validate'){if(sim.flags.handoffChecklist&&sim.lab.adminPassword==='changed'){sim.flags.handoffVerified=true;return 'Entrega inicial validada sem expor segredo.';}return 'Checklist e troca de senha ainda precisam estar completos.';}
  if(action==='password-reset'){sim.lab.adminPassword='default';for(const k of ['passwordChanged','handoffChecklist','handoffVerified'])sim.flags[k]=false;return 'Senha padrao restaurada no cenario; entrega invalidada.';}
 }
 return null;
}
