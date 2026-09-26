# Prompts das Pranchas Narrativas — Módulo 8 (Aulas 36 a 40)
**Curso NethServer 8 Interativo · Teseo IT Solutions**  
**Padrão Visual:** Graphic novel ocidental moderna, traço limpo de quadrinho europeu (estilo linha clara / Ligne Claire / Brian K. Vaughan), cores sóbrias de TI, 1536x1024, 6 quadros retangulares organizados em grid 3x2 com bordas cinza-grafite finas e números nos cantos superiores.
**Personagens Canônicos:**
- **Júnior:** 26-27 anos, cabelo escuro desgrenhado, barba rala por fazer, moletom cinza grafite escuro com capuz solto, crachá funcional da Aurora / Teseo com lanyard azul-petróleo, olhos castanhos atentos.
- **Sênior:** ~44 anos, barba curta grisalha bem alinhada, óculos de aro preto retangular, blazer azul-marinho sobre camisa cinza de gola aberta, postura calma, didática e firme.

---

## Aula 36 — Estratégia de Backup: Restic, Repositórios e Retenção
**Título:** Estratégia de Backup: Restic, Repositórios e Retenção  
**Tema:** Compreensão da engine de backup nativa do NS8 (Restic snapshot-based), repositórios remotos (SFTP e S3) e política de retenção (GFS / keep-daily / keep-monthly).

### Prancha 1 — Conceitos e Contexto (`assets/aula-36.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> A modern European graphic novel style, clean crisp linework, subtle digital watercolor shading, cinematic composition. Six sequential comic panels arranged in a 3x2 grid with thin dark graphite gutters and panel numbers 1 to 6.
> **Panel 1:** Júnior sitting at his dual-monitor desk in Aurora's modern server operations room, looking at an incident notification on screen stating "Storage alert: Local disk backup full". Junior looks anxious, hand on mouse.
> **Panel 2:** Sênior stands next to the whiteboard, drawing a comparison between "Simple File Copy (Tar/Zip)" crossed out in red and "Restic Content-Addressed Snapshot Engine (Deduplication, Incremental, Encrypted)" highlighted in glowing teal blue.
> **Panel 3:** Detailed close-up technical diagram of Restic storage mechanism: chunks of data hashed with SHA-256, deduplicated storage pool, and snapshots pointing to data blocks, illustrating that 10 daily backups only consume new delta data.
> **Panel 4:** Sênior gesturing calmly with open palm, speaking to Júnior. Dialogue balloon: "Um backup local no mesmo disco não é backup, é apenas uma cópia de conveniência. Se o nó queimar, você perde os dados e o backup junto. O NS8 usa Restic para enviar snapshots deduplicados para fora do servidor."
> **Panel 5:** Architectural schematic comparing two remote repository destinations: S3 Object Storage (MinIO / AWS S3) with bucket permissions vs SFTP / SSH remote server with private key authentication.
> **Panel 6:** Júnior typing on his mechanical keyboard with a determined expression, understanding the retention policy graph on screen: Keep 7 daily, 4 weekly, 12 monthly snapshots. Subtle cool blue and warm amber server room lighting. High resolution, high contrast typography, 1536x1024, 8k.

### Prancha 2 — Prática e Laboratório (`assets/aula-36-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> A crisp technical graphic novel style, clean comic line art, dark theme terminal interfaces, 6 panels in a 3x2 grid with thin frames.
> **Panel 1:** Júnior checking operator session in terminal: running `whoami` returning `junior` and `hostname` showing `ns8-lab-01`.
> **Panel 2:** Terminal screen displaying `cat estrategia-backup.txt` showing target repository requirements: Destination `s3://aurora-backups/ns8`, retention policy `7D/4W/12M`, encryption passkey requirement.
> **Panel 3:** Command execution `restic-repo-discover` testing network connectivity and latency towards the offsite S3 backup target at `192.168.50.200:9000`.
> **Panel 4:** Interactive web interface of NS8 Settings > Backup showing the retention rule builder: Keep Last (7), Keep Daily (7), Keep Weekly (4), Keep Monthly (12).
> **Panel 5:** Terminal executing `backup-policy-validate` displaying green status: `[OK] Restic engine ready, encryption key verified, retention policy syntax validated`.
> **Panel 6:** Sênior smiling warmly with hands on Júnior's desk shoulder, Júnior giving a confident nod. Notification on screen: "Estratégia de Backup Homologada". High resolution, crisp vector-like linework, 1536x1024.

