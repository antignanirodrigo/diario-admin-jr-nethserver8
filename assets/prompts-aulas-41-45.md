# Prompts das Pranchas Narrativas — Módulo 9 (Aulas 41 a 45)
**Curso NethServer 8 Interativo · Teseo IT Solutions**  
**Padrão Visual:** Graphic novel ocidental moderna, traço limpo europeu (Ligne Claire / Brian K. Vaughan), estética de TI realista e sóbria, proporção 1536x1024, 6 quadros retangulares em grid 3x2 com bordas cinza-grafite finas e números nos cantos superiores.
**Personagens Canônicos:**
- **Júnior:** 26-27 anos, cabelo escuro desgrenhado, barba rala por fazer, moletom cinza grafite com capuz solto, crachá da Aurora / Teseo com lanyard azul-petróleo.
- **Sênior:** ~44 anos, barba curta grisalha alinhada, óculos de aro preto retangular, blazer azul-marinho sobre camisa cinza de gola aberta.

---

## Aula 41 — Modelo de Segurança: Host Firewall vs UTM NethSecurity
**Título:** Modelo de Segurança: Host Firewall vs UTM NethSecurity  
**Tema:** Compreensão da separação arquitetural histórica: NethServer 7 (tudo-em-um) vs NethServer 8 (orquestrador de apps em container) e NethSecurity 8 (appliance dedicado de borda UTM baseado em OpenWrt).

### Prancha 1 — Conceitos e Contexto (`assets/aula-41.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Modern European graphic novel style, clean crisp line art, cinematic lighting, 6 panels in a 3x2 grid.
> **Panel 1:** Sênior drawing an evolution timeline on the glass board: "NethServer 7 (All-in-One: Gateway + Mail + Files + DC on single machine)" with an arrow pointing to "NethServer 8 + NethSecurity 8 (Decoupled Best-of-Breed Architecture)".
> **Panel 2:** Júnior staring intently with hands on chin, asking: "Por que a Nethesis separou o firewall do NethServer 8 em vez de manter tudo junto como no NS7?".
> **Panel 3:** Sênior tapping the diagram with his dry-erase marker. Dialogue balloon: "Um servidor que executa containers de aplicações (Nextcloud, ERP, Mail) tem ciclo de atualização diferente de um firewall de borda. Se o firewall reiniciar por causa de um update de app web, a empresa inteira fica sem internet. Borda é NethSecurity; aplicações é NethServer."
> **Panel 4:** Technical architectural layout: Internet cloud -> NethSecurity 8 UTM Appliance (Multi-WAN, DPI, IPS/IDS, NAT, OpenWrt kernel) -> LAN / DMZ Switch -> NethServer 8 Cluster (Rocky Linux 9, Podman, Traefik, nftables host firewall).
> **Panel 5:** Diagram of the internal host firewall on NS8: `firewalld / nftables` protecting the local VM listening ports (22, 80, 443, 587, 993), while NethSecurity handles stateful border filtering and routing.
> **Panel 6:** Júnior at his dual-monitor terminal typing `firewall-model-inspect`, smiling as the lightbulb clicks on. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-41-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Crisp technical comic style, terminal and network topology UI, 6 panels in 3x2 grid.
> **Panel 1:** Júnior verifying operator context with `whoami` and `hostname` showing `ns8-lab-01`.
> **Panel 2:** Terminal command `cat modelo-seguranca-escopo.txt` detailing the role separation: NS8 as Internal Application Host (192.168.50.10) and NethSecurity as Border Gateway (192.168.50.1).
> **Panel 3:** Executing `host-firewall-status` displaying active nftables zones and open inbound service ports: `zone: trusted (WireGuard mesh), zone: public (tcp/80, tcp/443, tcp/587, tcp/993)`.
> **Panel 4:** Executing `border-gateway-probe 192.168.50.1` validating reachability of NethSecurity 8 appliance on port 9090 and default gateway routing.
> **Panel 5:** Educational UI panel where Júnior classifies network layers: Edge UTM vs Host Firewall vs Container Isolation.
> **Panel 6:** Sênior giving a thumbs up in the server room background as terminal confirms: "Modelo de Segurança Validado". 1536x1024.

