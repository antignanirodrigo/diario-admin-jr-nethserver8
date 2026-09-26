const ok = output => ({output, error: false});
const fail = output => ({output, error: true});
const flag = (sim, name) => { sim.flags[name] = true; };

export const securityCommands = {
  41: ['cat modelo-seguranca-escopo.txt', 'host-firewall-status', 'border-gateway-probe 192.168.50.1'],
  42: ['cat integracao-nethsec-plano.txt', 'nethsec-controller-status', 'nethsec-appliance-pair --host 192.168.50.1', 'nethsec-nat-apply --port-map "80:80,443:443,25:25,587:587"', 'nethsec-audit-forwarding'],
  43: ['cat traefik-rotas-escopo.txt', 'traefik-routes-list', 'traefik-cert-audit cloud.lab.example', 'traefik-security-headers-apply cloud.lab.example --hsts --nosniff', 'curl -I https://cloud.lab.example/'],
  44: ['cat vpn-arquitetura-plano.txt', 'cluster-vpn-status', 'nethsec-vpn-audit 192.168.50.1', 'vpn-mesh-ping 10.5.4.1', 'vpn-security-validate'],
  45: ['cat chamado-incidente-seguranca.txt', 'nethsec-audit-forwarding', 'nethsec-nat-revoke --rule admin-wan', 'nethsec-threatshield-enable', 'edge-security-audit']
};

export function initSecurity(sim) {
  if (sim.id === 41) sim.lab.secModel = {border: '', host: '', container: '', verified: false};
  if (sim.id === 42) sim.lab.nethsec = {paired: false, natApplied: false, verified: false};
  if (sim.id === 43) sim.lab.traefikSec = {headersApplied: false, verified: false};
  if (sim.id === 44) sim.lab.vpnArch = {meshOk: false, borderVpnOk: false, verified: false};
  if (sim.id === 45) sim.lab.edgeIncident = {ruleRevoked: false, threatShieldActive: false, auditPass: false, checklist: false};
}

