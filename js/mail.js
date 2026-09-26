const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const mailCommands = {
  31: ['cat fluxo-email.txt', 'dig +short MX aurora.lab', 'mail-flow-test aurora.lab'],
  32: ['cat plano-instalacao-mail.txt', 'app-catalog list | grep mail', 'app-status mail1'],
  33: ['cat usuarios-mail-escopo.txt', 'mailbox-create ana 5G', 'mail-alias-create financeiro@aurora.lab ana@aurora.lab', 'mail-group-create diretoria@aurora.lab ana,mariana', 'mailbox-test ana@aurora.lab', 'send-internal-probe financeiro@aurora.lab'],
  34: ['cat reputacao-escopo.txt', 'dkim-generate-key aurora.lab', 'dns-record-apply spf "v=spf1 mx ip4:192.168.50.10 ~all"', 'dns-record-apply dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@aurora.lab"', 'mail-reputation-audit aurora.lab'],
  35: ['cat chamado-incidente-email.txt', 'mailq', 'mail-log-view', 'mail-relay-fix', 'postfix-flush']
};

export function initMail(sim) {
  if (sim.id === 31) sim.lab.flow = {matrix: '', verified: false};
  if (sim.id === 32) sim.lab.mailInstall = {installed: false, instance: 'mail1'};
  if (sim.id === 33) sim.lab.mailboxes = {ana: false, aliasFinanceiro: false, groupDiretoria: false, tested: false};
  if (sim.id === 34) sim.lab.reputation = {dkim: false, spf: false, dmarc: false, audited: false};
  if (sim.id === 35) sim.lab.mailIncident = {relayFixed: false, flushed: false, emptyQueue: false, checklist: false};
}