---

## Aula 37 — Configuração de Repositório de Backup e Credenciais
**Título:** Repositório de Backup e Segredos de Criptografia  
**Tema:** Provisionamento seguro do backend de backup remoto, armazenamento de Access Key/Secret Key e passphrase de cifragem no Cluster Admin.

### Prancha 1 — Conceitos e Contexto (`assets/aula-37.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel aesthetic, clear line art, cinematic lighting, 6 panels in a 3x2 grid.
> **Panel 1:** Close-up of a digital padlock graphic on a server console: "Restic Password / Cryptographic Key". Júnior holding a yellow sticky note with a password written on it.
> **Panel 2:** Sênior immediately snatching the sticky note with a stern look, holding up a secure hardware token / key manager icon. Dialogue balloon: "Se a chave de criptografia do repositório for perdida, nem a Nethesis, nem a Teseo, nem ninguém recupera seus dados. E se ela ficar colada no monitor, você não tem segurança."
> **Panel 3:** Diagram illustrating Restic client-side envelope encryption: payload encrypted on the NS8 host with AES-256 before leaving the network interface, traveling over TLS to an untrusted cloud or remote bucket.
> **Panel 4:** Blueprint of credential separation: IAM user with least-privilege `PutObject`, `GetObject`, `ListBucket` policies restricted to bucket `s3://aurora-backups`.
> **Panel 5:** Sênior explaining the repository initialization handshake: `restic init` creating config file, keys directory, and snapshot index inside the remote bucket.
> **Panel 6:** Júnior at his workstation, storing the generated master passkey inside the corporate vault (Bitwarden / KeePass) and feeling confident in the zero-trust workflow. High detail, 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-37-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European comic style, clean dark UI frames, 6 sequential panels in 3x2 grid.
> **Panel 1:** Júnior reviewing configuration parameters: `cat repo-credenciais-plano.txt` showing bucket URL, region, and access keys.
> **Panel 2:** Terminal command execution: `backup-repo-test s3://aurora-backups/ns8` verifying network ping, TLS certificate and port 9000 reachability.
> **Panel 3:** NS8 Cluster Admin UI showing the "Add Backup Destination" modal: Type S3 compatible, Endpoint `https://s3.aurora.lab`, Bucket `aurora-backups`, Path `ns8-cluster`.
> **Panel 4:** Terminal command `backup-repo-init` outputting: `repository 4d82b3a1 initialized successfully, password set, master key stored`.
> **Panel 5:** Terminal command `backup-repo-status` showing status `Connected, Snapshots: 0, Total size: 0 B, Lock status: free`.
> **Panel 6:** Júnior inspecting the green checkmark on the NS8 Backup dashboard: "Destination: aurora-backups (Healthy)". Sênior nods in approval in background. 1536x1024.

---

## Aula 38 — Backup Granular de Aplicações vs Backup do Core
**Título:** Backup Granular: Core do Cluster vs Aplicações  
**Tema:** Diferenciação entre o backup de estado do cluster (Redis, WireGuard, configurações) e os backups granulares de cada instância (Samba AD, Nextcloud, Mail).

