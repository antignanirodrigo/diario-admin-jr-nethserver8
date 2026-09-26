# Prompts das Pranchas Narrativas — Módulo 11 (Aulas 51 a 55)
**Curso NethServer 8 Interativo · Teseo IT Solutions**  
**Padrão Visual:** Graphic novel ocidental moderna, traço limpo europeu (Ligne Claire / Brian K. Vaughan), realismo sóbrio de TI, proporção 1536x1024, 6 quadros retangulares em grid 3x2 com bordas cinza-grafite finas e números nos cantos superiores.
**Personagens Canônicos:**
- **Júnior:** 26-27 anos, cabelo escuro desgrenhado, barba rala por fazer, moletom cinza grafite com capuz solto, crachá funcional da Aurora / Teseo com lanyard azul-petróleo.
- **Sênior:** ~44 anos, barba curta grisalha alinhada, óculos de aro preto retangular, blazer azul-marinho sobre camisa cinza de gola aberta.

---

## Aula 51 — Arquitetura Multi-Nó e VPN WireGuard Mesh
**Título:** Arquitetura Multi-Nó: Plano de Controle e WireGuard Mesh  
**Tema:** Planejamento da expansão horizontal do NS8 de nó único para cluster multi-nó, separação de papéis entre líder e workers e papel da malha WireGuard interna (`wg0`, 10.5.4.0/24).

### Prancha 1 — Conceitos e Contexto (`assets/aula-51.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Modern European graphic novel style, clean crisp linework, datacenter control room, 6 panels in a 3x2 grid.
> **Panel 1:** Aurora executive pointing to datacenter floor plan: "We are onboarding 150 new users next month. Our single server is nearing 60% RAM capacity. We need to scale horizontally!".
> **Panel 2:** Sênior explaining the NS8 cluster architecture on interactive whiteboard: "O NethServer 8 foi construído desde o primeiro dia para ser um cluster multi-nó. O nó original torna-se o Cluster Leader, e adicionamos novos nós Workers sem reinstalar nada do zero."
> **Panel 3:** Detailed network schematic: ns8-lab-01 (Leader, 192.168.50.10) linked via WireGuard interface wg0 (10.5.4.1/24) to ns8-worker-02 (Worker, 192.168.50.11, wg0: 10.5.4.2/24). ChaCha20-Poly1305 encryption badge.
> **Panel 4:** Sênior detailing control plane synchronization: Dialogue balloon: "O WireGuard do cluster opera diretamente no kernel do Linux. A VPN interna transporta o Redis do cluster, as métricas e o tráfego entre containers com latência de microssegundos!"
> **Panel 5:** Close-up of Traefik reverse proxy mesh diagram: Traefik on Leader receiving HTTPS traffic from WAN and routing seamlessly to a container running on the Worker node via the internal WireGuard tunnel.
> **Panel 6:** Júnior at his workstation terminal generating a cluster join token with a confident smile. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-51-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal outputs and network status cards, 6 panels in 3x2 grid.
> **Panel 1:** Júnior checking operator session: `whoami` and `hostname` on `ns8-lab-01`.
> **Panel 2:** Terminal command: `cat cluster-multinode-plano.txt` showing Leader IP 192.168.50.10 and target Worker IP 192.168.50.11.
> **Panel 3:** Executing `cluster-nodes-list` showing single leader node active with 6 applications currently hosted.
> **Panel 4:** Terminal command `cluster-vpn-mesh-status` inspecting WireGuard wg0 interface and MTU 1420 configuration.
> **Panel 5:** Running `cluster-join-token-generate` producing a cryptographically secure, time-limited join token: `AURORA-JOIN-9f2b8...`.
> **Panel 6:** Sênior looking over Júnior's shoulder, giving an approving nod: "Plano Multi-Nó e Token de Join Prontos". 1536x1024.

---

## Aula 52 — Adição do Nó Worker (`ns8-worker-02`) e Join ao Cluster
**Título:** Expansão Horizontal: Ingressando o Nó Worker no Cluster  
**Tema:** Execução do procedimento de join em uma VM Rocky Linux 9 limpa, estabelecimento do túnel WireGuard bidirecional, sincronização de configurações e validação da topologia multi-nó.

