const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const governanceCommands = {
  56: ['cat troubleshooting-cluster-guia.txt', 'cluster-redis-status', 'cluster-task-list --status failed', 'cluster-task-retry --task-id T-3091', 'cluster-health-check'],
  57: ['cat rolling-update-politica.txt', 'cluster-updates-check', 'cluster-update-apply --target-node ns8-worker-02 --rolling', 'cluster-update-apply --target-node ns8-lab-01', 'cluster-version-audit'],
  58: ['cat monitoramento-metricas-plano.txt', 'cluster-metrics-status', 'cluster-alerts-configure --threshold-cpu 85 --threshold-ram 90 --channel webhook', 'cluster-metrics-test'],
  59: ['cat hardening-governanca-escopo.txt', 'cluster-secrets-rotate --scope admin-api', 'cluster-firewall-compliance-audit', 'cluster-security-scorecard'],
  60: ['cat operacao-autonoma-chamado.txt', 'cluster-full-diagnostics', 'cluster-bcp-readiness-probe', 'cluster-end-to-end-acceptance']
};

export function initGovernance(sim) {
  if (sim.id === 56) sim.lab.troubleshooting = {redisChecked: false, taskFailedListed: false, retried: false, healthOk: false, verified: false};
  if (sim.id === 57) sim.lab.rollingUpdate = {checked: false, workerUpdated: false, leaderUpdated: false, versionAudited: false, verified: false};
  if (sim.id === 58) sim.lab.observability = {metricsChecked: false, alertsConfigured: false, testSent: false, verified: false};
  if (sim.id === 59) sim.lab.hardening = {secretsRotated: false, firewallAudited: false, scorecardGenerated: false, verified: false};
  if (sim.id === 60) sim.lab.finalCert = {diagnosticsOk: false, bcpProbed: false, acceptanceOk: false, checklist: false, certified: false};
}