### Prancha 1 — Conceitos e Contexto (`assets/aula-38.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Comic book art, clean crisp contours, realistic IT environment, 6 panels in a 3x2 grid.
> **Panel 1:** Sênior pointing to a diagram with two distinct columns: "Cluster Core (Cluster Admin, VPN, Metadata)" on the left, and "Application Instances (nextcloud1, mail1, samba1)" on the right.
> **Panel 2:** Junior looking confused asking a question. Dialogue balloon: "Se eu fizer o backup apenas da máquina virtual inteira no hypervisor, não é suficiente?" Sênior responds: "Hypervisor snapshot congela discos, mas não garante consistência de bancos de dados ativos e não permite restaurar apenas a caixa de entrada de um usuário sem derrubar o resto."
> **Panel 3:** Detailed technical breakdown of Application Backup in NS8: pre-backup hook locks database (MariaDB/PostgreSQL dump), takes container snapshot, unfreezes database, streams data to Restic repository.
> **Panel 4:** Infographic of schedule separation: Cluster Core backup runs once a week or on configuration change; Mail & Nextcloud run every night; Active Directory runs every 4 hours.
> **Panel 5:** Sênior showing an alert on tablet: "Database lock duration: 1.4s (minimal production disruption during live backup)".
> **Panel 6:** Júnior drawing the scheduling timeline on his scratchpad, realizing that granular schedules prevent I/O bottlenecks during peak office hours. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-38-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal outputs, 6 panels in 3x2 grid.
> **Panel 1:** Júnior in terminal executing `cat escopo-backup-granular.txt` checking registered instances: `core`, `samba1`, `nextcloud1`, `mail1`.
> **Panel 2:** Command `backup-plan-list` displaying separate backup jobs with distinct schedules and target retention periods.
> **Panel 3:** Running manual test backup of core configuration: `backup-run core` showing fast execution in 4.2 seconds.
> **Panel 4:** Running manual test backup of application: `backup-run mail1` showing pre-hook DB dump, volume streaming and Restic snapshot creation.
> **Panel 5:** In terminal running `backup-snapshot-list` showing the newly created snapshots with unique IDs and tags: `tag:core-weekly`, `tag:mail1-daily`.
> **Panel 6:** NS8 UI showing table of active backup jobs with green badges: "All scheduled jobs operational". Júnior smiles with satisfaction. 1536x1024.

---

## Aula 39 — Simulação de Disaster Recovery: Restauração de Aplicação
**Título:** Disaster Recovery: Procedimento de Restauração  
**Tema:** Execução prática de restore drill no NS8. Restaurando uma aplicação com falha (`nextcloud1`) a partir de snapshot Restic sem reinstalar o sistema operacional.

### Prancha 1 — Conceitos e Contexto (`assets/aula-39.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European line comic art, dramatic emergency scene in IT office, 6 panels in a 3x2 grid.
> **Panel 1:** A user rushing into Júnior's office panicked: "The shared folder and database in Nextcloud are completely corrupted after an accidental bulk script run!".
> **Panel 2:** Júnior's first impulse is to restart the VM. Sênior gently holds his wrist: "Calma. Reiniciar uma base corrompida só vai propagar o erro para os logs e apagar pistas. Nosso plano de recuperação existe para isso. Vamos selecionar o snapshot íntegro de 2 horas atrás."
> **Panel 3:** Step-by-step schematic of NS8 Restore architecture: 1. Stop instance containers; 2. Fetch snapshot metadata from Restic; 3. Restore persistent volumes (/srv/disk1/apps/nextcloud1); 4. Restore database dump; 5. Re-run post-restore healthchecks; 6. Start container.
> **Panel 4:** Contrast diagram: "Naive Restore (Overwrites entire server, loses 24h of all services)" vs "NS8 Granular Restore (Restores ONLY nextcloud1, Samba and Mail keep running untouched)".
> **Panel 5:** Sênior observing Júnior with confidence. Dialogue balloon: "O teste de fogo de um administrador de sistemas não é fazer backup, é o tempo e a precisão do restore."
> **Panel 6:** Júnior opening the NS8 Disaster Recovery console with clear head and disciplined posture. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-39-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel aesthetic, clean terminal and UI elements, 6 panels in a 3x2 grid.
> **Panel 1:** Terminal screen showing incident details: `cat chamado-desastre-cloud.txt` reporting Nextcloud data corruption on instance `nextcloud1`.
> **Panel 2:** Terminal command: `app-status nextcloud1` reporting error state: `State: DEGRADED (database table mismatch, 500 Internal Server Error)`.
> **Panel 3:** Inspecting available snapshots: `backup-snapshot-list nextcloud1` displaying candidate snapshot `b82f91a (Taken today at 04:00 AM, clean state)`.
> **Panel 4:** Initiating granular restore: `restore-app nextcloud1 b82f91a --confirm` showing progress bar: extracting volume data, importing database, validating container hashes.
> **Panel 5:** Terminal verification: `app-status nextcloud1` showing `RUNNING (all containers healthy)` and `curl -I https://cloud.lab.example/` returning `HTTP/2 200 OK`.
> **Panel 6:** Júnior high-fiving Sênior in front of glowing monitor, terminal showing "Restore Drill Completed: 0 data loss from previous snapshot". 1536x1024.

