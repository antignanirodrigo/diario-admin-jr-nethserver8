const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission57={
  id:57,xp:350,level:'Operação Avançada · 45-60 min',title:'Políticas de atualização do cluster e rolling updates',
  summary:'Aplique governança e patches contínuos no NS8: execute rolling update nó a nó (worker primeiro, líder por último) sem derrubar serviços da empresa.',
  call:'CH-NS8-057 · Janela de Manutenção J-109. O repositório oficial do NethServer 8 disponibilizou patches de segurança para o núcleo do sistema (NS8 Core 2.4.1) e novas versões de containers de colaboração. A diretoria da Aurora aprovou a janela de atualização sob a condição de não haver queda generalizada nos serviços de correio e arquivos. O Júnior deve seguir a política corporativa de Rolling Update: inspecionar atualizações pendentes, atualizar primeiro o nó worker ns8-worker-02, testar a estabilidade, aplicar o patch no nó líder ns8-lab-01 e auditar a paridade de versões em todo o cluster.',
  impact:'Executar rolling updates metódicos previne panes de cluster, assegura compatibilidade retroativa de APIs e mantém a empresa operando durante ciclos de aplicação de patches de segurança.',
  senior:'O Sênior sentou-se ao lado do Júnior e colocou na mesa o documento de governança de TI: "Atualização de infraestrutura não é jogo de azar, Júnior. Em um cluster distribuído, nunca se clica em \'atualizar tudo ao mesmo tempo\'. A regra número 1 da engenharia de confiabilidade é: o nó worker recebe o patch primeiro. Se o novo container tiver incompatibilidade ou falhar, o líder permanece estável para comandar o rollback. Quando o worker se provar saudável, aí sim atualizamos o líder. É assim que profissionais entregam 99.9% de uptime real."',
  concept:'A governança de patches no NethServer 8 apoia-se no conceito de Rolling Update com tolerância a versões heterogêneas transitórias. Durante a janela de atualização: 1) O nó worker é drenado de transações em andamento e atualizado com novos containers Podman; 2) A camada de rede WireGuard (wg0) mantém a comunicação ativa, pois os contratos de API REST do NS8 mantêm compatibilidade semântica com versões anteriores imediatas (N e N-1); 3) Validação de estabilidade pós-patch (smoke test local); 4) Atualização do nó líder; 5) Re-convergência do cluster e auditoria de versão para certificar que nenhum nó permaneceu defasado.',
  example:'No laboratório, você lê a política com cat rolling-update-politica.txt, descobre patches pendentes com cluster-updates-check, atualiza o worker com cluster-update-apply --target-node ns8-worker-02 --rolling, atualiza o líder com cluster-update-apply --target-node ns8-lab-01, audita a sincronização com cluster-version-audit e homologa o procedimento no painel.',
  glossary:[['Rolling Update','Estratégia de atualização sequencial nó a nó para eliminar indisponibilidade global','Trocar os pneus de um carro em pitstop mantendo o chassi sempre equilibrado.'],['Backward Compatibility','Capacidade de versões mais novas de software dialogarem com nós legados sem quebra','Falar português padrão de forma que pessoas de diferentes sotaques e idades entendam perfeitamente.'],['Node Drain','Pausa controlada no agendamento de novas tarefas em um nó prestes a receber patches','Fechar a catraca de entrada de uma estação de metrô para limpar e pintar a plataforma.'],['Version Parity','Estado em que todos os membros de um cluster executam exatamente a mesma versão estável','Todos os relógios de uma orquestra marcando rigorosamente os mesmos segundos.']],
  recall:{question:'Por que o nó worker deve ser atualizado antes do nó líder em uma rotina de Rolling Update no NS8?',answer:'Porque se houver qualquer anomalia no pacote novo, o nó líder mantém a gerência intacta, o controle da fila Redis e a capacidade de orquestrar correções sem colapso administrativo.'},
  labIntro:'Onde executar: console de gerenciamento de patches do nó líder ns8-lab-01.',
  labSteps:[
    'Execute whoami e hostname para confirmar o operador na console do líder.',
    'Execute cat rolling-update-politica.txt para revisar a sequência mandatória de patches.',
    'Execute cluster-updates-check para listar atualizações de Core e containers disponíveis.',
    'Execute cluster-update-apply --target-node ns8-worker-02 --rolling para atualizar o nó 2.',
    'Execute cluster-update-apply --target-node ns8-lab-01 para atualizar o nó líder.',
    'Execute cluster-version-audit para verificar que todos os nós estão sincronizados na versão 2.4.1.',
    'No painel educativo, homologue a conclusão da política de Rolling Update.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó líder com hostname'],
    ['readRollingPolicy','Ler política em rolling-update-politica.txt'],
    ['checkClusterUpdates','Verificar pacotes pendentes com cluster-updates-check'],
    ['applyWorkerUpdate','Atualizar nó worker primeiro com cluster-update-apply'],
    ['applyLeaderUpdate','Atualizar nó líder com cluster-update-apply'],
    ['auditClusterVersions','Auditar consistência com cluster-version-audit'],
    ['validateRollingUpdate','Homologar política de atualização no painel']
  ],
  hints:[
    'O comando cluster-updates-check examina os repositórios oficiais e lista o changelog disponível.',
    'Aplique a flag --rolling no primeiro comando cluster-update-apply apontando para ns8-worker-02.',
    'Finalize com cluster-version-audit para certificar que ambos os nós alcançaram a paridade de versão.'
  ],
  testking:[
    q('n57-order','Ordem Mandatória de Atualização','Qual é a sequência recomendada para aplicar patches de sistema em um cluster NS8 multi-nó?',0,
      ['Atualizar primeiramente os nós workers (secundários) e finalizar com o nó líder',
       'Atualizar o nó líder no meio do expediente sem avisar a equipe de suporte',
       'Desconectar todos os servidores da tomada e esperar que os pacotes se atualizem por gravidade'],
      ['Exato! Preserva a estabilidade do plano de controle enquanto os nós de processamento são atualizados.',
       'Atualizar o líder primeiro interrompe a coordenação das filas e bloqueia a administração.',
       'Atualizações de software exigem execução de comandos e fluxo de dados controlado.'],
      'É o capitão do navio: ele garante que toda a tripulação colocou o colete salva-vidas antes de vestir o seu.'
    ),
    q('n57-rolling','Vantagem do Rolling Update','Por que adotar Rolling Update em vez de atualização massiva e simultânea?',1,
      ['Porque o processo gasta mais internet e ocupa a equipe por mais tempo',
       'Porque mantém a disponibilidade dos serviços web e mitiga riscos de parada total em caso de defeito no pacote',
       'Porque o NethServer 8 proíbe que dois servidores fiquem ligados na mesma sala'],
      ['O objetivo da engenharia é a eficiência e confiabilidade, não gastar recursos inutilmente.',
       'Correto! O tráfego de usuários continua sendo atendido pelos nós que não estão sendo reiniciados.',
       'Servidores de cluster são construídos especificamente para cooperar no mesmo datacenter.'],
      'É a reforma de uma avenida de duas faixas: asfalta-se uma pista enquanto o trânsito flui normalmente pela outra.'
    ),
    q('n57-audit','Auditoria Pós-Atualização','Qual é a importância do comando cluster-version-audit após o término dos updates?',2,
      ['Para imprimir certificados em papel cartão para todos os funcionários',
       'Para alterar a senha do usuário root sem registrar no cofre',
       'Para garantir que nenhum nó ficou com pacotes desatualizados ou com esquemas de banco divergentes'],
      ['Auditorias de versão são ferramentas de diagnóstico operacional de infraestrutura.',
       'Senhas de administração não devem ser alteradas arbitrariamente durante auditorias de versão.',
       'Correto! A consistência de versões garante que todas as chamadas de API e volumes sejam compatíveis.'],
      'É a contagem final dos passageiros antes do avião decolar: garante que ninguém ficou para trás.'
    )
  ],
  decisionPrompt:'Durante uma janela de manutenção, a gerência sugere atualizar todos os servidores simultaneamente para terminar mais rápido. Como você se posiciona?',
  decisions:[
    {id:'accept-rush',label:'Aceitar a pressa e disparar a atualização simultânea em todos os nós',correct:false,consequence:'Risco severo de indisponibilidade geral caso um pacote contenha incompatibilidade inesperada.'},
    {id:'enforce-rolling',label:'Manter a política de Rolling Update: worker primeiro, validação de estabilidade e líder por último',correct:true,consequence:'Excelente postura profissional! A integridade dos dados e o SLA da empresa sempre prevalecem sobre a pressa.'},
    {id:'cancel-all',label:'Cancelar para sempre qualquer atualização de segurança e congelar o sistema',correct:false,consequence:'Postura perigosa que deixa o ambiente vulnerável a ataques e falhas de dia-zero.'}
  ],
  procedure:[
    'Consulte a janela de manutenção aprovada e notifique a equipe de operações.',
    'Efetue a sondagem de atualizações disponíveis nos repositórios oficiais.',
    'Inicie a atualização pelo nó worker utilizando modo rolling progressivo.',
    'Audite a saúde dos containers e serviços no nó worker após o reboot.',
    'Execute a atualização do nó líder e aguarde a re-sincronização do plano de controle.',
    'Rode a auditoria de paridade de versão e certifique que o cluster está 100% atualizado.'
  ],
  validation:'Evidência: pacotes inspecionados, nó worker atualizado sem indisponibilidade, nó líder atualizado com sucesso, paridade na versão 2.4.1 confirmada em cluster-version-audit e procedimento homologado.',
  challenge:'Documente o changelog dos pacotes atualizados, o tempo de transição do worker e a confirmação de que os serviços permaneceram responsivos.',
  diaryPlaceholder:'Janela de manutenção J-109 executada; worker ns8-worker-02 atualizado primeiro; líder atualizado em seguida; versão 2.4.1 sincronizada...',
  closing:'Você aplicou com perfeição as melhores práticas corporativas de Rolling Updates e governança de patches. Na próxima missão, implantará observabilidade avançada com métricas Prometheus e alertas proativos!',
  sources:[['Software Updates & Governance',docs+'administrator-manual/updates/'],['Cluster Rolling Updates',docs+'administrator-manual/cluster/#rolling-updates']]
};
