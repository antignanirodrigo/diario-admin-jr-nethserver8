# Validação atual — 16/09/2026

- Vinte e seis aulas; setenta e oito questões; cinquenta e duas pranchas (duas por aula).
- Aulas 23–26: matriz de ACLs, acesso negado por grupo ausente, entrega prática do servidor de arquivos e seleção de aplicação piloto. Fluxos práticos bloqueiam ACL sem matriz, correção errada por Everyone, entrega sem restore drill e instalação de aplicação antes da seleção.
- Trinta e dois testes automatizados aprovados após o lote de quatro aulas.
- Aulas 19–22: join de estação, incidente de autenticação, planejamento de armazenamento e criação de compartilhamento financeiro. Fluxos práticos bloqueiam join sem pré-checagem, reset de senha sem diagnóstico, share sem plano de volume e permissão ampla sem teste negativo.
- Aulas 15–18: atualização planejada, conceitos de identidade, planejamento AD/LDAP/Samba e domínio Samba educativo. Fluxos práticos bloqueiam atualização sem janela, mapeamento conceitual errado, plano de identidade divergente e criação de domínio com nomes fora do aprovado.
- Aulas 11–14: inventário do Cluster Admin, Software Center educativo, rotas/TLS e logs/tarefas. Fluxos práticos bloqueiam instalação fora de escopo, rota sem investigação e encerramento sem tarefa/log/HTTP.
- Aulas 7–10: rede da VM, instalação e primeiro acesso, criação do cluster e entrega inicial segura. Fluxos práticos têm bloqueios contra pular evidências: DHCP não libera instalação, primeiro acesso não vira cluster criado, Join/Restore são rejeitados no primeiro cluster, checklist exige troca da senha padrão.
- Aula 6: requisitos, entrega, cinco medições iniciais e finais, diagnóstico, perfil didático, validação e restauração. Doze testes automatizados aprovados. Fluxo completo da aula 6 testado no navegador em origem separada: bloqueio sem evidências, investigação, perfil, novas medições, questões, decisão, diário e conclusão persistida após recarregar.
- Doze imagens e os dois novos módulos retornam HTTP 200; ambas as pranchas da aula 6 carregam com largura natural 1536 pixels.
- Aula 5: cinco documentos, doze campos e diagnóstico, erros por campo, exportação TXT, invalidação ao editar e restauração de rascunho.
- A suíte preserva as verificações de documentos, rejeição campo a campo, exportação, restauração e rejeição de snapshots antigos da aula 5.
- Fluxo no navegador localhost (origem separada do progresso do usuário): coletar evidências, validar rascunho errado, corrigir, exportar, responder questões, decisão e diário, concluir e recarregar. Conclusão persistida.
- Duas imagens da aula 5 carregadas (1536×1024); ampliação verificada no navegador. Seis novas imagens inspecionadas. Segunda prancha da aula 1 corrigida para remover distribuições não previstas e afirmação de isolamento completo.
- A revisão anterior da aula 5 exige nova demonstração sem duplicação de XP.
- Sem execução em NS8 real; diário validado por preenchimento, não por semântica. Não houve auditoria exaustiva de acessibilidade ou responsividade nesta revisão.

## Histórico das revisões anteriores

# Validação do protótipo — 14/09/2026

- Quatro missões completas no escopo educativo, 12 questões originais e quatro pranchas raster.
- Oito testes automatizados aprovados: conteúdo e renderização do painel, rejeição de base inadequada, mapa e perda de nó, orientação no host errado, alteração DNS com pré-condições e novos testes, rejeição de comandos fora do escopo, restauração isolada por missão e XP único.
- JavaScript de aplicação, simulador, conteúdo e painel verificado sintaticamente.
- Serviço local limitado a 127.0.0.1:4174; página inicial e recursos locais verificados por HTTP.
- Quatro pranchas inspecionadas visualmente; ressalvas registradas no controle geral de auditoria e nas notas das próprias aulas.
- Não foi executada auditoria de interação ou responsividade em navegador nesta entrega. O visual e as regras responsivas partem do projeto INTERATIVO indicado pelo autor.
- Não houve instalação, autenticação, comandos ou mudanças em um NS8 real. Os resultados simulados são propositalmente limitados e essas simplificações estão descritas nas aulas.
- O preenchimento do diário é verificado por tamanho mínimo, sem avaliação semântica. O protótipo não é uma prova certificadora.

O curso completo de 60 aulas não está concluído: esta entrega cobre somente o protótipo solicitado das aulas 01–04.

---

# Validação — Missão 05 adicionada em 14/09/2026 (mesma sessão, continuação)

- Quinta missão completa no escopo educativo (inventário de implantação: host/FQDN, rede e capacidade),
  3 questões originais adicionais (total agora 15 questões nas 5 missões).
- Suíte de testes: `npm test` → 9/9 aprovados (8 anteriores + 1 novo teste dedicado à Missão 05: bloqueia
  inventário antes de ler o pedido, rejeita combinação de campos divergente, aceita a combinação correta
  só depois da leitura, e invalida a conclusão se os campos forem alterados para valores incorretos depois
  de já terem sido validados).
