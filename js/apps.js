const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const appCommands = {
  46: ['cat roundcube-plano.txt', 'app-catalog-search roundcube', 'app-install roundcube --instance roundcube1', 'app-status roundcube1', 'curl -I https://webmail.aurora.lab/'],
  47: ['cat mattermost-escopo.txt', 'app-install mattermost --instance mattermost1', 'app-auth-bind mattermost1 samba1', 'mattermost-team-create --name aurora --channel "geral,ti,financeiro"', 'curl -I https://chat.aurora.lab/'],
  48: ['cat guacamole-plano.txt', 'app-install guacamole --instance guacamole1', 'guacamole-connection-add --name "Estacao-Ana-Win10" --protocol rdp --host 192.168.50.50', 'guacamole-audit-connections', 'curl -I https://remote.aurora.lab/'],
  49: ['cat vaultwarden-escopo.txt', 'app-install vaultwarden --instance vaultwarden1', 'vaultwarden-admin-policy --disable-open-registration', 'vaultwarden-org-create --name "Aurora-TI" --collection "Servidores,Switches"', 'curl -I https://vault.aurora.lab/'],
  50: ['cat auditoria-catalogo-escopo.txt', 'app-catalog-audit', 'podman-stats-summary', 'cluster-app-smoke-test']
};

export function initApps(sim) {
  if (sim.id === 46) sim.lab.roundcube = {installed: false, statusOk: false, verified: false};
  if (sim.id === 47) sim.lab.mattermost = {installed: false, boundAuth: false, channelsCreated: false, verified: false};
  if (sim.id === 48) sim.lab.guacamole = {installed: false, rdpAdded: false, audited: false, verified: false};
  if (sim.id === 49) sim.lab.vaultwarden = {installed: false, policySet: false, orgCreated: false, verified: false};
  if (sim.id === 50) sim.lab.appAudit = {catalogAudited: false, statsChecked: false, smokeTested: false, checklist: false};
}