---

## Aula 40 — ⭐ Revisão Integrada 08: Simulação de Pane Catastrófica e DR Drill
**Título:** ⭐ Marco de Revisão Integrada 08: Auditoria Geral de Resiliência  
**Tema:** Simulação abrangente de perda de nó / desastre de armazenamento, auditoria de repositórios, verificação de consistência criptográfica com `restic check` e emissão do Relatório de Continuidade de Negócios (BCP).

### Prancha 1 — Conceitos e Contexto (`assets/aula-40.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European modern graphic novel style, dramatic golden hour in server room, 6 panels in a 3x2 grid, gold star badge in top margin.
> **Panel 1:** Aurora corporate board meeting room with projector screen: "Business Continuity & Disaster Recovery Audit (BCP / DR Drill)". Executives looking attentive.
> **Panel 2:** Sênior presenting the resilience metrics: RPO (Recovery Point Objective) set at 4 hours, RTO (Recovery Time Objective) set at under 30 minutes.
> **Panel 3:** Visual diagram of full cluster disaster: Physical failure of host, rebuilding a fresh node, installing NS8 base, reconnecting to the remote S3 repository, and executing `cluster-restore`.
> **Panel 4:** Sênior speaking to Júnior who is wearing the golden milestone badge on his lanyard. Dialogue balloon: "Você dominou a instalação, rede, domínio Samba, compartilhamentos, Nextcloud, e-mail e agora resiliência. Quando o pior acontecer no mundo real, você não vai entrar em pânico porque já praticou cada segundo desse procedimento."
> **Panel 5:** Infographic showing the 3-2-1 backup rule applied to NS8: 3 copies of data, 2 different media types (NVMe local + S3 Object Storage), 1 offsite off-premises copy.
> **Panel 6:** Júnior at his terminal with a calm, veteran expression, ready to execute the comprehensive audit and certification protocol. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-40-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, 6 panels in a 3x2 grid, high detail terminal UI.
> **Panel 1:** Júnior reviewing the comprehensive test scenario: `cat auditoria-resiliencia-escopo.txt`.
> **Panel 2:** Executing repository integrity check: `restic-check-repo` scanning all packs, blobs and trees for cryptographic bitrot or corruption. Output: `[PASS] 0 errors found in 42 snapshots`.
> **Panel 3:** Executing simulated automated disaster recovery dry-run: `dr-drill-simulate --all-apps` verifying that recovery scripts can restore core, samba1, mail1, and nextcloud1 in sequence.
> **Panel 4:** Measuring RTO performance in terminal: `dr-metrics-report` displaying `Actual RTO: 14m 22s (Target < 30m) - SUCCESS`.
> **Panel 5:** Review checklist panel on NS8 dashboard: Restic Repository (Verified), Encryption Keys Vaulted (Verified), Granular Schedules (Verified), Restore Drills (Passed), RTO/RPO Metrics (Compliant).
> **Panel 6:** Sênior handing Júnior the official certificate folder: "Módulo 8 Concluído — Especialista em Continuidade de Negócios NS8". Gold star gleaming on screen with celebration toast. 1536x1024.
