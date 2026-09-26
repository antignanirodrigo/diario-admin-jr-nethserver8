# Prompts das Pranchas Narrativas — Módulo 10 (Aulas 46 a 50)
**Curso NethServer 8 Interativo · Teseo IT Solutions**  
**Padrão Visual:** Graphic novel ocidental moderna, traço limpo europeu (Ligne Claire / Brian K. Vaughan), realismo sóbrio de TI, proporção 1536x1024, 6 quadros retangulares em grid 3x2 com bordas cinza-grafite finas e números nos cantos superiores.
**Personagens Canônicos:**
- **Júnior:** 26-27 anos, cabelo escuro desgrenhado, barba rala por fazer, moletom cinza grafite com capuz solto, crachá funcional da Aurora / Teseo com lanyard azul-petróleo.
- **Sênior:** ~44 anos, barba curta grisalha alinhada, óculos de aro preto retangular, blazer azul-marinho sobre camisa cinza de gola aberta.

---

## Aula 46 — Catálogo de Aplicações: Instalação do Roundcube Webmail
**Título:** Catálogo de Aplicações: Instalação do Roundcube Webmail  
**Tema:** Navegação no Software Center, seleção de imagem no repositório oficial de módulos, vinculação de backend de e-mail (Dovecot/Postfix) e publicação de interface web moderna para os usuários.

### Prancha 1 — Conceitos e Contexto (`assets/aula-46.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Modern European graphic novel style, clean crisp linework, cinematic lighting, 6 panels in a 3x2 grid.
> **Panel 1:** Aurora employees gathered in a meeting room, requesting a webmail interface: "We need to read our corporate emails directly in Chrome and Edge without configuring Outlook on every laptop!".
> **Panel 2:** Sênior demonstrating the Software Center on the interactive display: "No NethServer 8, o ecossistema de e-mail é modular. Nós instalamos o Mail Server (Postfix/Dovecot) na aula 32, e agora adicionamos o Roundcube Webmail como uma instância de frontend independente."
> **Panel 3:** Architectural diagram: Browser -> Traefik (webmail.aurora.lab:443) -> Roundcube Container (PHP 8.2, Nginx, SQLite/MariaDB) -> Internal Podman Network -> Dovecot IMAP (mail1:993) / Postfix SMTP (mail1:587).
> **Panel 4:** Sênior pointing out the modularity advantage: "Se o Roundcube precisar de um patch de segurança urgente, nós atualizamos apenas o container do webmail sem derrubar a recepção de e-mails do Postfix!"
> **Panel 5:** Diagram of session persistence and responsive web design: Roundcube interface showing clean modern Elastic theme working identically on desktop and mobile.
> **Panel 6:** Júnior at his workstation typing `app-catalog list | grep roundcube`, feeling confident about adding user-facing value. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-46-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Crisp technical comic style, terminal outputs and Web GUI, 6 panels in 3x2 grid.
> **Panel 1:** Júnior confirming operator session: `whoami` and `hostname` on `ns8-lab-01`.
> **Panel 2:** Terminal command: `cat roundcube-plano.txt` detailing the installation scope: Instance name `roundcube1`, backend `mail1`, FQDN `webmail.aurora.lab`.
> **Panel 3:** Terminal command `app-install roundcube --instance roundcube1` pulling the official container image and configuring internal IMAP credentials.
> **Panel 4:** Terminal verification: `app-status roundcube1` reporting `Status: RUNNING (healthy, connected to mail1:993)`.
> **Panel 5:** Executing `curl -I https://webmail.aurora.lab/` verifying `HTTP/2 200 OK` and Roundcube login cookie header.
> **Panel 6:** Júnior smiling as Sênior nods in approval, screen showing Roundcube login page with corporate logo: "Webmail Roundcube Homologado". 1536x1024.

---

## Aula 47 — Colaboração em Equipe com Mattermost Chat
**Título:** Chat Corporativo: Implantação do Mattermost  
**Tema:** Implantação de mensageria segura e canais de time on-premises com Mattermost, substituição do Slack/Teams público por soberania de dados e integração de webhooks.

