const q=(id,title,question,right,options,reasons,analogy)=>({id,title,question,choices:options.map((text,i)=>({id:String(i),text,correct:i===right,why:`${reasons[i]} 💡 Analogia do Sênior: ${analogy}`}))});
const docs='https://docs.nethserver.org/docs/administrator-manual/';

export const mission37={
  id:37,xp:460,level:'Resiliência e Continuidade · 60-75 min',title:'Repositório de backup e segredos de criptografia',
  summary:'Cadastre o repositório S3 remoto no Cluster Admin, proteja a chave-mestra e inicialize o cofre criptografado.',
  call:'CH-NS8-037 · O endpoint de armazenamento remoto da Aurora está disponível no bucket s3://aurora-backups/ns8. O Júnior deve cadastrar o destino no painel do NethServer 8, configurar as credenciais com privilégios mínimos (Access Key / Secret Key), definir a senha de criptografia de ponta a ponta e inicializar o repositório.',
  impact:'Perder a chave de criptografia do Restic torna impossível restaurar qualquer dado, mesmo que o bucket na nuvem esteja 100% intacto. Anotar senhas em texto puro no servidor atrai vazamentos graves.',
  senior:'O Sênior arrancou um bilhete colado na lateral da baia do Júnior e ergueu os óculos: "Júnior, a criptografia do Restic é em repouso e cliente-side. Nem o provedor do S3 consegue ler o que está dentro das caixas. Mas isso tem um preço alto: não existe botão Esqueci minha senha no Restic. Se perder essa passphrase, nem a Nethesis, nem a Teseo, nem a NASA recuperam seus arquivos. Guarde-a no cofre da empresa imediatamente."',
  concept:'Ao configurar um repositório remoto no NethServer 8 (seja S3-compatible, MinIO, AWS ou SFTP), o Restic executa a inicialização (restic init) criando a estrutura de diretórios e arquivos de configuração (config, keys, snapshots, data, index). Todas as informações são criptografadas antes de trafegar pela rede via TLS, utilizando cifras simétricas AES-256 ou ChaCha20-Poly1305. A autenticação com o bucket deve usar um usuário de serviço com privilégios restritos apenas ao bucket de backup.',
  example:'No laboratório, você revisa as credenciais com cat repo-credenciais-plano.txt, testa o canal com backup-repo-test s3://aurora-backups/ns8, inicializa o repositório com backup-repo-init e valida a integridade inicial com backup-repo-status.',
  glossary:[['Access Key / Secret Key','Par de chaves de API para autenticação em S3','O crachá e a senha biométrica para entrar no depósito terceirizado.'],['Client-Side Encryption','Criptografia realizada no host antes do envio','Trancar os documentos com segredo próprio antes de entregar o envelope para a transportadora.'],['Passphrase Restic','Senha mestra que decifra as chaves do cofre','A chave do cofre de aço onde estão os contratos originais.'],['restic init','Comando que formata e prepara o repositório','Instalar a fechadura e os escaninhos no armário vazio.']],
  recall:{question:'O que ocorre com os dados gravados em um repositório S3 se um invasor tiver acesso às chaves Access Key e Secret Key do bucket, mas não tiver a passphrase do Restic?',answer:'O invasor só verá arquivos binários indecifráveis em blocos criptografados com AES-256. Ele pode apagar os dados (se não houver política de bloqueio WORM/Object Lock), mas não conseguirá ler nenhum documento ou banco de dados.'},
  labIntro:'Onde executar: terminal simulado e módulo de configuração de repositórios do Cluster Admin.',
  labSteps:[
    'Execute whoami e hostname para confirmar o nó de gerência.',
    'Execute cat repo-credenciais-plano.txt para inspecionar os parâmetros de autenticação.',
    'Execute backup-repo-test s3://aurora-backups/ns8 para testar o endpoint e certificado.',
    'Execute backup-repo-init para inicializar o repositório Restic com cifragem AES-256.',
    'Execute backup-repo-status para auditar o repositório conectado e livre de locks.',
    'No painel educativo, confirme a retenção das credenciais no cofre e valide a entrega.'
  ],
  objectives:[
    ['identity','Confirmar operador com whoami'],
    ['host','Confirmar nó com hostname'],
    ['readRepoPlan','Ler escopo em repo-credenciais-plano.txt'],
    ['testRepoTarget','Testar conectividade com backup-repo-test'],
    ['initBackupRepo','Inicializar repositório com backup-repo-init'],
    ['checkRepoStatus','Validar repositório com backup-repo-status'],
    ['repoConfigVerified','Homologar repositório no painel educativo']
  ],
  hints:[
    'Utilize cat repo-credenciais-plano.txt para obter os parâmetros autorizados.',
    'Execute backup-repo-test para verificar se as portas e certificados TLS do S3 respondem.',
    'Inicialize com backup-repo-init e depois verifique o status com backup-repo-status.'
  ],
  testking:[
    q('n37-crypto','Criptografia Client-Side','O que significa dizer que o backup do NS8 com Restic possui criptografia client-side?',0,
      ['Os dados são cifrados pelo próprio NS8 antes de serem enviados pela rede ao destino',
       'O cliente do navegador web do usuário final é responsável por compactar os arquivos',
       'O provedor de nuvem criptografa os dados apenas depois de recebê-los sem senha'],
      ['Correto! A cifra é aplicada localmente na máquina de origem; o destino só recebe blocos indecifráveis.',
       'A criptografia é executada pelo subsistema do cluster no host, não na aba do navegador do usuário.',
       'Criptografia feita apenas pelo provedor após recepção (server-side) deixaria os dados legíveis em trânsito.'],
      'É lacrar e soldar uma caixa de aço na sua fábrica antes de colocá-la na carroceria do caminhão de frete.'
    ),
    q('n37-keyloss','Perda da Chave Mestra','Qual é a consequência de perder a passphrase do repositório Restic do NethServer 8?',2,
      ['O cluster pode ser reiniciado em modo de recuperação para criar uma nova chave sem perda',
       'Basta abrir um chamado de suporte com a equipe técnica da Nethesis para recuperar os arquivos',
       'A restauração se torna matematicamente impossível, resultando em perda definitiva dos backups'],
      ['O Restic não possui backdoor nem chave mestra de emergência no sistema operacional.',
       'Nem o suporte do sistema nem os desenvolvedores do software possuem cópia das chaves do usuário.',
       'Exato! A criptografia forte garante que sem a senha, os dados armazenados se tornam puro ruído digital.'],
      'Se você jogar a única chave do cofre no fundo do vulcão, não há serralheiro no mundo que abra o aço sem destruir o conteúdo.'
    ),
    q('n37-iam','Privilégios Mínimos no S3','Por que a conta de serviço do NS8 não deve ter permissões administrativas globais na conta de nuvem?',1,
      ['Porque o Restic só funciona se a conta do provedor tiver saldo zerado',
       'Para conter o raio de explosão caso a credencial seja comprometida, limitando o acesso apenas ao bucket de backup',
       'Porque o protocolo S3 exige que o usuário seja anônimo e sem senha para funcionar'],
      ['Saldos ou quotas financeiras não interferem nos algoritmos do protocolo Restic.',
       'Correto! Pelo princípio do menor privilégio, a credencial do cluster só deve poder escrever e ler em seu próprio bucket.',
       'Conexões anônimas sem autenticação são inseguras e rejeitadas em ambientes corporativos sérios.'],
      'Dar ao motorista da van a chave do galpão de encomendas, mas nunca a chave da presidência ou do cofre central.'
    )
  ],
  decisionPrompt:'O desenvolvedor sugere salvar a senha do repositório em um arquivo .txt na raiz / do servidor para facilitar automações de scripts caseiros. Como você responde?',
  decisions:[
    {id:'plaintext',label:'Aceitar a sugestão para agilizar a rotina de manutenção do time',correct:false,consequence:'Falha de segurança crítica! Qualquer usuário ou processo com acesso de leitura na máquina poderá roubar o segredo.'},
    {id:'vault-ns8',label:'Rejeitar o arquivo exposto; armazenar o segredo nos cofres internos do NS8 e cofre corporativo de senhas',correct:true,consequence:'Procedimento aprovado! O NS8 gerencia o segredo com permissões restritas e a equipe preserva a chave em cofre externo seguro.'},
    {id:'disable-crypto',label:'Desabilitar a criptografia do Restic para não precisar gerenciar senhas',correct:false,consequence:'Risco de conformidade grave: backups em nuvem sem criptografia violam a LGPD/GDPR e expõem a empresa a vazamentos.'}
  ],
  procedure:[
    'Crie o bucket dedicado no provedor de armazenamento (ex: MinIO, Wasabi ou AWS S3).',
    'Crie uma política IAM restrita exclusivamente às ações PutObject, GetObject, ListBucket e DeleteObject no bucket.',
    'Gere uma passphrase complexa de ao menos 24 caracteres aleatórios e registre-a no cofre da empresa.',
    'Cadastre o destino no Cluster Admin em Settings > Backup > Add Destination.',
    'Inicialize o repositório e confirme que o status se encontra conectado e íntegro.'
  ],
  validation:'Evidência: endpoint remoto validado, chaves de API restritas aplicadas, repositório Restic inicializado e status do cofre confirmado como ativo e saudável.',
  challenge:'Documente o endpoint do repositório, o protocolo utilizado (S3) e confirme onde a passphrase de recuperação foi guardada.',
  diaryPlaceholder:'Bucket s3://aurora-backups/ns8 inicializado; cifra AES-256; segredo salvo no cofre corporativo...',
  closing:'O repositório remoto está pronto e blindado por criptografia. Na próxima missão, você vai criar tarefas de backup com granularidade por aplicação.',
  sources:[['Backup Repositories',docs+'administrator-manual/backup/#repositories'],['Restic Security','https://restic.readthedocs.io/en/latest/100_references.html#threat-model']]
};
