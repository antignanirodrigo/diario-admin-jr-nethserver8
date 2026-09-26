export const INVENTORY_REVISION = 2;
export const inventoryFields = [
  ['hostname','Hostname','ns8-lab-01','rede-aprovada.txt'],
  ['fqdn','FQDN','ns8-lab-01.lab.example','rede-aprovada.txt'],
  ['ip','IP do nó','192.168.50.10','rede-aprovada.txt'],
  ['prefix','Prefixo','24','rede-aprovada.txt'],
  ['gateway','Gateway','192.168.50.1','rede-aprovada.txt'],
  ['dns','Resolvedor DNS externo','192.168.50.53','rede-aprovada.txt'],
  ['os','Sistema operacional','Rocky Linux 9','vm-aprovada.txt'],
  ['vcpu','vCPU','4','vm-aprovada.txt'],
  ['ram','RAM (GB)','8','vm-aprovada.txt'],
  ['disk','SSD virtual (GB)','80','vm-aprovada.txt'],
  ['owner','Responsável','Equipe de TI Aurora','escopo.txt'],
  ['apps','Aplicações previstas','Samba; Nextcloud','escopo.txt'],
];
export const initialInventory = {
  hostname:'ns8-lab-01',fqdn:'ns8-lab-01.lab.example',ip:'192.168.50.99',prefix:'24',
  gateway:'192.168.50.1',dns:'127.0.0.1',os:'Rocky Linux 9',vcpu:'4',ram:'8',disk:'40',owner:'',apps:'',diagnosis:''
};
export const documents = {
  'pedido-inventario.txt': ['request', 'CH-NS8-005 — Laboratório Aurora\nCompare o rascunho com as fontes aprovadas antes de liberar a instalação.\nLeia rascunho.txt, rede-aprovada.txt, vm-aprovada.txt e escopo.txt.\nO rascunho contém divergências. Corrija o registro, não os sistemas.\nEntrega: inventário revisado, diagnóstico da divergência e documento exportado.\nNenhuma instalação ou mudança de rede está autorizada.'],
  'rascunho.txt':['draftRead','RASCUNHO v0 — NÃO APROVADO\nHost: ns8-lab-01.lab.example\nIP: 192.168.50.99/24\nGateway: 192.168.50.1\nDNS: 127.0.0.1\nRocky Linux 9 | 4 vCPU | 8 GB RAM | 40 GB disco\nResponsável: ausente\nAplicações previstas: ausentes\nOrigem: anotações anteriores à revisão do laboratório.'],
  'rede-aprovada.txt':['networkDoc','REDE v1 — APROVADA PARA LABORATÓRIO\nHostname: ns8-lab-01\nFQDN: ns8-lab-01.lab.example\nIP reservado: 192.168.50.10/24 (estático)\nRede: 192.168.50.0/24\nGateway: 192.168.50.1\nResolvedor externo: 192.168.50.53, independente do NS8\nDNS A corrigido: ns8-lab-01.lab.example -> 192.168.50.10\nEvidência registrada na missão 04; não reconfigurar os serviços.'],
  'vm-aprovada.txt':['vmDoc','VM v1 — BASE APROVADA PARA LABORATÓRIO\nPlataforma: máquina virtual em Proxmox, não LXC\nSistema: Rocky Linux 9 limpo\nvCPU: 4\nRAM: 8 GB\nSSD virtual: 80 GB\nDimensionamento didático; aplicações ainda previstas, não instaladas.\nOs 40 GB do rascunho eram o mínimo de referência, não o disco reservado.'],
  'escopo.txt':['scopeDoc','ESCOPO v1 — AURORA\nAmbiente: laboratório, empresa fictícia\nResponsável: Equipe de TI Aurora\nAplicações previstas: Samba; Nextcloud\nObjetivo: estudar arquivos e colaboração\nSituação: instalação NS8 pendente\nAutorização: revisar documentação e exportar inventário; não instalar.']
};
const normal = value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
export function validateInventory(values) {
  const errors={};
  for(const [key,label,expected,source] of inventoryFields) {
    let valid=normal(values[key])===normal(expected);
    if(key==='apps') valid=JSON.stringify(normal(values[key]).split(/[;,]+/).map(s=>s.trim()).filter(Boolean).sort())===JSON.stringify(['nextcloud','samba']);
    if(!valid) errors[key]=`${label}: ${normal(values[key])?'diverge da fonte aprovada':'não preenchido'}. Confira ${source}.`;
  }
  if(values.diagnosis!=='stale-draft') errors.diagnosis='Compare as versões: os serviços já foram validados; o rascunho conserva valores antigos e omite dados do escopo.';
  return errors;
}
export function inventoryText(values, date=new Date().toISOString()) {
  return ['INVENTÁRIO DE IMPLANTAÇÃO — AURORA','Ambiente: laboratório educativo','Revisão: 2',`Gerado em: ${date}`,'',...inventoryFields.map(([key,label])=>`${label}: ${values[key]}`),'Rede: 192.168.50.0/24','IP estático: planejado conforme reserva aprovada','', 'Divergências corrigidas no documento:', '- IP antigo .99 substituído pelo reservado .10.', '- DNS do próprio nó substituído pelo resolvedor externo aprovado.', '- Disco de referência 40 GB corrigido para os 80 GB reservados.', '- Responsável e aplicações previstas incluídos.', '', 'Fontes do exercício: rede-aprovada.txt; vm-aprovada.txt; escopo.txt.', 'Instalação: PENDENTE. Aplicações: PREVISTAS, não instaladas.', 'Limite: documento gerado a partir de evidências simuladas; não comprova infraestrutura real.', 'Próxima etapa: revisar pré-requisitos e a janela de instalação.'].join('\n');
}
