const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';
export const mission23={
 id:23,xp:360,level:'ACLs e matriz de acesso · 55-70 min',title:'Quem pode ler, gravar ou ficar fora?',
 summary:'Transforme pedido de negócio em matriz de acesso antes de mexer em permissões finas.',
 call:'CH-NS8-023 · O financeiro quer liberar leitura para a diretoria, escrita para financeiro e nenhum acesso para suporte. O chamado autoriza montar a matriz e aplicar ACL simulada no compartilhamento financeiro.',
 impact:'Permissão sem matriz vira opinião. Um acesso amplo demais vaza informação; estreito demais trava a rotina e cria exceções escondidas.',
 senior:'O Júnior abriu a aba avançada de permissões sem escrever a matriz. O Sênior puxou uma folha e desenhou três colunas: grupo, leitura e escrita. “ACL não é decoração; é contrato.” Na Aurora fictícia, a permissão só foi aplicada depois que cada grupo teve um resultado esperado.',
 concept:'ACLs permitem permissões mais detalhadas do que uma regra simples de grupo principal. Antes de aplicar, defina quem lê, quem grava e quem não acessa. A matriz precisa ser testável com usuários representativos. Nesta aula, financeiro grava, diretoria lê e suporte é negado.',
 example:'Você lê cat matriz-acesso.txt, consulta group-list financeiro, group-list diretoria e acl-status financeiro. No painel, configura financeiro RW, diretoria R e suporte none. Depois valida a matriz.',
 glossary:[['ACL','Lista de controle de acesso','Tabela de quem tem qual chave.'],['RW','Leitura e gravação','Pode abrir e alterar.'],['R','Somente leitura','Pode consultar, não alterar.'],['None','Sem acesso','A porta deve negar.']],
 recall:{question:'Por que montar matriz antes de clicar em ACL?',answer:'Porque a matriz transforma pedido de negócio em expectativa testável. Sem ela, permissões viram tentativas isoladas.'},
 labIntro:'Onde executar: terminal e painel educativo de ACLs. A mudança é simulada e não altera servidor real.',
 labSteps:['Execute whoami, hostname, cat matriz-acesso.txt, group-list financeiro, group-list diretoria e acl-status financeiro.', 'No painel, defina financeiro RW, diretoria R e suporte sem acesso.', 'Valide a matriz antes de qualquer teste de usuário.', 'Registre que a próxima aula investigará um acesso negado realista.'],
 objectives:[['identity','Confirmar operador'],['host','Confirmar nó'],['aclMatrix','Ler matriz'],['financeGroup','Conferir grupo financeiro'],['boardGroup','Conferir grupo diretoria'],['aclStatus','Conferir ACL atual'],['aclMapped','Aplicar matriz correta'],['aclVerified','Validar matriz']],
 hints:['Financeiro grava; diretoria lê; suporte fica fora.', 'ACL atual ainda não tem diretoria como leitura.', 'Não use Everyone para simplificar.'],
 testking:[q('n23-matrix','Matriz','O que uma matriz de acesso define?',0,['Quem lê, grava ou fica sem acesso','O endereço IP do gateway','A cor do painel'],['Esse é o contrato de permissão.','Rede não define permissão.','Visual não controla arquivo.'],'É a planta das chaves.'),q('n23-rw','Financeiro','Qual permissão cabe ao grupo financeiro?',2,['Sem acesso','Somente leitura','Leitura e gravação'],['Não atenderia o dono do dado.','Financeiro precisa editar seus documentos.','É o grupo dono do compartilhamento.'],'Dono da sala pode trabalhar nela.'),q('n23-testable','Testável','Por que usar grupos representativos?',1,['Para decorar nomes','Para testar resultados esperados','Para evitar auditoria'],['Memória falha.','Cada grupo prova uma regra.','Auditoria fica mais fácil, não dispensável.'],'Uma chave para cada tipo de porta.')],
 decisionPrompt:'Como aplicar ACL sem virar tentativa?',
 decisions:[{id:'everyone',label:'Dar acesso para todos e ajustar depois',correct:false,consequence:'Você criou risco de vazamento.'},{id:'matrix',label:'Aplicar matriz: financeiro RW, diretoria R, suporte sem acesso',correct:true,consequence:'A permissão ficou testável.'},{id:'admins',label:'Manter só admins com acesso',correct:false,consequence:'As áreas solicitantes ficam bloqueadas.'}],
 procedure:['Colete dono do dado e grupos envolvidos.', 'Monte matriz R/RW/sem acesso.', 'Aplique permissão mínima compatível.', 'Teste usuários de cada grupo.', 'Registre exceções e revise periodicamente.'],
 validation:'Evidência: matriz lida, grupos consultados, ACL inicial vista e matriz correta aplicada. Retorno: limpar ACL no painel invalida a validação.',
 challenge:'Escreva uma matriz com três grupos e explique o que cada teste deverá provar.',
 diaryPlaceholder:'financeiro RW; diretoria R; suporte none; matriz validada antes dos testes...',
 closing:'Você transformou permissão em contrato. Agora vai investigar por que um usuário autorizado ainda recebe acesso negado.',
 sources:[['Samba file server e permissões',docs+'applications/file_server']]
};
