/**
 * @summary 参加者画面から参照し、現在シナリオ・現在ターンの公開済みAI講評を取得する
 * @function getPublishedAiFeedback
 * @read ai_feedback, getCurrentScenarioId_(), getCurrentTurn()
 * @write 公開済みの最新AI講評、または未公開メッセージを返す
 * @update 2026-06-30
 */
function getPublishedAiFeedback() {
  const sheet = getSheet('ai_feedback');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      success: false,
      message: 'WAIG博士の講評は、まだ公開されていません。GMの案内をお待ちください。'
    };
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const timestampIdx = idx('timestamp');
  const scenarioIdIdx = idx('scenario_id');
  const turnIdx = idx('turn');
  const feedbackTypeIdx = idx('feedback_type');
  const feedbackTextIdx = idx('feedback_text');
  const statusIdx = idx('status');
  const updatedByIdx = idx('updated_by');

  const currentScenarioId = getCurrentScenarioId_();
  const currentTurn = Number(getCurrentTurn());

  const rows = [];

  values.slice(1).forEach(function(row, i) {
    const scenarioId = String(row[scenarioIdIdx] || '').trim();
    const turn = Number(row[turnIdx] || 0);
    const feedbackType = String(row[feedbackTypeIdx] || '').trim();
    const status = String(row[statusIdx] || '').trim();
    const feedbackText = String(row[feedbackTextIdx] || '').trim();

    if (scenarioId !== currentScenarioId) return;
    if (turn !== currentTurn) return;
    if (feedbackType !== 'OVERALL') return;
    if (status !== 'published') return;
    if (!feedbackText) return;

    rows.push({
      rowNumber: i + 2,
      timestamp: row[timestampIdx],
      scenarioId: scenarioId,
      turn: turn,
      feedbackType: feedbackType,
      feedbackText: feedbackText,
      status: status,
      updatedBy: updatedByIdx >= 0 ? String(row[updatedByIdx] || '').trim() : ''
    });
  });

  if (rows.length === 0) {
    return {
      success: false,
      message: 'WAIG博士の講評は、まだ公開されていません。GMの案内をお待ちください。'
    };
  }

  rows.sort(function(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const latest = rows[0];

  return {
    success: true,
    scenarioId: latest.scenarioId,
    turn: latest.turn,
    feedbackType: latest.feedbackType,
    feedbackText: latest.feedbackText,
    status: latest.status,
    updatedBy: latest.updatedBy,
    timestamp: formatDateTimeForView_(latest.timestamp)
  };
}