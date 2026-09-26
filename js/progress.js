export function awardMission(state, missionId, xp, completedAt = new Date().toISOString()) {
  const id = String(missionId);
  if (state.completed[id] || state.awarded[id]) return { awarded: false, state };
  state.completed[id] = completedAt;
  state.awarded[id] = xp;
  state.xp += xp;
  return { awarded: true, state };
}
