import { missions, missionTitles } from "../data/missions.js";
import { TerminalSimulator, missionEvidence } from "./simulator.js";
import { renderLab } from "./lab.js";
import { awardMission } from "./progress.js";
import {INVENTORY_REVISION} from './inventory.js';

const STORAGE_KEY = "diario-admin-jr-ns8-progress";
const STORAGE_VERSION = 2;
const playableCount = Object.keys(missions).length;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

function defaultState() {
  return { version: STORAGE_VERSION, xp: 0, completed: {}, awarded: {}, missions: {} };
}

let storageAvailable = true;
function loadState() {
  try {
    const probe = "__admin_jr_probe__";
    localStorage.setItem(probe, "1"); localStorage.removeItem(probe);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.version === STORAGE_VERSION) return { ...defaultState(), ...saved };
    if (saved?.version === 1) return { ...defaultState(), missions: saved.missions || {} };
    return defaultState();
  } catch {
    storageAvailable = false;
    $("#storage-warning").hidden = false;
    return defaultState();
  }
}

let state = loadState();
if(state.missions[5] && state.missions[5].revision!==INVENTORY_REVISION) {
  state.previousMission5={exercise:state.missions[5],completed:state.completed[5]||null};
  delete state.missions[5]; delete state.completed[5];
}
let activeMission = null;
let simulator = null;
let historyIndex = 0;

function saveState() {
  if (!activeMission || !simulator) return persist();
  const current = state.missions[activeMission] || {};
  state.missions[activeMission] = { ...current, simulator: simulator.snapshot() };
  persist();
}

function persist() {
  if (!storageAvailable) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; $("#storage-warning").hidden = false; }
}

function missionState(id) {
  const existing = state.missions[id] || {};
  state.missions[id] = {
    decision: null, hints: 0, transcript: [], recallRevealed: false, quiz: {}, ...existing,
    diary: { evidence: "", solution: "", learning: "", ...(existing.diary || {}) },
    quiz: { ...(existing.quiz || {}) },
  };
  if(id===5) state.missions[id].revision=INVENTORY_REVISION;
  return state.missions[id];
}

function renderRail() {
  const completed = Object.keys(state.completed).length;
  $("#xp-value").textContent = state.xp;
  $("#completion-value").textContent = `${completed}/${playableCount}`;
  $("#rail-progress-bar").style.width = `${(completed / playableCount) * 100}%`;
  $("#mission-list").innerHTML = missionTitles.map((title, index) => {
    const id = index + 1;
    const playable = Boolean(missions[id]);
    const done = Boolean(state.completed[id]);
    const status = done ? "✓" : playable ? "›" : "🔒";
    return `<button class="mission-link ${playable ? "playable" : ""} ${done ? "done" : ""} ${activeMission === id ? "active" : ""}" data-mission="${id}" ${playable ? "" : "disabled"}>
      <span class="mission-number">${String(id).padStart(2, "0")}</span><span><strong>${escapeHtml(title)}</strong><small>${done ? "Concluída" : playable ? "Jogável no piloto" : "Em desenvolvimento"}</small></span><span class="mission-status">${status}</span>
    </button>`;
  }).join("");
  $$('[data-mission]').forEach((button) => button.addEventListener("click", () => openMission(Number(button.dataset.mission))));
}

function dashboard() {
  activeMission = null; simulator = null;
  const completed = Object.keys(state.completed).length;
  const playableIds = Object.keys(missions).map(Number).sort((a, b) => a - b);
  const next = playableIds.find((id) => !state.completed[id]) || playableIds[0];
  $("#main").innerHTML = `<div class="page">
    <section class="dashboard-hero">
      <span class="eyebrow">Sua próxima atividade</span>
      <h1>${completed === playableCount ? "Protótipo NS8 concluído" : escapeHtml(missions[next].title)}</h1>
      <p>${completed === playableCount ? "Você demonstrou as competências práticas das missões jogáveis. Pode revisar qualquer uma sem receber XP duplicado." : escapeHtml(missions[next].summary)}</p>
      <div class="button-row"><button class="button primary" id="continue-button">${completed === playableCount ? "Revisar missão 01" : `Iniciar missão ${String(next).padStart(2, "0")}`}</button></div>
    </section>
    <section class="dashboard-grid" aria-label="Resumo do progresso">
      <div class="stat-card"><strong>${state.xp}</strong><span>XP por competências demonstradas</span></div>
      <div class="stat-card"><strong>${completed}/${playableCount}</strong><span>missões jogáveis concluídas</span></div>
      <div class="stat-card"><strong>${Object.values(missions).reduce((n,m)=>n+m.testking.length,0)}</strong><span>questões com feedback por alternativa</span></div>
    </section>
    <section class="card section"><span class="eyebrow">Como funciona</span><h2>Investigue. Decida. Demonstre.</h2><p>Dez missões para começar no NethServer 8. Investigue os cenários, experimente o painel educativo e confirme os resultados no terminal simulado. Nenhuma ação controla um servidor real. As missões exigem prática, três questões comentadas, decisão técnica e diário. Seu progresso fica neste navegador.</p></section>
  </div>`;
  $("#continue-button").addEventListener("click", () => openMission(next));
  renderRail();
  window.scrollTo({ top: 0 });
}