### Prancha 1 — Conceitos e Contexto (`assets/aula-52.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, modern tech atmosphere, 6 panels in a 3x2 grid.
> **Panel 1:** Datacenter technician racking a new 1U server labeled `ns8-worker-02`. Connecting dual 10GbE network cables.
> **Panel 2:** Sênior showing the join workflow: Dialogue balloon: "No nó worker, nós instalamos apenas a base limpa do Rocky Linux 9. O comando de join estabelece a chave pública do WireGuard, sincroniza o relógio e registra o nó no Cluster Leader."
> **Panel 3:** Architectural handshake diagram: Worker generates keypair -> Sends public key over TLS to Leader using join token -> Leader assigns IP 10.5.4.2 -> Full mesh WireGuard active in 3 seconds.
> **Panel 4:** Sênior emphasizing zero manual cluster software configuration on worker: "O nó worker não precisa de um painel web próprio. Toda a gestão continua centralizada na interface única do Cluster Leader!"
> **Panel 5:** Dashboard mockup showing "Cluster Nodes: 2 Active (1 Leader, 1 Worker)". Combined memory: 16 GB RAM.
> **Panel 6:** Júnior typing the join command into the secondary terminal console with focus and precision. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-52-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Crisp technical comic art, dual terminal split view, 6 panels in 3x2 grid.
> **Panel 1:** Terminal command: `cat worker-join-escopo.txt` specifying target node `ns8-worker-02` (192.168.50.11).
> **Panel 2:** Executing `node-prereq-check ns8-worker-02` validating Rocky Linux 9, CPU, RAM, and external DNS reachability.
> **Panel 3:** Terminal command `cluster-node-add --host 192.168.50.11 --token AURORA-JOIN-9f2b8` initiating remote cluster enrollment.
> **Panel 4:** Terminal progress bar: `[1/3] WireGuard handshake... OK [2/3] Core synchronization... OK [3/3] Ready`.
> **Panel 5:** Executing `cluster-nodes-status` displaying: Node 1 (Leader, ns8-lab-01, Online) and Node 2 (Worker, ns8-worker-02, Online).
> **Panel 6:** Júnior and Sênior smiling at the multi-node cluster topology map: "Nó Worker Ingressado com Sucesso". 1536x1024.

---

## Aula 53 — Distribuição e Migração de Cargas de Trabalho (Workload Placement)
**Título:** Distribuição de Cargas: Migração de Aplicações entre Nós  
**Tema:** Balanceamento de recursos no cluster, migração de instâncias de containers (Nextcloud) do líder para o worker, orquestração transparente pelo Traefik sem interrupção de FQDN.

### Prancha 1 — Conceitos e Contexto (`assets/aula-53.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European graphic novel style, tech office setting, 6 panels in a 3x2 grid.
> **Panel 1:** CPU and RAM gauge showing Leader node at 78% memory utilization while Worker node sits idle at 8%.
> **Panel 2:** Sênior explaining workload distribution: Dialogue balloon: "O grande poder de um cluster é o balanceamento. O Nextcloud consome 1.2 GB de RAM e banco de dados. Vamos mover a instância nextcloud1 para o ns8-worker-02, liberando o nó líder para tarefas críticas."
> **Panel 3:** Step-by-step migration diagram: 1) Stop container on Node 1; 2) Sync persistent state; 3) Start container on Node 2 (10.5.4.2); 4) Traefik updates backend target automatically via WireGuard.
> **Panel 4:** Sênior highlighting the seamless user experience: Dialogue balloon: "O usuário que acessa https://cloud.lab.example/ continua digitando a mesma URL e falando com o mesmo IP público. O Traefik roteia o pacote pela VPN interna direto para o nó 2!"
> **Panel 5:** Visual showing balanced load meters: Leader at 38% RAM, Worker at 42% RAM. Ideal datacenter harmony.
> **Panel 6:** Júnior poised at his keyboard, excited to trigger his first live container workload migration. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-53-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Clean line comic art, terminal commands and Traefik route diagrams, 6 panels in 3x2 grid.
> **Panel 1:** Terminal review: `cat workload-migration-plano.txt` listing source node `ns8-lab-01` and destination `ns8-worker-02`.
> **Panel 2:** Executing `app-node-list` verifying that all 6 applications currently execute on node 1.
> **Panel 3:** Terminal command `app-migrate nextcloud1 --target-node ns8-worker-02` executing graceful container handover.
> **Panel 4:** Terminal output showing migration completion in 4.2 seconds: `nextcloud1 status: RUNNING on ns8-worker-02`.
> **Panel 5:** Executing `traefik-mesh-routes-audit` confirming `cloud.lab.example -> 10.5.4.2:80 (HTTP/2 200 OK)`.
> **Panel 6:** Júnior testing cloud login on his browser while Sênior gives a celebratory thumbs-up: "Carga de Trabalho Migrada com Sucesso". 1536x1024.

---

## Aula 54 — Replicação de Dados e Armazenamento Distribuído no Cluster
**Título:** Armazenamento Distribuído: Volumes e Compartilhamentos de Rede  
**Tema:** Modelos de armazenamento em clusters NS8 (volumes locais de nós vs NFS corporativo compartilhado `/srv/shared-nfs`), consistência de dados e estratégias de persistência para aplicações migradas.

