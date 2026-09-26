> **Jogar online:** https://antignanirodrigo.github.io/diario-admin-jr-nethserver8/  
> Parte da coleção [Diário de um Admin Jr.](https://antignanirodrigo.github.io/diario-admin-jr/)

# Diário de um Admin Jr. — NethServer 8

Protótipo das primeiras vinte e seis aulas, baseado no projeto INTERATIVO indicado pelo autor em http://127.0.0.1:4173/. O curso Linux original permanece separado.

## Abrir

Execute `INICIAR_CURSO.cmd` e abra http://127.0.0.1:4174/. O lançador usa Python instalado, verifica se a porta está livre e inicia o servidor apenas em 127.0.0.1. Nenhum serviço é exposto à rede. Para encerrar, feche a janela do servidor.

Alternativa: na pasta deste curso, execute `python -m http.server 4174 --bind 127.0.0.1`. Não abra o HTML por file://: a aplicação usa módulos JavaScript.

## Conteúdo entregue

1. Papel do NS8 e avaliação da base: rejeição de LXC/servidor reaproveitado e seleção de VM limpa.
2. Nó, cluster, aplicação e container: mapa interativo e ensaio de desligamento do único nó.
3. Orientação e SSH: identificar sessão no host errado, entrar no alvo e ler o procedimento.
4. Rede e DNS: investigar IP/rota/resolvedor/horário, corrigir registro A e repetir DNS/HTTP.
5. Investigação do inventário: comparar cinco documentos, corrigir doze campos e diagnóstico, receber feedback específico e baixar o inventário validado.

6. Requisitos e distribuição: medir a VM entregue, diagnosticar insuficiência, selecionar perfil didático aprovado e repetir medições antes da validação.
7. Preparação da rede: trocar DHCP por perfil estático aprovado, com DNS externo, FQDN e saída HTTPS testados antes e depois.
8. Instalação e primeiro acesso: simular instalação padrão, reboot, status e Cluster Admin acessível sem declarar cluster criado.
9. Criação do cluster: escolher Create cluster, validar FQDN do líder, VPN CIDR e limite de nó único.
10. Entrega inicial segura: trocar senha padrão, fechar checklist e registrar pendências sem expor segredo.
11. Navegação e inventário: mapear Cluster Admin, nós, aplicações, domínios e configurações sem criar mudança.
12. Software Center: selecionar somente a aplicação piloto autorizada, instalar instância simulada e validar status.
13. Rotas e TLS: corrigir rota HTTP de `docs.lab.example` para `docs1` e testar HTTPS.
14. Logs e tarefas: acompanhar tarefa running, ler log, concluir operação e validar HTTP antes de encerrar incidente.
15. Atualizações: planejar janela, ler escopo, executar atualização simulada e validar serviço depois.
16. Identidade: separar usuário, grupo, domínio e provedor antes de criar contas.
17. Planejamento AD/LDAP/Samba: escolher Samba AD de laboratório com DNS, horário e nomes coerentes.
18. Domínio Samba: criar domínio educativo `aurora.lab`, validar status e registro SRV, sem ingressar estação ainda.
19. Join de estação: validar DNS, horário, descoberta do domínio e ingresso simulado de `win10-lab`.
20. Incidente de autenticação: resolver login de Bruno corrigindo DNS do cliente sem resetar senha.
21. Planejamento de armazenamento: escolher volume, dono do dado e crescimento antes de criar a pasta.
22. Compartilhamento financeiro: criar share Samba com grupo correto, teste positivo e teste negativo.
23. ACLs e matriz de acesso: transformar regra de negócio em financeiro RW, diretoria R e suporte sem acesso.
24. Acesso negado: corrigir Carla no grupo financeiro sem abrir ACL para Everyone.
25. Entrega prática do servidor de arquivos: validar usuários, negação, backup e restore drill.
26. Seleção de aplicação: escolher Nextcloud piloto por necessidade e dependências, sem instalar ainda.

Cada missão contém chamado, crônica fictícia do Sênior, conceitos e analogias, recall, passos marcáveis, laboratório, três questões autorais com feedback individual, decisão, procedimento, validação, retorno, diário e cartão Anki. Cada uma das vinte e seis missões tem duas pranchas de seis quadros: contexto/conceitos e prática/validação. Total: cinquenta e duas pranchas e setenta e oito questões.

## Interações e limites

- Painéis educativos próprios: não são cópias exatas da interface NS8.
- Terminal local simulado, com comandos e argumentos limitados a `help`; nenhum comando é enviado ao computador ou a um NS8 real.
- As marcações de leitura não liberam objetivos práticos. A conclusão exige evidências, três questões dominadas, decisão correta e diário com pelo menos 12 caracteres em cada campo. A avaliação do diário verifica preenchimento, não qualidade semântica.
- Progresso persistido neste navegador, em chave exclusiva `diario-admin-jr-ns8-progress`. Não há conta ou sincronização. Reiniciar missão apaga o exercício atual, preservando XP já conquistado e evitando duplicação.
- Cartão Anki: arquivo de texto UTF-8 com frente e verso separados por tabulação. Importe no Anki como nota Básico, delimitador Tabulação.
- SSH omite autenticação e verificação de chave. Em um acesso real, esses passos são indispensáveis.
- DNS é aplicado imediatamente, sem caches/TTL. HTTP supõe certificado de CA de laboratório confiável. lab.example é um domínio de exemplo privado, não um domínio público para emissão de certificado.
- Religar o nó sempre restaura o serviço no exercício. Recuperação real pode exigir etapas adicionais. O cenário não demonstra HA nem failover.
- Os procedimentos foram conferidos em documentação oficial, mas não executados contra NS8 real nesta produção. As fontes estão no rodapé de cada aula.
- As demais 34 aulas estão apenas planejadas em PLANO_CURSO.md e não são parte do protótipo.

## Validação

Na pasta do curso: `npm.cmd test`. Os testes verificam caminhos de sucesso e falha, evidências, bloqueio de alteração DNS prematura, rollback, sessão no host errado, preservação de estado, XP único, atualização planejada, mapa de identidade, plano AD/LDAP/Samba e domínio Samba educativo.

A estrutura visual e o código-base de navegação foram reaproveitados de INTERATIVO; conteúdo e simulador NS8 são próprios. As pranchas foram criadas com ImageGen integrado; os prompts estão em assets/prompts.txt, assets/prompts-segundas-pranchas.md, assets/prompts-aula-6.md, assets/prompts-aulas-7-10.md, assets/prompts-aulas-11-14.md, assets/prompts-aulas-15-18.md, assets/prompts-aulas-19-22.md e assets/prompts-aulas-23-26.md. As notas abaixo de cada prancha explicam diferenças entre exemplos ilustrativos e valores usados no laboratório.

## Revisão de 15/09/2026

A aula 5 foi recriada. Ler o pedido não basta: é necessário conferir rascunho, rede, VM e escopo, reconciliar os campos e preparar o documento para download. Editar campos ou restaurar o rascunho invalida a aprovação. O arquivo contém fontes e o estado instalação pendente.

Quem concluiu a versão antiga deve demonstrar a nova prática, com XP anterior preservado. A cópia anterior do exercício fica em previousMission5 no armazenamento local. Prompts das seis novas imagens: assets/prompts-segundas-pranchas.md; geração pelo ImageGen integrado.
