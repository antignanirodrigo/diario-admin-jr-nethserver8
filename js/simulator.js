import {requirementCommands,requirementCommand,requirementAction} from './requirements.js';
import {deploymentCommands,initDeployment,deploymentCommand,deploymentAction} from './deployment.js';
import {operationCommands,initOperations,operationCommand,operationAction} from './operations.js';
import {identityCommands,initIdentity,identityCommand,identityAction} from './identity.js';
import {fileCommands,initFiles,fileCommand,fileAction} from './files.js';
import {mailCommands,initMail,mailCommand,mailAction} from './mail.js';
import {backupCommands,initBackup,backupCommand,backupAction} from './backup.js';
import {securityCommands,initSecurity,securityCommand,securityAction} from './security.js';
import {appCommands,initApps,appCommand,appAction} from './apps.js';
import {clusterCommands,initCluster,clusterCommand,clusterAction} from './cluster.js';
import {governanceCommands,initGovernance,governanceCommand,governanceAction} from './governance.js';
import {initialInventory, documents, validateInventory, inventoryText, INVENTORY_REVISION} from './inventory.js';
export const FQDN = 'ns8-lab-01.lab.example';
export const TARGET = '192.168.50.10';
export const correctMap = {aurora:'cluster', machine:'node', nextcloud:'application', component:'container'};
export class TerminalSimulator {
  constructor(id) {
    this.id = id; this.user = 'junior'; this.hostname = id === 3 ? 'srv-arquivo-01' : (id === 1 || id === 5) ? 'estacao-junior' : 'ns8-lab-01';
    this.cwd = '/home/junior'; this.history = []; this.flags = {};
    this.lab = {candidate:'', mapping:{}, nodeOn:true, dns:'192.168.50.99', inventory:{hostname:'',network:'',capacity:''}, feedback:''};
    if(id===6) {this.hostname="ns8-prep-01";this.lab.profile="delivered";}
    if(id>=7&&id<=8) {this.hostname="ns8-prep-01";initDeployment(this);}
    if(id>=9&&id<=10) {this.hostname="ns8-lab-01";initDeployment(this);}
    if(id>=11&&id<=14) {this.hostname="ns8-lab-01";initOperations(this);}
    if(id>=15&&id<=18) {this.hostname="ns8-lab-01";initIdentity(this);}
    if(id>=19&&id<=30) {this.hostname="ns8-lab-01";initFiles(this);}
    if(id>=31&&id<=35) {this.hostname="ns8-lab-01";initMail(this);}
    if(id>=36&&id<=40) {this.hostname="ns8-lab-01";initBackup(this);}
    if(id>=41&&id<=45) {this.hostname="ns8-lab-01";initSecurity(this);}
    if(id>=46&&id<=50) {this.hostname="ns8-lab-01";initApps(this);}
    if(id>=51&&id<=55) {this.hostname="ns8-lab-01";initCluster(this);}
    if(id>=56&&id<=60) {this.hostname="ns8-lab-01";initGovernance(this);}
    if(id===5) {this.lab.inventory={...initialInventory}; this.lab.inventoryRevision=INVENTORY_REVISION; this.lab.inventoryErrors={};}
  }
  snapshot() { return JSON.parse(JSON.stringify({id:this.id, user:this.user, hostname:this.hostname, cwd:this.cwd, history:this.history, flags:this.flags, lab:this.lab})); }
  restore(saved) {
    if (saved?.id !== this.id) return;
    if(this.id===5 && saved.lab?.inventoryRevision!==INVENTORY_REVISION) return;
    this.hostname = saved.hostname || this.hostname; this.cwd = saved.cwd || this.cwd;
    this.history = Array.isArray(saved.history) ? saved.history.slice(-200) : [];
    this.flags = {...saved.flags}; this.lab = {...this.lab, ...saved.lab};
  }
  autocomplete(rawLine = '') {
    const line = String(rawLine);
    if (!line.trim()) return { line, matches: [] };
    const trailingSpace = /\s$/.test(line);
    const typedTokens = line.trimStart().split(/\s+/);
    const completedTokens = trailingSpace ? typedTokens : typedTokens.slice(0, -1);
    const currentPrefix = trailingSpace ? '' : (typedTokens[typedTokens.length - 1] || '');
    const before = trailingSpace ? line : line.slice(0, line.length - currentPrefix.length);

    const nextTokenSet = new Set();
    const hasMore = {};
    for (const cmd of this.commands()) {
      const cmdTokens = cmd.trim().split(/\s+/);
      if (cmdTokens.length <= completedTokens.length) continue;
      if (!completedTokens.every((t, i) => cmdTokens[i] === t)) continue;
      const candidate = cmdTokens[completedTokens.length];
      if (candidate.startsWith(currentPrefix)) {
        nextTokenSet.add(candidate);
        if (cmdTokens.length > completedTokens.length + 1) hasMore[candidate] = true;
      }
    }
    const matches = [...nextTokenSet].sort();
    if (matches.length === 1) {
      return { line: before + matches[0] + (hasMore[matches[0]] ? ' ' : ''), matches };
    }
    if (matches.length > 1) {
      const common = matches.reduce((acc, item) => {
        let i = 0;
        while (i < acc.length && i < item.length && acc[i] === item[i]) i++;
        return acc.slice(0, i);
      });
      return { line: common.length > currentPrefix.length ? before + common : line, matches };
    }
    return { line, matches: [] };
  }
  commands() {
    const common = ['help','whoami','hostname','pwd','ls','cd /home/junior','clear'];
    if(this.id===6)return [...common,...requirementCommands];
    if(this.id>=7&&this.id<=10)return [...common,...deploymentCommands[this.id]];
    if(this.id>=11&&this.id<=14)return [...common,...operationCommands[this.id]];
    if(this.id>=15&&this.id<=18)return [...common,...identityCommands[this.id]];
    if(this.id>=19&&this.id<=30)return [...common,...fileCommands[this.id]];
    if(this.id>=31&&this.id<=35)return [...common,...mailCommands[this.id]];
    if(this.id>=36&&this.id<=40)return [...common,...backupCommands[this.id]];
    if(this.id>=41&&this.id<=45)return [...common,...securityCommands[this.id]];
    if(this.id>=46&&this.id<=50)return [...common,...appCommands[this.id]];
    if(this.id>=51&&this.id<=55)return [...common,...clusterCommands[this.id]];
    if(this.id>=56&&this.id<=60)return [...common,...governanceCommands[this.id]];
    return [...common, ...(this.id === 1 ? ['cat /home/junior/chamado.txt'] : this.id === 2 ? ['cat /home/junior/topologia.txt'] : this.id === 3 ? ['ssh junior@192.168.50.10', 'cat /home/junior/LEIA-ME.txt','exit'] : this.id === 5 ? Object.keys(documents).map(name=>'cat /home/junior/'+name) : ['ip -br addr','ip route','cat /etc/resolv.conf','timedatectl',`dig +short ${FQDN}`,`ping -c 2 ${TARGET}`,`curl -I https://${FQDN}/cluster-admin/`])];
  }
  execute(input) {
    const line = input.trim().replace(/\s+/g,' ');
    const ok = output => ({output, error:false}); const fail = output => ({output,error:true});
    if (!line) return ok('');
    this.history.push(line); this.history = this.history.slice(-200);
    if (line === 'clear') return {clear:true,output:'',error:false};
    if (line === 'help') return ok('SIMULAÇÃO EDUCATIVA — nenhum comando real é executado.\nUm comando por linha; sem pipes, redirecionamentos ou instalação.\n'+this.commands().join('\n'));
    if (line === 'whoami') { if (this.id !== 3 || this.hostname === 'ns8-lab-01') this.flags.identity = true; return ok(this.user); }
    if (line === 'hostname') { if (this.id === 3 && this.hostname !== 'ns8-lab-01') this.flags.wrongHost = true; else this.flags.host = true; return ok(this.hostname); }
    if (line === 'pwd') { if (this.id !== 3 || this.hostname === 'ns8-lab-01') this.flags.location = true; return ok(this.cwd); }
    if (line === 'ls' || line === 'ls /home/junior') { if (this.id !== 3 || this.hostname === 'ns8-lab-01') this.flags.listed = true; return ok(this.id === 1 ? 'chamado.txt' : this.id === 2 ? 'topologia.txt' : this.id === 3 && this.hostname === 'ns8-lab-01' ? 'LEIA-ME.txt' : this.id === 5 ? Object.keys(documents).join('  ') : '(nenhum arquivo neste diretório simulado)'); }
    if (['cd /home/junior','cd ~','cd','cd .'].includes(line)) { this.cwd='/home/junior'; return ok(''); }
    if (this.id === 1 && ['cat /home/junior/chamado.txt','cat chamado.txt'].includes(line)) { this.flags.request = true; return ok('CH-NS8-001 — Aurora / laboratório\nObjetivo: estudar arquivos e colaboração.\nCandidatos: LXC; VM limpa; servidor reaproveitado.\nAprovar somente a base do laboratório. Não instalar nesta missão.'); }
    if (this.id === 2 && ['cat /home/junior/topologia.txt','cat topologia.txt'].includes(line)) {this.flags.topology=true; return ok('Aurora: cluster de um nó\nns8-lab-01: VM Linux, nó líder\nnextcloud1: instância de aplicação\nComponente web da aplicação: executado em container\nSem segundo nó ou réplica configurada neste cenário.');}
    if (this.id === 3) {
      if (line === `ssh junior@${TARGET}`) { this.hostname='ns8-lab-01'; this.cwd='/home/junior'; this.flags.connected=true; return ok('Conexão SIMULADA com ns8-lab-01 (192.168.50.10).\nAutenticação e chave SSH omitidas aqui; valide-as em um acesso real.'); }
      if (line === 'exit') { this.hostname='srv-arquivo-01'; this.cwd='/home/junior'; return ok('Sessão simulada encerrada. Retorno a srv-arquivo-01.'); }
      if (['cat /home/junior/LEIA-ME.txt','cat LEIA-ME.txt'].includes(line)) {
        if (this.hostname !== 'ns8-lab-01') return fail('cat: arquivo não encontrado nesta máquina. Confira o destino autorizado.');
        this.flags.guide=true; return ok('AMBIENTE: laboratório\nHOST: ns8-lab-01\nIP: 192.168.50.10\nREGRA: observar antes de alterar\nESCOPO: confirmar contexto e ler; não instalar nem modificar.');
      }
    }
    if(this.id===5 && line.startsWith('cat ')) {
      const path=line.slice(4); const name=path.startsWith('/home/junior/')?path.slice(13):path;
      if(documents[name]) {const [flag,body]=documents[name]; this.flags[flag]=true; return ok(body);}
    }
    if(this.id===6){const result=requirementCommand(this,line);if(result)return result;}
    if(this.id>=7&&this.id<=10){const result=deploymentCommand(this,line);if(result)return result;}
    if(this.id>=11&&this.id<=14){const result=operationCommand(this,line);if(result)return result;}
    if(this.id>=15&&this.id<=18){const result=identityCommand(this,line);if(result)return result;}
    if(this.id>=19&&this.id<=30){const result=fileCommand(this,line);if(result)return result;}
    if(this.id>=31&&this.id<=35){const result=mailCommand(this,line);if(result)return result;}
    if(this.id>=36&&this.id<=40){const result=backupCommand(this,line);if(result)return result;}
    if(this.id>=41&&this.id<=45){const result=securityCommand(this,line);if(result)return result;}
    if(this.id>=46&&this.id<=50){const result=appCommand(this,line);if(result)return result;}
    if(this.id>=51&&this.id<=55){const result=clusterCommand(this,line);if(result)return result;}
    if(this.id>=56&&this.id<=60){const result=governanceCommand(this,line);if(result)return result;}
    if (this.id === 4) {
      if (line === 'ip -br addr' || line === 'ip addr') {this.flags.address=true; return ok('lo       UNKNOWN 127.0.0.1/8\nens18    UP      192.168.50.10/24');}
      if (line === 'ip route') {this.flags.route=true; return ok('default via 192.168.50.1 dev ens18\n192.168.50.0/24 dev ens18 proto kernel scope link src 192.168.50.10');}
      if (line === 'cat /etc/resolv.conf') {this.flags.resolver=true; return ok('# DNS externo de laboratório, independente do NS8\nnameserver 192.168.50.53');}
      if (line === 'timedatectl') {this.flags.clock=true; return ok('Time zone: Etc/UTC (UTC, +0000)\nSystem clock synchronized: yes\nNTP service: active\nRTC in local TZ: no');}
      if (line === `dig +short ${FQDN}`) {
        if (this.lab.dns !== TARGET) this.flags.badDns=true;
        else this.flags.dnsRetested=true;
        return ok(this.lab.dns);
      }
      if (line === `ping -c 2 ${TARGET}`) return ok('2 packets transmitted, 2 received, 0% packet loss\nA resposta ICMP não valida HTTPS ou autenticação.');
      if (line === `curl -I https://${FQDN}/cluster-admin/`) {
        if (this.lab.dns !== TARGET) return fail('curl: (7) Failed to connect to '+FQDN+' port 443 (destino DNS '+this.lab.dns+')');
        this.flags.http=true; return ok('HTTP/2 200\ncontent-type: text/html\n\n[Simulação: CA de laboratório confiável. Página respondeu; login não testado.]');
      }
    }
    return fail('Comando ou argumentos fora do escopo desta simulação. Digite help. Nenhuma ação foi executada.');
  }
  act(action, values={}) {
    const done = text => {this.lab.feedback=text; return text;};
    if(this.id===6){const result=requirementAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=7&&this.id<=10){const result=deploymentAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=11&&this.id<=14){const result=operationAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=15&&this.id<=18){const result=identityAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=19&&this.id<=30){const result=fileAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=31&&this.id<=35){const result=mailAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=36&&this.id<=40){const result=backupAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=41&&this.id<=45){const result=securityAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=46&&this.id<=50){const result=appAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=51&&this.id<=55){const result=clusterAction(this,action,values);if(result!==null)return done(result);}
    if(this.id>=56&&this.id<=60){const result=governanceAction(this,action,values);if(result!==null)return done(result);}
    if (this.id === 1 && action === 'plan') {
      this.lab.candidate=values.candidate;
      this.flags.plan=values.candidate==='vm';
      return done(this.flags.plan ? 'Proposta aprovada: VM limpa compatível para o laboratório. Produção ainda exige dimensionamento.' : values.candidate==='lxc' ? 'Proposta rejeitada: instalação NS8 em LXC não é suportada.' : values.candidate==='reused' ? 'Proposta rejeitada: o servidor contém serviços existentes; a base deve ser limpa.' : 'Selecione uma candidata antes de validar.');
    }
    if (this.id === 2) {
      if (action === 'map') {this.lab.mapping={...values}; this.flags.mapped=Object.entries(correctMap).every(([key,v])=>values[key]===v); return done(this.flags.mapped?'Mapa correto. Teste agora a perda do único nó.':'Há camadas trocadas. Releia a topologia e compare máquina, conjunto, aplicação e container.');}
      if (action === 'off') {this.lab.nodeOn=false; this.flags.outage=true; this.flags.recovered=false; return done('Nó desligado no cenário. nextcloud1 indisponível: não há outro nó com uma cópia do serviço.');}
      if (action === 'on') {this.lab.nodeOn=true; this.flags.recovered=Boolean(this.flags.outage); return done('Nó religado. nextcloud1 disponível no cenário simplificado. Isto não foi failover.');}
    }
    if (this.id === 4) {
      if (action === 'dns') {
        if (!['address','route','resolver','clock','badDns'].every(k=>this.flags[k])) return done('Colete primeiro IP, rota, resolvedor, horário e DNS inicial no terminal. O ticket só autoriza a correção depois dessas evidências.');
        if (values.dns?.trim() !== TARGET) return done('O inventário autoriza somente 192.168.50.10. Registro não alterado.');
        this.lab.dns=TARGET; this.flags.dnsFixed=true; this.flags.dnsRetested=false; this.flags.http=false;
        return done('Registro A atualizado no cenário. Repita dig e curl para comprovar o resultado.');
      }
      if (action === 'rollback') {this.lab.dns='192.168.50.99'; this.flags.dnsFixed=false; this.flags.dnsRetested=false; this.flags.http=false; return done('Registro inicial restaurado: .99. As validações posteriores foram removidas; repita a correção para concluir.');}
    }
    if (this.id === 5 && action === 'inventory') {
      this.lab.inventory = {...values};
      this.flags.inventory=false; this.flags.exported=false;
      this.lab.inventoryErrors=validateInventory(values);
      if (!['identity','host','request','draftRead','networkDoc','vmDoc','scopeDoc'].every(k=>this.flags[k])) return done('Antes de validar, confirme a sessão e leia pedido, rascunho e as três fontes aprovadas no terminal.');
      this.flags.inventory=Object.keys(this.lab.inventoryErrors).length===0;
      return done(this.flags.inventory?'Inventário validado contra as três fontes. Prepare o arquivo para download; a instalação continua pendente.':'Inventário não aprovado. Cada campo divergente mostra a fonte que deve ser consultada.');
    }
    if(this.id===5 && action==='restore-draft') {
      this.lab.inventory={...initialInventory}; this.lab.inventoryErrors={}; this.flags.inventory=false; this.flags.exported=false;
      return done('Rascunho inicial restaurado. Leituras preservadas; corrija e valide novamente.');
    }
    return done('Ação indisponível nesta missão.');
  }
  updateInventory(values) {if(this.id!==5)return; this.lab.inventory={...this.lab.inventory,...values}; this.flags.inventory=false; this.flags.exported=false;}
  exportInventory() {
    if(this.id!==5 || !this.flags.inventory || Object.keys(validateInventory(this.lab.inventory)).length) throw new Error('Valide o inventário atual antes de exportar.');
    this.flags.exported=true;
    return inventoryText(this.lab.inventory);
  }
}
export function missionEvidence(id, sim) {
  const e = {...sim.flags};
  if(id===1 && !sim.flags.plan) e.plan=false;
  if(id===2 && (!sim.flags.mapped || !sim.flags.recovered || !sim.lab.nodeOn)) {e.mapped=false; e.recovered=false;}
  if(id===3 && (sim.hostname!=='ns8-lab-01' || !sim.flags.guide)) {e.identity=false; e.host=false; e.location=false; e.listed=false; e.guide=false;}
  if(id===4 && (!sim.flags.dnsFixed || sim.lab.dns!==TARGET || !sim.flags.dnsRetested || !sim.flags.http)) {e.dnsFixed=false; e.dnsRetested=false; e.http=false;}
  if(id===5 && (!sim.flags.inventory || Object.keys(validateInventory(sim.lab.inventory)).length)) {e.inventory=false; e.exported=false;}
  if(id===17 && !e.identityPlan) e.identityPlanVerified=false;
  if(id===18 && !sim.lab.samba?.created) {e.sambaCreated=false;e.domainStatus=false;e.srvCheck=false;e.sambaVerified=false;}
  if(id===19 && !sim.lab.join?.joined) {e.joinRun=false;e.joinStatus=false;e.joinVerified=false;}
  if(id===20 && sim.lab.auth?.dns!=="fixed") {e.clientDnsFixed=false;e.domainDiscover=false;e.loginTest=false;e.authVerified=false;}
  if(id===21 && !e.storageSelected) e.storageVerified=false;
  if(id===22 && !sim.lab.share?.created) {e.shareCreated=false;e.shareStatus=false;e.accessAllowed=false;e.accessDenied=false;e.shareVerified=false;}
  if(id===23 && !e.aclMapped) e.aclVerified=false;
  if(id===24 && !sim.lab.carla?.fixed) {e.carlaFixed=false;e.carlaGroupsAfter=false;e.carlaAllowed=false;e.denyVerified=false;}
  if(id===25 && !e.fileHandoffChecklist) e.fileHandoffVerified=false;
  if(id===26 && !e.appSelected) e.appSelectionVerified=false;
  if(id===27 && !sim.lab.nextcloud?.installed) {e.nextcloudInstalled=false;e.nextcloudStatus=false;e.nextcloudVerified=false;}
  if(id===28 && sim.lab.cloudIdentity?.audience!=="financeiro-diretoria") {e.cloudAudienceSet=false;e.anaCloudLogin=false;e.marianaCloudLogin=false;e.brunoCloudDenied=false;e.cloudIdentityVerified=false;}
  if(id===29 && sim.lab.cloudPublish?.route!=="nextcloud1") {e.cloudRouteSet=false;e.cloudRouteAfter=false;e.cloudHttp=false;e.cloudPublishVerified=false;}
  if(id===30 && !e.cloudHandoffChecklist) e.cloudHandoffVerified=false;
  if(id===31 && !sim.lab.flow?.verified) e.validateFlowPlan=false;
  if(id===32 && !sim.lab.mailInstall?.installed) {e.installMailInstance=false;e.checkMailStatus=false;e.mailInstalledVerified=false;}
  if(id===33 && !sim.lab.mailboxes?.ana) {e.createAnaMailbox=false;e.createFinanceAlias=false;e.createBoardGroup=false;e.mailAccountsVerified=false;}
  if(id===34 && !sim.lab.reputation?.audited) e.mailReputationVerified=false;
  if(id===35 && !sim.lab.mailIncident?.emptyQueue) {e.verifyQueueEmpty=false;e.review7Certified=false;}
  if(id===36 && !sim.lab.strategy?.verified) e.backupStrategyVerified=false;
  if(id===37 && !sim.lab.repo?.verified) e.repoConfigVerified=false;
  if(id===38 && !sim.lab.granular?.verified) e.granularBackupVerified=false;
  if(id===39 && !sim.lab.restoreDrill?.verified) e.drRestoreVerified=false;
  if(id===40 && !sim.lab.bcpAudit?.metricsReported) {e.measureRtoMetrics=false;e.review8Certified=false;}
  if(id===41 && !sim.lab.secModel?.verified) e.securityModelVerified=false;
  if(id===42 && !sim.lab.nethsec?.verified) e.nethsecIntegrationVerified=false;
  if(id===43 && !sim.lab.traefikSec?.verified) e.traefikConfigVerified=false;
  if(id===44 && !sim.lab.vpnArch?.verified) e.vpnArchitectureVerified=false;
  if(id===45 && !sim.lab.edgeIncident?.auditPass) {e.runEdgeSecurityAudit=false;e.review9Certified=false;}
  if(id===46 && !sim.lab.roundcube?.verified) e.validateRoundcube=false;
  if(id===47 && !sim.lab.mattermost?.verified) e.validateMattermost=false;
  if(id===48 && !sim.lab.guacamole?.verified) e.validateGuacamole=false;
  if(id===49 && !sim.lab.vaultwarden?.verified) e.validateVaultwarden=false;
  if(id===50 && !sim.lab.appAudit?.smokeTested) {e.runAppSmokeTest=false;e.review10Certified=false;}
  if(id===51 && !sim.lab.clusterPlan?.verified) e.validateMultiNodePlan=false;
  if(id===52 && !sim.lab.workerJoin?.verified) e.validateWorkerEnrollment=false;
  if(id===53 && !sim.lab.workloadMigration?.verified) e.validateWorkloadMigration=false;
  if(id===54 && !sim.lab.clusterStorage?.verified) e.validateDistributedStorage=false;
  if(id===55 && !sim.lab.clusterDrill?.audited) {e.runResilienceAudit=false;e.review11Certified=false;}
  if(id===56 && !sim.lab.troubleshooting?.verified) e.validateTroubleshooting=false;
  if(id===57 && !sim.lab.rollingUpdate?.verified) e.validateRollingUpdate=false;
  if(id===58 && !sim.lab.observability?.verified) e.validateObservability=false;
  if(id===59 && !sim.lab.hardening?.verified) e.validateHardeningGovernance=false;
  if(id===60 && !sim.lab.finalCert?.certified) {e.runEndToEndAcceptance=false;e.review12Certified=false;}
  return e;
}
