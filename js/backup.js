const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const backupCommands = {
  36: ['cat estrategia-backup.txt', 'restic-repo-discover', 'backup-policy-validate'],
  37: ['cat repo-credenciais-plano.txt', 'backup-repo-test s3://aurora-backups/ns8', 'backup-repo-init', 'backup-repo-status'],
  38: ['cat escopo-backup-granular.txt', 'backup-plan-list', 'backup-run core', 'backup-run mail1', 'backup-snapshot-list'],
  39: ['cat chamado-desastre-cloud.txt', 'app-status nextcloud1', 'backup-snapshot-list nextcloud1', 'restore-app nextcloud1 b82f91a --confirm', 'curl -I https://cloud.lab.example/'],
  40: ['cat auditoria-resiliencia-escopo.txt', 'restic-check-repo', 'dr-drill-simulate --all-apps', 'dr-metrics-report']
};

export function initBackup(sim) {
  if (sim.id === 36) sim.lab.strategy = {policy: '', verified: false};
  if (sim.id === 37) sim.lab.repo = {initialized: false, status: 'unconfigured', verified: false};
  if (sim.id === 38) sim.lab.granular = {coreDone: false, mailDone: false, snapshots: 0, verified: false};
  if (sim.id === 39) sim.lab.restoreDrill = {appStatus: 'DEGRADED', restored: false, verified: false};
  if (sim.id === 40) sim.lab.bcpAudit = {integrityChecked: false, drillCompleted: false, metricsReported: false, checklist: false};
}