### Prancha 1 — Conceitos e Contexto (`assets/aula-54.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Comic book art, technical clarity, storage SAN and datacenter background, 6 panels in a 3x2 grid.
> **Panel 1:** Júnior scratching his head looking at storage diagram: "If we move applications between nodes, where do their persistent files, photos and databases live?".
> **Panel 2:** Sênior sketching storage patterns on glass board: "Ótima pergunta, Júnior! Em um cluster NS8, existem dois modelos: volumes locais sincronizados pelo cluster ou armazenamento compartilhado de rede (NFS / iSCSI NAS)."
> **Panel 3:** Infographic comparing Local Node Storage (fast NVMe, pinned to node) vs Network Shared Storage (NFS 4.2 on 192.168.50.20, accessible by all nodes simultaneously).
> **Panel 4:** Sênior pointing out failover flexibility: Dialogue balloon: "Com armazenamento NFS compartilhado montado em /srv/shared-nfs, qualquer nó do cluster pode subir o container imediatamente sem necessidade de copiar terabytes de dados!"
> **Panel 5:** Diagram of POSIX permissions and UID/GID mapping across nodes to ensure container rootless Podman users maintain identical file ownership.
> **Panel 6:** Júnior nodding with enlightened expression, ready to mount and validate shared storage across the cluster nodes. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-54-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, terminal commands and storage mount outputs, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen: `cat storage-distribuido-plano.txt` detailing NFS server `192.168.50.20` and export `/export/aurora-cluster`.
> **Panel 2:** Executing `node-storage-audit` inspecting local disk mount points across `ns8-lab-01` and `ns8-worker-02`.
> **Panel 3:** Terminal command `cluster-nfs-mount --server 192.168.50.20 --path /srv/shared-nfs` mounting network volume on all cluster members.
> **Panel 4:** Executing `cluster-storage-validate` writing and reading test locking canary file across both nodes. Output: `I/O PASS, latency 0.8ms`.
> **Panel 5:** Terminal verification: `df -h /srv/shared-nfs` reporting `4.0 TB total, 3.2 TB available, NFSv4.2 with sec=sys`.
> **Panel 6:** Sênior pointing at terminal: "Armazenamento compartilhado consolidado. Agora nosso cluster é verdadeiramente flexível!". 1536x1024.

---

## Aula 55 — ⭐ Revisão Integrada 11: Simulação de Falha de Nó e Resiliência de Cluster
**Título:** ⭐ Marco de Revisão Integrada 11: Resiliência de Cluster e Recuperação de Falhas  
**Tema:** Auditoria de alta disponibilidade e tolerância a falhas: simulação de parada abrupta do nó worker, diagnóstico de isolamento de rede, recuperação de serviços e homologação da certificação multi-nó.

### Prancha 1 — Conceitos e Contexto (`assets/aula-55.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European modern graphic novel style, dramatic datacenter lighting, 6 panels in a 3x2 grid, gold star badge in top margin.
> **Panel 1:** Red warning flashing on rack console: Node `ns8-worker-02` heartbeat lost! Communication over WireGuard 10.5.4.2 times out.
> **Panel 2:** Sênior remaining completely calm, sipping coffee: "Toda infraestrutura vai falhar um dia, Júnior. O teste do administrador sênior é como seu cluster reage quando um nó físico apaga repentinamente."
> **Panel 3:** Resiliency workflow diagram: Cluster Leader detects missing heartbeat (30s) -> Marks worker as DEGRADED -> Traefik healthcheck trips -> Operator inspects or evacuates workloads -> Restores node -> Re-convergence in seconds.
> **Panel 4:** Close-up of WireGuard mesh self-healing: Once network cable is plugged back, WireGuard handshakes automatically and routes resume without rebooting the leader.
> **Panel 5:** Sênior looking proudly at Júnior: Dialogue balloon: "Você dominou nós líderes, workers, roteamento Traefik por VPN interna e armazenamento distribuído. Nosso datacenter agora tem músculos de alta disponibilidade!"
> **Panel 6:** Júnior smiling with determination, ready to conduct the full disaster drill and certify Module 11. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-55-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal outputs and cluster topology graphs, 6 panels in 3x2 grid.
> **Panel 1:** Júnior reviewing disaster drill scope: `cat resiliencia-cluster-escopo.txt`.
> **Panel 2:** Executing `cluster-failover-simulate --offline-node ns8-worker-02` simulating network partition on worker node.
> **Panel 3:** Terminal command `cluster-health-probe` reporting `ns8-lab-01: ONLINE | ns8-worker-02: UNREACHABLE (Alert dispatched)`.
> **Panel 4:** Terminal command `cluster-node-recover --node ns8-worker-02` restoring WireGuard peer and resuming container sync.
> **Panel 5:** Running end-to-end verification probe: `cluster-resilience-audit` checking node health, VPN latency, and Traefik routing. Result: `100% HEALTHY`.
> **Panel 6:** Sênior presenting the golden Módulo 11 badge to Júnior: "Especialista em Cluster Multi-Nó e Alta Disponibilidade NS8". Handshake of technical excellence. 1536x1024.