export function securityCommand(sim, line) {
  if (sim.id === 41) {
    if (line === 'cat modelo-seguranca-escopo.txt') {
      flag(sim, 'readSecurityScope');
      return ok('Separação Arquitetural de Segurança — Aurora IT Infrastructure\nCamada 1 (Borda UTM): NethSecurity 8 (OpenWrt, Multi-WAN, DPI, IPS/IDS Suricata, porta 9090)\nCamada 2 (Host Local): NethServer 8 (Rocky Linux 9, nftables/firewalld protegendo portas locais)\nCamada 3 (Aplicações): Podman container namespaces (Nextcloud, Mail, Samba)\nRegra: Jamais expor o NS8 diretamente à Internet sem o NethSecurity na borda.');
    }
    if (line === 'host-firewall-status') {
      flag(sim, 'checkHostFirewall');
      return ok('=== STATUS DO FIREWALL DE HOST (nftables / NS8) ===\nZona pública (ens18):\n - tcp/80, tcp/443 (Traefik reverse proxy)\n - tcp/25, tcp/587, tcp/993 (Mail server)\nZona confiável (wg0):\n - udp/51820 (WireGuard cluster mesh, interconexão interna)\nPolíticas: DROP por padrão para portas não declaradas.');
    }
    if (line === 'border-gateway-probe 192.168.50.1' || line.startsWith('border-gateway-probe')) {
      flag(sim, 'probeBorderGateway');
      return ok('Sondando Gateway de Borda NethSecurity 8 (192.168.50.1)...\n[OK] Resposta ICMP: 0.2ms (gateway ativo)\n[OK] Porta 9090/tcp (NethSecurity Admin LuCI / Nethesis): OPEN (TLSv1.3)\n[OK] Rota padrão 0.0.0.0/0 via 192.168.50.1 operacional\nGateway NethSecurity pronto para pareamento com controller.');
    }
  }

  if (sim.id === 42) {
    if (line === 'cat integracao-nethsec-plano.txt') {
      flag(sim, 'readIntegrationPlan');
      return ok('Plano de Integração NethSecurity Controller — aurora.lab\nAppliance de borda: netsec.aurora.lab (192.168.50.1:9090)\nCanal de controle: API REST sobre mTLS autenticado\nMatriz de Port Forwarding Autorizada:\n - WAN:80 -> 192.168.50.10:80 (HTTP Traefik / ACME)\n - WAN:443 -> 192.168.50.10:443 (HTTPS Traefik / Apps)\n - WAN:25 -> 192.168.50.10:25 (MTA SMTP relay)\n - WAN:587 -> 192.168.50.10:587 (Submission STARTTLS)\nProibição: DMZ total ou abertura de portas de gerência (22, 9090, 443/admin).');
    }
    if (line === 'nethsec-controller-status') {
      flag(sim, 'checkControllerStatus');
      return ok('App: NethSecurity Controller (ghcr.io/nethserver/nethsecurity-controller:1.2)\nStatus: RUNNING\nAppliances cadastrados: 0 (Aguardando pareamento com 192.168.50.1)');
    }
    if (line === 'nethsec-appliance-pair --host 192.168.50.1' || line.startsWith('nethsec-appliance-pair')) {
      if (!sim.flags.checkControllerStatus) return fail('Consulte nethsec-controller-status antes de parear o appliance.');
      sim.lab.nethsec.paired = true;
      flag(sim, 'pairAppliance');
      return ok('Conectando a netsec.aurora.lab (192.168.50.1:9090)...\n[1/3] Negociando certificado de controle mTLS... OK\n[2/3] Autenticando token de gestão remota... OK\n[3/3] Registrando appliance na central de controle... OK\nSucesso: NethSecurity 8 (firmware 8.2-GA) pareado com o cluster.');
    }
    if (line.startsWith('nethsec-nat-apply')) {
      if (!sim.lab.nethsec.paired) return fail('Erro: O appliance deve estar pareado antes de aplicar regras de NAT.');
      sim.lab.nethsec.natApplied = true;
      flag(sim, 'applyNatRules');
      return ok('Aplicando regras de Destination NAT (Port Forwarding) no NethSecurity:\n - WAN:80 -> 192.168.50.10:80 [ALLOW, LOG]\n - WAN:443 -> 192.168.50.10:443 [ALLOW, LOG]\n - WAN:25 -> 192.168.50.10:25 [ALLOW, LOG]\n - WAN:587 -> 192.168.50.10:587 [ALLOW, LOG]\nRegras injetadas no subsistema nftables do NethSecurity com sucesso.');
    }
    if (line === 'nethsec-audit-forwarding') {
      if (!sim.lab.nethsec.natApplied) return fail('Aplique as regras com nethsec-nat-apply antes de auditar.');
      flag(sim, 'auditForwarding');
      return ok('TABELA DE ENCAMINHAMENTO DE PORTAS (WAN -> LAN):\nREGRA  PORTA WAN  DESTINO INTERNO   PROTOCOLO  STATUS\nweb80  80         192.168.50.10:80  tcp        ATIVO (LOGGED)\nweb443 443        192.168.50.10:443 tcp        ATIVO (LOGGED)\nmail25 25         192.168.50.10:25  tcp        ATIVO (LOGGED)\nsub587 587        192.168.50.10:587 tcp        ATIVO (LOGGED)\nNenhuma porta de gerência exposta na WAN. Status: CONFORME.');
    }
  }

  if (sim.id === 43) {
    if (line === 'cat traefik-rotas-escopo.txt') {
      flag(sim, 'readTraefikPlan');
      return ok('Mapeamento de Rotas do Proxy Reverso Traefik — NS8\nFrontend FQDN: cloud.lab.example -> Backend container: nextcloud1:80\nFrontend FQDN: ns8-lab-01.lab.example -> Backend: cluster-admin:443\nRequisitos de Hardening OWASP:\n - Strict-Transport-Security (HSTS): max-age=31536000; includeSubDomains\n - X-Frame-Options: SAMEORIGIN (anti-clickjacking)\n - X-Content-Type-Options: nosniff (anti-MIME sniffing)');
    }
    if (line === 'traefik-routes-list') {
      flag(sim, 'listTraefikRoutes');
      return ok('ROUTER                RULE                                   BACKEND\ncloud-router@docker   Host(`cloud.lab.example`)              nextcloud1:80 (tls: true)\nadmin-router@file     Host(`ns8-lab-01.lab.example`)         core-admin (tls: true)\nTraefik provê descoberta dinâmica e terminação TLS em todas as rotas.');
    }
    if (line === 'traefik-cert-audit cloud.lab.example' || line.startsWith('traefik-cert-audit')) {
      flag(sim, 'auditTraefikCerts');
      return ok('Auditoria de Certificado TLS para cloud.lab.example:\nEmissor: Aurora Lab Internal CA (ou Let\'s Encrypt)\nValidade: 89 dias restantes\nCifra negociada: TLS_AES_256_GCM_SHA384 (TLSv1.3)\nStatus: VÁLIDO e CONFIÁVEL.');
    }
    if (line.startsWith('traefik-security-headers-apply')) {
      sim.lab.traefikSec.headersApplied = true;
      flag(sim, 'applySecurityHeaders');
      return ok('Middleware de segurança aplicado para cloud.lab.example:\n - HSTS ativado (max-age=31536000; includeSubDomains)\n - X-Frame-Options configurado para SAMEORIGIN\n - X-Content-Type-Options configurado para nosniff\nAtualização injetada no Traefik dinamicamente (zero-downtime).');
    }
    if (line === 'curl -I https://cloud.lab.example/' || line.startsWith('curl -I')) {
      if (!sim.lab.traefikSec.headersApplied) {
        return ok('HTTP/2 200 OK\nserver: traefik\ncontent-type: text/html\n(Alerta: Cabeçalhos HSTS e SAMEORIGIN ausentes).');
      }
      flag(sim, 'verifyHardenedHttp');
      return ok('HTTP/2 200 OK\nserver: traefik\ndate: Tue, 16 Sep 2026 12:00:00 GMT\ncontent-type: text/html; charset=UTF-8\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-frame-options: SAMEORIGIN\nx-content-type-options: nosniff\n[Auditoria Traefik: Rota protegida com nota A+]');
    }
  }

  if (sim.id === 44) {
    if (line === 'cat vpn-arquitetura-plano.txt') {
      flag(sim, 'readVpnPlan');
      return ok('Diretrizes de Segmentação de Redes e VPN — Aurora\n1. Malha Interna WireGuard do Cluster (wg0):\n - Sub-rede: 10.5.4.0/24 (exclusiva para nós do cluster NS8)\n - Finalidade: Tráfego de controle, sincronização e Redis\n - Acesso de usuários: PROIBIDO.\n2. VPN de Acesso de Usuários (NethSecurity Roadwarrior):\n - Sub-rede: 10.99.0.0/24 (OpenVPN / IPsec)\n - Finalidade: Acesso seguro de notebooks e home office com MFA\n - Regras de firewall: Inspecionado na borda.');
    }
    if (line === 'cluster-vpn-status') {
      flag(sim, 'inspectClusterVpn');
      return ok('Interface: wg0 (WireGuard cluster mesh)\nIP interno: 10.5.4.1/24\nPorta de escuta: 51820/udp\nChave pública: +9F4eBq8K1z7L4x3... (autenticada)\nPeers ativos: 0 (cluster standalone) / escutando em alta velocidade no kernel.');
    }
    if (line === 'nethsec-vpn-audit 192.168.50.1' || line.startsWith('nethsec-vpn-audit')) {
      flag(sim, 'auditNethsecVpn');
      return ok('Auditoria de Servidor VPN no NethSecurity (192.168.50.1):\nServiço: OpenVPN Roadwarrior Server\nPorta pública: 1194/udp (WAN)\nPool de clientes: 10.99.0.0/24\nAutenticação: Vinculada a aurora.lab (Samba AD) + MFA TOTP\nStatus: ATIVO e SEPARADO da rede de controle do cluster.');
    }
    if (line === 'vpn-mesh-ping 10.5.4.1' || line.startsWith('vpn-mesh-ping')) {
      sim.lab.vpnArch.meshOk = true;
      flag(sim, 'pingVpnMesh');
      return ok('PING 10.5.4.1 (10.5.4.1) 56(84) bytes of data.\n64 bytes from 10.5.4.1: icmp_seq=1 ttl=64 time=0.041 ms\n64 bytes from 10.5.4.1: icmp_seq=2 ttl=64 time=0.038 ms\n--- 10.5.4.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss, time 1001ms\nMalha WireGuard interna íntegra e com latência sub-milissegundo.');
    }
    if (line === 'vpn-security-validate') {
      if (!sim.flags.inspectClusterVpn || !sim.flags.auditNethsecVpn) {
        return fail('Audite o WireGuard do cluster e a VPN do NethSecurity antes de validar.');
      }
      sim.lab.vpnArch.verified = true;
      flag(sim, 'validateVpnSecurity');
      return ok('AUDITORIA DE SEGURANÇA E SEGMENTAÇÃO DE REDE:\n[PASS] WireGuard (10.5.4.0/24) isolado: 0 clientes externos permitidos\n[PASS] Roadwarrior (10.99.0.0/24) terminado no firewall de borda NethSecurity\n[PASS] Autenticação de usuários protegida por MFA e políticas de acesso\nConformidade de segmentação: 100% HOMOLOGADA.');
    }
  }

  if (sim.id === 45) {
    if (line === 'cat chamado-incidente-seguranca.txt') {
      flag(sim, 'readEdgeIncidentTicket');
      return ok('INCIDENTE DE SEGURANÇA INC-7710: Ataque de força bruta contra a empresa.\nSintoma: Centenas de conexões por segundo de IPs estrangeiros na porta WAN.\nAlerta: Regra de NAT admin-wan mapeou a porta de gerência (443/admin) na WAN pública!\nMissão de emergência:\n1. Auditar o encaminhamento e identificar a regra indevida;\n2. Revogar imediatamente o acesso à gerência da WAN;\n3. Ativar o Threat Shield (Suricata + CrowdSec) no NethSecurity;\n4. Comprovar que apenas as portas de serviço continuam respondendo.');
    }
    if (line === 'nethsec-audit-forwarding') {
      flag(sim, 'auditBorderExposure');
      if (sim.lab.edgeIncident?.ruleRevoked) {
        return ok('TABELA DE REGRAS DE BORDA (NethSecurity):\nweb80   80  -> 192.168.50.10:80   tcp  ALLOW\nweb443  443 -> 192.168.50.10:443  tcp  ALLOW (Traefik apps)\nmail25  25  -> 192.168.50.10:25   tcp  ALLOW\nsub587  587 -> 192.168.50.10:587  tcp  ALLOW\n(A regra vulnerável admin-wan foi removida com sucesso).');
      }
      return ok('TABELA DE REGRAS DE BORDA (NethSecurity):\nweb80     80   -> 192.168.50.10:80   tcp  ALLOW\nweb443    443  -> 192.168.50.10:443  tcp  ALLOW\nadmin-wan 8443 -> 192.168.50.10:443  tcp  ALLOW [VULNERÁVEL! Cluster Admin exposto na WAN]\nmail25    25   -> 192.168.50.10:25   tcp  ALLOW\nsub587    587  -> 192.168.50.10:587  tcp  ALLOW');
    }
    if (line === 'nethsec-nat-revoke --rule admin-wan' || line.startsWith('nethsec-nat-revoke')) {
      if (!sim.flags.auditBorderExposure) return fail('Erro: Audite primeiro as regras com nethsec-audit-forwarding.');
      sim.lab.edgeIncident.ruleRevoked = true;
      flag(sim, 'revokeExposedRule');
      return ok('Revogando regra admin-wan no NethSecurity 8...\nRegra de NAT removida do nftables. Porta 8443/443 fechada na WAN.\nAcesso administrativo restrito à LAN interna e VPN.');
    }
    if (line === 'nethsec-threatshield-enable') {
      if (!sim.lab.edgeIncident.ruleRevoked) return fail('Revogue primeiro a regra vulnerável antes de acionar a blindagem.');
      sim.lab.edgeIncident.threatShieldActive = true;
      flag(sim, 'enableEdgeThreatShield');
      return ok('=== ATIVANDO THREAT SHIELD NO NETHSECURITY ===\n[1/3] Carregando listas comunitárias CrowdSec de IPs atacantes... OK\n[2/3] Ativando regras de assinatura Suricata IPS de borda... OK\n[3/3] Aplicando bloqueio imediato para IPs maliciosos reincidentes... OK\nThreat Shield ativo: 142 IPs de atacantes banidos imediatamente.');
    }
    if (line === 'edge-security-audit') {
      if (!sim.lab.edgeIncident.ruleRevoked || !sim.lab.edgeIncident.threatShieldActive) {
        return fail('Revogue a regra indevida e ative o Threat Shield antes de auditar a borda.');
      }
      sim.lab.edgeIncident.auditPass = true;
      flag(sim, 'runEdgeSecurityAudit');
      return ok('=== AUDITORIA GERAL DE SEGURANÇA DE BORDA E PUBLICAÇÃO ===\n[PORTAS PÚBLICAS] 80, 443 (Traefik), 25, 587 (Postfix): RESPONDENDO COM HARDENING\n[GERÊNCIA CLUSTER ADMIN] Porta fechada na WAN: PASS (Invisível na Internet)\n[THREAT SHIELD] CrowdSec + Suricata: ATIVO e monitorando\n[TRAEFIK REVERSE PROXY] Headers HSTS e anti-clickjacking: APLICADOS\nResultado da Auditoria: 100% CONFORME (Incidente ENCERRADO com sucesso).');
    }
  }

  return null;
}

