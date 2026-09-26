# Diário de um Admin Jr. — NethServer 8

Status: protótipo interativo das aulas 01–05 produzido em 14/09/2026, disponível localmente em http://127.0.0.1:4174/. Referência confirmada pelo autor: http://127.0.0.1:4173/, correspondente ao projeto INTERATIVO, com título “Diário de um Admin Jr. — Fundamentos Linux”.

Atualização 16/09/2026: aulas 01–26 disponíveis, com duas pranchas por aula. Aulas 23–26 fecham o módulo inicial de arquivos com ACLs, incidente de acesso negado e entrega prática, e abrem aplicações com seleção do Nextcloud piloto. Trinta e dois testes automatizados aprovados. Aulas 27 em diante permanecem planejadas.

## Modelo interativo confirmado

Reutilizar como referência a central de missões de INTERATIVO: navegação lateral, XP por competências, progresso persistente, incidente, contexto e impacto, pranchas narrativas, explicação do Sênior, recuperação ativa, prática simulada, objetivos verificáveis, dicas graduais, três checkpoints comentados, decisão técnica, verificação e diário de passagem de turno. A conclusão deve depender de evidências práticas, checkpoints, decisão e diário.

A página observada tem 35 missões jogáveis e uma em desenvolvimento. O README desse projeto ainda descreve apenas três missões; para reproduzir o modelo, usar a aplicação e os arquivos atuais como referência.

Para NS8, a prática deverá incluir um painel administrativo educativo com estado e validações, além de terminal apenas nos cenários pertinentes. O simulador Linux atual não representa operações de Cluster Admin, aplicações, identidades ou restaurações NS8. Não apresentar comandos inventados como comandos oficiais. Distinguir claramente simulação educativa de laboratório em máquinas virtuais reais.

Manter armazenamento de progresso próprio do curso NS8 para não misturar XP, conclusão e estado de exercícios com Linux. O curso será produzido na pasta CURSO_NETHSERVER_8. A grade abaixo define conteúdo; o modelo de interação confirmado tem precedência sobre a organização visual originalmente proposta.

## Objetivo

Conduzir o aluno da primeira instalação à operação, diagnóstico e recuperação de serviços NS8. O nível avançado será demonstrado por evidências de laboratório e por um projeto de recuperação, não apenas por leitura.

Pré-requisitos: uso básico do computador e capacidade de criar uma máquina virtual. Terminal, redes, DNS e permissões terão nivelamento no próprio curso. Carga estimada: 90–120 horas, a ajustar após o piloto.

## Padrão de cada aula

Aplicar a skill aula-pro: incidente; história do Sênior em terceira pessoa; decodificador; perguntas de fixação; laboratório guiado com local de execução explícito; recall ativo; três questões originais comentadas; procedimento profissional; validação e encerramento; resposta final e gancho.

Usar glossário da cena com analogias, alternar a posição das respostas corretas e escrever encerramento específico para cada incidente. Incluir resultado esperado, falhas frequentes, evidências e plano de retorno em cada laboratório. As questões serão autorais, sem reprodução de provas. Referências técnicas ficam na bibliografia, fora das questões.

## Grade proposta — 60 aulas

### Módulo 1 — Fundamentos e laboratório
1. O primeiro chamado: o que é NS8 e quais problemas ele resolve.
2. Host, nó, cluster, aplicação e container: quem faz o quê.
3. Terminal e SSH essenciais para acompanhar o laboratório.
4. IP, gateway, DNS, FQDN e horário: a base dos serviços.
5. Planejamento da empresa fictícia, máquinas virtuais e inventário.

### Módulo 2 — Primeira implantação
6. Requisitos e escolha da distribuição suportada.
7. Preparação da máquina virtual e rede do laboratório.
8. Instalação e primeiro acesso ao Cluster Admin.
9. Criação do cluster e planejamento da rede privada.
10. Credenciais administrativas e checklist de entrega inicial.

### Módulo 3 — Administração cotidiana
11. Navegação, nós, configurações e inventário do cluster.
12. Software Center: instalar, configurar e identificar instâncias.
13. DNS de aplicações, rotas HTTP e certificados TLS.
14. Logs e tarefas: acompanhar operações e interpretar falhas.
15. Atualizações: leitura de mudanças, janela e validação.

### Módulo 4 — Identidade
16. Usuários, grupos, domínios e provedores de contas.
17. Planejamento de identidade: Active Directory e LDAP.
18. Implantação de domínio Samba em laboratório.
19. Integração de uma estação e testes de autenticação.
20. Incidente: usuário não autentica — DNS, horário e credenciais.

### Módulo 5 — Arquivos e permissões
21. Planejamento de armazenamento do servidor de arquivos.
22. Criação de compartilhamentos e acesso de clientes.
23. Grupos e ACLs: matriz de acesso por departamento.
24. Diagnóstico de acesso negado e permissões excessivas.
25. Entrega prática: servidor de arquivos com testes positivos e negativos.