export function backupCommand(sim, line) {
  if (sim.id === 36) {
    if (line === 'cat estrategia-backup.txt') {
      flag(sim, 'readBackupStrategy');
      return ok('Planejamento de Proteção de Dados — Cluster Aurora NS8\nMotor: Restic 0.16.4 com deduplicação nativa por chunks SHA-256.\nDestino autorizado: s3://aurora-backups/ns8 (MinIO/S3 offsite).\nPolítica de Retenção GFS Aprovada:\n - Keep daily: 7 snapshots\n - Keep weekly: 4 snapshots\n - Keep monthly: 12 snapshots\nRegra: Cópia local pura proibida pela política 3-2-1.');
    }
    if (line === 'restic-repo-discover') {
      flag(sim, 'discoverBackupRepo');
      return ok('[TESTE DE ALCANCE DE REPOSITÓRIO REMOTO]\nEndpoint: https://192.168.50.200:9000/aurora-backups/ns8\nLatência de rede: 0.8ms (MTU 1500, TLSv1.3 negociado)\nPermissões de bucket: ListBucket OK, PutObject OK\nStatus do backend S3: DISPONÍVEL');
    }
    if (line === 'backup-policy-validate') {
      flag(sim, 'validateBackupPolicy');
      return ok('AUDITORIA DE POLÍTICA DE RETENÇÃO (GFS):\nRegra diária: 7 dias (recuperação fina recente) -> OK\nRegra semanal: 4 semanas (marcos de fechamento) -> OK\nRegra mensal: 12 meses (conformidade contábil anual) -> OK\nEstimativa de deduplicação média: 74% de economia de storage.\nSintaxe da política Restic: APROVADA.');
    }
  }

  if (sim.id === 37) {
    if (line === 'cat repo-credenciais-plano.txt') {
      flag(sim, 'readRepoPlan');
      return ok('Credenciais do Repositório Remoto — S3 Compatible\nEndpoint: https://s3.aurora.lab:9000\nBucket: aurora-backups\nPrefixo / Path: ns8-cluster\nAccess Key ID: AKIA_AURORA_BK_9941\nSecret Access Key: ************************************ (em cofre)\nCriptografia: AES-256 (Passphrase mestra registrada no Bitwarden corporativo)\nPermissões IAM: Limitadas exclusivamente ao bucket aurora-backups.');
    }
    if (line === 'backup-repo-test s3://aurora-backups/ns8' || line.startsWith('backup-repo-test')) {
      flag(sim, 'testRepoTarget');
      return ok('Conectando a s3://aurora-backups/ns8...\n[OK] Resolução DNS s3.aurora.lab -> 192.168.50.200\n[OK] Handshake TLSv1.3 e certificado aceito pela CA do cluster\n[OK] Autenticação IAM AKIA_AURORA_BK_9941 confirmada\nO bucket está acessível e pronto para inicialização.');
    }
    if (line === 'backup-repo-init') {
      if (!sim.flags.testRepoTarget) return fail('Erro: Teste primeiro o endpoint com backup-repo-test antes de inicializar.');
      sim.lab.repo.initialized = true;
      sim.lab.repo.status = 'ready';
      flag(sim, 'initBackupRepo');
      return ok('Executando: restic init --repo s3:https://s3.aurora.lab:9000/aurora-backups/ns8\nCriando estrutura de diretórios e chaves criptográficas...\ncreated restic repository 8f3a21bc9e at s3:https://s3.aurora.lab:9000/aurora-backups/ns8\nPlease note that knowledge of your password is required to access the repository.\nRepositório inicializado com sucesso e protegido por AES-256.');
    }
    if (line === 'backup-repo-status') {
      if (!sim.lab.repo.initialized) return fail('Repositório remoto ainda não inicializado.');
      flag(sim, 'checkRepoStatus');
      return ok('Repositório: s3:https://s3.aurora.lab:9000/aurora-backups/ns8\nID: 8f3a21bc9e\nCriptografia: AES-256 (client-side)\nSnapshots indexados: 0\nArmazenamento ocupado: 4.1 KB (metadados iniciais)\nLock status: UNLOCKED (saudável)');
    }
  }

  if (sim.id === 38) {
    if (line === 'cat escopo-backup-granular.txt') {
      flag(sim, 'readGranularPlan');
      return ok('Planos de Backup Granular — Cluster Aurora\n1. core: Configurações do Cluster Admin, Redis, WireGuard (Semanal / pós-alteração)\n2. samba1: Domínio de identidade e banco SAMBA AD (Diário às 23:00)\n3. nextcloud1: Arquivos e banco de dados MariaDB (Diário às 01:00)\n4. mail1: Caixas postais Dovecot e spool Postfix (Diário às 03:00)\nRegra: Jamais rodar tarefas concorrentes pesadas para não saturar I/O.');
    }
    if (line === 'backup-plan-list') {
      flag(sim, 'listBackupPlans');
      return ok('ID       NOME        ALVO         JANELA        RETENÇÃO   STATUS\nplan-01  core-sched  cluster-core semanal-dom   7D/4W/12M  ATIVO\nplan-02  samba-sched samba1       diario-23h00  7D/4W/12M  ATIVO\nplan-03  cloud-sched nextcloud1   diario-01h00  7D/4W/12M  ATIVO\nplan-04  mail-sched  mail1        diario-03h00  7D/4W/12M  ATIVO');
    }
    if (line === 'backup-run core') {
      sim.lab.granular.coreDone = true;
      sim.lab.granular.snapshots++;
      flag(sim, 'runCoreBackup');
      return ok('Iniciando plano de backup: core\n[hook] Exportando metadados do Cluster Admin e dump do Redis...\n[restic] Coletando arquivos de configuração /var/lib/nethserver/core...\n[restic] Criado snapshot a14f92c1 em 2.4s (Tamanho: 14.8 MB, 0 erros).\nSnapshot tag: core-manual.');
    }
    if (line === 'backup-run mail1') {
      if (!sim.flags.runCoreBackup) return fail('Erro: Execute primeiro o backup do core antes de testar a aplicação mail1.');
      sim.lab.granular.mailDone = true;
      sim.lab.granular.snapshots++;
      flag(sim, 'runMailBackup');
      return ok('Iniciando plano de backup: mail1\n[pre-backup hook] Congelando tabelas temporárias e pausando recepção local...\n[restic] Coletando volumes /srv/disk1/vmail e configs de Postfix/Dovecot...\n[post-backup hook] Descongelando serviços e retomando transporte.\n[restic] Criado snapshot c78e31b4 em 8.1s (Tamanho delta: 128 MB, 0 erros).\nSnapshot tag: mail1-manual.');
    }
    if (line === 'backup-snapshot-list') {
      if (!sim.lab.granular.coreDone || !sim.lab.granular.mailDone) {
        return fail('Gere os snapshots manuais de core e mail1 antes de consultar a listagem.');
      }
      flag(sim, 'listBackupSnapshots');
      return ok('SNAPSHOT ID  DATA/HORA           TAG           TAMANHO    INSTÂNCIA\na14f92c1     2026-09-16 11:00:12 core-manual   14.8 MiB   core\nc78e31b4     2026-09-16 11:02:45 mail1-manual  128.4 MiB  mail1\nTotal de snapshots ativos: 2 (Deduplicação operando com sucesso).');
    }
  }

  if (sim.id === 39) {
    if (line === 'cat chamado-desastre-cloud.txt') {
      flag(sim, 'readDrTicket');
      return ok('INCIDENTE CRÍTICO INC-9904: Falha em lote no Nextcloud.\nSintoma: Usuários recebem HTTP 500 Internal Server Error.\nLog do container: PDOException: SQLSTATE[HY000] [2002] Tablespace is missing in MariaDB.\nCausa: Script de manutenção corrompeu o volume de banco de dados do nextcloud1.\nInstrução: Isolar a aplicação e restaurar o snapshot mais recente íntegro.');
    }
    if (line === 'app-status nextcloud1') {
      if (sim.lab.restoreDrill?.restored) {
        flag(sim, 'verifyRestoredApp');
        return ok('Instância: nextcloud1\nStatus: RUNNING\nContainers:\n - nextcloud1-app: running (healthy)\n - nextcloud1-mariadb: running (healthy)\n - nextcloud1-redis: running (healthy)\nIntegridade de banco e volumes: 100% íntegro.');
      }
      flag(sim, 'checkDegradedApp');
      return ok('Instância: nextcloud1\nStatus: DEGRADED\nContainers:\n - nextcloud1-app: erro 500 (falha de conexão ao banco)\n - nextcloud1-mariadb: ERRO FATAL (tabelas de catálogo corrompidas)\nAlerta: Necessária intervenção de restauração para recuperação do serviço.');
    }
    if (line === 'backup-snapshot-list nextcloud1') {
      flag(sim, 'listAvailableSnapshots');
      return ok('SNAPSHOTS DISPONÍVEIS PARA nextcloud1:\nb82f91a   Hoje 04:00:00   Tag: nextcloud1-daily   (Estado: ÍNTEGRO, verificado)\nd41a990   Ontem 04:00:00  Tag: nextcloud1-daily   (Estado: ÍNTEGRO)\nRecomendação: Utilizar snapshot b82f91a para perda mínima (RPO).');
    }
    if (line === 'restore-app nextcloud1 b82f91a --confirm' || line.startsWith('restore-app nextcloud1')) {
      if (!sim.flags.checkDegradedApp || !sim.flags.listAvailableSnapshots) {
        return fail('Erro: Inspecione o estado degradado e liste os snapshots antes de disparar a restauração.');
      }
      sim.lab.restoreDrill.restored = true;
      sim.lab.restoreDrill.appStatus = 'RUNNING';
      flag(sim, 'restoreApplication');
      return ok('=== INICIANDO RESTORE GRANULAR DE nextcloud1 ===\n[1/5] Parando containers da aplicação nextcloud1... OK\n[2/5] Baixando snapshot b82f91a do repositório Restic... OK\n[3/5] Restaurando arquivos em /srv/disk1/apps/nextcloud1... OK\n[4/5] Restaurando dump consistente do MariaDB e aplicando migrações... OK\n[5/5] Reiniciando containers e executando healthcheck... OK\nRestauração concluída em 42 segundos. Instância restabelecida.');
    }
    if (line === 'curl -I https://cloud.lab.example/' || line.startsWith('curl -I')) {
      if (!sim.lab.restoreDrill?.restored) {
        return fail('HTTP/1.1 500 Internal Server Error (nextcloud1 ainda corrompido).');
      }
      flag(sim, 'testRestoredHttp');
      return ok('HTTP/2 200 OK\nserver: nginx / traefik (NS8)\ndate: Tue, 16 Sep 2026 11:20:00 GMT\ncontent-type: text/html; charset=UTF-8\nset-cookie: oc_sessionPassphrase=...; path=/; secure; HttpOnly\n[Aplicação Nextcloud respondendo normalmente]');
    }
  }

  if (sim.id === 40) {
    if (line === 'cat auditoria-resiliencia-escopo.txt') {
      flag(sim, 'readDrAuditPlan');
      return ok('Auditoria de Continuidade de Negócios (BCP) — Marco Módulo 8\nEscopo:\n1. Integridade criptográfica dos dados (restic check em 100% dos blocos).\n2. Simulação de DR Drill de reconstrução total do cluster em nó limpo.\n3. Medição de métricas RTO (tolerância máxima corporativa: 30 minutos).\nObjetivo: Certificação de resiliência e emissão do dossiê técnico.');
    }
    if (line === 'restic-check-repo') {
      flag(sim, 'checkRepoIntegrity');
      return ok('Executando varredura profunda de blocos: restic check --read-data-subset=10%\nusing temporary cache in /tmp/restic-check\nenter password for repository: [autenticado via cofre]\nrepository 8f3a21bc9e opened successfully, password is correct\nchecking snapshots, trees and packs...\n[100%] 48 snapshots checked, 18,290 packs verified, 0 errors found.\nIntegridade de dados: 100% PASS (Sem bitrot ou corrupção de índice).');
    }
    if (line === 'dr-drill-simulate --all-apps' || line.startsWith('dr-drill-simulate')) {
      if (!sim.flags.checkRepoIntegrity) {
        return fail('Erro: Audite a integridade dos blocos com restic-check-repo antes do simulado de desastre.');
      }
      flag(sim, 'simulateDisasterDrill');
      return ok('=== SIMULADO DE DESASTRE TOTAL: RESTAURAÇÃO COMPLETA ===\n[00:00] Nó simulado limpo provisionado (Rocky Linux 9 + NS8 core)\n[02:15] Conexão com repositório S3 e download do snapshot Core... OK\n[05:30] Restauração do domínio de identidade samba1 e autenticação... OK\n[09:10] Restauração do servidor de e-mail mail1 e spool... OK\n[14:22] Restauração do Nextcloud nextcloud1 e banco de dados... OK\nResultado do Simulado: Todos os 4 serviços online e saudáveis.');
    }
    if (line === 'dr-metrics-report') {
      if (!sim.flags.simulateDisasterDrill) {
        return fail('Erro: Execute o simulado dr-drill-simulate antes de gerar o relatório de métricas.');
      }
      sim.lab.bcpAudit.metricsReported = true;
      flag(sim, 'measureRtoMetrics');
      return ok('=== RELATÓRIO DE MÉTRICAS DE CONTINUIDADE (BCP) ===\nMeta de RTO Corporativo: 30 minutos (1800 s)\nRTO Efetivo Medido no Drill: 14 minutos e 22 segundos (862 s) [CONFORME]\nMeta de RPO Corporativo: 4 horas (14400 s)\nRPO Efetivo Garantido por Snapshot: 2 horas (7200 s) [CONFORME]\nStatus da Auditoria: APROVADO COM LOUVOR');
    }
  }

  return null;
}