function openMission(id) {
  const mission = missions[id];
  if (!mission) return;
  activeMission = id;
  const ms = missionState(id);
  simulator = new TerminalSimulator(id);
  if (ms.simulator) simulator.restore(ms.simulator);
  const savedDecision = mission.decisions.find((choice) => choice.id === ms.decision);
  if (mission.objectives.some(([key]) => key === "authorized") && savedDecision?.correct) simulator.setAuthorization(true);
  historyIndex = simulator.history.length;
  renderMission(mission, ms);
  renderRail();
  $("#mission-rail").classList.remove("open");
  $("#menu-button").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0 });
}

function renderMission(mission, ms) {
  const images = mission.images.map((src, index) => `<button class="comic-button" data-image="${src}" data-alt="${escapeHtml(mission.alt[index])}"><img src="${src}" alt="${escapeHtml(mission.alt[index])}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'comic-missing',textContent:'Prancha ${index + 1} ainda não gerada'})); this.closest('.comic-button').disabled=true; this.closest('.comic-button').style.cursor='default';"><span>Prancha ${index + 1} · ampliar</span></button>`).join("");
  $("#main").innerHTML = `<article class="page">
    <header class="mission-header"><div><span class="eyebrow">MISSÃO ${String(mission.id).padStart(2, "0")} · ${escapeHtml(mission.level)}</span><h1>${escapeHtml(mission.title)}</h1><p class="muted">${escapeHtml(mission.summary)}</p></div><span class="xp-chip">+${mission.xp} XP</span></header>
    <div class="mission-progress" aria-label="Etapas da missão">${mission.steps.map((step) => `<span title="${escapeHtml(step)}"></span>`).join("")}</div>
    <div class="notice sim"><strong>Laboratório educativo:</strong> esta é uma simulação isolada. Nenhum comando é enviado ao sistema real.</div>
    <section class="story-grid section"><div class="story-card"><span class="label">01 · CHAMADO DA EMPRESA</span><h2>O incidente</h2><p>${escapeHtml(mission.call)}</p></div><div class="story-card"><span class="label">02 · CONTEXTO E IMPACTO</span><h2>Por que importa</h2><p>${escapeHtml(mission.impact)}</p></div>${mission.senior ? `<div class="story-card"><span class="label">HISTÓRIA DO SÊNIOR</span><h2>O que ele já viu acontecer</h2><p>${escapeHtml(mission.senior)}</p></div>` : ""}</section>
    <section class="comic-grid ns8-comic" aria-label="Pranchas narrativas">${images}</section>
    <div class="notice"><strong>Nota sobre a arte:</strong> ${escapeHtml(mission.artNote)}</div>
    <section class="card section"><span class="eyebrow">03 · CONCEITO</span><h2>O Sênior te conta</h2><div class="concept"><p>${escapeHtml(mission.concept)}</p><div class="example"><strong>Exemplo</strong><br>${escapeHtml(mission.example)}</div></div></section>
    <section class="card section"><h2>Decodificador de conceitos</h2><div class="table-scroll"><table class="glossary"><thead><tr><th>Termo</th><th>Significado</th><th>Analogia</th></tr></thead><tbody>${mission.glossary.map(([term, meaning, analogy])=>`<tr><th>${escapeHtml(term)}</th><td>${escapeHtml(meaning)}</td><td>${escapeHtml(analogy)}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="recall-card section"><span class="eyebrow">RECUPERAÇÃO ATIVA · ANTES DAS OPÇÕES</span><h2>Tente responder de cabeça</h2><p class="recall-question">${escapeHtml(mission.recall.question)}</p><button class="button secondary" id="recall-button">${ms.recallRevealed ? "Ocultar resposta" : "Revelar resposta"}</button><div class="recall-answer ${ms.recallRevealed ? "show" : ""}" id="recall-answer"><strong>Resposta comentada</strong><p>${escapeHtml(mission.recall.answer)}</p></div></section>
    <section class="section"><span class="eyebrow">04–05 · INVESTIGAÇÃO E PRÁTICA</span><h2>Laboratório guiado</h2><p>${escapeHtml(mission.labIntro)}</p><ol class="lab-steps">${mission.labSteps.map((step,i)=>`<li><label><input type="checkbox" data-step="${i}" ${ms.steps?.[i]?'checked':''}> ${escapeHtml(step)}</label></li>`).join("")}</ol><p class="muted">As marcações acima organizam o estudo. Os objetivos abaixo só são concluídos pelas evidências do simulador.</p><div id="lab-surface">${renderLab(mission.id,simulator)}</div><h3>Terminal de homologação</h3><div class="workbench">
      <div class="terminal" aria-label="Terminal Linux simulado"><div class="terminal-bar"><span class="terminal-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>SIMULAÇÃO · NS8 LAB</span><span>digite help</span></div><div class="terminal-output" id="terminal-output" tabindex="0" aria-live="polite"></div><form class="terminal-input-row" id="terminal-form"><span class="prompt" id="terminal-prompt"></span><input class="terminal-input" id="terminal-input" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Digite um comando no terminal simulado"></form></div>
      <aside class="card"><h3>Objetivos verificáveis</h3><div class="objectives" id="objectives"></div><div class="hint-panel"><button class="button" id="hint-button">Solicitar dica (${ms.hints || 0}/${mission.hints.length})</button><div class="hint-text" id="hint-text">${renderHints(mission, ms.hints || 0)}</div></div></aside>
    </div></section>
    <section class="section"><div class="quiz-heading"><div><span class="eyebrow">CHECKPOINTS TESTKING · RACIOCÍNIO</span><h2>Explique antes de avançar</h2></div><span class="quiz-score" id="quiz-score">0/3 dominados</span></div><p class="muted">Cada alternativa possui uma explicação própria. Errar não remove XP: leia o feedback e tente novamente. O terminal continua sendo a prova prática.</p><div class="testking-grid" id="testking-grid">${mission.testking.map((question, index) => renderQuizCard(question, ms.quiz[question.id], index)).join("")}</div></section>
    <section class="card section"><span class="eyebrow">06 · DECISÃO TÉCNICA</span><h2>${escapeHtml(mission.decisionPrompt)}</h2><div class="decision-grid">${mission.decisions.map((choice) => `<button class="decision ${ms.decision === choice.id ? `selected ${choice.correct ? "good" : "bad"}` : ""}" data-decision="${choice.id}">${escapeHtml(choice.label)}</button>`).join("")}</div><div class="consequence ${decisionClass(mission, ms.decision)}" id="consequence">${decisionFeedback(mission, ms.decision)}</div></section>
    <section class="card section"><span class="eyebrow">PROCEDIMENTO PROFISSIONAL</span><h2>Como levar o raciocínio ao trabalho</h2><ol>${mission.procedure.map(step=>`<li>${escapeHtml(step)}</li>`).join("")}</ol><p>${escapeHtml(mission.validation)}</p></section>
    <section class="card section"><span class="eyebrow">07 · VERIFICAÇÃO</span><h2>A solução funciona de verdade?</h2><p id="verification-text">Conclua os objetivos no painel e no terminal. A verificação considera as evidências coletadas e o estado atual do cenário.</p></section>
    <section class="card section"><span class="eyebrow">08–09 · DIÁRIO E DESAFIO</span><h2>Registre sua passagem de turno</h2><p>${escapeHtml(mission.challenge)}</p><div class="diary-grid">
      <div class="field"><label for="diary-evidence">Evidências observadas</label><textarea id="diary-evidence" placeholder="${escapeHtml(mission.diaryPlaceholder)}">${escapeHtml(ms.diary?.evidence)}</textarea></div>
      <div class="field"><label for="diary-solution">Solução aplicada</label><textarea id="diary-solution" placeholder="Comandos ou decisão tomada e por quê...">${escapeHtml(ms.diary?.solution)}</textarea></div>
      <div class="field"><label for="diary-learning">O que aprendi</label><textarea id="diary-learning" placeholder="Explique o conceito com suas palavras...">${escapeHtml(ms.diary?.learning)}</textarea></div>
    </div></section>
    <section class="completion-box section" id="completion-box"><h2 id="completion-title">Verificação pendente</h2><p id="completion-reason">Conclua os objetivos, escolha a decisão segura e preencha as três partes do diário.</p><div class="button-row"><button class="button primary" id="complete-button" disabled>Concluir missão</button><button class="button danger" id="reset-button">Reiniciar missão</button><button class="button" id="back-button">Voltar à central</button></div></section>
    <section class="card section"><span class="eyebrow">10 · ENCERRAMENTO E REVISÃO</span><h2>O que esta missão comprova</h2><p>${escapeHtml(mission.closing)}</p><p>Revise esta pergunta amanhã, em sete dias e em trinta dias. Tente responder antes de revelar a explicação.</p><button class="button" id="anki-button">Baixar cartão para Anki</button><details class="sources"><summary>Fontes oficiais e limites do protótipo</summary><p>Referências conferidas em 15/09/2026. Simulação educativa; os procedimentos não foram executados em um NS8 real nesta produção.</p><ul>${mission.sources.map(([title,url])=>`<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a></li>`).join("")}</ul></details></section>
  </article>`;

  bindMission(mission, ms);
  renderTranscript(ms);
  updateEvidence(mission, ms);
}

function renderQuizCard(question, saved = {}, index = 0) {
  const selected = question.choices.find((choice) => choice.id === saved.selected);
  const locked = Boolean(selected);
  const stateClass = saved.mastered ? "mastered" : selected ? "answered-wrong" : "";
  const feedback = selected ? `<div class="quiz-feedback ${selected.correct ? "correct" : "wrong"}" role="status"><strong>${selected.correct ? "Resposta correta" : "Resposta incorreta — observe isto"}</strong><p>${escapeHtml(selected.why)}</p>${selected.correct ? "" : `<button class="button quiz-retry" data-quiz-retry="${question.id}">Tentar novamente</button>`}</div>` : "";
  return `<article class="testking-card ${stateClass}" data-quiz-card="${question.id}"><div class="testking-meta"><span>CHECK ${index + 1}</span><span>${saved.attempts || 0} tentativa(s)</span></div><h3>${escapeHtml(question.title)}</h3><p>${escapeHtml(question.question)}</p><div class="quiz-options">${question.choices.map((choice, choiceIndex) => `<button class="quiz-option ${saved.selected === choice.id ? (choice.correct ? "selected-correct" : "selected-wrong") : ""}" data-quiz="${question.id}" data-choice="${choice.id}" ${locked ? "disabled" : ""}><b>${String.fromCharCode(65 + choiceIndex)}</b><span>${escapeHtml(choice.text)}</span></button>`).join("")}</div>${feedback}</article>`;
}

function decisionClass(mission, decisionId) {
  const choice = mission.decisions.find((item) => item.id === decisionId);
  if (!choice) return "";
  return choice.correct ? "correct" : "wrong";
}

function decisionFeedback(mission, decisionId) {
  const choice = mission.decisions.find((item) => item.id === decisionId);
  if (!choice) return "<strong>Aguardando sua escolha</strong><p>Clique em uma alternativa para ver a consequência técnica antes de continuar.</p>";
  const title = choice.correct ? "Decisão segura" : "Risco operacional";
  return `<strong>${title}</strong><p>${escapeHtml(choice.consequence)}</p>`;
}

function renderHints(mission, count = 0) {
  if (!count) return "<p>As dicas são cumulativas: quando você pedir a dica 2, a dica 1 continuará visível.</p>";
  return mission.hints.slice(0, count).map((hint, index) => `<article class="hint-item"><strong>Dica ${index + 1}</strong><p>${escapeHtml(hint)}</p></article>`).join("");
}

function bindMission(mission, ms) {
  bindLab(mission, ms);
  $$('[data-step]').forEach(input=>input.addEventListener('change',()=>{ms.steps ||= {}; ms.steps[input.dataset.step]=input.checked; persist();}));
  $('#anki-button').addEventListener('click',()=>{
    const safe=value=>value.replace(/[\t\r\n]+/g,' ');
    const blob=new Blob([safe(mission.recall.question)+'\t'+safe(mission.recall.answer)+'\n'],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`ns8-aula-${mission.id}-anki.txt`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $$(".comic-button").forEach((button) => button.addEventListener("click", () => showImage(button.dataset.image, button.dataset.alt)));
  $("#terminal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#terminal-input");
    const line = input.value;
    const originalPrompt = promptText();
    const result = simulator.execute(line);
    if (line.trim()) {
      ms.transcript ||= [];
      if (result.clear) ms.transcript = [];
      else ms.transcript.push({ prompt: originalPrompt, command: line.trim(), output: result.output, error: result.error });
      input.value = "";
      historyIndex = simulator.history.length;
      saveState(); renderTranscript(ms); updateEvidence(mission, ms);
    }
  });
  $("#terminal-input").addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && simulator.history.length) { event.preventDefault(); historyIndex = Math.max(0, historyIndex - 1); event.currentTarget.value = simulator.history[historyIndex] || ""; }
    if (event.key === "ArrowDown") { event.preventDefault(); historyIndex = Math.min(simulator.history.length, historyIndex + 1); event.currentTarget.value = simulator.history[historyIndex] || ""; }
    if (event.key === "Tab" && !event.shiftKey) {
      if (!event.currentTarget.value.trim()) return;
      event.preventDefault();
      const current = event.currentTarget.value;
      const completed = simulator.autocomplete(current);
      event.currentTarget.value = completed.line;
      if (completed.matches.length > 1 && completed.line === current) {
        ms.transcript ||= [];
        ms.transcript.push({ prompt: promptText(), command: current || "<TAB>", output: completed.matches.join("  "), error: false });
        renderTranscript(ms);
      }
    }
  });
  $("#hint-button").addEventListener("click", () => {
    ms.hints = Math.min(mission.hints.length, (ms.hints || 0) + 1);
    $("#hint-button").textContent = `Solicitar dica (${ms.hints}/${mission.hints.length})`;
    $("#hint-text").innerHTML = renderHints(mission, ms.hints);
    persist();
  });
  $("#recall-button").addEventListener("click", () => {
    ms.recallRevealed = !ms.recallRevealed;
    $("#recall-answer").classList.toggle("show", ms.recallRevealed);
    $("#recall-button").textContent = ms.recallRevealed ? "Ocultar resposta" : "Revelar resposta";
    persist();
  });
  bindQuizEvents(mission, ms);
  $$(".decision").forEach((button) => button.addEventListener("click", () => {
    const choice = mission.decisions.find((item) => item.id === button.dataset.decision);
    ms.decision = choice.id;
    if (mission.objectives.some(([key]) => key === "authorized")) simulator.setAuthorization(choice.correct);
    $$(".decision").forEach((item) => item.className = "decision");
    button.classList.add("selected", choice.correct ? "good" : "bad");
    const consequence = $("#consequence");
    consequence.className = `consequence ${choice.correct ? "correct" : "wrong"}`;
    consequence.innerHTML = decisionFeedback(mission, choice.id);
    saveState(); updateEvidence(mission, ms);
  }));
  ["evidence", "solution", "learning"].forEach((field) => $("#diary-" + field).addEventListener("input", (event) => { ms.diary[field] = event.target.value; persist(); updateEvidence(mission, ms); }));
  $("#complete-button").addEventListener("click", () => completeMission(mission, ms));
  $("#reset-button").addEventListener("click", () => resetMission(mission.id));
  $("#back-button").addEventListener("click", dashboard);
}

function bindQuizEvents(mission, ms) {
  $$('[data-quiz]').forEach((button) => button.addEventListener("click", () => {
    const question = mission.testking.find((item) => item.id === button.dataset.quiz);
    const choice = question.choices.find((item) => item.id === button.dataset.choice);
    const previous = ms.quiz[question.id] || { attempts: 0, mastered: false };
    ms.quiz[question.id] = {
      attempts: previous.attempts + 1,
      mastered: previous.mastered || choice.correct,
      selected: choice.id,
      firstAttemptCorrect: previous.attempts === 0 ? choice.correct : previous.firstAttemptCorrect,
    };
    persist(); refreshQuizSection(mission, ms); updateEvidence(mission, ms);
  }));
  $$('[data-quiz-retry]').forEach((button) => button.addEventListener("click", () => {
    const questionId = button.dataset.quizRetry;
    const current = ms.quiz[questionId];
    if (current && !current.mastered) {
      ms.quiz[questionId] = {
        attempts: current.attempts || 0,
        mastered: false,
        firstAttemptCorrect: current.firstAttemptCorrect,
      };
    }
    persist(); refreshQuizSection(mission, ms); updateEvidence(mission, ms);
  }));
}

function refreshQuizSection(mission, ms) {
  $("#testking-grid").innerHTML = mission.testking.map((question, index) => renderQuizCard(question, ms.quiz[question.id], index)).join("");
  bindQuizEvents(mission, ms);
  updateQuizScore(mission, ms);
}

function updateQuizScore(mission, ms) {
  const mastered = mission.testking.filter((question) => ms.quiz[question.id]?.mastered).length;
  $("#quiz-score").textContent = `${mastered}/${mission.testking.length} dominados`;
}

function promptText() { return `${simulator.user}@${simulator.hostname}:${simulator.cwd}$`; }
function renderTranscript(ms) {
  $("#terminal-prompt").textContent = `${promptText()} `;
  const intro = `<span class="muted">Terminal simulado iniciado. Digite help para conhecer os comandos disponíveis.</span>`;
  $("#terminal-output").innerHTML = intro + (ms.transcript || []).map((entry) => `\n<span class="command">${escapeHtml(entry.prompt)} ${escapeHtml(entry.command)}</span>${entry.output ? `\n<span class="${entry.error ? "error" : ""}">${escapeHtml(entry.output)}</span>` : ""}`).join("");
  $("#terminal-output").scrollTop = $("#terminal-output").scrollHeight;
}

function updateEvidence(mission, ms) {
  const evidence = missionEvidence(mission.id, simulator);
  $("#objectives").innerHTML = mission.objectives.map(([key, label]) => `<div class="objective ${evidence[key] ? "done" : ""}"><i>${evidence[key] ? "✓" : ""}</i><span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(explainObjective(label))}</small></span></div>`).join("");
  const allEvidence = mission.objectives.every(([key]) => evidence[key]);
  const quizReady = mission.testking.every((question) => ms.quiz[question.id]?.mastered);
  const correctDecision = mission.decisions.find((choice) => choice.id === ms.decision)?.correct === true;
  const diaryReady = [ms.diary?.evidence, ms.diary?.solution, ms.diary?.learning].every((value) => (value || "").trim().length >= 12);
  const ready = allEvidence && quizReady && correctDecision && diaryReady;
  const count = mission.objectives.filter(([key]) => evidence[key]).length;
  $$(".mission-progress span").forEach((el,i)=>el.classList.toggle("filled",i < Math.round((count/mission.objectives.length)*mission.steps.length)));
  const completeButton = $("#complete-button");
  completeButton.disabled = !ready || Boolean(state.completed[mission.id]);
  completeButton.textContent = state.completed[mission.id] ? "Missão já concluída" : "Concluir missão";
  $("#completion-box").classList.toggle("ready", ready || Boolean(state.completed[mission.id]));
  $("#completion-title").textContent = state.completed[mission.id] ? "Competência já demonstrada" : ready ? "Verificação aprovada" : "Verificação pendente";
  $("#completion-reason").textContent = state.completed[mission.id] ? "Você pode repetir a missão à vontade. O XP não será concedido novamente." : ready ? "As evidências práticas, os checkpoints, a decisão e o diário estão completos." : `${mission.objectives.filter(([key]) => !evidence[key]).length} objetivo(s) prático(s) pendente(s). TestKing: ${quizReady ? "ok" : "pendente"}. Decisão segura: ${correctDecision ? "ok" : "pendente"}. Diário: ${diaryReady ? "ok" : "preencha ao menos 12 caracteres em cada parte"}.`;
  $("#verification-text").textContent = allEvidence ? "O estado final e os testes exigidos foram demonstrados no laboratório educativo." : "Conclua os objetivos no painel e no terminal. A verificação considera as evidências coletadas e o estado atual do cenário.";
  updateQuizScore(mission, ms);
}

function explainObjective(label='') {
  if(label.toLowerCase().includes('validar') || label.includes('Aplicar') || label.includes('download')) return 'Use o painel educativo; a validação considera os valores escolhidos.';
  if(label.includes('Religar') || label.includes('impacto')) return 'Observe a mudança de disponibilidade no mapa do cenário.';
  return 'Execute o comando indicado e interprete a saída antes de continuar.';
}

function isReady(mission, ms) {
  const evidence=missionEvidence(mission.id,simulator);
  return mission.objectives.every(([key])=>evidence[key]) && mission.testking.every(q=>ms.quiz[q.id]?.mastered) && mission.decisions.some(c=>c.id===ms.decision && c.correct) && ['evidence','solution','learning'].every(k=>(ms.diary[k]||'').trim().length>=12);
}
function bindLab(mission, ms) {
  $$('[data-inventory]').forEach(input=>input.addEventListener('input',()=>{
    simulator.updateInventory({[input.dataset.inventory]:input.value});
    $('#export-inventory').disabled=true;
    $('#lab-surface .lab-feedback').textContent='Rascunho alterado. Valide novamente antes de exportar.';
    saveState(); updateEvidence(mission,ms);
  }));
  $('#export-inventory')?.addEventListener('click',()=>{
    try {
      const body=simulator.exportInventory(); const blob=new Blob([body],{type:'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='inventario-aurora-ns8.txt'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      simulator.lab.feedback='Arquivo preparado para download. Abra-o e confira a entrega; nenhum servidor real foi alterado.';
      $('#lab-surface .lab-feedback').textContent=simulator.lab.feedback;
      saveState(); updateEvidence(mission,ms);
    } catch(error) {showToast(error.message);}
  });
  $$('[data-lab]').forEach(button=>button.addEventListener('click',()=>{
    const action=button.dataset.lab;
    const valueReaders={
      profile:()=>({diagnosis:$('#requirements-diagnosis').value}),
      'network-profile':()=>({profile:$('#network-profile').value}),
      'access-log':()=>({state:$('#access-state').value}),
      'cluster-create':()=>({mode:$('#cluster-mode').value,label:$('#cluster-label').value,vpn:$('#cluster-vpn').value}),
      'handoff-checklist':()=>Object.fromEntries($$('[data-handoff]').map(input=>[input.dataset.handoff,input.checked])),
      'areas-map':()=>Object.fromEntries(['nodes','apps','users','settings'].map(k=>[k,$('#area-'+k).value])),
      'app-select':()=>({app:$('#app-name').value,node:$('#app-node').value,volume:$('#app-volume').value}),
      'route-apply':()=>({target:$('#route-target').value}),
      'update-approve':()=>({window:$('#update-window').value,scope:$('#update-scope').value}),
      'identity-map':()=>Object.fromEntries(['person','department','domain','backend'].map(k=>[k,$('#idmap-'+k).value])),
      'identity-plan':()=>({type:$('#identity-type').value,domain:$('#identity-domain').value,realm:$('#identity-realm').value,netbios:$('#identity-netbios').value}),
      'samba-create':()=>({domain:$('#samba-domain').value,realm:$('#samba-realm').value,netbios:$('#samba-netbios').value}),
      'join-run':()=>({client:$('#join-client').value,domain:$('#join-domain').value}),
      'client-dns-fix':()=>({dns:$('#client-dns').value}),
      'storage-select':()=>({volume:$('#storage-volume').value,owner:$('#storage-owner').value,growth:$('#storage-growth').value}),
      'share-create':()=>({name:$('#share-name').value,group:$('#share-group').value,permission:$('#share-permission').value}),
      'acl-map':()=>Object.fromEntries(['financeiro','diretoria','suporte'].map(k=>[k,$('#acl-'+k).value])),
      'carla-fix':()=>({group:$('#carla-group').value}),
      'file-handoff-checklist':()=>Object.fromEntries($$('[data-file-handoff]').map(input=>[input.dataset.fileHandoff,input.checked])),
      'app-selection':()=>({app:$('#pilot-app').value,audience:$('#pilot-audience').value,fqdn:$('#pilot-fqdn').value}),
      'nextcloud-config':()=>({instance:$('#nextcloud-instance').value,fqdn:$('#nextcloud-fqdn').value,audience:$('#nextcloud-audience').value}),
      'cloud-audience':()=>({audience:$('#cloud-audience').value}),
      'cloud-route-apply':()=>({target:$('#cloud-route-target').value}),
      'cloud-handoff-checklist':()=>Object.fromEntries($$('[data-cloud-handoff]').map(input=>[input.dataset.cloudHandoff,input.checked])),
      'flow-matrix-validate':()=>({submission:$('#mail-port-sub')?.value,relay:$('#mail-port-relay')?.value,imap:$('#mail-port-imap')?.value}),
      'review7-checklist':()=>Object.fromEntries($$('[data-mail-review]').map(input=>[input.dataset.mailReview,input.checked])),
      'backup-strategy-validate':()=>({daily:$('#retention-daily')?.value,weekly:$('#retention-weekly')?.value,monthly:$('#retention-monthly')?.value}),
      'review8-checklist':()=>Object.fromEntries($$('[data-bcp-review]').map(input=>[input.dataset.bcpReview,input.checked])),
      'security-model-validate':()=>({border:$('#sec-layer-border')?.value,host:$('#sec-layer-host')?.value,container:$('#sec-layer-container')?.value}),
      'review9-checklist':()=>Object.fromEntries($$('[data-sec-review]').map(input=>[input.dataset.secReview,input.checked])),
      'review10-checklist':()=>Object.fromEntries($$('[data-app-review]').map(input=>[input.dataset.appReview,input.checked])),
      'review11-checklist':()=>Object.fromEntries($$('[data-cluster-review]').map(input=>[input.dataset.clusterReview,input.checked])),
      'review12-checklist':()=>Object.fromEntries($$('[data-cert-review]').map(input=>[input.dataset.certReview,input.checked])),
      plan:()=>({candidate:$('#candidate').value}),
      map:()=>Object.fromEntries(['aurora','machine','nextcloud','component'].map(k=>[k,$('#map-'+k).value])),
      dns:()=>({dns:$('#dns-address').value}),
      inventory:()=>Object.fromEntries($$('[data-inventory]').map(input=>[input.dataset.inventory,input.value]))
    };
    const values=(valueReaders[action]||(()=>({})))();
    simulator.act(action,values); saveState();
    $('#lab-surface').innerHTML=renderLab(mission.id,simulator);
    bindLab(mission,ms); updateEvidence(mission,ms);
  }));
}
function completeMission(mission, ms) {
  if (state.completed[mission.id] || !isReady(mission, ms)) return;
  const alreadyAwarded=Boolean(state.awarded[mission.id]);
  if(alreadyAwarded) state.completed[mission.id]=new Date().toISOString();
  else awardMission(state, mission.id, mission.xp);
  saveState(); renderRail(); updateEvidence(mission, ms);
  showToast(`Missão ${String(mission.id).padStart(2, "0")} concluída · ${alreadyAwarded?'XP anterior preservado':`+${mission.xp} XP`}`);
}

function resetMission(id) {
  const wasCompleted = Boolean(state.completed[id]);
  state.missions[id] = { decision: null, hints: 0, recallRevealed: false, quiz: {}, diary: { evidence: "", solution: "", learning: "" }, transcript: [] };
  if (!wasCompleted) { delete state.completed[id]; }
  persist(); openMission(id);
  showToast(wasCompleted ? "Missão reiniciada para revisão. O XP conquistado foi preservado." : "Missão reiniciada. O ambiente virtual voltou ao estado inicial.");
}

function showImage(src, alt) {
  $("#dialog-image").src = src; $("#dialog-image").alt = alt; $("#dialog-caption").textContent = alt; $("#image-dialog").showModal();
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.hidden = true, 4200);
}

$("#home-button").addEventListener("click", dashboard);
$("#menu-button").addEventListener("click", () => { const rail = $("#mission-rail"); rail.classList.toggle("open"); $("#menu-button").setAttribute("aria-expanded", String(rail.classList.contains("open"))); });
$("#close-menu").addEventListener("click", () => { $("#mission-rail").classList.remove("open"); $("#menu-button").setAttribute("aria-expanded", "false"); });
$("#image-dialog .dialog-close").addEventListener("click", () => $("#image-dialog").close());
$("#image-dialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });

dashboard();
