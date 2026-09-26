const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission45={
  id:45,xp:550,level:'⭐ Revisão Integrada 09 · 75-90 min',title:'Marco de revisão integrada: incidente de borda e hardening',
  isReview:true,
  summary:'Consolide os pilares de segurança do Módulo 9: isole portas de gerência expostas na WAN, ative proteção de ameaças e certifique a borda.',
  call:'CH-NS8-045 · Marco de Certificação do Módulo 9. O sistema de monitoramento da Teseo disparou um alerta vermelho: centenas de tentativas de invasão e força bruta estão atingindo o IP público da empresa. O Júnior deve realizar a triagem de emergência: identificar que a porta de administração do Cluster Admin (443) foi inadvertidamente exposta na WAN do NethSecurity, revogar imediatamente o redirecionamento indevido, acionar o módulo Threat Shield (Suricata + CrowdSec) e auditar a publicação segura das aplicações.',
  impact:'Deixar a porta de administração do cluster aberta para a Internet permite que atacantes automatizados descubram vulnerabilidades, executem credential stuffing e assumam o controle total de todos os containers e nós da organização.',
  senior:'O Sênior aproximou-se em silêncio e apontou para o log vermelho piscando na tela: "Veja os endereços IP de origem, Júnior. Moscou, Shenzhen, Frankfurt, Ashburn. São robôs escaneando o mundo 24 horas por dia em busca de painéis administrativos desprotegidos. Um administrador júnior entra em pânico e puxa o cabo de força. Um administrador profissional respira fundo, identifica a regra de NAT que abriu a porta errada, fecha a brecha na borda e ativa a blindagem de ameaças. Vamos limpar essa exposição agora."',
  concept:'A resolução de incidentes de segurança de borda em infraestruturas NethServer 8 integradas ao NethSecurity 8 requer: 1) Triagem de exposição de portas através da auditoria de regras de Destination NAT (Port Forwarding) no firewall de borda; 2) Princípio da Não-Exposição de Gerência: portas de administração web (Cluster Admin e LuCI 9090) e SSH (porta 22) devem ser estritamente confinadas à LAN interna ou acessíveis exclusivamente via túneis VPN autenticados; 3) Defesa Ativa de Borda com Threat Shield: bloqueio automático de IPs maliciosos conhecidos via listas de reputação CrowdSec e análise comportamental com Suricata IPS; 4) Validação externa de publicação: assegurar que somente os domínios protegidos pelo Traefik (Nextcloud e Mail) respondem externamente.',
  example:'No laboratório, você lê o alerta com cat chamado-incidente-seguranca.txt, audita as portas com nethsec-audit-forwarding, revoga a regra indevida com nethsec-nat-revoke --rule admin-wan, ativa as defesas com nethsec-threatshield-enable e valida a segurança com edge-security-audit.',
  glossary:[['Credential Stuffing','Ataque automatizado usando bancos de senhas vazadas','Um ladrão tentando abrir a fechadura com um chaveiro cheio de chaves perdidas na rua.'],['Threat Shield','Módulo de inteligência de ameaças e IPS do NethSecurity','A patrulha que reconhece o rosto de invasores procurados e barra a entrada na cancela.'],['CrowdSec','Rede colaborativa global de bloqueio de IPs maliciosos','A lista comunitária de vizinhos avisando quais carros suspeitos estão rondando o bairro.'],['Hardening','Processo de reforço de segurança e remoção de brechas','Instalar travas reforçadas, alarme e fechar janelas que foram deixadas abertas por engano.']],
  recall:{question:'Quais são as três medidas imediatas que um administrador deve tomar ao detectar que a interface administrativa do cluster foi exposta na WAN da empresa?',answer:'1) Revogar imediatamente a regra de Port Forwarding no firewall de borda (NethSecurity); 2) Ativar o bloqueio de IPs maliciosos via Threat Shield / CrowdSec; 3) Analisar os logs de autenticação do Cluster Admin para comprovar que nenhuma credencial foi comprometida.'},
  labIntro:'Onde executar: terminal de operações de segurança e console central de auditoria de borda.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de plantão.',
    'Execute cat chamado-incidente-seguranca.txt para ler os detalhes do alerta de invasão.',
    'Execute nethsec-audit-forwarding para localizar a regra indevida que expôs a gerência.',
    'Execute nethsec-nat-revoke --rule admin-wan para revogar o redirecionamento da WAN.',
    'Execute nethsec-threatshield-enable para acionar o bloqueio ativo de ameaças.',
    'Execute edge-security-audit para validar que apenas as portas de serviço estão acessíveis.',
    'No painel educativo, confirme os cinco itens do checklist do Módulo 9 e homologue a certificação estelar.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readEdgeIncidentTicket','Ler chamado em chamado-incidente-seguranca.txt'],
    ['auditBorderExposure','Auditar encaminhamento com nethsec-audit-forwarding'],
    ['revokeExposedRule','Revogar regra indevida com nethsec-nat-revoke'],
    ['enableEdgeThreatShield','Ativar Threat Shield com nethsec-threatshield-enable'],
    ['runEdgeSecurityAudit','Comprovar segurança com edge-security-audit'],
    ['review9Certified','Homologar Marco de Revisão Integrada 09']
  ],
  hints:[
    'O comando nethsec-audit-forwarding apontará a regra admin-wan exposta.',
    'Utilize nethsec-nat-revoke --rule admin-wan para fechar a porta administrativa.',
    'Após ativar o Threat Shield, execute edge-security-audit para obter o status PASS em todas as verificações.'
  ],
  testking:[
    q('n45-vuln','Causa Raiz do Incidente','Qual foi a falha de configuração que gerou os alertas de ataque de força bruta?',1,
      ['O provedor de Internet cancelou o contrato de fibra óptica da empresa',
       'Uma regra de NAT no NethSecurity encaminhou a porta de gerência (Cluster Admin) para a Internet aberta',
       'O teclado do Júnior estava com a tecla Shift emperrada'],
      ['Cancelamento de contrato geraria perda total de conexão, não ataques de força bruta no painel.',
       'Correto! A exposição indevida da porta de administração atraiu botnets globais que iniciaram ataques automatizados.',
       'Problemas mecânicos de teclado não abrem portas de firewall nem alteram regras de rede.'],
      'É deixar a porta da tesouraria do banco aberta para a calçada da avenida durante a madrugada.'
    ),
    q('n45-threat','Papel do Threat Shield e CrowdSec','Como o módulo Threat Shield do NethSecurity 8 ajuda a conter ataques massivos de varredura?',0,
      ['Bloqueando automaticamente os endereços IP catalogados em listas globais de atacantes e aplicando regras Suricata',
       'Desligando a energia de toda a cidade para evitar que computadores acessem a Internet',
       'Enviando um e-mail educado pedindo para os invasores pararem de atacar o servidor'],
      ['Exato! O CrowdSec sincroniza inteligência de ameaças comunitária em tempo real e o Suricata analisa assinaturas.',
       'Desligar energia da cidade é absurdo e viola todas as práticas de continuidade de negócios.',
       'Atacantes utilizam scripts automatizados que ignoram e-mails ou pedidos de interrupção.'],
      'É o segurança que já possui a lista com a foto dos golpistas procurados e os impede de entrar na festa.'
    ),
    q('n45-safe-pub','Publicação Segura de Serviços','Qual é o estado final correto de publicação de serviços após a conclusão do hardening de borda?',2,
      ['Todas as portas fechadas e nenhum usuário da empresa conseguindo ler e-mails ou arquivos',
       'Todas as portas abertas novamente para facilitar a vida dos desenvolvedores',
       'Apenas portas de serviços essenciais (80, 443 para Traefik e 25/587 para e-mail) abertas, com gerência isolada'],
      ['Fechar tudo impediria o funcionamento da empresa e violaria a disponibilidade dos serviços.',
       'Reabrir portas indiscriminadamente recriaria o incidente com gravidade ainda maior.',
       'Correto! O proxy Traefik atende as requisições web legítimas, o correio flui e a administração fica blindada na LAN/VPN.'],
      'A loja abre o balcão de vendas na galeria comercial, enquanto a sala da tesouraria permanece protegida por senha e alarme.'
    )
  ],
  decisionPrompt:'Após resolver o incidente, o auditor de segurança pergunta qual medida definitiva deve ser registrada para evitar que outros operadores criem regras de NAT expondo portas administrativas. O que você apresenta?',
  decisions:[
    {id:'no-policy',label:'Não fazer nada e torcer para ninguém errar de novo',correct:false,consequence:'Irresponsabilidade técnica: sem processo formal, o erro se repetirá na próxima troca de turno.'},
    {id:'hardened-policy',label:'Implementar política formal proibindo Port Forwarding de gerência e automatizar alertas de desvio',correct:true,consequence:'Excelente conduta! A regra passa a constar no manual corporativo com auditoria contínua e conformidade ISO 27001.'},
    {id:'block-internet',label:'Cortar a Internet da empresa para sempre',correct:false,consequence:'Solução absurda que inviabiliza as atividades comerciais da Aurora.'}
  ],
  procedure:[
    'Audite imediatamente a tabela de redirecionamento de portas (Destination NAT) no NethSecurity.',
    'Revogue regras que apontem portas de gerência (443/cluster-admin, 9090, 22) para a WAN.',
    'Ative o Threat Shield com listas CrowdSec e regras Suricata IPS no firewall de borda.',
    'Inspecione os cabeçalhos de segurança e certificados no proxy reverso Traefik.',
    'Execute uma varredura de portas externa para certificar que apenas os serviços aprovados respondem.',
    'Atualize a documentação de conformidade e o relatório de fechamento do incidente.'
  ],
  validation:'Evidência: regra de exposição indevida revogada, Threat Shield ativo na borda, apenas portas públicas autorizadas respondendo e auditoria de segurança homologada com distinção.',
  challenge:'Documente a regra de NAT removida, confirme o status ativo do Threat Shield e anote as portas públicas que permaneceram autorizadas.',
  diaryPlaceholder:'Regra admin-wan revogada; Threat Shield CrowdSec ativado; apenas 80,443,25,587 na WAN; Módulo 9 certificado...',
  closing:'⭐ Parabéns! Você concluiu o Módulo 9 com excelência e tornou-se Especialista em Segurança de Borda, Proxy Reverso e NethSecurity 8. No Módulo 10, você dominará o Catálogo de Aplicações e Serviços Avançados!',
  sources:[['Edge Hardening',docs+'administrator-manual/security/#hardening'],['Threat Shield in NethSecurity','https://docs.nethsecurity.org/en/latest/threat_shield.html']]
};