export function mailCommand(sim, line) {
  if (sim.id === 31) {
    if (line === 'cat fluxo-email.txt') {
      flag(sim, 'readFlowPlan');
      return ok('Planejamento de Fluxo de Correio — Domínio: aurora.lab\nServidor MTA: mail.aurora.lab (192.168.50.10)\nMX Record: 10 mail.aurora.lab\nPortas requeridas: 25/tcp (MTA Internet), 587/tcp (STARTTLS clientes), 993/tcp (IMAPS).\nRequisito: Proibir clientes na porta 25.');
    }
    if (line === 'dig +short MX aurora.lab') {
      flag(sim, 'checkMxRecord');
      return ok('10 mail.aurora.lab.');
    }
    if (line === 'mail-flow-test aurora.lab') {
      flag(sim, 'testMailPorts');
      return ok('[TESTE DE PORTAS: mail.aurora.lab]\nPorta 25/tcp (SMTP Relay): OPEN (Postfix ESMTP ready)\nPorta 587/tcp (Submission): OPEN (STARTTLS required, auth enabled)\nPorta 993/tcp (IMAP SSL): OPEN (Dovecot ready, TLSv1.3)\nDiagnóstico: Portas ativas e escutando na interface de rede.');
    }
  }

  if (sim.id === 32) {
    if (line === 'cat plano-instalacao-mail.txt') {
      flag(sim, 'readMailPlan');
      return ok('Plano de Implantação Mail Server — NethServer 8\nNome da Instância: mail1\nComponentes: Postfix (MTA), Dovecot (MDA/IMAP), Rspamd (Antispam/DKIM).\nFiltro de Conteúdo: ClamAV integrado.\nArmazenamento: /srv/disk1/vmail (volume de dados dedicado).');
    }
    if (line === 'app-catalog list | grep mail' || line === 'app-catalog list | grep -i mail') {
      flag(sim, 'checkMailCatalog');
      return ok('ghcr.io/nethserver/mail:2.4.1       Mail Server (Postfix, Dovecot, Rspamd)      installed: no');
    }
    if (line === 'app-status mail1') {
      if (!sim.lab.mailInstall?.installed) {
        return fail('Erro: Instância mail1 não encontrada no cluster.');
      }
      flag(sim, 'checkMailStatus');
      return ok('Instância: mail1 (ghcr.io/nethserver/mail)\nStatus: RUNNING\nContainers:\n - mail1-postfix: running (healthy)\n - mail1-dovecot: running (healthy)\n - mail1-rspamd: running (healthy)\nArmazenamento: /srv/disk1/vmail montado com sucesso.');
    }
  }

  if (sim.id === 33) {
    if (line === 'cat usuarios-mail-escopo.txt') {
      flag(sim, 'readAccountsPlan');
      return ok('Escopo de Caixas Postais e Aliases — aurora.lab\n1. Caixa individual: ana@aurora.lab (Quota: 5 GB)\n2. Alias de setor: financeiro@aurora.lab -> ana@aurora.lab\n3. Grupo de distribuição: diretoria@aurora.lab -> ana@aurora.lab, mariana@aurora.lab\nRegra: Não criar contas de sistema desnecessárias; utilizar aliases.');
    }
    if (line === 'mailbox-create ana 5G' || line.startsWith('mailbox-create ana')) {
      sim.lab.mailboxes.ana = true;
      flag(sim, 'createAnaMailbox');
      return ok('Sucesso: Caixa postal criada para ana@aurora.lab [Quota: 5 GB, Maildir: /srv/disk1/vmail/ana].');
    }
    if (line === 'mail-alias-create financeiro@aurora.lab ana@aurora.lab' || line.startsWith('mail-alias-create financeiro')) {
      if (!sim.lab.mailboxes.ana) return fail('Erro: O destino ana@aurora.lab deve existir antes de criar o alias.');
      sim.lab.mailboxes.aliasFinanceiro = true;
      flag(sim, 'createFinanceAlias');
      return ok('Sucesso: Alias financeiro@aurora.lab -> ana@aurora.lab registrado na tabela de aliases virtuais.');
    }
    if (line === 'mail-group-create diretoria@aurora.lab ana,mariana' || line.startsWith('mail-group-create diretoria')) {
      sim.lab.mailboxes.groupDiretoria = true;
      flag(sim, 'createBoardGroup');
      return ok('Sucesso: Grupo de distribuição diretoria@aurora.lab criado com membros [ana@aurora.lab, mariana@aurora.lab].');
    }
    if (line === 'mailbox-test ana@aurora.lab') {
      if (!sim.lab.mailboxes.ana) return fail('Erro: Caixa ana@aurora.lab não encontrada.');
      flag(sim, 'testMailDelivery');
      return ok('Dovecot LMTP delivery test: OK (ana@aurora.lab maildir acessível).');
    }
    if (line === 'send-internal-probe financeiro@aurora.lab') {
      if (!sim.lab.mailboxes.aliasFinanceiro) return fail('Erro: Alias financeiro@aurora.lab não configurado.');
      flag(sim, 'testMailDelivery');
      return ok('Probe SMTP interno enviado para financeiro@aurora.lab -> Resolvido para ana@aurora.lab -> Entregue com status 250 2.0.0 Ok: queued as 7F3A91.');
    }
  }

  if (sim.id === 34) {
    if (line === 'cat reputacao-escopo.txt') {
      flag(sim, 'readReputationPlan');
      return ok('Diretrizes de Entregabilidade e Reputação — aurora.lab\nIP público de saída: 192.168.50.10 (simulado)\nSPF: v=spf1 mx ip4:192.168.50.10 ~all\nDKIM: Seletor mail, RSA 2048-bit gerado via Rspamd\nDMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc@aurora.lab\nRequisito: Obter 100% de conformidade contra spoofing.');
    }
    if (line === 'dkim-generate-key aurora.lab') {
      sim.lab.reputation.dkim = true;
      flag(sim, 'generateDkimKey');
      return ok('Chave DKIM gerada com sucesso para aurora.lab:\nSeletor: 202609._domainkey.aurora.lab\nRegistro TXT DNS sugerido: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3..."\nRspamd configurado para assinar cabeçalhos de envio.');
    }
    if (line.startsWith('dns-record-apply spf')) {
      sim.lab.reputation.spf = true;
      flag(sim, 'applySpfRecord');
      return ok('DNS: Registro TXT para "aurora.lab" aplicado: "v=spf1 mx ip4:192.168.50.10 ~all".');
    }
    if (line.startsWith('dns-record-apply dmarc')) {
      sim.lab.reputation.dmarc = true;
      flag(sim, 'applyDmarcRecord');
      return ok('DNS: Registro TXT para "_dmarc.aurora.lab" aplicado: "v=DMARC1; p=quarantine; rua=mailto:dmarc@aurora.lab".');
    }
    if (line === 'mail-reputation-audit aurora.lab') {
      if (!sim.lab.reputation.dkim || !sim.lab.reputation.spf || !sim.lab.reputation.dmarc) {
        return fail('Auditoria reprovada: registros SPF, chave DKIM ou política DMARC ausentes.');
      }
      sim.lab.reputation.audited = true;
      flag(sim, 'auditReputation');
      return ok('=== AUDITORIA DE REPUTAÇÃO E SEGURANÇA ===\n[SPF]   aurora.lab -> PASS (ip4:192.168.50.10 autorizado)\n[DKIM]  202609._domainkey.aurora.lab -> PASS (Assinatura RSA válida)\n[DMARC] _dmarc.aurora.lab -> PASS (Política p=quarantine alinhada)\n[PTR]   10.50.168.192.in-addr.arpa -> mail.aurora.lab (PASS)\nScore de Entregabilidade: 10/10 (Excelente)');
    }
  }

  if (sim.id === 35) {
    if (line === 'cat chamado-incidente-email.txt') {
      flag(sim, 'readIncidentTicket');
      return ok('INCIDENTE INC-8821: Usuários relatam que e-mails externos não saem da empresa.\nSintoma: Fila de envio crescendo; mensagens retidas com status deferred.\nAlerta do monitor: postfix/smtp[412]: connect to mail-relay.upstream[10.99.0.1]:25: Connection refused.\nCausa provável: IP do relay corporativo desatualizado ou rota SMTP externa incorreta.');
    }
    if (line === 'mailq') {
      if (sim.lab.mailIncident?.flushed && sim.lab.mailIncident?.relayFixed) {
        sim.lab.mailIncident.emptyQueue = true;
        flag(sim, 'verifyQueueEmpty');
        return ok('Mail queue is empty');
      }
      flag(sim, 'inspectMailQueue');
      return ok('-Queue ID-  --Size-- ----Arrival Time---- -Sender/Recipient-------\n8C402B19*    2048 Tue Sep 16 09:12:01  ana@aurora.lab\n                                         cliente@externo.com\n (connect to mail-relay.upstream[10.99.0.1]:25: Connection refused)\n\n9E114C23*    4190 Tue Sep 16 09:14:22  mariana@aurora.lab\n                                         fornecedor@parceiro.org\n (connect to mail-relay.upstream[10.99.0.1]:25: Connection refused)\n\n-- 2 Kbytes in 2 Requests.');
    }
    if (line === 'mail-log-view') {
      flag(sim, 'examineMailLogs');
      return ok('tail -n 20 /var/log/mail.log (mail1-postfix):\npostfix/qmgr[201]: 8C402B19: from=<ana@aurora.lab>, size=2048, nrcpt=1 (queue active)\npostfix/smtp[302]: connect to mail-relay.upstream[10.99.0.1]:25: Connection refused\npostfix/smtp[302]: 8C402B19: to=<cliente@externo.com>, relay=none, delay=1420, delays=1/0/1419/0, dsn=4.4.1, status=deferred (connect to mail-relay.upstream[10.99.0.1]:25: Connection refused)\nDiagnóstico: O upstream antigo 10.99.0.1 está desativado; a rota direta com MX DNS deve ser ativada.');
    }
    if (line === 'mail-relay-fix') {
      if (!sim.flags.examineMailLogs) return fail('Erro: Analise primeiro os logs de erro com mail-log-view antes de aplicar a correção.');
      sim.lab.mailIncident.relayFixed = true;
      flag(sim, 'fixOutboundRoute');
      return ok('Configuração atualizada: relayhost = (removido upstream defeituoso 10.99.0.1).\nPostfix reconfigurado para entrega direta via MX resolution e STARTTLS na porta 25 externa.\npostfix/master reload: OK.');
    }
    if (line === 'postfix-flush') {
      if (!sim.lab.mailIncident.relayFixed) return fail('Erro: Corrija a rota de saída com mail-relay-fix antes de forçar o descarregamento da fila.');
      sim.lab.mailIncident.flushed = true;
      flag(sim, 'flushMailQueue');
      return ok('Forçando processamento da fila: postqueue -f\npostfix/qmgr[201]: 8C402B19: removed from queue (delivered successfully)\npostfix/qmgr[201]: 9E114C23: removed from queue (delivered successfully)\nTodas as mensagens da fila deferred foram despachadas.');
    }
  }

  return null;
}

