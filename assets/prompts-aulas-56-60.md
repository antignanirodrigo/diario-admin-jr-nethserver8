# Prompts das Pranchas Narrativas — Módulo 12 (Aulas 56 a 60)
**Curso NethServer 8 Interativo · Teseo IT Solutions**  
**Padrão Visual:** Graphic novel ocidental moderna, traço limpo europeu (Ligne Claire / Brian K. Vaughan), realismo sóbrio de TI, proporção 1536x1024, 6 quadros retangulares em grid 3x2 com bordas cinza-grafite finas e números nos cantos superiores.
**Personagens Canônicos:**
- **Júnior:** 26-27 anos, cabelo escuro desgrenhado, barba rala por fazer, moletom cinza grafite com capuz solto, crachá funcional da Aurora / Teseo com lanyard azul-petróleo.
- **Sênior:** ~44 anos, barba curta grisalha alinhada, óculos de aro preto retangular, blazer azul-marinho sobre camisa cinza de gola aberta.

---

## Aula 56 — Troubleshooting do Cluster e Diagnóstico do Agente Redis
**Título:** Resolução de Problemas: Diagnóstico do Agente e Redis  
**Tema:** Diagnóstico profundo de tarefas com erro no cluster NS8, inspeção de filas no Redis central, liberação de locks de concorrência e depuração via logs unificados.

### Prancha 1 — Conceitos e Contexto (`assets/aula-56.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Modern European graphic novel style, clean crisp linework, server room atmosphere, 6 panels in a 3x2 grid.
> **Panel 1:** Helpdesk screen showing a stuck task: "Task T-3091: Application reconfiguration FAILED. Cluster state locked". Júnior looking concerned.
> **Panel 2:** Sênior leaning over Júnior's terminal, calm and instructional: "No pânico, Júnior. No NS8, todas as operações assíncronas passam pelo Redis do nó líder. Quando uma tarefa falha por timeout de rede ou lock órfão, o bom administrador sabe inspecionar a fila e liberar o bloqueio com segurança."
> **Panel 3:** Architectural diagram of NS8 Task Queue: Web UI / API -> Leader Redis Queue (`tasks:pending`, `tasks:running`, `tasks:failed`) -> Node Agent daemon -> Podman runtime.
> **Panel 4:** Sênior pointing to journald logs: Dialogue balloon: "O journald e o comando cluster-task-list são nossos bisturis. Nunca reinicie o servidor às cegas sem entender a causa raiz registrada no log!"
> **Panel 5:** Diagram of graceful task retry: Clearing the orphan lock -> Re-executing the task handler -> Redis status turning green: `completed`.
> **Panel 6:** Júnior typing diagnostic commands with focused eyes, feeling empowered by root-cause analysis. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-56-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal outputs and task queue cards, 6 panels in 3x2 grid.
> **Panel 1:** Júnior confirming operator session: `whoami` and `hostname` on `ns8-lab-01`.
> **Panel 2:** Terminal command: `cat troubleshooting-cluster-guia.txt` detailing the stuck task incident T-3091.
> **Panel 3:** Executing `cluster-redis-status` verifying Redis connection health and memory usage.
> **Panel 4:** Terminal command `cluster-task-list --status failed` pinpointing the exact failure stack trace on task T-3091.
> **Panel 5:** Executing `cluster-task-retry --task-id T-3091` releasing the orphan lock and re-running the transaction: `Status: SUCCESS (completed in 1.4s)`.
> **Panel 6:** Sênior nodding with pride as `cluster-health-check` reports zero errors: "Fila de Tarefas Desobstruída com Sucesso". 1536x1024.

---

## Aula 57 — Políticas de Atualização do Cluster e Rolling Updates
**Título:** Manutenção Contínua: Rolling Updates sem Interrupção  
**Tema:** Governança de patches no NS8, estratégia de rolling updates nó a nó (Worker primeiro, Leader por último), verificação de compatibilidade de esquemas e proteção de continuidade.