### Módulo 6 — Aplicações e colaboração
26. Seleção de aplicações e leitura da documentação específica.
27. Implantação de Nextcloud e configuração inicial.
28. Integração de identidade e validação do acesso.
29. Publicação web: nomes, certificados e limites de exposição.
30. Entrega prática: aplicação colaborativa com documentação operacional.

### Módulo 7 — Correio eletrônico
31. Fluxo de e-mail: SMTP, IMAP, MX e responsabilidades.
32. Planejamento de domínio e instalação do serviço de correio.
33. Caixas, aliases, grupos e clientes de e-mail.
34. SPF, DKIM, DMARC, DNS reverso e diagnóstico de entrega.
35. Incidente: mensagem não chega — filas, logs e evidências.

### Módulo 8 — Backup e restauração
36. RPO, RTO, retenção e inventário do que proteger.
37. Configuração do cluster versus dados das aplicações.
38. Destinos de backup, credenciais e execução inicial.
39. Agendamentos, retenção e tratamento de falhas.
40. Restauração de aplicação em ambiente isolado e validação dos dados.

### Módulo 9 — Segurança e operação
41. Administração segura, privilégios e autenticação reforçada.
42. Rede, portas e integração com firewall externo.
43. Capacidade: memória, CPU, disco e crescimento de dados.
44. Rotina operacional: logs, verificações e alertas disponíveis.
45. Incidente integrado: serviço indisponível após mudança.

### Módulo 10 — Vários nós
46. Líder e workers: funções, dependências e limites.
47. Inclusão do segundo nó e verificação de conectividade.
48. Distribuição de aplicações e planejamento de recursos.
49. Movimentação de aplicações conforme suporte de cada módulo.
50. Falha de nó: impacto real e opções de recuperação documentadas.

### Módulo 11 — Administração avançada
51. Arquitetura interna: containers e contexto de execução.
52. API e ferramentas administrativas: consultas e automação controlada.
53. Diagnóstico por camadas: host, cluster, aplicação e cliente.
54. Planejamento de migração de NS7: inventário e compatibilidade.
55. Ensaio de migração, critérios de corte e retorno ao ambiente anterior.

### Módulo 12 — Recuperação e projeto final
56. Plano de recuperação: dependências, segredos e ordem de retorno.
57. Recuperação de desastre do cluster em ambiente isolado.
58. Exercício: perda de serviço e restauração cronometrada.
59. Projeto final: empresa com identidade, arquivos e colaboração.
60. Defesa técnica: evidências, RPO/RTO medidos e manual de operação.

## Laboratório e limites técnicos

- Começar com uma VM NS8 e um cliente; adicionar um segundo nó no módulo 10 e um destino de backup independente no módulo 8.
- NS8 em Proxmox será instalado em VM; a documentação não suporta instalação em LXC.
- Dimensionar memória e disco para as aplicações escolhidas. Os mínimos de instalação não representam dimensionamento de uma empresa.
- Cluster não deve ser apresentado como garantia de alta disponibilidade ou failover automático. Explicar e verificar o mecanismo disponível para cada serviço.
- Não transferir receitas de NS7 diretamente para NS8. Migração exige matriz de compatibilidade e ensaio.
- Testes de correio público dependem de domínio, DNS e conectividade adequados; separar esses testes do laboratório local.
- Comandos e telas de cada aula deverão ser conferidos na documentação da versão adotada. Não afirmar execução em NS8 real sem teste efetivo.

## Critérios de qualidade e produção

Referência fixada: INTERATIVO. Produzir uma aula piloto completa, validar texto e interação e aplicar o padrão às demais aulas. As pranchas em quadrinhos incluídas nesse modelo precisam de produção e auditoria próprias, com conteúdo específico de NS8. Não contar uma grade ou página com títulos como aula pronta.

Cada módulo termina com entrega verificável. O projeto final exige evidências de autenticação, permissões, acesso à aplicação e restauração de dados, acompanhadas de diário de mudanças e manual de operação.

## Referências oficiais consultadas em 14/09/2026

- Introdução: https://docs.nethserver.org/projects/ns8/en/latest/introduction.html
- Requisitos: https://docs.nethserver.org/projects/ns8/en/latest/system_requirements.html
- Instalação: https://docs.nethserver.org/projects/ns8/en/latest/install.html
- Cluster: https://docs.nethserver.org/projects/ns8/en/latest/cluster.html
- Software Center: https://docs.nethserver.org/projects/ns8/en/latest/software_center.html
- Arquivos Samba: https://docs.nethserver.org/projects/ns8/en/latest/file_server.html
- Backup e restauração: https://docs.nethserver.org/docs/administrator-manual/configuration/backup

Estas referências fundamentam a arquitetura inicial. As aulas especializadas ainda precisam de pesquisa e validação próprias.
