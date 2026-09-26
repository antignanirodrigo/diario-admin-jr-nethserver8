const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const clusterCommands = {
  51: ['cat cluster-multinode-plano.txt', 'cluster-nodes-list', 'cluster-vpn-mesh-status', 'cluster-join-token-generate'],
  52: ['cat worker-join-escopo.txt', 'node-prereq-check ns8-worker-02', 'cluster-node-add --host 192.168.50.11 --token AURORA-JOIN-TOKEN', 'cluster-nodes-status'],
  53: ['cat workload-migration-plano.txt', 'app-node-list', 'app-migrate nextcloud1 --target-node ns8-worker-02', 'traefik-mesh-routes-audit'],
  54: ['cat storage-distribuido-plano.txt', 'node-storage-audit', 'cluster-nfs-mount --server 192.168.50.20 --path /srv/shared-nfs', 'cluster-storage-validate'],
  55: ['cat resiliencia-cluster-escopo.txt', 'cluster-failover-simulate --offline-node ns8-worker-02', 'cluster-health-probe', 'cluster-node-recover --node ns8-worker-02', 'cluster-resilience-audit']
};

export function initCluster(sim) {
  if (sim.id === 51) sim.lab.clusterPlan = {vpnChecked: false, tokenGenerated: false, verified: false};
  if (sim.id === 52) sim.lab.workerJoin = {prereqsOk: false, nodeAdded: false, statusOk: false, verified: false};
  if (sim.id === 53) sim.lab.workloadMigration = {migrated: false, routesOk: false, verified: false};
  if (sim.id === 54) sim.lab.clusterStorage = {mounted: false, ioValidated: false, verified: false};
  if (sim.id === 55) sim.lab.clusterDrill = {failoverSimulated: false, healthProbed: false, recovered: false, audited: false, checklist: false};
}