export function backupAction(sim, action, values) {
  if (sim.id === 36) {
    if (action === 'backup-strategy-validate') {
      if (!['readBackupStrategy', 'discoverBackupRepo', 'validateBackupPolicy'].every(k => sim.flags[k])) {
        return 'Leia os requisitos, descubra o repositório remoto e valide a política no terminal antes de homologar.';
      }
      const good = values.daily === '7' && values.weekly === '4' && values.monthly === '12';
      if (!good) return 'Matriz incorreta: Use retenção GFS 7 diários, 4 semanais e 12 mensais conforme política corporativa.';
      sim.lab.strategy.policy = 'GFS-7-4-12';
      sim.lab.strategy.verified = true;
      sim.flags.backupStrategyVerified = true;
      return 'Estratégia de backup e retenção GFS homologada com sucesso! Pronto para configurar repositório.';
    }
  }

  if (sim.id === 37) {
    if (action === 'repo-config-validate') {
      if (!['readRepoPlan', 'testRepoTarget', 'initBackupRepo', 'checkRepoStatus'].every(k => sim.flags[k])) {
        return 'Teste o repositório, execute backup-repo-init e audite com backup-repo-status antes de validar.';
      }
      sim.lab.repo.verified = true;
      sim.flags.repoConfigVerified = true;
      return 'Repositório remoto S3 e segredos de criptografia homologados com sucesso! Cofre ativo.';
    }
  }

  if (sim.id === 38) {
    if (action === 'granular-backup-validate') {
      if (!['readGranularPlan', 'listBackupPlans', 'runCoreBackup', 'runMailBackup', 'listBackupSnapshots'].every(k => sim.flags[k])) {
        return 'Dispare os backups manuais de core e mail1 e liste os snapshots antes de homologar os planos granulares.';
      }
      sim.lab.granular.verified = true;
      sim.flags.granularBackupVerified = true;
      return 'Rotinas de backup granulares homologadas! Metadados e instâncias com agendamentos protegidos.';
    }
  }

  if (sim.id === 39) {
    if (action === 'dr-restore-validate') {
      if (!['readDrTicket', 'checkDegradedApp', 'listAvailableSnapshots', 'restoreApplication', 'verifyRestoredApp', 'testRestoredHttp'].every(k => sim.flags[k])) {
        return 'Constaste o estado DEGRADED, restaure com restore-app e comprove status RUNNING e HTTP 200 via curl.';
      }
      sim.lab.restoreDrill.verified = true;
      sim.flags.drRestoreVerified = true;
      return 'Restauração de aplicação homologada! O Nextcloud foi recuperado sem indisponibilidade dos demais serviços.';
    }
  }

  if (sim.id === 40) {
    if (action === 'review8-checklist') {
      const needed = ['strategy', 'repo', 'granular', 'restore', 'audit'];
      const ok = needed.every(k => values[k]);
      sim.lab.bcpAudit.checklist = ok;
      return ok ? 'Checklist de resiliência completo! Clique em Validar Certificação.' : 'Marque todos os marcos do Módulo 8 para certificar.';
    }
    if (action === 'review8-validate') {
      if (sim.lab.bcpAudit.checklist && ['readDrAuditPlan', 'checkRepoIntegrity', 'simulateDisasterDrill', 'measureRtoMetrics'].every(k => sim.flags[k])) {
        sim.flags.review8Certified = true;
        return '⭐ Marco de Revisão Integrada 08 homologado! Dossiê de resiliência aprovado e certificação concedida.';
      }
      return 'Conclua a verificação de integridade, simulado DR, relatório de métricas e checklist antes de homologar.';
    }
  }

  return null;
}