export function securityAction(sim, action, values) {
  if (sim.id === 41) {
    if (action === 'security-model-validate') {
      if (!['readSecurityScope', 'checkHostFirewall', 'probeBorderGateway'].every(k => sim.flags[k])) {
        return 'Leia o escopo, audite o firewall de host e sonde o gateway de borda antes de validar.';
      }
      const good = values.border === 'nethsecurity' && values.host === 'nftables' && values.container === 'podman';
      if (!good) return 'Classificação incorreta: Borda = NethSecurity 8, Host = nftables local, Aplicações = Podman containers.';
      sim.lab.secModel.border = values.border;
      sim.lab.secModel.verified = true;
      sim.flags.securityModelVerified = true;
      return 'Modelo de segurança homologado com sucesso! Defesa em profundidade compreendida.';
    }
  }

  if (sim.id === 42) {
    if (action === 'nethsec-integration-validate') {
      if (!['readIntegrationPlan', 'checkControllerStatus', 'pairAppliance', 'applyNatRules', 'auditForwarding'].every(k => sim.flags[k])) {
        return 'Pareie o appliance, aplique as regras de NAT seletivas e audite a tabela antes de homologar.';
      }
      sim.lab.nethsec.verified = true;
      sim.flags.nethsecIntegrationVerified = true;
      return 'Integração NethSecurity Controller e Port Forwarding homologados com sucesso!';
    }
  }

  if (sim.id === 43) {
    if (action === 'traefik-config-validate') {
      if (!['readTraefikPlan', 'listTraefikRoutes', 'auditTraefikCerts', 'applySecurityHeaders', 'verifyHardenedHttp'].every(k => sim.flags[k])) {
        return 'Liste as rotas, audite certificados, aplique os headers de segurança e comprove via curl antes de homologar.';
      }
      sim.lab.traefikSec.verified = true;
      sim.flags.traefikConfigVerified = true;
      return 'Proxy reverso Traefik, terminação TLS e cabeçalhos de proteção homologados!';
    }
  }

  if (sim.id === 44) {
    if (action === 'vpn-architecture-validate') {
      if (!['readVpnPlan', 'inspectClusterVpn', 'auditNethsecVpn', 'pingVpnMesh', 'validateVpnSecurity'].every(k => sim.flags[k])) {
        return 'Inspecione a malha WireGuard, audite a VPN do NethSecurity, execute o ping e a validação antes de homologar.';
      }
      sim.lab.vpnArch.verified = true;
      sim.flags.vpnArchitectureVerified = true;
      return 'Arquitetura de VPNs e segmentação de acessos homologadas com sucesso!';
    }
  }

  if (sim.id === 45) {
    if (action === 'review9-checklist') {
      const needed = ['model', 'controller', 'traefik', 'vpn', 'incident'];
      const ok = needed.every(k => values[k]);
      sim.lab.edgeIncident.checklist = ok;
      return ok ? 'Checklist de segurança completo! Clique em Validar Certificação.' : 'Marque todos os marcos do Módulo 9 para certificar.';
    }
    if (action === 'review9-validate') {
      if (sim.lab.edgeIncident.checklist && ['readEdgeIncidentTicket', 'auditBorderExposure', 'revokeExposedRule', 'enableEdgeThreatShield', 'runEdgeSecurityAudit'].every(k => sim.flags[k])) {
        sim.flags.review9Certified = true;
        return '⭐ Marco de Revisão Integrada 09 homologado! A borda está blindada e a certificação foi concedida.';
      }
      return 'Revogue a regra indevida, ative o Threat Shield, execute a auditoria e marque o checklist antes de homologar.';
    }
  }

  return null;
}
