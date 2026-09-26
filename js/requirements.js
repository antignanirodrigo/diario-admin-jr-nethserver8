export const requirementCommands=['cat requisitos.txt','cat entrega.txt','cat /etc/os-release','uname -m','nproc','free -h','lsblk -d -o NAME,SIZE'];
export const measurements=['os','arch','cpu','ram','disk'];
export function requirementCommand(sim,line){
  const corrected=sim.lab.profile==='approved';
  const data={
    'cat requisitos.txt':['requirements','Referência NS8 (15/09/2026): x86_64; mínimo 2 vCPU, 2 GB RAM, 40 GB SSD. Base limpa. Rocky Linux 9 e Debian 13 compatíveis. LXC não suportado.\nPlano Aurora: VM limpa Rocky Linux 9, 4 vCPU, 8 GB RAM, disco 80 GB em SSD. É uma escolha do laboratório, não dimensionamento de produção.'],
    'cat entrega.txt':['delivery','CH-NS8-006 — ns8-prep-01 é uma nova VM vazia de preparação, separada dos cenários anteriores. Sem aplicações ou NS8.\nRelatório do hypervisor: VM x86_64; Rocky Linux 9 limpo; backend SSD; perfil entregue 1 vCPU / 1 GB RAM / 20 GB.\nAutorizado no exercício: selecionar perfil corrigido 4 / 8 / 80, após registrar diagnóstico. Instalação pendente.'],
    'cat /etc/os-release':['os','NAME="Rocky Linux"\nVERSION="9.6 (Blue Onyx)"\nID="rocky"\nVERSION_ID="9.6"\n[Imagem didática Rocky 9; não indica a versão de manutenção mais recente.]'],
    'uname -m':['arch','x86_64'],
    'nproc':['cpu',corrected?'4':'1'],
    'free -h':['ram',corrected?'               total    used    free   shared  buff/cache  available\nMem:           7.7Gi   410Mi   6.9Gi     8Mi       400Mi      7.0Gi\nSwap:          4.0Gi      0B   4.0Gi':'               total    used    free   shared  buff/cache  available\nMem:           960Mi   410Mi   250Mi     8Mi       300Mi      400Mi\nSwap:          4.0Gi      0B   4.0Gi'],
    'lsblk -d -o NAME,SIZE':['disk',corrected?'NAME SIZE\nsda   80G':'NAME SIZE\nsda   20G']
  };
  if(!data[line])return null;
  const [flag,output]=data[line];
  sim.flags[measurements.includes(flag)?(corrected?'after_':'before_')+flag:flag]=true;
  return {output,error:false};
}
export function requirementAction(sim,action,values){
  if(action==='profile-reset'){
    sim.lab.profile='delivered';sim.flags.profile=false;sim.flags.verified=false;
    for(const k of measurements)sim.flags['after_'+k]=false;
    return 'Perfil inicial restaurado. Repita a seleção e as medições finais; leituras iniciais preservadas.';
  }
  if(action==='profile'){
    if(!['identity','host','requirements','delivery',...measurements.map(k=>'before_'+k)].every(k=>sim.flags[k]))return 'Confirme a sessão, leia os dois documentos e colete as cinco medições iniciais antes de selecionar o perfil.';
    if(values.diagnosis!=='resources')return 'Diagnóstico incorreto: Rocky Linux 9 e x86_64 são compatíveis. CPU, RAM e disco entregues estão abaixo do mínimo e do plano.';
    sim.lab.profile='approved';sim.flags.profile=true;sim.flags.verified=false;
    for(const k of measurements)sim.flags['after_'+k]=false;
    return 'Perfil da VM vazia trocado somente na simulação: 4 vCPU, 8 GB, 80 GB. Repita os cinco comandos de medição e valide. Não representa redimensionamento de disco ou instalação real.';
  }
  if(action==='requirements-validate'){
    sim.flags.verified=Boolean(sim.flags.profile&&sim.lab.profile==='approved'&&measurements.every(k=>sim.flags['after_'+k]));
    return sim.flags.verified?'Base e recursos conferidos contra o plano. Instalação pendente; rede e preparação operacional serão tratadas na aula 7.':'Validação pendente: selecione o perfil aprovado após o diagnóstico e repita as cinco medições.';
  }
  return null;
}
