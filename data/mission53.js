const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission53={
  id:53,xp:500,level:'Especialista · 60-70 min',title:'Distribuição de cargas: migração de aplicações entre nós',
  summary:'Equilibre os recursos do cluster migrando a aplicação Nextcloud do nó líder para o worker com roteamento transparente via Traefik.',
  call:'CH-NS8-053 · O nó líder (ns8-lab-01) continua sobrecarregado com 6 aplicações ativas, enquanto o recém-chegado nó worker (ns8-worker-02) está operando com menos de 10% de uso de memória. O Júnior deve executar a migração a quente da instância nextcloud1 para o nó worker, transferindo a execução dos containers e comprovando que o Traefik passa a despachar requisições para o novo destino sem alterar a URL cloud.lab.example nem desconectar sessões.',
  impact:'Saber balancear e migrar cargas entre nós do cluster previne gargalos severos de desempenho, viabiliza manutenções programadas de nós físicos sem indisponibilidade e garante o retorno máximo do investimento em hardware no datacenter.',
  senior:'O Sênior apontou para o monitor de recursos gráficos do cluster: "Veja os medidores, Júnior. O nó líder está amarelo, batendo 78% de memória RAM porque o Nextcloud mantém cache Redis e conexões WebDAV ativas. Enquanto isso, o ns8-worker-02 está ali, com 8 GB de RAM completamente livres. Vamos usar o poder do NS8: com o comando app-migrate, o cluster sincroniza os volumes de estado, inicia o Podman no nó 2 e instrui o Traefik a apontar a rota cloud.lab.example para 10.5.4.2:80 via WireGuard. Os usuários sequer notarão que a máquina por trás da página mudou de servidor. Essa é a magia do cluster moderno."',
  concept:'A migração de cargas de trabalho (Workload Placement & Migration) no NethServer 8 apoia-se no desacoplamento entre containers e proxy de entrada. O processo executa quatro fases: 1) Pré-sincronização de volumes persistentes entre o nó de origem e destino; 2) Encerramento gracioso dos containers no nó líder com flush de estado; 3) Inicialização dos pods Podman no nó worker (10.5.4.2); 4) Reconfiguração dinâmica do proxy Traefik, que atualiza a tabela de roteamento interno sem necessidade de reiniciar o Traefik nem reemitir certificados TLS.',
  example:'No laboratório, você inspeciona a distribuição em cat workload-migration-plano.txt, lista as instâncias com app-node-list, dispara a migração com app-migrate nextcloud1 --target-node ns8-worker-02, audita a rota de malha com traefik-mesh-routes-audit e valida o balanceamento no painel educativo.',
  glossary:[['Workload Placement','Decisão de qual nó do cluster deve executar uma determinada instância','Escolher em qual filial da transportadora cada caminhão deve ficar estacionado para atender os clientes mais rápido.'],['App Migration','Transferência do ciclo de vida de uma aplicação conteinerizada entre nós','Trocar a locomotiva que puxa o trem sem que os passageiros precisem descer dos vagões.'],['Dynamic Backend Update','Capacidade do proxy Traefik de alterar o IP de destino sem parar requisições','A telefonista que transfere a chamada para outro ramal sem derrubar a ligação.'],['Stateless vs Stateful','Diferença entre serviços que não guardam arquivos locais e os que mantêm bancos/discos persistentes','Um rádio de pilha que apenas sintoniza a música versus uma biblioteca que armazena livros pesados nas prateleiras.']],
  recall:{question:'O que acontece com o FQDN público (ex: https://cloud.lab.example/) e o certificado TLS quando o Nextcloud é migrado para outro nó?',answer:'Permanecem rigorosamente inalterados: o tráfego externo continua chegando na porta 443 do Traefik no IP público, e o Traefik simplesmente encaminha o tráfego pela VPN WireGuard interna para o IP virtual do nó onde a aplicação agora executa.'},
  labIntro:'Onde executar: console do líder e gerenciador de distribuição de cargas do cluster.',
  labSteps:[
    'Execute whoami e hostname para confirmar a sessão no nó líder ns8-lab-01.',
    'Execute cat workload-migration-plano.txt para verificar os alvos de origem e destino.',
    'Execute app-node-list para auditar em qual nó cada aplicação está sendo executada.',
    'Execute app-migrate nextcloud1 --target-node ns8-worker-02 para iniciar a migração.',
    'Execute traefik-mesh-routes-audit para checar o novo backend IP (10.5.4.2) no Traefik.',
    'No painel educativo, confirme a nova topologia balanceada e homologue a migração.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readMigrationPlan','Ler plano em workload-migration-plano.txt'],
    ['listAppNodes','Listar alocação de nós com app-node-list'],
    ['migrateWorkload','Migrar aplicação com app-migrate nextcloud1'],
    ['auditTraefikMeshRoutes','Auditar rotas Traefik com traefik-mesh-routes-audit'],
    ['validateWorkloadMigration','Homologar migração no painel educativo']
  ],
  hints:[
    'Consulte app-node-list para confirmar que todas as aplicações estavam no nó líder.',
    'O comando de migração deve direcionar a instância nextcloud1 para o target ns8-worker-02.',
    'Após a migração, traefik-mesh-routes-audit comprovará que a rota aponta para 10.5.4.2.'
  ],
  testking:[
    q('n53-traefik','Transparência de Roteamento','Como o Traefik mantém o acesso dos usuários funcionando após a migração do Nextcloud para o nó 2?',1,
      ['Enviando um e-mail pedindo para todos os usuários digitarem um novo endereço IP no navegador',
       'Atualizando dinamicamente a rota interna para despachar requisições via WireGuard até o IP 10.5.4.2 sem mudar a URL externa',
       'Desligando o site por três dias até o DNS da Internet expirar'],
      ['Usuários finais não precisam ser incomodados com detalhes de infraestrutura interna.',
       'Correto! O proxy reverso abstrai totalmente a localização física dos containers na rede.',
       'Downtime desnecessário é o oposto da finalidade de um cluster corporativo moderno.'],
      'É o carteiro que continua entregando as cartas na sua caixa postal mesmo que você tenha trocado de quarto na casa.'
    ),
    q('n53-balance','Benefício do Balanceamento','Qual é o impacto imediato no nó líder após a migração bem-sucedida do Nextcloud para o worker?',0,
      ['Liberação de mais de 1.2 GB de memória RAM e alívio de ciclos de CPU no nó líder',
       'Perda irreversível de todos os arquivos cadastrados no sistema financeiro',
       'Explosão das portas de rede por excesso de tráfego de ar comprimido'],
      ['Exato! A migração distribui a carga de memória e CPU, restaurando a folga operacional (headroom) do líder.',
       'Volumes persistentes são preservados e sincronizados durante o procedimento de migração oficial.',
       'Termos fantasiosos sem fundamento na física ou nas redes de computadores.'],
      'É transferir parte das malas pesadas para o segundo carro da família para não sobrecarregar o primeiro.'
    ),
    q('n53-downtime','Tempo de Indisponibilidade na Migração','Como é caracterizado o tempo de transição durante o comando app-migrate no NS8?',2,
      ['Uma parada de manutenção de 48 horas exigindo gerador a diesel',
       'Nenhuma parada jamais, pois os containers se multiplicam como clones infinitos',
       'Uma janela de transição de poucos segundos, apenas o tempo de parar o container no nó 1 e subir no nó 2 com flush de estado'],
      ['Paradas de dias são inaceitáveis para migrações de containers modernos.',
       'Containers com banco de dados precisam sincronizar buffers para evitar corrupção de escrita simultânea.',
       'Correto! A transição dura meros segundos, minimizando o impacto operacional a quase imperceptível.'],
      'É o semáforo que fica vermelho por 5 segundos para que o pedestre atravesse a rua em segurança.'
    )
  ],
  decisionPrompt:'O coordenador de vendas teme que a migração de nós apague os compartilhamentos públicos já enviados para clientes externos. O que você esclarece tecnicamente?',
  decisions:[
    {id:'panic-links',label:'Afirmar que todos os links anteriores foram destruídos e pedir desculpas',correct:false,consequence:'Informação falsa e amadora que espalha pânico infundado na equipe comercial.'},
    {id:'assure-links',label:'Garantir que os tokens de links, bancos e permissões permanecem 100% íntegros porque os dados persistem no volume da aplicação',correct:true,consequence:'Excelente segurança técnica! Demonstra domínio da separação entre camada de computação efêmera e armazenamento persistente.'},
    {id:'cancel-cluster',label:'Desmontar o cluster e colocar o Nextcloud em um pen-drive',correct:false,consequence:'Proposta absurda que quebra toda a segurança e confiabilidade do ambiente.'}
  ],
  procedure:[
    'Monitore o consumo de memória RAM do nó líder e identifique a aplicação com maior footprint.',
    'Verifique se o nó de destino (ns8-worker-02) possui capacidade e saúde adequadas.',
    'Dispare o comando de migração com notificação e encerramento gracioso dos containers.',
    'Monitore a sincronização de volumes e a reinicialização dos serviços no nó worker.',
    'Inspecione a tabela de rotas do Traefik e comprove o apontamento para o IP virtual 10.5.4.2.',
    'Execute testes funcionais no FQDN oficial e confirme a estabilidade das sessões de usuários.'
  ],
  validation:'Evidência: alocação inicial auditada com 6 apps no líder, migração da instância nextcloud1 executada para ns8-worker-02, rota Traefik atualizada para 10.5.4.2:80 com HTTP/2 200 OK e homologação concluída no painel educativo.',
  challenge:'Documente a alteração na distribuição de nós, comprove a redução de uso de RAM no líder e verifique o status do Nextcloud no worker.',
  diaryPlaceholder:'Nextcloud1 migrado para ns8-worker-02; líder aliviado (RAM caiu para 38%); rota cloud.lab.example apontando para 10.5.4.2 no Traefik...',
  closing:'Excelente! A carga de trabalho foi migrada com sucesso mantendo transparência total. Na Aula 54, você aprenderá a gerenciar armazenamento distribuído e montagens de rede no cluster!',
  sources:[['Workload Migration',docs+'administrator-manual/cluster/#migrating-applications'],['Dynamic Reverse Proxy Routing',docs+'administrator-manual/traefik/']]
};