---

## Aula 42 — Integração Arquitetural: NethSecurity Controller e Port Forwarding
**Título:** NethSecurity Controller e Roteamento de Borda  
**Tema:** Como o NS8 se comunica com o NethSecurity 8 via o app NethSecurity Controller, gestão de instâncias remotas e abertura/encaminhamento de portas (NAT/Port Forwarding) para os serviços do cluster.

### Prancha 1 — Conceitos e Contexto (`assets/aula-42.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, clear line art, subtle server room colors, 6 panels in 3x2 grid.
> **Panel 1:** Sênior introducing the NethSecurity Controller concept on laptop: "Para administrar múltiplos firewalls NethSecurity a partir de uma interface centralizada, o NS8 possui o app NethSecurity Controller."
> **Panel 2:** Close-up of the NethSecurity web console (port 9090, modern OpenWrt LuCI / Nethesis skin) showing WAN status, Multi-WAN failover, and Threat Shield (Suricata/CrowdSec).
> **Panel 3:** Blueprint of NAT / Port Forwarding rule: Public WAN IP:443 -> Forwarded to NS8 Cluster Traefik IP (192.168.50.10:443); WAN:25 -> Forwarded to NS8 Mail (192.168.50.10:25).
> **Panel 4:** Sênior pointing to the screen sternly: "Nunca faça DMZ cega para o IP do NS8! Encaminhe somente as portas estritamente necessárias (80, 443, 25, 587, 993) e mantenha portas de gerência (Cluster Admin 443 com restrição e SSH 22) invisíveis na Internet."
> **Panel 5:** Diagram of the secure API tunnel between NethSecurity Controller on NS8 and the remote NethSecurity appliance over mTLS.
> **Panel 6:** Júnior writing down the port forwarding rule table on his notepad, feeling ready to implement the boundary rules. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-42-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, clean UI and terminal boxes, 6 panels in 3x2 grid.
> **Panel 1:** Terminal execution: `cat integracao-nethsec-plano.txt` showing appliance FQDN `netsec.aurora.lab` (192.168.50.1).
> **Panel 2:** Command `nethsec-controller-status` confirming the controller app is operational on NS8.
> **Panel 3:** Executing `nethsec-appliance-pair --host 192.168.50.1` establishing the encrypted mTLS control session between NS8 and the NethSecurity appliance.
> **Panel 4:** Executing `nethsec-nat-apply --port-map "80:80,443:443,25:25,587:587"` pushing the border port forwarding rules to NethSecurity's nftables engine.
> **Panel 5:** Command `nethsec-audit-forwarding` showing all 4 rules active: `WAN -> 192.168.50.10 [ALLOW, LOGGED]`.
> **Panel 6:** Júnior showing the unified dashboard to Sênior: "Appliance NethSecurity Pareado e Regras de NAT Aplicadas". 1536x1024.

---

## Aula 43 — Proxy Reverso Integrado (Traefik): Roteamento e TLS
**Título:** Proxy Reverso Traefik: Roteamento HTTP e Certificados  
**Tema:** O papel do Traefik no NethServer 8 como proxy reverso unificado, roteamento baseado em SNI / host headers, terminação TLS e cabeçalhos de segurança (HSTS, CSP).