### Prancha 1 — Conceitos e Contexto (`assets/aula-57.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European graphic novel style, tech office setting, 6 panels in a 3x2 grid.
> **Panel 1:** Notification banner in Cluster Admin: "3 New Core Updates and 5 Application Container Updates Available".
> **Panel 2:** Sênior explaining the rolling update methodology: Dialogue balloon: "Atualizar um cluster não é clicar em 'atualizar tudo' durante o expediente. A regra de ouro é Rolling Update: atualizamos o nó worker primeiro, validamos a estabilidade e só então atualizamos o nó líder!"
> **Panel 3:** Sequential flow diagram: Phase 1: Snapshot state -> Phase 2: Update Worker (ns8-worker-02) -> Phase 3: Smoke test worker workloads -> Phase 4: Update Leader (ns8-lab-01) -> Phase 5: Cluster re-convergence.
> **Panel 4:** Sênior highlighting backward compatibility: "Durante o rolling update, os nós com versões ligeiramente diferentes continuam conversando normalmente pelo WireGuard porque as APIs do NS8 mantêm compatibilidade semântica."
> **Panel 5:** Diagram of automatic rollback safeguard: If a container fails to start post-update, the system reverts to the previous container image snapshot automatically.
> **Panel 6:** Júnior at his workstation, reviewing the update manifest with professional discipline. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-57-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, terminal commands and update progress bars, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen: `cat rolling-update-politica.txt` listing maintenance sequence and safety gates.
> **Panel 2:** Executing `cluster-updates-check` discovering pending core and container updates.
> **Panel 3:** Terminal command `cluster-update-apply --target-node ns8-worker-02 --rolling` patching worker node with zero user disruption.
> **Panel 4:** Executing `cluster-update-apply --target-node ns8-lab-01` patching the cluster leader node.
> **Panel 5:** Executing `cluster-version-audit` reporting both nodes updated to latest stable release: `NS8 Core 2.4.1 (All nodes synchronized)`.
> **Panel 6:** Sênior and Júnior reviewing the all-green maintenance log: "Rolling Update Concluído sem Queda de Serviços". 1536x1024.

---

## Aula 58 — Monitoramento Avançado, Métricas e Alertas
**Título:** Observabilidade: Métricas Prometheus e Notificações de Alerta  
**Tema:** Implantação de telemetria no cluster NS8, exporters de nó host e containers Podman, configuração de limiares de alerta e canais de notificação para a equipe de operações.

### Prancha 1 — Conceitos e Contexto (`assets/aula-58.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Clean line comic art, modern network operations center (NOC) aesthetic, 6 panels in a 3x2 grid.
> **Panel 1:** NOC screens showing real-time graphs: CPU curves, memory usage bars, network throughput gauges and disk I/O rates.
> **Panel 2:** Sênior presenting the observability stack: Dialogue balloon: "Administrar sem métricas é como pilotar um avião à noite sem instrumentos. O NS8 expõe métricas Prometheus para cada container e nó, permitindo antecipar problemas antes que os usuários percebam."
> **Panel 3:** Telemetry data flow schematic: Podman Containers & Host OS -> Node Exporter (Metrics scraping) -> Prometheus time-series database -> Grafana dashboards & Webhook alerts.
> **Panel 4:** Sênior explaining alert threshold tuning: Dialogue balloon: "Alerta bem configurado não gera spam: definimos 85% de CPU por 5 minutos e 90% de RAM como limiar crítico, enviando aviso direto para nosso canal #ti no Mattermost!"
> **Panel 5:** Close-up of mobile notification arriving on smartphone: `[ALERT: RESOLVED] Node 1 memory returned to 58% (Normal)`.
> **Panel 6:** Júnior configuring the alerting thresholds on his keyboard with high satisfaction. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-58-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Crisp technical comic art, terminal outputs and metrics graphs, 6 panels in 3x2 grid.
> **Panel 1:** Terminal inspection: `cat monitoramento-metricas-plano.txt` showing target metrics and webhook endpoints.
> **Panel 2:** Executing `cluster-metrics-status` verifying telemetry collectors across `ns8-lab-01` and `ns8-worker-02`.
> **Panel 3:** Terminal command `cluster-alerts-configure --threshold-cpu 85 --threshold-ram 90 --channel webhook` setting up proactive monitoring rules.
> **Panel 4:** Executing synthetic test alert probe: `cluster-metrics-test` verifying end-to-end alert dispatch and webhook delivery.
> **Panel 5:** Terminal verification: `[WEBHOOK] Test alert received successfully in #infra-alertas channel (Latency 42ms)`.
> **Panel 6:** Sênior giving a high-five to Júnior: "Observabilidade e Alertas Operacionais Homologados". 1536x1024.

---

## Aula 59 — Hardening Final, Auditoria de Conformidade e Gestão de Segredos
**Título:** Hardening e Governança: Rotação de Chaves e Conformidade ISO  
**Tema:** Auditoria profunda de conformidade do cluster, rotação periódica de chaves de API e certificados, escaneamento de portas e consolidação do Runbook de Segurança.

