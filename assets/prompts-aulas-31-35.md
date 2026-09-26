# Prompts — NS8 Aulas 31–35 (Módulo 7: Correio Eletrônico)

Geradas para o padrão oficial do projeto: duas pranchas por aula (Prancha 1: Contexto/Conceitos; Prancha 2: Prática/Validação), formato 1536×1024, exatamente 6 quadros (3 colunas × 2 linhas), estilo Western Graphic Novel maduro. Paleta grafite/azul/ciano, racks fechados de 19 polegadas, Júnior (27 anos, barba por fazer, hoodie grafite, crachá de TI) e Sênior (44 anos, barba espessa grisalha, óculos retangulares pretos, blazer escuro).

---

## Aula 31 — Fluxo de E-mail: SMTP, IMAP e MX

### Prancha 1 (Contexto & Conceitos)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Corporate closed 19inch racks, blue cyan graphite palette. Junior adult27 angular jaw visible stubble messy dark hair graphite hoodie IT lanyard. Senior44 saltpepper beard black rectangular glasses dark blazer. Consistent characters, no repeated poses. Educational fictional NethServer8 lab. Title 'AULA 31 · O CAMINHO DA MENSAGEM'. Panel1 Junior receives ticket: 'E-mail corporativo não é apenas webmail'. Panel2 architectural diagram showing mail flow: 'Cliente MUA -> SMTP 587 -> MTA Postfix -> DNS MX -> Destino IMAP 993'. Panel3 sharp terminal: '$ dig +short MX aurora.lab' showing '10 mail.aurora.lab'. Panel4 Senior points to network board: 'SMTP envia entre servidores; IMAP sincroniza caixas no cliente.' Panel5 Junior inspecting ports with nc: '$ nc -zv mail.aurora.lab 25 587 993'. Panel6 both confirm ports open and clear boundary between transmission and storage. Six panels only.
```

### Prancha 2 (Prática & Validação)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Corporate closed 19inch racks, blue cyan graphite palette. Junior adult27 and Senior44 in datacenter lab. Title 'AULA 31 · VALIDAR ANTES DE ENVIAR'. Panel1 Junior reads guide 'cat fluxo-email.txt' on technician bench. Panel2 isometric diagram of three protocol checks 'Porta 25 (MTA)', 'Porta 587 (Submissão TLS)', 'Porta 993 (IMAP SSL)'. Panel3 sharp terminal '$ mail-flow-test aurora.lab' showing green checks for DNS, MX, SMTP and IMAP. Panel4 Senior checks TLS certificate validity for mail FQDN. Panel5 Junior checks checklist 'Protocolos mapeados' and 'Portas autorizadas no firewall'. Panel6 Junior and Senior review passing checklist, status 'Fluxo validado' and 'Pronto para implantar'. No imaginary messages delivered. Six panels only.
```

---

## Aula 32 — Planejamento de Domínio e Instalação do Serviço de Correio

### Prancha 1 (Contexto & Conceitos)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Corporate closed 19inch racks, blue cyan palette. Title 'AULA 32 · O DOMÍNIO DE E-MAIL'. Panel1 Junior reviews scope: 'Criar serviço de e-mail no NS8 para @aurora.lab'. Panel2 diagram of Mail Module inside NS8 Podman container: 'mail1 container -> Postfix + Dovecot + Rspamd'. Panel3 sharp terminal: '$ app-catalog list | grep mail' showing 'mail (v2.x) - NethServer Mail Server'. Panel4 Senior explains: 'O módulo de e-mail precisa de FQDN limpo, armazenamento dedicado e integração com Samba AD.' Panel5 Junior verifies storage volume allocation on /srv/vmail. Panel6 comparison chart showing standalone mail server vs integrated cluster instance. Six panels only.
```

### Prancha 2 (Prática & Validação)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Corporate racks, blue cyan palette. Title 'AULA 32 · INSTALAÇÃO CONTROLADA'. Panel1 Junior in NS8 Software Center selects 'Mail Server (mail1)'. Panel2 UI modal 'Configure Mail: Domain aurora.lab · Storage local-fast'. Panel3 terminal output: '$ app-status mail1' displaying 'Status: running (Postfix/Dovecot up)'. Panel4 Senior validates system resources: memory and disk thresholds verified. Panel5 Junior runs sanity check: '$ mail-test-readiness' showing green indicators. Panel6 report signed off by Senior with status 'Módulo Mail ativo' and 'Caixas pendentes'. Six panels only.
```

---

## Aula 33 — Caixas Postais, Aliases e Grupos