export function clusterCommand(sim, line) {
  if (sim.id === 51) {
    if (line === 'cat cluster-multinode-plano.txt') {
      flag(sim, 'readClusterPlan');
      return ok('Plano de Expansão Multi-Nó — Aurora IT Infrastructure\nNó Atual: ns8-lab-01 (192.168.50.10, Papel: Cluster Leader)\nNó Futuro: ns8-worker-02 (192.168.50.11, Papel: Cluster Worker)\nRede de Controle e Dados do Cluster (WireGuard Mesh):\n - Sub-rede: 10.5.4.0/24\n - Nó 1 (Leader): 10.5.4.1/24 (Porta UDP 51820)\n - Nó 2 (Worker): 10.5.4.2/24 (Porta UDP 51820)\n - Cifra: ChaCha20-Poly1305 nativa no kernel Linux.');
    }
    if (line === 'cluster-nodes-list') {
      flag(sim, 'listClusterNodes');
      return ok('ID  NOME         PAPEL   IP FÍSICO       IP WIREGUARD  STATUS   CONTAINERS\n1   ns8-lab-01   Leader  192.168.50.10   10.5.4.1      ONLINE   13 (6 apps)\nTotal de nós: 1 (Cluster standalone em transição para multi-nó).');
    }
    if (line === 'cluster-vpn-mesh-status') {
      sim.lab.clusterPlan.vpnChecked = true;
      flag(sim, 'checkVpnMesh');
      return ok('=== STATUS DA MALHA WIREGUARD DO CLUSTER (wg0) ===\nInterface: wg0\nEndereço IP: 10.5.4.1/24\nPorta de escuta: 51820/udp\nChave pública: h8K1z7L4x3+9F4eBq... (Leader Master Key)\nMTU: 1420 (otimizado para overhead UDP)\nPeers configurados: 0 (Aguardando primeiro nó worker).');
    }
    if (line === 'cluster-join-token-generate' || line.startsWith('cluster-join-token-generate')) {
      if (!sim.flags.readClusterPlan || !sim.lab.clusterPlan.vpnChecked) {
        return fail('Consulte o plano e inspecione a malha WireGuard antes de gerar o token.');
      }
      sim.lab.clusterPlan.tokenGenerated = true;
      flag(sim, 'generateJoinToken');
      return ok('=== GERANDO TOKEN CRIPTOGRÁFICO DE INGRESSO (JOIN) ===\nToken gerado: AURORA-JOIN-TOKEN-9f2b8a7c14e\nExpiração: 60 minutos\nImpressão digital CA: SHA256:7b:94:e2:11:ff:30:8a:c4... (Aurora Cluster Root CA)\nInstrução: Utilize este token no comando cluster-node-add no host remoto.');
    }
  }

  if (sim.id === 52) {
    if (line === 'cat worker-join-escopo.txt') {
      flag(sim, 'readWorkerScope');
      return ok('Escopo de Ingresso de Nó Worker — ns8-worker-02\nHost alvo: 192.168.50.11\nHostname: ns8-worker-02.aurora.lab\nSO instalado: Rocky Linux 9.4 (instalação mínima limpa)\nHardware: 4 vCPU, 8 GB RAM, 80 GB SSD\nToken de autorização: AURORA-JOIN-TOKEN (emitido pelo nó líder).');
    }
    if (line === 'node-prereq-check ns8-worker-02' || line.startsWith('node-prereq-check')) {
      if (!sim.flags.readWorkerScope) return fail('Leia o escopo em worker-join-escopo.txt antes de checar pré-requisitos.');
      sim.lab.workerJoin.prereqsOk = true;
      flag(sim, 'checkNodePrereqs');
      return ok('Verificando pré-requisitos em ns8-worker-02 (192.168.50.11)...\n[1/5] Conectividade SSH e ping: OK (0.3ms)\n[2/5] Sistema operacional: Rocky Linux 9.4 (OK)\n[3/5] Serviços conflitantes (Apache, MySQL, Docker): NENHUM (OK)\n[4/5] Sincronismo de relógio NTP: SINCRONIZADO (delta 0.002s, OK)\n[5/5] Resolução DNS externa e portas 51820/udp liberadas: OK\nResultado: Host 100% elegível para ingresso como nó Worker.');
    }
    if (line.startsWith('cluster-node-add')) {
      if (!sim.lab.workerJoin.prereqsOk) return fail('Execute node-prereq-check antes de ingressar o nó.');
      sim.lab.workerJoin.nodeAdded = true;
      flag(sim, 'addWorkerNode');
      return ok('Iniciando provisionamento e ingresso de ns8-worker-02 no cluster...\n[1/4] Autenticando com join token no líder... OK\n[2/4] Gerando chaves WireGuard locais e negociando IP 10.5.4.2/24... OK\n[3/4] Inicializando agente de orquestração e registrando no Redis... OK\n[4/4] Sincronizando autoridade de certificação interna... OK\nSucesso: Nó ns8-worker-02 ingressado no cluster Aurora com status ONLINE.');
    }
    if (line === 'cluster-nodes-status') {
      if (!sim.lab.workerJoin.nodeAdded) return fail('Ingresse o nó com cluster-node-add antes de auditar o status.');
      sim.lab.workerJoin.statusOk = true;
      flag(sim, 'checkClusterStatus');
      return ok('=== TOPOLOGIA CONSOLIDADA DO CLUSTER NS8 ===\nID  NOME            PAPEL   IP FÍSICO       IP WIREGUARD  CPU / RAM     STATUS\n1   ns8-lab-01      Leader  192.168.50.10   10.5.4.1      4v / 8.0 GB   ONLINE (Healthy)\n2   ns8-worker-02   Worker  192.168.50.11   10.5.4.2      4v / 8.0 GB   ONLINE (Healthy)\n------------------------------------------------------------------------\nTotal de nós: 2 | Capacidade agregada: 8 vCPU / 16.0 GB RAM | Estado: ESTÁVEL.');
    }
  }

  if (sim.id === 53) {
    if (line === 'cat workload-migration-plano.txt') {
      flag(sim, 'readMigrationPlan');
      return ok('Plano de Migração e Balanceamento de Carga — Aurora IT\nCenário: Nó líder ns8-lab-01 com 78% de RAM utilizada; nó worker ns8-worker-02 com 8%.\nInstância selecionada para migração: nextcloud1 (consumo de ~1.2 GB RAM)\nNó de Origem: ns8-lab-01 (ID: 1)\nNó de Destino: ns8-worker-02 (ID: 2, IP WireGuard: 10.5.4.2)\nMeta de Roteamento: Traefik deve atualizar o backend cloud.lab.example para 10.5.4.2:80.');
    }
    if (line === 'app-node-list') {
      flag(sim, 'listAppNodes');
      if (sim.lab.workloadMigration.migrated) {
        return ok('INSTÂNCIA     CATEGORIA    NÓ EXECUTOR      IP WIREGUARD  STATUS\nnextcloud1    Collab/Sync  ns8-worker-02    10.5.4.2      RUNNING (Migrado)\nmail1         Mail Server  ns8-lab-01       10.5.4.1      RUNNING\nroundcube1    Webmail      ns8-lab-01       10.5.4.1      RUNNING\nmattermost1   Team Chat    ns8-lab-01       10.5.4.1      RUNNING\nguacamole1    Remote GW    ns8-lab-01       10.5.4.1      RUNNING\nvaultwarden1  Password     ns8-lab-01       10.5.4.1      RUNNING');
      }
      return ok('INSTÂNCIA     CATEGORIA    NÓ EXECUTOR      IP WIREGUARD  STATUS\nnextcloud1    Collab/Sync  ns8-lab-01       10.5.4.1      RUNNING (Sobrecarga)\nmail1         Mail Server  ns8-lab-01       10.5.4.1      RUNNING\nroundcube1    Webmail      ns8-lab-01       10.5.4.1      RUNNING\nmattermost1   Team Chat    ns8-lab-01       10.5.4.1      RUNNING\nguacamole1    Remote GW    ns8-lab-01       10.5.4.1      RUNNING\nvaultwarden1  Password     ns8-lab-01       10.5.4.1      RUNNING');
    }
    if (line.startsWith('app-migrate')) {
      if (!sim.flags.readMigrationPlan || !sim.flags.listAppNodes) {
        return fail('Consulte o plano e liste a distribuição de nós antes de migrar.');
      }
      sim.lab.workloadMigration.migrated = true;
      flag(sim, 'migrateWorkload');
      return ok('Migrando instância nextcloud1 para o nó ns8-worker-02...\n[1/4] Parando containers no nó 1 com flush de transações... OK (1.2s)\n[2/4] Sincronizando metadados de volume e variáveis de ambiente... OK (1.8s)\n[3/4] Inicializando pods Podman no nó 2 (10.5.4.2)... OK (1.2s)\n[4/4] Atualizando tabela de roteamento no proxy Traefik... OK (zero downtime)\nMigração concluída com sucesso em 4.2 segundos! Nextcloud ativo no worker.');
    }
    if (line === 'traefik-mesh-routes-audit') {
      if (!sim.lab.workloadMigration.migrated) return fail('Execute a migração antes de auditar as rotas.');
      sim.lab.workloadMigration.routesOk = true;
      flag(sim, 'auditTraefikMeshRoutes');
      return ok('=== AUDITORIA DE ROTAS DINÂMICAS DO TRAEFIK (Cluster Mesh) ===\nROTA                         BACKEND ALVO         CANAL DE TRANSPORTE  STATUS\nhttps://cloud.lab.example/   10.5.4.2:80 (Node 2) WireGuard Mesh (wg0) HTTP/2 200 OK\nhttps://webmail.aurora.lab/  10.5.4.1:80 (Node 1) Local Container      HTTP/2 200 OK\nhttps://chat.aurora.lab/     10.5.4.1:80 (Node 1) Local Container      HTTP/2 200 OK\nRoteamento entre nós auditado e 100% operacional sem quebra de sessão.');
    }
  }

  if (sim.id === 54) {
    if (line === 'cat storage-distribuido-plano.txt') {
      flag(sim, 'readStoragePlan');
      return ok('Plano de Armazenamento Distribuído — Aurora Storage Area\nServidor NAS Corporativo: 192.168.50.20\nExport NFS: /export/aurora-cluster\nProtocolo: NFSv4.2 (suporte a locking atômico, sec=sys, no_subtree_check)\nPonto de montagem unificado em todos os nós: /srv/shared-nfs\nFinalidade: Hospedar volumes persistentes compartilháveis entre nós líder e worker.');
    }
    if (line === 'node-storage-audit') {
      flag(sim, 'auditNodeStorage');
      return ok('=== AUDITORIA DE DISCOS LOCAIS DOS NÓS ===\nNÓ             DISPOSITIVO  MONTADO EM  TAMANHO  USADO  DISPONÍVEL  TIPO\nns8-lab-01     /dev/sda3    /           80 GB    28 GB  52 GB       xfs (local)\nns8-worker-02  /dev/sda3    /           80 GB    12 GB  68 GB       xfs (local)\nDiscos locais saudáveis. Ponto de rede /srv/shared-nfs ainda não montado.');
    }
    if (line.startsWith('cluster-nfs-mount')) {
      if (!sim.flags.readStoragePlan || !sim.flags.auditNodeStorage) {
        return fail('Leia o plano e audite o armazenamento local antes de montar o NFS.');
      }
      sim.lab.clusterStorage.mounted = true;
      flag(sim, 'mountClusterNfs');
      return ok('Montando compartilhamento NFS corporativo no cluster...\n[1/3] Conectando a 192.168.50.20:/export/aurora-cluster... OK\n[2/3] Negociando NFSv4.2 com opções rw,sync,hard,intr... OK\n[3/3] Aplicando montagem em ns8-lab-01 e ns8-worker-02 (/srv/shared-nfs)... OK\nVolume de rede montado e integrado ao cluster com sucesso.');
    }
    if (line === 'cluster-storage-validate') {
      if (!sim.lab.clusterStorage.mounted) return fail('Monte o compartilhamento com cluster-nfs-mount antes de validar.');
      sim.lab.clusterStorage.ioValidated = true;
      flag(sim, 'validateStorageIo');
      return ok('=== VALIDAÇÃO DE I/O E LOCKING NO ARMAZENAMENTO DISTRIBUÍDO ===\n[TESTE 1] Criação de arquivo canário em ns8-lab-01: PASS (/srv/shared-nfs/.canary)\n[TESTE 2] Leitura imediata a partir de ns8-worker-02: PASS (Consistente)\n[TESTE 3] Trava atômica de arquivo (POSIX flock): PASS (Concorrência segura)\n[TESTE 4] Medição de latência de escrita síncrona: 0.8ms (Alta velocidade)\nArmazenamento distribuído homologado: pronto para failover de aplicações.');
    }
  }

  if (sim.id === 55) {
    if (line === 'cat resiliencia-cluster-escopo.txt') {
      flag(sim, 'readDrillScope');
      return ok('Escopo do Marco de Resiliência e Simulação de Falha — Módulo 11\nObjetivo: Comprovar a alta disponibilidade e capacidade de auto-recuperação do cluster.\nProcedimento do Teste de Estresse:\n1. Simular falha de partição de rede no nó ns8-worker-02;\n2. Sondar o cluster e verificar a detecção de perda de heartbeat;\n3. Comprovar que o nó líder e os serviços nele hospedados continuam intactos;\n4. Restabelecer a conectividade do nó worker e auditar a re-convergência da malha.');
    }
    if (line.startsWith('cluster-failover-simulate')) {
      if (!sim.flags.readDrillScope) return fail('Leia o escopo em resiliencia-cluster-escopo.txt antes de disparar o teste.');
      sim.lab.clusterDrill.failoverSimulated = true;
      flag(sim, 'simulateNodeFailover');
      return ok('=== DISPARANDO SIMULAÇÃO DE FALHA: ns8-worker-02 ===\n[ALERTA] Link físico simulado desconectado no nó 2.\n[WIREGUARD] Pacotes de heartbeat para 10.5.4.2 sem resposta (timeout 30s).\n[LEADER] Nó ns8-worker-02 marcado como UNREACHABLE / DEGRADED.\n[RESILIÊNCIA] Serviços locais no líder ns8-lab-01 permanecem 100% OPERACIONAIS.');
    }
    if (line === 'cluster-health-probe') {
      if (!sim.lab.clusterDrill.failoverSimulated) return fail('Dispare a simulação de falha antes de sondar o cluster.');
      sim.lab.clusterDrill.healthProbed = true;
      flag(sim, 'probeClusterHealth');
      if (sim.lab.clusterDrill.recovered) {
        return ok('=== SONDAGEM DE SAÚDE DO CLUSTER (Pós-Recuperação) ===\nNó 1 (ns8-lab-01): ONLINE (Leader, RTT: local)\nNó 2 (ns8-worker-02): ONLINE (Worker, RTT: 0.2ms via WireGuard)\nCluster state: 100% CONVERGIDO e ESTÁVEL.');
      }
      return ok('=== SONDAGEM DE SAÚDE DO CLUSTER (Durante Falha) ===\nNó 1 (ns8-lab-01): ONLINE (Leader, íntegro)\nNó 2 (ns8-worker-02): UNREACHABLE (Degradação isolada no nó worker)\nAlerta enviado para central de monitoramento da Teseo.');
    }
    if (line.startsWith('cluster-node-recover')) {
      if (!sim.lab.clusterDrill.healthProbed) return fail('Sonde o cluster com cluster-health-probe antes de recuperar.');
      sim.lab.clusterDrill.recovered = true;
      flag(sim, 'recoverClusterNode');
      return ok('Restabelecendo conectividade com ns8-worker-02...\n[1/3] Reconectando link de rede... OK\n[2/3] Handshake WireGuard automático restabelecido (10.5.4.2)... OK\n[3/3] Sincronização de estado com o banco Redis do líder... OK\nNó ns8-worker-02 reintegrado com sucesso sem reiniciar o cluster!');
    }
    if (line === 'cluster-resilience-audit') {
      if (!sim.lab.clusterDrill.recovered) return fail('Recupere o nó worker antes de executar a auditoria final.');
      sim.lab.clusterDrill.audited = true;
      flag(sim, 'runResilienceAudit');
      return ok('=== AUDITORIA GERAL DE RESILIÊNCIA E ALTA DISPONIBILIDADE ===\n[TOPOLOGIA] 2 nós ativos (ns8-lab-01 Líder + ns8-worker-02 Worker): PASS\n[MALHA WIREGUARD] Latência sub-milissegundo (0.2ms) e handshake íntegro: PASS\n[TRAEFIK MESH] Roteamento de FQDNs para backends locais e remotos: PASS\n[ARMAZENAMENTO] Ponto NFS /srv/shared-nfs montado e consistente: PASS\nResultado da Auditoria: 100% CONFORME (Marco de Revisão 11 APROVADO).');
    }
  }

  return null;
}