- Verificação end-to-end manual no navegador (não só teste automatizado): terminal simulado (whoami,
  hostname, cat pedido-inventario.txt), painel de inventário (3 selects + validação), 3 quizzes, decisão
  técnica e diário — fluxo completo até "Missão concluída · +170 XP" confirmado, depois `localStorage`
  limpo para não deixar progresso de teste gravado no navegador do usuário.
- **Pendência conhecida:** a Missão 05 não tem prancha (`assets/aula-5.png` não existe). O código já trata
  isso (`missions[5].images = []`), mostrando a nota "Prancha desta missão ainda não produzida" em vez de
  uma imagem quebrada. Gerar a arte quando houver acesso a ferramenta de imagem (o README explica que as
  pranchas 01–04 foram feitas com ImageGen do GPT, fora desta sessão).
- Textos fixos de contagem atualizados: `index.html` (título/meta), `js/app.js` (texto "Cinco missões" e
  "15 questões"), `README.md` (item 5 na lista de conteúdo entregue), `tests/course.test.js` (assert de
  5 missões).
- Faltam 55 aulas do plano de 60 (`PLANO_CURSO.md`) — próxima é a Missão 06, que fecha o Módulo 1 e abre o
  Módulo 2 (Primeira implantação: requisitos e escolha da distribuição suportada).

---

# Validação — Reescrita da Missão 05 (mesma sessão, 15/09/2026) + correção de regressão

**Contexto:** Rodrigo revisou a Missão 05 anterior e apontou 4 problemas reais (inventário incompleto — só
validava 3 de ~8 campos necessários; pouca investigação nova; feedback genérico ao errar; continuidade
desatualizada na Aula 4). Outro agente (ficou sem créditos de API no meio do trabalho) reescreveu a
Missão 05 quase por completo nesse meio-tempo — novo módulo `js/inventory.js` + `data/mission5.js`.

**Conferido que os 4 pontos foram resolvidos:**
1. Inventário agora tem **12 campos** (hostname, FQDN, IP, prefixo, gateway, DNS, SO, vCPU, RAM, disco,
   responsável, aplicações) contra 3 fontes aprovadas simuladas (`rede-aprovada.txt`, `vm-aprovada.txt`,
   `escopo.txt`) mais um rascunho desatualizado (`rascunho.txt`) que o aluno precisa reconciliar.
2. Prática real: 5 arquivos pra ler e comparar, divergências reais em IP (.99 vs .10), DNS (127.0.0.1 vs
   .53), disco (40GB vs 80GB), responsável/aplicações ausentes — não é mais só reafirmar o que já sabia.
3. Feedback por campo: `validateInventory()` retorna mensagem nomeando o campo E o arquivo-fonte
   (ex.: "Resolvedor DNS externo: diverge da fonte aprovada. Confira rede-aprovada.txt."), com destaque
   visual (borda vermelha) por campo — **verificado ao vivo no navegador**.
4. Continuidade: fechamento da Aula 4 corrigido — agora referencia a Aula 5 em vez de afirmar que o
   protótipo termina ali.
5. Exportação: botão "Baixar inventário validado (.txt)" gera arquivo com fontes, divergências corrigidas
   e status "instalação pendente" — implementado, ainda não clicado/baixado nesta verificação (a lógica
   de geração foi conferida por leitura de código e pelos testes automatizados).

**Regressão encontrada e corrigida por mim:** o loop genérico em `data/missions.js` passou a exigir
**2 pranchas por missão** (`aula-N.png` + `aula-N-p2.png`) para as 5 missões — mas só existem os 4 PNGs
originais (1 por missão, aulas 1-4), nenhum "-p2" e nada pra Missão 5. Isso causava ícone de imagem
quebrada em: prancha 2 das Missões 01-04, e ambas as pranchas da Missão 05. Rodrigo confirmou que o agente
responsável ficou sem créditos no meio da geração dessas imagens — ou seja, a estrutura de código está
correta/intencional, só faltam os arquivos.

**Fix aplicado (não reverte a estrutura de 2 pranchas, só torna a ausência graciosa):** `onerror` no
`<img>` (`js/app.js`) substitui a imagem quebrada por um placeholder "Prancha N ainda não gerada"
(`.comic-missing` em `styles.css`, padrão hachurado, mesmas proporções). Quando as pranchas -p2 e as duas
da Missão 05 forem geradas (retomando de onde a outra sessão parou), elas aparecem automaticamente sem
precisar mexer no código de novo.

**Testes:** `npm test` → 11/11 (inalterado, o fix de imagem é client-side/visual, não afeta a suíte).
**Verificação ao vivo:** Missão 01 (prancha 1 real + prancha 2 placeholder) e Missão 05 (duas placeholders
+ painel de 12 campos + erro por campo demonstrado) conferidos no navegador; `localStorage` limpo depois.

**Avaliação de Rodrigo sobre a versão anterior:** "aprovada como rascunho de revisão, ainda não como aula
final". Com a reescrita + o fix de imagem, os 4 pontos que ele levantou estão endereçados. Pendência que
ele mesmo já esperava: pranchas ainda não existem (nem a p2 das 1-4, nem as duas da 05) — arte fica para
quando a geração de imagem for retomada.