export function appCommand(sim, line) {
  if (sim.id === 46) {
    if (line === 'cat roundcube-plano.txt') {
      flag(sim, 'readPlan');
      return ok('Plano de Implantação do Roundcube Webmail — Aurora IT\nInstância: roundcube1\nBackend IMAP: mail1:993 (TLSv1.3)\nBackend SMTP: mail1:587 (STARTTLS Submission)\nDomínio de Publicação (FQDN): webmail.aurora.lab\nTema da interface: Elastic (responsivo para desktop e mobile)\nPersistência de sessão: SQLite gerenciado internamente pelo container.');
    }
    if (line === 'app-catalog-search roundcube' || line === 'app-catalog list | grep roundcube') {
      flag(sim, 'searchCatalog');
      return ok('REPOSITÓRIO OFICIAL DE MÓDULOS NS8 (ghcr.io/nethserver):\nNOME       VERSÃO   CATEGORIA  DESCRIÇÃO\nroundcube  1.6.8    webmail    Modern webmail client for IMAP/SMTP services\nStatus: Disponível para instalação (compatível com nó Rocky Linux 9).');
    }
    if (line === 'app-install roundcube --instance roundcube1' || line.startsWith('app-install roundcube')) {
      if (!sim.flags.readPlan || !sim.flags.searchCatalog) {
        return fail('Consulte o plano e pesquise o catálogo antes de iniciar a instalação.');
      }
      sim.lab.roundcube.installed = true;
      flag(sim, 'installRoundcube');
      return ok('Instalando módulo roundcube (instância roundcube1)...\n[1/4] Baixando imagem ghcr.io/nethserver/roundcube:1.6.8... OK\n[2/4] Criando volumes de configuração e plugins... OK\n[3/4] Vinculando backend IMAP para mail1:993 e SMTP para mail1:587... OK\n[4/4] Injetando rota no Traefik para webmail.aurora.lab... OK\nInstância roundcube1 iniciada com sucesso em container rootless Podman.');
    }
    if (line === 'app-status roundcube1' || line.startsWith('app-status')) {
      if (!sim.lab.roundcube.installed) return fail('Instância roundcube1 não encontrada. Execute app-install primeiro.');
      sim.lab.roundcube.statusOk = true;
      flag(sim, 'checkAppStatus');
      return ok('=== STATUS DA INSTÂNCIA: roundcube1 ===\nContainer: roundcube1-app (Podman systemd unit)\nStatus: RUNNING (healthy)\nUptime: 2 minutos\nMemória RAM: 84 MB / 512 MB limit\nConexão com IMAP (mail1:993): ESTABELECIDA (OK)\nConexão com SMTP (mail1:587): ESTABELECIDA (OK)\nRota Traefik: https://webmail.aurora.lab/ -> roundcube1:80 (TLS ativo)');
    }
    if (line === 'curl -I https://webmail.aurora.lab/' || line.startsWith('curl -I')) {
      if (!sim.lab.roundcube.installed) return fail('Serviço webmail não responde. Instale a aplicação primeiro.');
      flag(sim, 'verifyWebmailHttp');
      return ok('HTTP/2 200 OK\nserver: traefik\ndate: Tue, 16 Sep 2026 14:00:00 GMT\ncontent-type: text/html; charset=UTF-8\nset-cookie: roundcube_sessid=s78f89b21; path=/; secure; HttpOnly; SameSite=Strict\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-frame-options: SAMEORIGIN\n[Roundcube Webmail pronto para login dos colaboradores]');
    }
  }

  if (sim.id === 47) {
    if (line === 'cat mattermost-escopo.txt') {
      flag(sim, 'readScope');
      return ok('Escopo de Implantação do Mattermost Chat — Aurora\nInstância: mattermost1\nBanco de dados: PostgreSQL 15 integrado\nAutenticação: LDAP integrado ao Samba Active Directory (samba1)\nFQDN público: chat.aurora.lab\nEquipe inicial: aurora\nCanais institucionais: geral, ti, financeiro\nRequisitos de rede: Suporte ativo a WebSocket no Traefik para mensagens instantâneas.');
    }
    if (line === 'app-install mattermost --instance mattermost1' || line.startsWith('app-install mattermost')) {
      if (!sim.flags.readScope) return fail('Leia o escopo em mattermost-escopo.txt antes de instalar.');
      sim.lab.mattermost.installed = true;
      flag(sim, 'installMattermost');
      return ok('Instalando Mattermost no cluster NS8...\n[1/4] Provisionando container postgresql-mattermost1 (PostgreSQL 15)... OK\n[2/4] Provisionando container mattermost-server (v9.5)... OK\n[3/4] Inicializando esquemas de banco de dados e migrações... OK\n[4/4] Registrando rota chat.aurora.lab no proxy Traefik com WebSocket enabled... OK\nInstância mattermost1 operacional.');
    }
    if (line === 'app-auth-bind mattermost1 samba1' || line.startsWith('app-auth-bind')) {
      if (!sim.lab.mattermost.installed) return fail('Instale a aplicação antes de vincular a base de identidades.');
      sim.lab.mattermost.boundAuth = true;
      flag(sim, 'bindSambaAuth');
      return ok('Vinculando provedor de identidades Samba AD (samba1) à instância mattermost1...\n[LDAP BIND] Conectado a ldaps://samba1.aurora.lab:636... OK\n[LDAP QUERY] Sincronizados 3 usuários (ana, carla, bruno) e grupos... OK\nAutenticação do Mattermost configurada para validar contas corporativas.');
    }
    if (line.startsWith('mattermost-team-create')) {
      if (!sim.lab.mattermost.boundAuth) return fail('Vincule a autenticação do domínio antes de criar equipes.');
      sim.lab.mattermost.channelsCreated = true;
      flag(sim, 'createTeamChannels');
      return ok('Criando equipe corporativa no Mattermost:\nNome: aurora (Aurora Tecnologia)\nCanais criados:\n - #geral (Canal institucional para todos os colaboradores)\n - #ti (Canal técnico restrito à equipe de infraestrutura)\n - #financeiro (Canal confidencial para gestão orçamentária)\nPermissões aplicadas com base nos grupos do Samba AD.');
    }
    if (line === 'curl -I https://chat.aurora.lab/' || line.startsWith('curl -I')) {
      if (!sim.lab.mattermost.installed) return fail('Endpoint chat.aurora.lab não encontrado.');
      flag(sim, 'verifyChatHttp');
      return ok('HTTP/2 200 OK\nserver: traefik\ndate: Tue, 16 Sep 2026 14:10:00 GMT\ncontent-type: text/html; charset=utf-8\nupgrade: websocket\nconnection: Upgrade\nx-frame-options: SAMEORIGIN\n[Mattermost Web App respondendo com suporte a WebSocket]');
    }
  }

  if (sim.id === 48) {
    if (line === 'cat guacamole-plano.txt') {
      flag(sim, 'readPlan');
      return ok('Plano de Acesso Remoto Seguro com Apache Guacamole\nInstância: guacamole1\nComponentes: guacd (daemon de tradução C/libguac) + guacamole-client (Java/Tomcat)\nFQDN público: remote.aurora.lab\nConexões autorizadas no laboratório:\n - Nome: Estacao-Ana-Win10 | Protocolo: RDP | Host interno: 192.168.50.50 | Porta: 3389\n - Auditoria: Gravação de sessão habilitada em /srv/guacamole/recordings');
    }
    if (line === 'app-install guacamole --instance guacamole1' || line.startsWith('app-install guacamole')) {
      if (!sim.flags.readPlan) return fail('Consulte o plano com cat guacamole-plano.txt antes de instalar.');
      sim.lab.guacamole.installed = true;
      flag(sim, 'installGuacamole');
      return ok('Instalando Apache Guacamole no NS8...\n[1/3] Iniciando container guacd (proxy de protocolos RDP/SSH/VNC)... OK\n[2/3] Iniciando container guacamole-web (Apache Tomcat 10)... OK\n[3/3] Configurando proxy Traefik para remote.aurora.lab... OK\nGateway clientless Apache Guacamole iniciado.');
    }
    if (line.startsWith('guacamole-connection-add')) {
      if (!sim.lab.guacamole.installed) return fail('Instale o Guacamole antes de adicionar conexões.');
      sim.lab.guacamole.rdpAdded = true;
      flag(sim, 'addRdpConnection');
      return ok('Adicionando conexão remota no Guacamole:\nNome: Estacao-Ana-Win10\nProtocolo: RDP\nHost de destino: 192.168.50.50:3389\nSegurança de rede: NLA (Network Level Authentication)\nGravação de sessão: ATIVA (/srv/guacamole/recordings/ana-win10.guac)\nConexão salva e atribuída ao grupo financeiro.');
    }
    if (line === 'guacamole-audit-connections') {
      if (!sim.lab.guacamole.rdpAdded) return fail('Adicione ao menos uma conexão antes de realizar a auditoria.');
      sim.lab.guacamole.audited = true;
      flag(sim, 'auditGuacamoleConnections');
      return ok('=== AUDITORIA DE CONEXÕES GUACAMOLE ===\nCONEXÃO              PROTOCOLO  DESTINO            SEGURANÇA  GRAVAÇÃO  STATUS\nEstacao-Ana-Win10    RDP        192.168.50.50:3389 NLA/TLS    SIM       ONLINE (PRONTO)\nTestes de handshake: SUCESSO (Canvas HTML5 negociado a 60 fps).');
    }
    if (line === 'curl -I https://remote.aurora.lab/' || line.startsWith('curl -I')) {
      if (!sim.lab.guacamole.installed) return fail('Gateway remote.aurora.lab inacessível.');
      flag(sim, 'verifyRemoteHttp');
      return ok('HTTP/2 200 OK\nserver: traefik\ndate: Tue, 16 Sep 2026 14:20:00 GMT\ncontent-type: text/html;charset=UTF-8\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-frame-options: DENY\n[Apache Guacamole HTML5 Clientless Gateway respondendo com segurança]');
    }
  }

  if (sim.id === 49) {
    if (line === 'cat vaultwarden-escopo.txt') {
      flag(sim, 'readScope');
      return ok('Escopo de Implantação do Cofre de Senhas Vaultwarden\nInstância: vaultwarden1\nBackend: Rust leve com SQLite / PostgreSQL\nCriptografia: Zero-Knowledge (PBKDF2/Argon2 + AES-256 no cliente)\nFQDN público: vault.aurora.lab\nDiretiva de Segurança Mandatória: SIGNUPS_ALLOWED=false (desativar cadastro público)\nOrganização corporativa: Aurora-TI com coleções seguras para senhas de infraestrutura.');
    }
    if (line === 'app-install vaultwarden --instance vaultwarden1' || line.startsWith('app-install vaultwarden')) {
      if (!sim.flags.readScope) return fail('Leia o escopo com cat vaultwarden-escopo.txt antes de instalar.');
      sim.lab.vaultwarden.installed = true;
      flag(sim, 'installVaultwarden');
      return ok('Instalando Vaultwarden no NS8...\n[1/3] Baixando imagem ghcr.io/nethserver/vaultwarden:latest... OK\n[2/3] Alocando volume seguro em /srv/disk1/vaultwarden-data... OK\n[3/3] Registrando rota vault.aurora.lab no Traefik com suporte a notificações push... OK\nContainer Vaultwarden iniciado com footprint ultraleve (45 MB RAM).');
    }
    if (line === 'vaultwarden-admin-policy --disable-open-registration' || line.startsWith('vaultwarden-admin-policy')) {
      if (!sim.lab.vaultwarden.installed) return fail('Instale o Vaultwarden antes de configurar políticas.');
      sim.lab.vaultwarden.policySet = true;
      flag(sim, 'enforceAdminPolicy');
      return ok('Aplicando política de segurança administrativa:\nVariável: SIGNUPS_ALLOWED=false\nVariável: INVITATIONS_ALLOWED=true\nEfeito: Auto-cadastro público bloqueado na tela inicial.\nNovos usuários só podem ingressar mediante convite enviado pela TI.');
    }
    if (line.startsWith('vaultwarden-org-create')) {
      if (!sim.lab.vaultwarden.policySet) return fail('Aplique a restrição de cadastro antes de criar a organização.');
      sim.lab.vaultwarden.orgCreated = true;
      flag(sim, 'createOrgCollections');
      return ok('Criando organização corporativa no cofre:\nNome: Aurora-TI\nColeções estruturadas:\n - [Coleção: Servidores] Acesso restrito a administradores de infraestrutura\n - [Coleção: Switches] Credenciais de rede e roteadores de borda\nPolíticas de cofre: Exigência obrigatória de 2FA para todos os membros ativada.');
    }
    if (line === 'curl -I https://vault.aurora.lab/' || line.startsWith('curl -I')) {
      if (!sim.lab.vaultwarden.installed) return fail('Cofre vault.aurora.lab não responde.');
      flag(sim, 'verifyVaultHttp');
      return ok('HTTP/2 200 OK\nserver: traefik\ndate: Tue, 16 Sep 2026 14:30:00 GMT\ncontent-type: text/html; charset=utf-8\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-frame-options: SAMEORIGIN\n[Vaultwarden Web Vault ativo com criptografia Zero-Knowledge]');
    }
  }

  if (sim.id === 50) {
    if (line === 'cat auditoria-catalogo-escopo.txt') {
      flag(sim, 'readAuditScope');
      return ok('Escopo do Marco de Auditoria Global de Aplicações — Módulo 10\nParque avaliado: 6 aplicações conteinerizadas sob Traefik\n - Nextcloud (nuvem de arquivos)\n - Mail Server (Postfix + Dovecot)\n - Roundcube (webmail)\n - Mattermost (chat e colaboração)\n - Guacamole (gateway de acesso remoto)\n - Vaultwarden (cofre corporativo de senhas)\nMetas da auditoria:\n1. Checagem de integridade e versões de todas as instâncias;\n2. Medição do uso consolidado de memória e CPU via Podman;\n3. Execução de smoke test sintético nos 6 domínios publicados;\n4. Validação de governança e homologação da certificação.');
    }
    if (line === 'app-catalog-audit') {
      if (!sim.flags.readAuditScope) return fail('Consulte auditoria-catalogo-escopo.txt antes de auditar.');
      sim.lab.appAudit.catalogAudited = true;
      flag(sim, 'runCatalogAudit');
      return ok('=== AUDITORIA GERAL DO CATÁLOGO DE APLICAÇÕES (NS8) ===\nINSTÂNCIA     CATEGORIA    CONTAINERS  AUTO-RESTART  HEALTHCHECK  STATUS\nnextcloud1    Storage/Collab  3        always        HEALTHY      RUNNING\nmail1         Mail Server     4        always        HEALTHY      RUNNING\nroundcube1    Webmail         1        always        HEALTHY      RUNNING\nmattermost1   Team Chat       2        always        HEALTHY      RUNNING\nguacamole1    Remote Gateway  2        always        HEALTHY      RUNNING\nvaultwarden1  Password Vault  1        always        HEALTHY      RUNNING\nTotal de instâncias: 6 | Containers ativos: 13 | Falhas detectadas: 0.');
    }
    if (line === 'podman-stats-summary') {
      if (!sim.lab.appAudit.catalogAudited) return fail('Execute app-catalog-audit antes de mensurar recursos.');
      sim.lab.appAudit.statsChecked = true;
      flag(sim, 'monitorPodmanStats');
      return ok('=== CONSUMO CONSOLIDADO DE HARDWARE (Podman Pods) ===\nAPLICAÇÃO       CPU %   MEMÓRIA USADA  MEMÓRIA LIMITE   I/O DISCO\nnextcloud1      1.8%    1.20 GB        2.00 GB          42 MB/s\nmail1           2.1%    1.80 GB        2.50 GB          18 MB/s\nmattermost1     1.2%    820 MB         1.50 GB          12 MB/s\nguacamole1      0.9%    580 MB         1.00 GB          8 MB/s\nvaultwarden1    0.1%    52 MB          256 MB           2 MB/s\ntraefik-core    0.4%    110 MB         512 MB           5 MB/s\n---------------------------------------------------------------\nCONSOLIDADO:    6.5%    4.56 GB / 8.00 GB (57% da RAM total)\nHeadroom disponível: 3.44 GB (43% livre). Nó estável e com margem segura.');
    }
    if (line === 'cluster-app-smoke-test') {
      if (!sim.lab.appAudit.statsChecked) return fail('Inspecione o consumo com podman-stats-summary antes do smoke test.');
      sim.lab.appAudit.smokeTested = true;
      flag(sim, 'runAppSmokeTest');
      return ok('=== DISPARANDO SMOKE TEST SINTÉTICO (Traefik Endpoints) ===\n[1/6] https://cloud.lab.example/       -> HTTP/2 200 OK (TLS 1.3, 14ms) [PASS]\n[2/6] mail1:993 (IMAPS) & mail1:587     -> STARTTLS OK   (TLS 1.3, 8ms)  [PASS]\n[3/6] https://webmail.aurora.lab/      -> HTTP/2 200 OK (TLS 1.3, 12ms) [PASS]\n[4/6] https://chat.aurora.lab/         -> HTTP/2 200 OK (WSS OK, 15ms)  [PASS]\n[5/6] https://remote.aurora.lab/       -> HTTP/2 200 OK (TLS 1.3, 11ms) [PASS]\n[6/6] https://vault.aurora.lab/        -> HTTP/2 200 OK (TLS 1.3, 9ms)  [PASS]\n---------------------------------------------------------------\nResultado: 6/6 PASS. Todos os serviços web corporativos operacionais!');
    }
  }

  return null;
}