### Prancha 1 — Conceitos e Contexto (`assets/aula-59.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Dramatic European comic style, cybersecurity audit theme, 6 panels in a 3x2 grid.
> **Panel 1:** Auditor holding clipboard with "ISO 27001 / LGPD Compliance Audit Checklist". Inspecting the IT infrastructure.
> **Panel 2:** Sênior walking alongside the auditor: "Nossa infraestrutura no NethServer 8 foi construída sobre princípios de segurança por design: containers rootless, WireGuard isolado, TLS 1.3 e privilégio mínimo."
> **Panel 3:** Schematic of secrets management and cryptographic lifecycle: Periodic rotation of cluster administration tokens, TLS certificates renewal, and database service passwords.
> **Panel 4:** Sênior showing the firewall compliance matrix: Zero administrative ports exposed on WAN; SSH restricted to private LAN; all user traffic flowing through hardened Traefik middleware.
> **Panel 5:** Infographic of the "Security Scorecard": 100% compliance across Access Control, Encryption, Backup Retention, and Patch Governance.
> **Panel 6:** Júnior holding the official hardcover "Runbook de Operações de Segurança Aurora / Teseo". 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-59-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, rich terminal outputs and security report badges, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen: `cat hardening-governanca-escopo.txt` specifying audit criteria.
> **Panel 2:** Executing `cluster-secrets-rotate --scope admin-api` refreshing API tokens and control plane secrets without service interruption.
> **Panel 3:** Terminal command `cluster-firewall-compliance-audit` scanning internal and external ports across all nodes. Result: `0 unauthorized open ports`.
> **Panel 4:** Executing comprehensive scorecard analysis: `cluster-security-scorecard` displaying `Grade: A+ (100/100 points, ISO 27001 Ready)`.
> **Panel 5:** Interactive review checklist on console: Secrets Rotated (Yes), Firewall Compliant (Yes), Zero-Knowledge Vault Active (Yes), Runbook Documented (Yes).
> **Panel 6:** Sênior and Júnior looking at the golden compliance certificate on screen: "Hardening e Governança Homologados". 1536x1024.

---

## Aula 60 — ⭐ Revisão Integrada 12 & Certificação Final: Simulação de Operação Autônoma
**Título:** ⭐ Marco de Revisão Integrada 12: Certificação Final de Administrador NethServer 8  
**Tema:** O grande marco de encerramento do curso. Simulação de operação autônoma completa: diagnóstico global, prontidão de desastres, homologação de ponta a ponta e diplomação do Administrador Pleno NS8.

### Prancha 1 — Conceitos e Contexto (`assets/aula-60.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European modern graphic novel style, golden sunrise over modern corporate IT headquarters, 6 panels in a 3x2 grid, gold diamond badge in top margin.
> **Panel 1:** Flashback sequence: Panel 1 of Aula 1 (Júnior looking hesitant at an empty terminal, evaluating candidate machines) contrasting with today.
> **Panel 2:** Sênior standing beside Júnior in the bustling operations center: Dialogue balloon: "Júnior, você percorreu 60 missões rigorosas. Da escolha da base limpa à orquestração multi-nó, da segurança de borda com NethSecurity aos cofres criptografados e disaster recovery. Hoje você opera com autonomia e autoridade técnica."
> **Panel 3:** Comprehensive architectural poster of the complete Aurora / Teseo infrastructure: UTM Firewall (NethSecurity 8) -> Cluster Leader (ns8-lab-01) -> Cluster Worker (ns8-worker-02) -> Distributed Storage (NFS) -> S3 Cloud Backup -> 6 Enterprise Applications.
> **Panel 4:** Sênior presenting the golden certification lanyard to Júnior: "Você não é mais um iniciante que chuta comandos. Você é um Administrador de Infraestruturas NethServer 8 qualificado e certificado."
> **Panel 5:** Colleagues and managers from Financial, IT, and Board departments applauding Júnior's dedication and reliable system uptime.
> **Panel 6:** Júnior at his dual-monitor workstation, looking forward with confident determination, ready to conduct the final autonomous certification. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-60-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Rich technical comic art, full cluster diagnostic dashboard and final certificate modal, 6 panels in 3x2 grid.
> **Panel 1:** Júnior reviewing the final autonomous graduation ticket: `cat operacao-autonoma-chamado.txt`.
> **Panel 2:** Executing `cluster-full-diagnostics` verifying: Leader, Worker, WireGuard Mesh, Traefik routes, and Podman containers: `ALL SYSTEMS GREEN (0 errors)`.
> **Panel 3:** Terminal command `cluster-bcp-readiness-probe` testing backup snapshots, S3 encryption, and recovery readiness: `BCP STATUS: 100% READY`.
> **Panel 4:** Terminal command `cluster-end-to-end-acceptance` running automated end-to-end synthetic transactions across all 6 applications: `6/6 ACCEPTED`.
> **Panel 5:** Completing the final 6-pillar master checklist: Infrastructure, Identity, Collaboration, Storage, Security, Multi-Node Cluster.
> **Panel 6:** Sênior handing the golden graduation plaque to Júnior: "Parabéns, Administrador NethServer 8!". Massive celebratory toast with entire Teseo engineering team. 1536x1024.