export function clusterAction(sim, action, values) {
  if (sim.id === 51) {
    if (action === 'cluster-plan-validate') {
      if (!['readClusterPlan', 'listClusterNodes', 'checkVpnMesh', 'generateJoinToken'].every(k => sim.flags[k])) {
        return 'Leia o plano, liste os nós, inspecione a malha WireGuard e gere o token antes de validar.';
      }
      sim.lab.clusterPlan.verified = true;
      sim.flags.validateMultiNodePlan = true;
      return 'Planejamento de arquitetura multi-nó e token de join homologados com sucesso!';
    }
  }

  if (sim.id === 52) {
    if (action === 'worker-enroll-validate') {
      if (!['readWorkerScope', 'checkNodePrereqs', 'addWorkerNode', 'checkClusterStatus'].every(k => sim.flags[k])) {
        return 'Leia o escopo, valide os pré-requisitos, adicione o worker e confira o status antes de homologar.';
      }
      sim.lab.workerJoin.verified = true;
      sim.flags.validateWorkerEnrollment = true;
      return 'Nó worker ns8-worker-02 integrado ao cluster com sucesso! Expansão horizontal ativa.';
    }
  }

  if (sim.id === 53) {
    if (action === 'workload-migration-validate') {
      if (!['readMigrationPlan', 'listAppNodes', 'migrateWorkload', 'auditTraefikMeshRoutes'].every(k => sim.flags[k])) {
        return 'Leia o plano, liste a alocação, execute a migração do Nextcloud e audite as rotas Traefik antes de homologar.';
      }
      sim.lab.workloadMigration.verified = true;
      sim.flags.validateWorkloadMigration = true;
      return 'Migração de carga de trabalho e balanceamento homologados! Nextcloud operando no worker.';
    }
  }

  if (sim.id === 54) {
    if (action === 'cluster-storage-validate-action') {
      if (!['readStoragePlan', 'auditNodeStorage', 'mountClusterNfs', 'validateStorageIo'].every(k => sim.flags[k])) {
        return 'Leia o plano, audite os discos, monte o volume NFS e valide I/O e locking antes de homologar.';
      }
      sim.lab.clusterStorage.verified = true;
      sim.flags.validateDistributedStorage = true;
      return 'Armazenamento distribuído NFSv4.2 homologado com sucesso em todos os nós do cluster!';
    }
  }

  if (sim.id === 55) {
    if (action === 'review11-checklist') {
      const needed = ['mesh', 'join', 'migration', 'storage', 'resilience'];
      const ok = needed.every(k => values[k]);
      sim.lab.clusterDrill.checklist = ok;
      return ok ? 'Checklist do Módulo 11 completo! Clique em Validar Certificação.' : 'Marque todos os cinco marcos de cluster para certificar.';
    }
    if (action === 'review11-validate') {
      if (sim.lab.clusterDrill.checklist && ['readDrillScope', 'simulateNodeFailover', 'probeClusterHealth', 'recoverClusterNode', 'runResilienceAudit'].every(k => sim.flags[k])) {
        sim.flags.review11Certified = true;
        return '⭐ Marco de Revisão Integrada 11 homologado! Cluster multi-nó resiliente e de alta disponibilidade certificado com sucesso.';
      }
      return 'Simule o failover, sonde a saúde, recupere o nó worker, audite a resiliência e marque o checklist antes de certificar.';
    }
  }

  return null;
}