### Prancha 1 — Conceitos e Contexto (`assets/aula-47.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Comic book art, clear linework, tech office setting, 6 panels in a 3x2 grid.
> **Panel 1:** Executives talking in a hallway: "Commercial leaks in public messaging apps are dangerous. We need an on-premises team chat where all messages stay inside our servers!".
> **Panel 2:** Sênior presenting Mattermost on tablet: "O Mattermost no NS8 oferece canais, mensagens diretas, threads e chamadas com soberania total de dados e conformidade LGPD/GDPR."
> **Panel 3:** Architectural layout of Mattermost instance: Traefik (chat.aurora.lab) -> Mattermost Server container -> PostgreSQL 15 container -> Local storage volume for attachments.
> **Panel 4:** Sênior explaining identity integration: Dialogue balloon: "Os usuários não criam novas senhas: o Mattermost autentica diretamente contra o nosso domínio Samba AD (aurora.lab) via LDAP!"
> **Panel 5:** Close-up of webhook integration diagram: Git and alerting bots sending automated pipeline notices to `#infra-alertas` channel.
> **Panel 6:** Júnior in front of his mechanical keyboard, eager to provision the corporate collaboration hub. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-47-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal and UI cards, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen: `cat mattermost-escopo.txt` specifying instance `mattermost1`, database PostgreSQL, FQDN `chat.aurora.lab`.
> **Panel 2:** Executing `app-install mattermost --instance mattermost1` showing automated provisioning of database container and app container.
> **Panel 3:** Executing `app-auth-bind mattermost1 samba1` connecting Mattermost user directory to the corporate Samba Active Directory.
> **Panel 4:** Terminal command `mattermost-team-create --name aurora --channel "geral,ti,financeiro"` seeding initial team channels.
> **Panel 5:** Running verification probe: `curl -I https://chat.aurora.lab/` returning `HTTP/2 200 OK` and WebSocket upgrade header ready.
> **Panel 6:** Sênior and Júnior reviewing the chat channels on screen, celebratory high-five: "Mattermost Operacional e Integrado ao Samba AD". 1536x1024.

---

## Aula 48 — Acesso Remoto Seguro com Apache Guacamole
**Título:** Gateway de Acesso Remoto: Apache Guacamole  
**Tema:** Implantação de gateway clientless para RDP, VNC e SSH via HTML5 no navegador web, permitindo suporte e home office seguro sem instalação de clientes VPN pesados.

### Prancha 1 — Conceitos e Contexto (`assets/aula-48.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, modern European comic art, 6 panels in a 3x2 grid.
> **Panel 1:** IT helpdesk phone ringing, support operator overwhelmed: "Home office users with Chromebooks and tablets cannot install corporate VPN clients to access internal Windows desktops!".
> **Panel 2:** Sênior showing a browser tab running a full Windows 10 desktop with zero client software installed: "Com o Apache Guacamole no NS8, qualquer navegador moderno com HTML5 vira um cliente RDP e SSH ultrarrápido."
> **Panel 3:** Technical workflow diagram: User Browser (HTTPS / WebSocket) -> Traefik (remote.aurora.lab) -> Guacamole Web App (Java/Tomcat) -> Guacd Proxy Daemon (C/libguac) -> Internal LAN (RDP port 3389 to win10-lab, SSH port 22 to Linux).
> **Panel 4:** Sênior highlighting security: Dialogue balloon: "O tráfego RDP jamais sai para a Internet! O usuário só vê um canvas HTML5 criptografado. O Guacamole grava sessões em vídeo para auditoria de conformidade."
> **Panel 5:** Diagram of session recording and 2FA authentication requirement before accessing server consoles.
> **Panel 6:** Júnior nodding with wide eyes, impressed by the elegance of clientless remote access. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-48-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Clean line art, terminal and browser mockup, 6 panels in 3x2 grid.
> **Panel 1:** Terminal inspection: `cat guacamole-plano.txt` listing target connections: `win10-lab (RDP 192.168.50.50)` and `srv-db (SSH 192.168.50.15)`.
> **Panel 2:** Executing `app-install guacamole --instance guacamole1` launching guacd daemon and web frontend containers.
> **Panel 3:** Terminal command `guacamole-connection-add --name "Estacao-Ana-Win10" --protocol rdp --host 192.168.50.50` mapping the desktop.
> **Panel 4:** Executing `guacamole-audit-connections` verifying connection health and encryption cipher negotiation.
> **Panel 5:** Verification command `curl -I https://remote.aurora.lab/` returning `HTTP/2 200 OK` and Guacamole session token.
> **Panel 6:** Júnior testing HTML5 remote desktop session on screen, Sênior smiling in background: "Acesso Remoto Guacamole Homologado". 1536x1024.

---

## Aula 49 — Gestão Centralizada de Senhas com Vaultwarden
**Título:** Cofre de Senhas Corporativo: Vaultwarden  
**Tema:** Implantação de cofre de senhas de alta segurança e leveza (Bitwarden API compatível em Rust), compartilhamento seguro de credenciais entre equipes e autenticação de dois fatores (2FA).