export function governanceCommand(sim, line) {
  if (sim.id === 56) {
    if (line === 'cat troubleshooting-cluster-guia.txt') {
      flag(sim, 'readTroubleshootingGuide');
      return ok('Guia de Diagnóstico e Resolução de Problemas — Incidente T-3091\nSintoma: Operações de atualização e reconfiguração bloqueadas no Cluster Admin.\nCausa Suspeita: Tarefa anterior (T-3091) finalizou com status FAILED por timeout temporário,\nmas deixou a chave de lock em memória ativa no Redis central (chave lock:task:app-reconfig).\nInstruções:\n1. Inspecionar saúde do daemon Redis;\n2. Localizar detalhes da falha em cluster-task-list --status failed;\n3. Executar retry liberando o lock e auditar a normalização do cluster.');
    }
    if (line === 'cluster-redis-status') {
      sim.lab.troubleshooting.redisChecked = true;
      flag(sim, 'checkRedisStatus');
      return ok('=== STATUS DO DAEMON REDIS DO NÓ LÍDER ===\nServiço: redis.service (ativo / running)\nPID: 1482 | Porta: 127.0.0.1:6379 (Loopback + WireGuard auth)\nUso de Memória: 34.2 MB / 512 MB (Normal)\nClientes conectados: 8 daemons de nó e workers\nFilas de eventos: tasks:pending (0) | tasks:running (1) | tasks:failed (1)\nChaves ativas de lock: 1 (lock:task:app-reconfig, retida há 42 minutos).');
    }
    if (line === 'cluster-task-list --status failed' || line.startsWith('cluster-task-list')) {
      sim.lab.troubleshooting.taskFailedListed = true;
      flag(sim, 'listFailedTasks');
      return ok('=== LISTAGEM DE TAREFAS COM STATUS: FAILED ===\nTASK-ID  MÓDULO      NÓ          INÍCIO               ERRO / STACK TRACE\nT-3091   app-reconf  ns8-lab-01  Hoje 14:02:11 UTC    Timeout waiting for container podman-stop\nDetalhes do Erro: Código 124 (SIGTERM timeout). O processo reteve o lock exclusivo.\nAção recomendada: cluster-task-retry --task-id T-3091');
    }
    if (line.startsWith('cluster-task-retry')) {
      if (!sim.flags.readTroubleshootingGuide || !sim.lab.troubleshooting.taskFailedListed) {
        return fail('Leia o guia e filtre a tarefa com erro antes de comandar o retry.');
      }
      sim.lab.troubleshooting.retried = true;
      flag(sim, 'retryStuckTask');
      return ok('Executando retry controlado da tarefa T-3091...\n[1/4] Expurgando lock órfão (DEL lock:task:app-reconfig)... OK\n[2/4] Reinicializando contexto de execução no Podman... OK\n[3/4] Reprocessando script de reconfiguração de aplicação... OK (0.9s)\n[4/4] Atualizando Redis: chave tasks:completed gravada com sucesso.\nStatus final da tarefa T-3091: SUCCESS. Fila de orquestração liberada!');
    }
    if (line === 'cluster-health-check') {
      if (!sim.lab.troubleshooting.retried) return fail('Execute o retry da tarefa T-3091 antes de rodar o health check.');
      sim.lab.troubleshooting.healthOk = true;
      flag(sim, 'runClusterHealthCheck');
      return ok('=== DIAGNÓSTICO GERAL DE SAÚDE DO CLUSTER NS8 ===\nNó 1 (ns8-lab-01): ONLINE (Healthy, Redis OK, 0 locks órfãos)\nNó 2 (ns8-worker-02): ONLINE (Healthy, Agente responsivo)\nFila Redis: 0 pendentes, 0 travadas, 0 falhas registradas nas últimas 24h\nTraefik Gateway: 100% de backends respondendo HTTP 200\nDiagnóstico de integridade: 100% HEALTHY. Nenhum erro detectado.');
    }
  }

  if (sim.id === 57) {
    if (line === 'cat rolling-update-politica.txt') {
      flag(sim, 'readRollingPolicy');
      return ok('Política Corporativa de Rolling Updates — Aurora IT Governance\nDiretriz Mandatória:\n1. NUNCA aplicar atualizações simultâneas em todos os nós;\n2. O nó worker (ns8-worker-02) DEVE ser atualizado primeiro;\n3. Validar se os serviços conteinerizados no worker sobem com estabilidade;\n4. Atualizar o nó líder (ns8-lab-01) em seguida;\n5. Auditar a paridade de versões e schemas de banco em todo o cluster.');
    }
    if (line === 'cluster-updates-check') {
      sim.lab.rollingUpdate.checked = true;
      flag(sim, 'checkClusterUpdates');
      return ok('=== VERIFICAÇÃO DE ATUALIZAÇÕES DISPONÍVEIS ===\nRepositório: https://updates.nethserver.org/ns8/stable\nAtualizações de Núcleo (Core):\n - ns8-core: 2.3.8 -> 2.4.1 (Patches de segurança e melhorias de WireGuard)\nAtualizações de Módulos (Containers):\n - ns8-nextcloud: 1.4.2 -> 1.5.0\n - ns8-mail: 1.3.1 -> 1.3.4\nTotal: 2 pacotes de núcleo e 5 imagens de container aguardando aplicação.');
    }
    if (line === 'cluster-update-apply --target-node ns8-worker-02 --rolling' || (line.startsWith('cluster-update-apply') && line.includes('worker-02'))) {
      if (!sim.flags.readRollingPolicy || !sim.lab.rollingUpdate.checked) {
        return fail('Leia a política e cheque as atualizações pendentes antes de aplicar.');
      }
      sim.lab.rollingUpdate.workerUpdated = true;
      flag(sim, 'applyWorkerUpdate');
      return ok('Iniciando Rolling Update no nó worker: ns8-worker-02...\n[1/4] Drenando requisições ativas do nó 2... OK\n[2/4] Baixando novas imagens de container Podman... OK (220 MB)\n[3/4] Atualizando pacotes ns8-core para 2.4.1... OK\n[4/4] Reinicializando pods e efetuando smoke test local... OK\nWorker ns8-worker-02 atualizado com sucesso! Zero downtime para usuários.');
    }
    if (line === 'cluster-update-apply --target-node ns8-lab-01' || (line.startsWith('cluster-update-apply') && line.includes('lab-01'))) {
      if (!sim.lab.rollingUpdate.workerUpdated) {
        return fail('Política de Rolling Update violada: atualize o nó worker antes do líder!');
      }
      sim.lab.rollingUpdate.leaderUpdated = true;
      flag(sim, 'applyLeaderUpdate');
      return ok('Iniciando atualização do nó líder: ns8-lab-01...\n[1/4] Criando snapshot transacional do banco Redis... OK\n[2/4] Aplicando patches ns8-core 2.4.1 no nó líder... OK\n[3/4] Reiniciando agente de orquestração e proxy Traefik... OK (0.8s)\n[4/4] Re-convergindo malha WireGuard com ns8-worker-02... OK\nLíder atualizado para versão 2.4.1 com sucesso. Cluster 100% operacional.');
    }
    if (line === 'cluster-version-audit') {
      if (!sim.lab.rollingUpdate.leaderUpdated) return fail('Conclua as atualizações dos nós antes de auditar a versão.');
      sim.lab.rollingUpdate.versionAudited = true;
      flag(sim, 'auditClusterVersions');
      return ok('=== AUDITORIA DE PARIDADE DE VERSÃO DO CLUSTER ===\nNÓ             PAPEL   VERSÃO NS8 CORE   STATUS CONTAINER    PARIDADE\nns8-lab-01     Leader  2.4.1 (Latest)    13/13 Updated       SINCRONIZADO\nns8-worker-02  Worker  2.4.1 (Latest)    4/4 Updated         SINCRONIZADO\nResultado: Paridade perfeita de versões. Esquemas de dados 100% compatíveis.');
    }
  }

  if (sim.id === 58) {
    if (line === 'cat monitoramento-metricas-plano.txt') {
      flag(sim, 'readMonitoringPlan');
      return ok('Plano de Telemetria e Observabilidade do Cluster — NOC Teseo\nExporters Alvo:\n - Node Exporter: métricas de hardware/SO na porta 9100/tcp\n - Podman Exporter: métricas de containers e pods cgroups v2\nLimiares de Alerta Aprovados:\n - CPU Sustentada: > 85% por mais de 300 segundos\n - RAM do Host: > 90% de utilização\nCanal de Notificação: Webhook HTTP POST -> https://chat.aurora.lab/hooks/infra-alertas');
    }
    if (line === 'cluster-metrics-status') {
      sim.lab.observability.metricsChecked = true;
      flag(sim, 'checkMetricsStatus');
      return ok('=== STATUS DA INFRAESTRUTURA DE TELEMETRIA PROMETHEUS ===\nNÓ             COLETOR        PORTA     SCRAPE INTERVAL  STATUS\nns8-lab-01     Node/Podman    9100/tcp  15s              ACTIVE (Scraping)\nns8-worker-02  Node/Podman    9100/tcp  15s              ACTIVE (Scraping)\nMétricas coletadas: cpu_usage, mem_used, disk_io_time, net_bytes_total\nEstado da telemetria: 100% OPERACIONAL.');
    }
    if (line.startsWith('cluster-alerts-configure')) {
      if (!sim.flags.readMonitoringPlan || !sim.lab.observability.metricsChecked) {
        return fail('Leia o plano de monitoramento e inspecione as métricas antes de configurar alertas.');
      }
      sim.lab.observability.alertsConfigured = true;
      flag(sim, 'configureClusterAlerts');
      return ok('Configurando regras e limiares de alerta proativo...\n[1/3] Definindo limiar crítico de CPU: 85% (tempo de sustentação: 5m)... OK\n[2/3] Definindo limiar crítico de memória: 90%... OK\n[3/3] Registrando endpoint de Webhook corporativo no Mattermost... OK\nRegras de alerta gravadas com sucesso no subsistema de monitoramento.');
    }
    if (line === 'cluster-metrics-test') {
      if (!sim.lab.observability.alertsConfigured) return fail('Configure os alertas antes de disparar o teste.');
      sim.lab.observability.testSent = true;
      flag(sim, 'testAlertWebhook');
      return ok('Disparando sonda sintética de alerta de teste...\n[SINTÉTICO] Gerando evento: [TEST_ALERT] Proactive Monitoring Verification\n[WEBHOOK] Enviando payload JSON para https://chat.aurora.lab/hooks/infra-alertas...\n[RESPOSTA] HTTP/2 200 OK — Mensagem postada no canal #infra-alertas em 42ms.\nTeste de entrega de alerta concluído com sucesso!');
    }
  }

  if (sim.id === 59) {
    if (line === 'cat hardening-governanca-escopo.txt') {
      flag(sim, 'readHardeningScope');
      return ok('Escopo de Hardening e Auditoria de Segurança — ISO 27001 / LGPD\nRequisitos de Conformidade:\n1. Rotação de chaves criptográficas e tokens de API com grace period atômico;\n2. Varredura estrita de firewall: zero portas de gerência (ex: 9090) expostas na WAN;\n3. Validação de isolamento Rootless no Podman para todas as instâncias;\n4. Emissão de Scorecard de Segurança com nota mínima de corte A.');
    }
    if (line.startsWith('cluster-secrets-rotate')) {
      if (!sim.flags.readHardeningScope) return fail('Leia o escopo em hardening-governanca-escopo.txt antes de rotacionar segredos.');
      sim.lab.hardening.secretsRotated = true;
      flag(sim, 'rotateClusterSecrets');
      return ok('Iniciando rotação atômica de segredos de API e tokens de cluster...\n[1/4] Gerando novos pares de chaves RSA-4096 e tokens JWT... OK\n[2/4] Atualizando chaves de autenticação no Redis e daemons locais... OK\n[3/4] Aplicando grace period de 10 minutos para conexões ativas... OK\n[4/4] Revogando credenciais antigas com segurança atômica... OK\nRotação de segredos concluída com sucesso sem nenhuma quebra de sessão!');
    }
    if (line === 'cluster-firewall-compliance-audit') {
      if (!sim.lab.hardening.secretsRotated) return fail('Rotacione os segredos antes de auditar a conformidade de firewall.');
      sim.lab.hardening.firewallAudited = true;
      flag(sim, 'auditFirewallCompliance');
      return ok('=== AUDITORIA DE CONFORMIDADE DE FIREWALL E PORTAS ===\nZONA WAN (Borda NethSecurity):\n - Portas Abertas: 80/tcp (HTTP), 443/tcp (HTTPS), 51820/udp (WireGuard)\n - Portas de Gerência (9090, 22, 6379): BLOQUEADAS / INACESSÍVEIS (PASS)\nZONA LAN (nftables nós líderes e workers):\n - Tráfego interno restrito à sub-rede 192.168.50.0/24 e 10.5.4.0/24 (PASS)\nTotal de portas não autorizadas expostas: 0. Conformidade 100% aprovada.');
    }
    if (line === 'cluster-security-scorecard') {
      if (!sim.lab.hardening.firewallAudited) return fail('Execute a auditoria de firewall antes de compilar o scorecard.');
      sim.lab.hardening.scorecardGenerated = true;
      flag(sim, 'generateSecurityScorecard');
      return ok('=== SECURITY SCORECARD DO CLUSTER NETHSERVER 8 ===\n[CONTROLE DE ACESSO] Autenticação mTLS e Zero Trust: 100/100 (PASS)\n[CRIPTOGRAFIA] WireGuard ChaCha20 + TLS 1.3 Traefik: 100/100 (PASS)\n[GESTÃO DE SEGREDOS] Rotação periódica de chaves ativa: 100/100 (PASS)\n[ISOLAMENTO] Containers Podman 100% Rootless: 100/100 (PASS)\n[FIREWALL] 0 portas de gerência na WAN (NethSecurity UTM): 100/100 (PASS)\n------------------------------------------------------------------------\nNOTA FINAL DE AUDITORIA: GRADE A+ (100/100 PONTOS) — ISO 27001 READY.');
    }
  }

  if (sim.id === 60) {
    if (line === 'cat operacao-autonoma-chamado.txt') {
      flag(sim, 'readGraduationTicket');
      return ok('Chamado de Homologação Final de Administrador Pleno — CH-NS8-060\nCandidato: Júnior (Sysadmin Pleno NS8)\nBanca de Certificação: Diretoria Teseo IT Solutions & Aurora Corp\nCritérios de Aceite para Operação Autônoma Total:\n1. Diagnóstico Global do Cluster: 2 nós e todas as rotas ativas;\n2. Sondagem de Prontidão BCP: snapshots íntegros e RTO medido;\n3. Homologação Ponta a Ponta: baterias sintéticas nas 6 aplicações corporativas;\n4. Validação formal dos 6 pilares de engenharia e governança.');
    }
    if (line === 'cluster-full-diagnostics') {
      if (!sim.flags.readGraduationTicket) return fail('Leia o chamado em operacao-autonoma-chamado.txt antes de iniciar o diagnóstico.');
      sim.lab.finalCert.diagnosticsOk = true;
      flag(sim, 'runFullDiagnostics');
      return ok('=== DIAGNÓSTICO HOLÍSTICO INTEGRADO DO CLUSTER ===\n[NÓS] ns8-lab-01 (Líder, 10.5.4.1) + ns8-worker-02 (Worker, 10.5.4.2): ONLINE (0.2ms)\n[REDE] WireGuard wg0 mesh criptografada ativa com ChaCha20-Poly1305: HEALTHY\n[STORAGE] Volume NFSv4.2 /srv/shared-nfs montado e síncrono em todos os nós: HEALTHY\n[CORE] Redis central sem locks pendentes, Traefik roteando com certificados TLS: HEALTHY\n[CONTAINERS] 17 pods Podman executando em modo rootless sem erros: HEALTHY\nStatus Geral: ALL SYSTEMS GREEN (0 falhas, 100% de disponibilidade).');
    }
    if (line === 'cluster-bcp-readiness-probe') {
      if (!sim.lab.finalCert.diagnosticsOk) return fail('Execute o diagnóstico global antes da sondagem de BCP.');
      sim.lab.finalCert.bcpProbed = true;
      flag(sim, 'probeBcpReadiness');
      return ok('=== SONDA DE PRONTIDÃO DE RECUPERAÇÃO DE DESASTRES (BCP) ===\n[REPOSITÓRIO REMOTO] Bucket S3 compatível com cifragem AES-256 no cliente: CONECTADO\n[INTEGRIDADE DE DADOS] Verificação Restic check em 24 snapshots: 0 BITROT (100% ÍNTEGRO)\n[POLÍTICA GFS] Retenção diária (7d), semanal (4w) e mensal (12m): APLICADA\n[TESTE DE RESTORE] RTO medido em simulação: 3 minutos e 12 segundos (Meta < 15m): PASS\nProntidão de Continuidade de Negócios: 100% HOMOLOGADA.');
    }
    if (line === 'cluster-end-to-end-acceptance') {
      if (!sim.lab.finalCert.bcpProbed) return fail('Sonde a prontidão de BCP antes de executar a homologação ponta a ponta.');
      sim.lab.finalCert.acceptanceOk = true;
      flag(sim, 'runEndToEndAcceptance');
      return ok('=== HOMOLOGAÇÃO PONTA A PONTA DAS APLICAÇÕES CORPORATIVAS ===\n[1/6] Nextcloud (cloud.lab.example): HTTP/2 200 OK (Sync & WebDAV PASS)\n[2/6] Mail Server (mail1 Postfix/Dovecot): STARTTLS 250 OK (SMTP/IMAP PASS)\n[3/6] Roundcube (webmail.aurora.lab): HTTP/2 200 OK (Webmail Login PASS)\n[4/6] Mattermost (chat.aurora.lab): HTTP/2 200 OK (LDAP Auth & Webhook PASS)\n[5/6] Guacamole (remote.aurora.lab): HTTP/2 200 OK (HTML5 RDP Gateway PASS)\n[6/6] Vaultwarden (vault.aurora.lab): HTTP/2 200 OK (Zero-Knowledge Vault PASS)\nResultado: 6/6 APLICAÇÕES ACEITAS COM SUCESSO ABSOLUTO!');
    }
  }

  return null;
}