export function appAction(sim, action, values) {
  if (sim.id === 46) {
    if (action === 'roundcube-validate') {
      if (!['readPlan', 'searchCatalog', 'installRoundcube', 'checkAppStatus', 'verifyWebmailHttp'].every(k => sim.flags[k])) {
        return 'Leia o plano, busque o catálogo, instale a aplicação, confira o status e valide via curl antes de homologar.';
      }
      sim.lab.roundcube.verified = true;
      sim.flags.validateRoundcube = true;
      return 'Roundcube Webmail homologado com sucesso! Frontend integrado ao Mail Server.';
    }
  }

  if (sim.id === 47) {
    if (action === 'mattermost-validate') {
      if (!['readScope', 'installMattermost', 'bindSambaAuth', 'createTeamChannels', 'verifyChatHttp'].every(k => sim.flags[k])) {
        return 'Leia o escopo, instale o Mattermost, vincule a autenticação AD, crie os canais e audite o endpoint antes de homologar.';
      }
      sim.lab.mattermost.verified = true;
      sim.flags.validateMattermost = true;
      return 'Mattermost homologado com sucesso! Plataforma de chat corporativo on-premises operacional.';
    }
  }

  if (sim.id === 48) {
    if (action === 'guacamole-validate') {
      if (!['readPlan', 'installGuacamole', 'addRdpConnection', 'auditGuacamoleConnections', 'verifyRemoteHttp'].every(k => sim.flags[k])) {
        return 'Leia o plano, instale o Guacamole, mapeie a estação RDP, audite as conexões e teste o FQDN antes de homologar.';
      }
      sim.lab.guacamole.verified = true;
      sim.flags.validateGuacamole = true;
      return 'Apache Guacamole homologado com sucesso! Gateway de acesso remoto clientless operacional.';
    }
  }

  if (sim.id === 49) {
    if (action === 'vaultwarden-validate') {
      if (!['readScope', 'installVaultwarden', 'enforceAdminPolicy', 'createOrgCollections', 'verifyVaultHttp'].every(k => sim.flags[k])) {
        return 'Leia o escopo, instale o Vaultwarden, bloqueie o auto-cadastro, crie as coleções de TI e teste o FQDN antes de homologar.';
      }
      sim.lab.vaultwarden.verified = true;
      sim.flags.validateVaultwarden = true;
      return 'Vaultwarden homologado com sucesso! Cofre de senhas corporativo protegido com Zero-Knowledge.';
    }
  }

  if (sim.id === 50) {
    if (action === 'review10-checklist') {
      const needed = ['roundcube', 'mattermost', 'guacamole', 'vaultwarden', 'governance'];
      const ok = needed.every(k => values[k]);
      sim.lab.appAudit.checklist = ok;
      return ok ? 'Checklist do Módulo 10 completo! Clique em Validar Certificação.' : 'Marque todos os cinco marcos do catálogo para homologar.';
    }
    if (action === 'review10-validate') {
      if (sim.lab.appAudit.checklist && ['readAuditScope', 'runCatalogAudit', 'monitorPodmanStats', 'runAppSmokeTest'].every(k => sim.flags[k])) {
        sim.flags.review10Certified = true;
        return '⭐ Marco de Revisão Integrada 10 homologado! Catálogo de aplicações auditado e certificado com sucesso.';
      }
      return 'Audite o catálogo, meça o consumo de recursos, execute os smoke tests e marque o checklist antes de homologar.';
    }
  }

  return null;
}