### Prancha 1 — Conceitos e Contexto (`assets/aula-43.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European comic style, crisp ink contours, modern IT datacenter atmosphere, 6 panels in 3x2 grid.
> **Panel 1:** Sênior holding a flashlight pointing at a road intersection sign: "cloud.aurora.lab", "mail.aurora.lab", "admin.aurora.lab". Dialogue balloon: "Todas essas URLs chegam na mesma porta 443 do IP do servidor. Quem decide para qual container cada requisição vai é o Traefik."
> **Panel 2:** Júnior watching an animated explanation on screen: Traefik inspecting the SNI (Server Name Indication) in the TLS ClientHello and the HTTP `Host:` header to route requests to the correct Podman container socket.
> **Panel 3:** Close-up diagram of TLS termination: Traefik presents Let's Encrypt / custom CA certificates, decrypts the TLS stream, and forwards unencrypted or mTLS traffic to internal container ports over localhost or pod network.
> **Panel 4:** Infographic of HTTP Security Headers injected by Traefik: `Strict-Transport-Security (HSTS)`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, preventing clickjacking and MIME-confusion attacks.
> **Panel 5:** Sênior gesturing: "No NS8 você não edita arquivos de configuração de Apache na mão. O Traefik lê dinamicamente as rotas registradas pelas aplicações no cluster."
> **Panel 6:** Júnior nodding with enthusiasm, ready to configure and audit HTTP routes in terminal and UI. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-43-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Clean comic lines, terminal views, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen showing `cat traefik-rotas-escopo.txt` listing public FQDNs and internal backends.
> **Panel 2:** Command `traefik-routes-list` showing active routes for `nextcloud1` (`cloud.lab.example`) and `Cluster Admin` (`ns8-lab-01.lab.example`).
> **Panel 3:** Executing `traefik-cert-audit cloud.lab.example` verifying TLS validity, issuer, and expiration date.
> **Panel 4:** Command `traefik-security-headers-apply cloud.lab.example --hsts --nosniff` hardening the frontend route.
> **Panel 5:** Terminal verification: `curl -I https://cloud.lab.example/` displaying `strict-transport-security: max-age=31536000; includeSubDomains` and `x-frame-options: SAMEORIGIN`.
> **Panel 6:** Sênior patting Júnior on the back as security score badge turns green: "A+ SSL Labs / Traefik Hardened". 1536x1024.

---

## Aula 44 — VPN e Conectividade Segura: WireGuard vs OpenVPN / IPsec
**Título:** VPN e Malha de Conectividade: WireGuard e Túneis  
**Tema:** O papel da malha WireGuard interna do cluster NS8 (comunicação segura inter-nós) em contraste com os serviços de VPN de acesso remoto (OpenVPN/Roadwarrior) e site-to-site (IPsec) providos no NethSecurity 8.

### Prancha 1 — Conceitos e Contexto (`assets/aula-44.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Modern graphic novel style, cinematic lighting, 6 panels in 3x2 grid.
> **Panel 1:** Sênior sketching a network topology: two distinct VPN layers highlighted in contrasting colors — Green for "WireGuard Cluster Mesh" and Orange for "NethSecurity User Roadwarrior VPN".
> **Panel 2:** Junior asking: "Se o NS8 já tem WireGuard, por que eu não conecto os usuários do home office direto nele?".
> **Panel 3:** Sênior shaking head firmly. Dialogue balloon: "O WireGuard do NS8 é a medula espinhal do cluster! Ele serve para os nós conversarem entre si com criptografia rápida de kernel. Colocar 50 notebooks de funcionários dentro da rede de controle do cluster é violar a separação de privilégios. VPN de usuários fica no firewall NethSecurity!"
> **Panel 4:** Diagram of NethSecurity VPN termination: Remote workers connect via OpenVPN / WireGuard on NethSecurity (port 1194/51820), undergo Multi-Factor Authentication (MFA), and are subject to border firewall policies.
> **Panel 5:** Diagram of NS8 Cluster VPN: Internal subnet `10.5.4.0/24`, peer-to-peer authenticated public keys, encapsulating inter-node traffic seamlessly.
> **Panel 6:** Júnior observing the elegance of the dual-layer architecture, understanding the defense-in-depth security model. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-44-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic art, terminal windows, 6 panels in 3x2 grid.
> **Panel 1:** Junior running `whoami` and `hostname` in the management terminal.
> **Panel 2:** Terminal command: `cat vpn-arquitetura-plano.txt` explaining the separation between cluster mesh and roadwarrior access.
> **Panel 3:** Executing `cluster-vpn-status` inspecting WireGuard interface `wg0`: CIDR `10.5.4.1/24`, listening port 51820, handshake active, 0 packet loss.
> **Panel 4:** Executing `nethsec-vpn-audit 192.168.50.1` querying the NethSecurity border appliance for user roadwarrior pool status (`10.99.0.0/24`, OpenVPN/TLS ready).
> **Panel 5:** Running end-to-end connectivity test: `vpn-mesh-ping 10.5.4.1` and `vpn-security-validate`.
> **Panel 6:** UI panel confirming green status for both cluster mesh and border remote access. Sênior smiles with approval. 1536x1024.