### Prancha 1 (Contexto & Conceitos)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Title 'AULA 33 · IDENTIDADE E CAIXAS'. Panel1 Junior analyzes request: 'Ana precisa de ana@aurora.lab e do alias financeiro@aurora.lab'. Panel2 diagram showing Samba AD accounts mapped to Dovecot maildirs: 'Samba User -> Mailbox /var/vmail/domain/user'. Panel3 sharp terminal: '$ samba-tool user list' showing users ana, mariana, bruno. Panel4 Senior cautions: 'Alias não consome licença nem disco extra; grupo de distribuição entrega para múltiplos destinatários.' Panel5 Junior maps aliases table on glass wall: 'contato@ -> ana, mariana'. Panel6 clear operational matrix for user mailboxes and group aliases. Six panels only.
```

### Prancha 2 (Prática & Validação)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Title 'AULA 33 · ENTREGA DE CAIXAS'. Panel1 Junior in NS8 Mail Admin interface opens 'Users & Mailboxes'. Panel2 UI showing active mailbox for Ana Silva with 5GB quota and alias financeiro@. Panel3 sharp terminal: '$ mailbox-test ana@aurora.lab' showing 'Authentication: OK · Maildir exists'. Panel4 Senior tests delivery to alias: '$ send-internal-probe financeiro@aurora.lab'. Panel5 Junior checks mailbox delivery log: 'Delivered to ana@aurora.lab via alias'. Panel6 Junior and Senior celebrate verified mailboxes with green status 'Caixas e Aliases operacionais'. Six panels only.
```

---

## Aula 34 — Reputação e Entregabilidade: SPF, DKIM e DMARC

### Prancha 1 (Contexto & Conceitos)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Title 'AULA 34 · O TRIÂNGULO DA ENTREGABILIDADE'. Panel1 Junior looking at spam alert: 'Mensagem corporativa caiu no lixo eletrônico?'. Panel2 educational triad diagram: 'SPF (Quem envia) · DKIM (Assinatura criptográfica) · DMARC (Política de rejeição)'. Panel3 sharp terminal: '$ dig TXT aurora.lab' showing 'v=spf1 mx ip4:192.168.50.10 ~all'. Panel4 Senior holds key icon: 'Sem DKIM assinado na saída e PTR reverso no IP, servidores modernos descartam seu e-mail sem avisar.' Panel5 Junior inspects DKIM public key generated by Rspamd in NS8. Panel6 comparison of unauthenticated message (red dropped) vs SPF/DKIM aligned message (green inbox). Six panels only.
```

### Prancha 2 (Prática & Validação)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Title 'AULA 34 · AUDITORIA DE REPUTAÇÃO'. Panel1 Junior accesses NS8 Mail Security panel. Panel2 UI displays DKIM selector 'ns8-2026' and DNS TXT record recommendation. Panel3 sharp terminal: '$ mail-reputation-audit aurora.lab' showing 'SPF: PASS · DKIM: PASS · DMARC: PASS · PTR: MATCH'. Panel4 Senior inspects email header snippet showing 'Authentication-Results: dkim=pass'. Panel5 Junior registers DNS records in lab DNS zone. Panel6 clean validation report signed with green badge 'Entregabilidade Homologada'. Six panels only.
```

---

## Aula 35 — ⭐ REVISÃO INTEGRADA: Triagem de Incidente e Filas de Mensagens

### Prancha 1 (Contexto & Conceitos)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Corporate datacenter at night, amber warning lights on server rack. Title 'AULA 35 · ⭐ REVISÃO: INCIDENTE NA FILA DE E-MAIL'. Panel1 Junior alerted by urgent ticket: 'Contratos urgentes não chegam aos destinatários externos'. Panel2 queue diagram: 'Incoming -> Postfix Mail Queue (Active/Deferred/Hold) -> Output Blocked'. Panel3 sharp terminal: '$ mailq' showing 15 deferred messages with error 'Connection timed out port 25'. Panel4 Senior mentors with coffee: 'Nunca delete a fila às cegas. Descubra se o bloqueio é DNS, porta 25 no provedor ou IP em blacklist.' Panel5 Junior examines Postfix log: '$ journalctl -u mail1 -n 30' revealing firewall outbound block. Panel6 Senior and Junior outline 4-step triage workflow: Queue check, Log analysis, Route fix, Queue flush. Six panels only.
```

### Prancha 2 (Prática & Validação)
```text
Create a polished landscape 1536x1024 Western graphic novel comic sheet, EXACTLY SIX panels 3 columns x2 rows, Portuguese text crisp and short. Night datacenter scene. Title 'AULA 35 · ⭐ REVISÃO: LIBERAÇÃO E HANDOFF'. Panel1 Junior reviews simulated border firewall rule blocking outbound port 25. Panel2 UI shows outbound SMTP route redirected to authorized relay / direct port. Panel3 sharp terminal: '$ postsuper -r ALL && postfix flush' followed by '$ mailq' showing 'Mail queue is empty'. Panel4 Senior confirms delivery logs: 'status=sent (250 2.0.0 Ok: queued)'. Panel5 Junior completes end-of-module review checklist covering SMTP, DKIM, Aliases and Queues. Panel6 Senior hands Gold Review Badge to Junior, green status '⭐ Módulo 7 Concluído · Correio Homologado'. Six panels only.
```