### Prancha 1 — Conceitos e Contexto (`assets/aula-49.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European comic style, crisp detailed lines, dramatic security aesthetic, 6 panels in 3x2 grid.
> **Panel 1:** Close-up of yellow sticky notes under keyboards with passwords written on them: "financeiro2026", "admin123". Red warning graphic.
> **Panel 2:** Sênior standing firm with arms crossed: "Planilhas de senhas compartilhadas e post-its são um convite aberto para desastres. No NS8, nós implantamos o Vaultwarden para gerenciar cofres criptografados de ponta a ponta."
> **Panel 3:** Architecture schematic: Vaultwarden (lightweight Rust backend) -> SQLite / PostgreSQL storage -> End-to-end client encryption with PBKDF2/Argon2 + AES-256 (the server NEVER sees plaintext passwords).
> **Panel 4:** Infographic of team credential sharing: "Organizational Collections" where IT and Financial departments securely share API keys without revealing master secrets.
> **Panel 5:** Sênior explaining browser extension and mobile app compatibility: Dialogue balloon: "Como o Vaultwarden implementa 100% da API do Bitwarden, os funcionários usam as extensões oficiais no Chrome, Firefox e iOS/Android apontando para vault.aurora.lab."
> **Panel 6:** Júnior at his terminal, motivated to eradicate insecure password practices across the company. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-49-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Technical comic illustration, terminal commands and vault UI, 6 panels in 3x2 grid.
> **Panel 1:** Terminal screen: `cat vaultwarden-escopo.txt` specifying instance `vaultwarden1`, FQDN `vault.aurora.lab`, registration policy `INVITE_ONLY`.
> **Panel 2:** Executing `app-install vaultwarden --instance vaultwarden1` pulling lightweight Rust container and setting up HTTPS route.
> **Panel 3:** Command `vaultwarden-admin-policy --disable-open-registration` enforcing strict administrative approval for new user accounts.
> **Panel 4:** Executing `vaultwarden-org-create --name "Aurora-TI" --collection "Servidores,Switches"` setting up shared credential collections.
> **Panel 5:** Verification command `curl -I https://vault.aurora.lab/` returning `HTTP/2 200 OK` with WebSocket push notification active.
> **Panel 6:** Sênior congratulating Júnior as the digital vault icon turns golden: "Cofre Corporativo Vaultwarden Operacional". 1536x1024.

---

## Aula 50 — ⭐ Revisão Integrada 10: Auditoria do Catálogo e Ciclo de Vida de Aplicações
**Título:** ⭐ Marco de Revisão Integrada 10: Auditoria de Aplicações e Ciclo de Vida  
**Tema:** Auditoria global do parque de aplicações do NS8 (Nextcloud, Mail, Roundcube, Mattermost, Guacamole, Vaultwarden), monitoramento de consumo de CPU/RAM em containers Podman e homologação do catálogo.

### Prancha 1 — Conceitos e Contexto (`assets/aula-50.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> European modern graphic novel style, golden hour in datacenter, 6 panels in a 3x2 grid, gold star badge in top margin.
> **Panel 1:** Sênior and Júnior reviewing a comprehensive cluster dashboard with 6 application cards glowing green: Nextcloud, Mail, Roundcube, Mattermost, Guacamole, Vaultwarden.
> **Panel 2:** Sênior explaining the application lifecycle: Dialogue balloon: "Instalar aplicações é fácil; governar o ciclo de vida é onde se prova o bom administrador. Você precisa medir uso de memória, planejar limites de recursos e saber quando isolar um serviço antes que ele afete o nó."
> **Panel 3:** Detailed technical chart of Podman container resource footprint: Memory consumption breakdown (Nextcloud 1.2 GB, Mail 1.8 GB, Mattermost 800 MB, Guacamole 600 MB, Vaultwarden 60 MB, Traefik 120 MB).
> **Panel 4:** Visualizing update procedures: In-place rolling update of containers without touching persistent volumes stored on `/srv/disk1`.
> **Panel 5:** Sênior placing hands on Júnior's shoulders with deep pride. Dialogue balloon: "Você partiu de uma VM vazia na Aula 1 e agora orquestra um ecossistema completo de serviços corporativos de alta produtividade."
> **Panel 6:** Júnior smiling with professional poise, ready to conduct the full application catalog audit. 1536x1024.

### Prancha 2 — Prática e Laboratório (`assets/aula-50-p2.png`)
**Prompt Midjourney / SDXL (1536x1024):**
> Graphic novel layout, rich terminal outputs and multi-app status cards, 6 panels in 3x2 grid.
> **Panel 1:** Júnior reviewing comprehensive audit scope: `cat auditoria-catalogo-escopo.txt`.
> **Panel 2:** Terminal command `app-catalog-audit` inspecting all active instances, versions, container healthchecks, and auto-restart policies.
> **Panel 3:** Running container resource monitoring: `podman-stats-summary` displaying aggregate memory: `4.6 GB / 8.0 GB RAM (57% utilized, healthy headroom)`.
> **Panel 4:** Running end-to-end synthetic probe: `cluster-app-smoke-test` executing automated HTTP GET and TLS handshakes across all 6 published FQDNs. Output: `6/6 PASS`.
> **Panel 5:** Interactive review checklist on NS8 console: Webmail (Verified), Team Chat (Verified), Remote Gateway (Verified), Password Vault (Verified), Resource Governance (Compliant).
> **Panel 6:** Sênior presenting the golden Módulo 10 badge to Júnior: "Especialista em Catálogo de Aplicações e Serviços NS8". Celebration toast and congratulations. 1536x1024.