---

## Aula 45 — ⭐ Revisão Integrada 09: Incidente de Segurança de Borda e Publicação
**Título:** ⭐ Marco de Revisão Integrada 09: Auditoria de Borda e Hardening  
**Tema:** Cenário de incidente de segurança simulado: tráfego malicioso atacando porta de gerência exposta, isolamento de rota, reconfiguração do NethSecurity UTM, hardening no Traefik e homologação de publicação segura.

### Prancha 1 — Conceitos e Contexto (`assets/aula-45.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, emergency alert atmosphere in operations room, 6 panels in 3x2 grid, gold star badge in top margin.
> **Panel 1:** Red flashing alert on Júnior's terminal: "SECURITY ALERT: Brute force attempts on Cluster Admin port from external IP range!".
> **Panel 2:** Sênior arriving with calm authority, looking at the logs: "Alguém encaminhou a porta de gerência diretamente na WAN do NethSecurity sem restrição de IP de origem. Portas de administração jamais devem ficar expostas ao mundo."
> **Panel 3:** Attack anatomy diagram: Botnet scanning port 443/9090, attempting automated credential stuffing against admin accounts.
> **Panel 4:** Remediation plan diagram: 1. Remove public WAN port forwarding for Cluster Admin; 2. Confine management access strictly to LAN and authenticated VPN; 3. Enable CrowdSec / Threat Shield on NethSecurity to ban offender IPs; 4. Verify Traefik reverse proxy limits public exposure to application domains only (`cloud.aurora.lab`).
> **Panel 5:** Sênior speaking to Júnior: "A segurança de uma empresa não depende de um único cadeado. Se a borda (NethSecurity) e o proxy (Traefik) trabalharem juntos, os containers do NS8 operam protegidos como em um bunker."
> **Panel 6:** Júnior sitting upright, cracking knuckles, ready to execute the comprehensive edge defense protocol. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-45-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European comic style, detailed terminal lines, 6 panels in 3x2 grid.
> **Panel 1:** Júnior reviewing incident ticket: `cat chamado-incidente-seguranca.txt`.
> **Panel 2:** Inspecting border exposure: `nethsec-audit-forwarding` identifying rogue port forward: `WAN:8443 -> 192.168.50.10:443 (Cluster Admin exposed!)`.
> **Panel 3:** Remediating border rule: `nethsec-nat-revoke --rule admin-wan` closing the external management exposure immediately.
> **Panel 4:** Activating edge threat intelligence: `nethsec-threatshield-enable` engaging Suricata IPS and CrowdSec blocklist on the NethSecurity appliance.
> **Panel 5:** Running comprehensive boundary audit: `edge-security-audit` confirming that only port 80/443 (for public Traefik domains) and mail ports respond to external probes, with 0 management leaks.
> **Panel 6:** Milestone celebration in operations room: Sênior pinning the golden "Especialista em Segurança e Borda NS8" star on Júnior's profile. Screen showing "Marco de Revisão 09 Concluído com Sucesso". 1536x1024.