export function governanceAction(sim, action, values) {
  if (sim.id === 56) {
    if (action === 'troubleshooting-validate') {
      if (!['readTroubleshootingGuide', 'checkRedisStatus', 'listFailedTasks', 'retryStuckTask', 'runClusterHealthCheck'].every(k => sim.flags[k])) {
        return 'Leia o guia, verifique o Redis, liste as tarefas com erro, faça o retry e rode o health check antes de validar.';
      }
      sim.lab.troubleshooting.verified = true;
      sim.flags.validateTroubleshooting = true;
      return 'Resolução cirúrgica de problemas e desobstrução de filas no Redis homologadas com sucesso!';
    }
  }

  if (sim.id === 57) {
    if (action === 'rolling-update-validate') {
      if (!['readRollingPolicy', 'checkClusterUpdates', 'applyWorkerUpdate', 'applyLeaderUpdate', 'auditClusterVersions'].every(k => sim.flags[k])) {
        return 'Leia a política, cheque updates, atualize o worker, atualize o líder e audite versões antes de homologar.';
      }
      sim.lab.rollingUpdate.verified = true;
      sim.flags.validateRollingUpdate = true;
      return 'Política de Rolling Updates e manutenção contínua homologadas! Atualização aplicada sem downtime.';
    }
  }

  if (sim.id === 58) {
    if (action === 'observability-validate') {
      if (!['readMonitoringPlan', 'checkMetricsStatus', 'configureClusterAlerts', 'testAlertWebhook'].every(k => sim.flags[k])) {
        return 'Leia o plano, verifique os coletores, configure os limiares e teste o webhook antes de validar.';
      }
      sim.lab.observability.verified = true;
      sim.flags.validateObservability = true;
      return 'Telemetria Prometheus e canal de alertas proativos homologados com sucesso no cluster!';
    }
  }

  if (sim.id === 59) {
    if (action === 'hardening-governance-validate') {
      if (!['readHardeningScope', 'rotateClusterSecrets', 'auditFirewallCompliance', 'generateSecurityScorecard'].every(k => sim.flags[k])) {
        return 'Leia o escopo, rotacione segredos, audite as portas e gere o scorecard antes de homologar.';
      }
      sim.lab.hardening.verified = true;
      sim.flags.validateHardeningGovernance = true;
      return 'Hardening final, gestão de segredos e conformidade ISO 27001 homologados com nota A+!';
    }
  }

  if (sim.id === 60) {
    if (action === 'review12-checklist') {
      const needed = ['infra', 'identity', 'collab', 'storage', 'security', 'continuity'];
      const ok = needed.every(k => values[k]);
      sim.lab.finalCert.checklist = ok;
      return ok ? 'Checklist dos 6 Pilares de Infraestrutura completo! Clique em Validar Certificação Final.' : 'Marque todos os seis pilares dominados para concluir a certificação.';
    }
    if (action === 'review12-validate') {
      if (sim.lab.finalCert.checklist && ['readGraduationTicket', 'runFullDiagnostics', 'probeBcpReadiness', 'runEndToEndAcceptance'].every(k => sim.flags[k])) {
        sim.flags.review12Certified = true;
        sim.lab.finalCert.certified = true;
        return '⭐ PARABÉNS! Certificação Final de Administrador NethServer 8 conquistada com honra e distinção máxima!';
      }
      return 'Execute os diagnósticos, a sonda BCP, a homologação de aplicações e marque o checklist dos 6 pilares antes de certificar.';
    }
  }

  return null;
}