export function mailAction(sim, action, values) {
  if (sim.id === 31) {
    if (action === 'flow-matrix-validate') {
      if (!['readFlowPlan', 'checkMxRecord', 'testMailPorts'].every(k => sim.flags[k])) {
        return 'Leia o plano de fluxo, audite o MX e teste as portas no terminal antes de validar.';
      }
      const good = values.submission === '587' && values.relay === '25' && values.imap === '993';
      if (!good) return 'Matriz incorreta: Use porta 587 para clientes com TLS, 25 para MTA Internet e 993 para IMAPS.';
      sim.lab.flow.matrix = 'approved';
      sim.lab.flow.verified = true;
      sim.flags.validateFlowPlan = true;
      return 'Matriz de portas e fluxo aprovada com sucesso! Entrega técnica concluída.';
    }
  }

  if (sim.id === 32) {
    if (action === 'install-mail-instance') {
      if (!['readMailPlan', 'checkMailCatalog'].every(k => sim.flags[k])) {
        return 'Leia o plano de instalação e consulte o catálogo antes de instalar a instância.';
      }
      sim.lab.mailInstall.installed = true;
      sim.flags.installMailInstance = true;
      return 'Instância mail1 instalada com sucesso pelo Cluster Admin! Verifique o status com app-status mail1.';
    }
    if (action === 'mail-install-validate') {
      if (sim.lab.mailInstall?.installed && sim.flags.checkMailStatus) {
        sim.flags.mailInstalledVerified = true;
        return 'Homologação concluída: Instância mail1 (Postfix + Dovecot + Rspamd) ativa e pronta para caixas postais.';
      }
      return 'Instale a instância mail1 e execute app-status mail1 antes de validar.';
    }
  }

  if (sim.id === 33) {
    if (action === 'mail-accounts-validate') {
      if (!['readAccountsPlan', 'createAnaMailbox', 'createFinanceAlias', 'createBoardGroup', 'testMailDelivery'].every(k => sim.flags[k])) {
        return 'Faltam etapas: provisione a caixa de Ana, o alias financeiro, o grupo diretoria e execute o teste de entrega.';
      }
      sim.flags.mailAccountsVerified = true;
      return 'Contas, aliases e grupos homologados com sucesso! Estrutura de correspondência operacional.';
    }
  }

  if (sim.id === 34) {
    if (action === 'reputation-validate') {
      if (!['readReputationPlan', 'generateDkimKey', 'applySpfRecord', 'applyDmarcRecord', 'auditReputation'].every(k => sim.flags[k])) {
        return 'Gere a chave DKIM, aplique os registros SPF e DMARC no DNS e execute a auditoria antes de validar.';
      }
      sim.flags.mailReputationVerified = true;
      return 'Reputação e entregabilidade homologadas! aurora.lab protegido contra spoofing e com score máximo.';
    }
  }

  if (sim.id === 35) {
    if (action === 'review7-checklist') {
      const needed = ['flow', 'install', 'mailboxes', 'reputation', 'incident'];
      const ok = needed.every(k => values[k]);
      sim.lab.mailIncident.checklist = ok;
      return ok ? 'Checklist de revisão do Módulo 7 completo. Valide a certificação.' : 'Marque todos os marcos do Módulo 7 para certificar.';
    }
    if (action === 'review7-validate') {
      if (sim.lab.mailIncident.checklist && ['readIncidentTicket', 'inspectMailQueue', 'examineMailLogs', 'fixOutboundRoute', 'flushMailQueue', 'verifyQueueEmpty'].every(k => sim.flags[k])) {
        sim.flags.review7Certified = true;
        return '⭐ Marco de Revisão Integrada 07 homologado! O cluster de e-mail da Aurora está recuperado e operacional.';
      }
      return 'Resolva o incidente na fila (logs, rota, flush e mailq vazio) e marque o checklist antes de homologar.';
    }
  }

  return null;
}
