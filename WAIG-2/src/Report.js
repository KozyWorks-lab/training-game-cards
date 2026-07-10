/**
 * @summary レポート画面から参照し、指定グループの成績・施策履歴・ランキング・スコアカード情報を取得する
 * @function getReportPageData
 * @read groupId, getCurrentTurn(), getGroups(), getCompareDbData(), getActionHistory()
 * @write レポート画面表示用のグループ別集計データを返す
 * @update 2026-06-30
 */
function getReportPageData(groupId) {
  const targetGroupId = String(groupId || '').trim();

  if (!targetGroupId) {
    throw new Error('プレイヤーIDが指定されていません。');
  }

  const currentTurn = Number(getCurrentTurn());

  const nameMap = getGroupDisplayNameMap();
  const groups = getGroups();

  const group = groups.find(function(g) {
    return String(g.groupId || '').trim() === targetGroupId;
  });

  const missionId = group ? String(group.missionId || '').trim() : '';

  const missionInfo = {
    challengeId: group ? String(group.challengeId || '').trim() : '',
    challengeName: group ? String(group.challengeLabel || group.challengeName || '').trim() : '',
    missionId: missionId,
    missionName: group ? String(group.missionLabel || group.missionName || '').trim() : '',
    missionDifficulty: group ? String(group.missionDifficulty || '').trim() : '',
    skillId: group ? String(group.skillId || '').trim() : '',
    skillName: group ? String(group.skillLabel || group.skillName || '').trim() : '',
    skillActivation: group ? String(group.activation || group.skillActivation || '').trim() : ''
  };

  const compareData = getCompareDbData();
  const completedGroupIds = getCompletedPlayerGroupIds_();

  const history = buildGroupHistoryFromCompareData_(
    compareData,
    targetGroupId,
    currentTurn,
    completedGroupIds
  );

  const ranking = buildTurnRankingFromCompareData_(
    compareData,
    currentTurn,
    completedGroupIds,
    nameMap
  );

  const actionHistory = getActionHistory(targetGroupId)
    .filter(function(row) {
      return Number(row.turn) <= currentTurn;
    });

  const playInfo = getReportPlayInfo_();
  const scenarioInfo = getReportScenarioInfo_();

  const finalResult = history && history.length > 0
    ? history[history.length - 1]
    : null;

  const rankIndex = ranking.findIndex(function(row) {
    return String(row.groupId) === targetGroupId;
  });

  const finalRank = rankIndex >= 0 ? rankIndex + 1 : '';

  const scoreCard = buildWaigScoreCard_(
    targetGroupId,
    history,
    ranking,
    playInfo,
    group,
    missionInfo,
    scenarioInfo
  );

  return {
    success: true,
    groupId: targetGroupId,
    groupLabel: nameMap[targetGroupId] || targetGroupId,
    currentTurn: currentTurn,
    playInfo: playInfo,
    scoreCard: scoreCard,
    missionInfo: missionInfo,
    finalResult: finalResult,
    finalRank: finalRank,
    history: history,
    actionHistory: actionHistory,
    ranking: ranking
  };
}

/**
 * @summary 内部処理：指定グループのターン別施策履歴をレポート表示用に整形する
 * @function getReportActionHistory_
 * @read groupId, currentTurn, getWatchActionMatrix()
 * @write ターン別の施策・組み合わせ効果の履歴配列を返す
 * @update 2026-06-30
 */
function getReportActionHistory_(groupId, currentTurn) {
  const matrix = getWatchActionMatrix();
  const targetGroupId = String(groupId || '').trim();

  const player = matrix.find(function(item) {
    return String(item.groupId) === targetGroupId;
  });

  if (!player) {
    return [];
  }

  const result = [];

  for (let turn = 1; turn <= Number(currentTurn); turn++) {
    const action = player.turns && player.turns[turn]
      ? player.turns[turn]
      : null;

    if (!action) {
      result.push({
        turn: turn,
        rowType: 'empty',
        actionId: '',
        actionLabel: '-',
        effectShort: ''
      });
      continue;
    }

    if (Array.isArray(action.actions) && action.actions.length > 0) {
      action.actions.forEach(function(item) {
        result.push({
          turn: turn,
          rowType: 'action',
          actionId: item.actionId || '',
          actionLabel: item.actionLabel || item.label || '',
          effectShort: item.effectShort || ''
        });
      });
    } else {
      result.push({
        turn: turn,
        rowType: 'action',
        actionId: action.actionId || '',
        actionLabel: action.actionLabel || '',
        effectShort: action.effectShort || ''
      });

      if (action.actionId2 || action.actionLabel2) {
        result.push({
          turn: turn,
          rowType: 'action',
          actionId: action.actionId2 || '',
          actionLabel: action.actionLabel2 || '',
          effectShort: action.effectShort2 || ''
        });
      }
    }

    if (action.synergyLabel || action.synergyDescription) {
      result.push({
        turn: turn,
        rowType: 'synergy',
        actionId: action.synergyKey || '',
        actionLabel: action.synergyLabel || '組み合わせ効果',
        description: action.synergyDescription || '',
        effectShort: action.synergyEffectShort || ''
      });
    }
  }

  return result;
}

/**
 * @summary 内部処理：turn_log からプレイ日時・開始時刻・終了時刻・レポート作成日時を取得する
 * @function getReportPlayInfo_
 * @read turn_log
 * @write レポート表示用のプレイ日時情報を返す
 * @update 2026-06-30
 */
function getReportPlayInfo_() {
  const sheet = getSheet(SHEETS.TURN_LOG);

  const emptyResult = {
    playDate: '',
    playStartAt: '',
    playEndAt: '',
    reportCreatedAt: formatReportDateTime_(new Date())
  };

  if (!sheet) {
    return emptyResult;
  }

  const values = sheet.getDataRange().getValues();
  const displayValues = sheet.getDataRange().getDisplayValues();

  if (values.length <= 1) {
    return emptyResult;
  }

  const headers = displayValues[0].map(function(h) {
    return String(h).trim();
  });

  function findHeaderIndex(names) {
    for (let i = 0; i < names.length; i++) {
      const index = headers.indexOf(names[i]);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  }

  const timestampIdx = findHeaderIndex([
    'timestamp',
    'タイムスタンプ'
  ]);

  const logTypeIdx = findHeaderIndex([
    'log_type',
    'logType',
    'ログ種別'
  ]);

  if (timestampIdx === -1 || logTypeIdx === -1) {
    return emptyResult;
  }

  const actionRows = [];

  for (let i = 1; i < values.length; i++) {
    const logType = String(displayValues[i][logTypeIdx] || '').trim();

    if (logType !== 'HUMAN_ACTION') {
      continue;
    }

    const rawTimestamp = values[i][timestampIdx];
    const displayTimestamp = String(displayValues[i][timestampIdx] || '').trim();

    if (!rawTimestamp && !displayTimestamp) {
      continue;
    }

    actionRows.push({
      raw: rawTimestamp,
      display: displayTimestamp
    });
  }

  if (actionRows.length === 0) {
    return emptyResult;
  }

  const first = actionRows[0];
  const last = actionRows[actionRows.length - 1];

  return {
    playDate: formatReportDateOnly_(first.raw, first.display),
    playStartAt: formatReportTimeOnly_(first.raw, first.display),
    playEndAt: formatReportTimeOnly_(last.raw, last.display),
    reportCreatedAt: formatReportDateTime_(new Date())
  };
}

/**
 * @summary 内部処理：日時文字列から日付部分を抽出する
 * @function extractReportDate_
 * @read text
 * @write 日付部分の文字列を返す
 * @update 2026-06-30
 */
function extractReportDate_(text) {
  const value = String(text || '').trim();
  if (!value) return '';

  const parts = value.split(' ');
  return parts[0] || value;
}

/**
 * @summary 内部処理：日時文字列から時刻部分を抽出する
 * @function extractReportTime_
 * @read text
 * @write HH:mm形式の時刻文字列を返す
 * @update 2026-06-30
 */
function extractReportTime_(text) {
  const value = String(text || '').trim();
  if (!value) return '';

  const parts = value.split(' ');
  if (parts.length < 2) return '';

  return parts[1].substring(0, 5);
}

/**
 * @summary 内部処理：Date値をレポート表示用の日時形式に変換する
 * @function formatReportDateTime_
 * @read date, Session.getScriptTimeZone()
 * @write yyyy/MM/dd HH:mm形式の日時文字列を返す
 * @update 2026-06-30
 */
function formatReportDateTime_(date) {
  const timezone = Session.getScriptTimeZone() || 'Asia/Tokyo';
  return Utilities.formatDate(date, timezone, 'yyyy/MM/dd HH:mm');
}

/**
 * @summary 内部処理：Date値または表示文字列からレポート用の日付を整形する
 * @function formatReportDateOnly_
 * @read rawValue, displayValue, Session.getScriptTimeZone()
 * @write yyyy/MM/dd形式の日付文字列を返す
 * @update 2026-06-30
 */
function formatReportDateOnly_(rawValue, displayValue) {
  const timezone = Session.getScriptTimeZone() || 'Asia/Tokyo';

  if (rawValue instanceof Date) {
    return Utilities.formatDate(rawValue, timezone, 'yyyy/MM/dd');
  }

  const text = String(displayValue || rawValue || '').trim();
  if (!text) return '';

  const match = text.match(/^(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
  if (match) {
    return match[1].replace(/-/g, '/');
  }

  const parts = text.split(' ');
  return parts[0] || '';
}

/**
 * @summary 内部処理：Date値または表示文字列からレポート用の時刻を整形する
 * @function formatReportTimeOnly_
 * @read rawValue, displayValue, Session.getScriptTimeZone()
 * @write HH:mm形式の時刻文字列を返す
 * @update 2026-06-30
 */
function formatReportTimeOnly_(rawValue, displayValue) {
  const timezone = Session.getScriptTimeZone() || 'Asia/Tokyo';

  if (rawValue instanceof Date) {
    return Utilities.formatDate(rawValue, timezone, 'HH:mm');
  }

  const text = String(displayValue || rawValue || '').trim();
  if (!text) return '';

  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return match[1].padStart(2, '0') + ':' + match[2];
  }

  return '';
}

/**
 * @summary 内部処理：現在の市場シナリオ情報をレポート表示用に取得する
 * @function getReportScenarioInfo_
 * @read getWatchMarketMatrix()
 * @write シナリオIDとシナリオ名を含む情報を返す
 * @update 2026-06-30
 */
function getReportScenarioInfo_() {
  const market = getWatchMarketMatrix();

  return market.scenarioProfile || {
    scenarioId: '',
    scenarioName: ''
  };
}

/**
 * @summary 内部処理：履歴・ランキング・ミッション情報からWAIGスコアカード情報を生成する
 * @function buildWaigScoreCard_
 * @read groupId, history, ranking, playInfo, group, missionInfo, scenarioInfo
 * @write 順位・得点・改善率・バッジを含むスコアカードオブジェクトを返す
 * @update 2026-06-30
 */
function buildWaigScoreCard_(groupId, history, ranking, playInfo, group, missionInfo,scenarioInfo) {
  const start = history && history.length > 0 ? history[0] : {};
  const end = history && history.length > 0 ? history[history.length - 1] : {};
  const trafficGrowthRate =
    start.gi > 0
      ? ((end.gi - start.gi) / start.gi)
      : 0;

  const profitRate =
    end.sales > 0
      ? (end.profit / end.sales)
      : 0;

  const bounceImprovementRate =
    start.bounce > 0
      ? ((start.bounce - end.bounce) / start.bounce)
      : 0;

  const cvrImprovementRate =
    start.cvr > 0
      ? ((end.cvr - start.cvr) / start.cvr)
      : 0;
  const growthRank = ranking.findIndex(function(row) {
  return String(row.groupId) === String(groupId);
  }) + 1;
  const profitRank = getMetricRank_(ranking, groupId, 'profit', 'desc');
  const cpaRank = getMetricRank_(ranking, groupId, 'cpa', 'asc');
  const roasRank = getMetricRank_(ranking, groupId, 'roas', 'desc');

  const points = {
    growth: getPointByRank_(growthRank),
    profit: getPointByRank_(profitRank),
    cpa: getPointByRank_(cpaRank),
    roas: getPointByRank_(roasRank)
  };

  const badges = buildScoreBadges_(groupId, ranking);

  return {
    eventName: '',
    eventDate: playInfo.playDate || '',
    masterName: '亀井 耕二',
    location: '',
    scenarioName:
    (scenarioInfo.scenarioId || '') +
    ((scenarioInfo.scenarioName || '') ? '｜' + scenarioInfo.scenarioName : ''),
    selectionSummary:
    (group && group.challengeId ? group.challengeId : '') + '｜' +
    (group && group.challengeName ? group.challengeName : '') + '<br>' +
    (missionInfo.missionId || (group && group.missionId ? group.missionId : '')) + '｜' +
    (missionInfo.missionName || (group && group.missionName ? group.missionName : '')) + '｜' +
    (missionInfo.missionDifficulty || (group && group.missionDifficulty ? group.missionDifficulty : '')) + '<br>' +
    (group && group.skillId ? group.skillId : '') + '｜' +
    (group && group.skillName ? group.skillName : '') + '｜' +
    (group && group.skillActivation ? 'Turn' + group.skillActivation + '発動' : ''),
    waigVersion: 'WAIG-2.0',
    participantCount: ranking.length,
    finalRank: growthRank,

    growthRank: growthRank,
    profitRank: profitRank,
    cpaRank: cpaRank,
    roasRank: roasRank,

    points: points,
    totalPoint: points.growth + points.profit + points.cpa + points.roas,

    trafficGrowthRate: trafficGrowthRate,
    profitRate: profitRate,
    bounceImprovementRate: bounceImprovementRate,
    cvrImprovementRate: cvrImprovementRate,

    badges: badges,
    issuedAt: playInfo.reportCreatedAt || ''
  };
}

/**
 * @summary 内部処理：compare_db から指定グループのターン別成績履歴を作成する
 * @function buildGroupHistoryFromCompareData_
 * @read compare_dbデータ, groupId, currentTurn, completedGroupIds
 * @write 指定グループのターン別成績履歴と成長率順位を返す
 * @update 2026-06-30
 */
function buildGroupHistoryFromCompareData_(data, groupId, currentTurn, completedGroupIds) {
  const targetGroupId = String(groupId || '').trim();

  const growthRankMap = {};

  for (let turn = 0; turn <= Number(currentTurn); turn++) {
    const turnRows = data.values.slice(1)
      .filter(function(row) {
        const rowGroupId = String(row[data.idx('group_id')] || '').trim();

        return Number(row[data.idx('turn')]) === Number(turn) &&
          completedGroupIds.indexOf(rowGroupId) !== -1 &&
          String(row[data.idx('target_role')] || '').trim() === 'HUMAN' &&
          String(row[data.idx('sum_type')] || '').trim() === 'player';
      })
      .map(function(row) {
        return buildResultRow(row, data);
      })
      .sort(function(a, b) {
        return Number(b.growthRate || 0) - Number(a.growthRate || 0);
      });

    turnRows.forEach(function(row, index) {
      growthRankMap[turn + '_' + row.groupId] = index + 1;
    });
  }

  return data.values.slice(1)
    .filter(function(row) {
      return String(row[data.idx('group_id')]).trim() === targetGroupId &&
        String(row[data.idx('target_role')]).trim() === 'HUMAN' &&
        String(row[data.idx('sum_type')]).trim() === 'player' &&
        Number(row[data.idx('turn')]) <= Number(currentTurn);
    })
    .map(function(row) {
      const result = buildResultRow(row, data);
      result.growthRank = growthRankMap[result.turn + '_' + result.groupId] || '';
      return result;
    })
    .sort(function(a, b) {
      return Number(a.turn) - Number(b.turn);
    });
}

/**
 * @summary 内部処理：compare_db から指定ターンの利益成長率ランキングを作成する
 * @function buildTurnRankingFromCompareData_
 * @read compare_dbデータ, turn, completedGroupIds, nameMap
 * @write 指定ターンのランキング配列を返す
 * @update 2026-06-30
 */
function buildTurnRankingFromCompareData_(data, turn, completedGroupIds, nameMap) {
  const rows = data.values.slice(1)
    .filter(function(row) {
      const groupId = String(row[data.idx('group_id')] || '').trim();

      return Number(row[data.idx('turn')]) === Number(turn) &&
        completedGroupIds.indexOf(groupId) !== -1 &&
        String(row[data.idx('target_role')] || '').trim() === 'HUMAN' &&
        String(row[data.idx('sum_type')] || '').trim() === 'player';
    })
    .map(function(row) {
      return buildResultRow(row, data);
    })
    .sort(function(a, b) {
      return Number(b.growthRate || 0) - Number(a.growthRate || 0);
    });

  rows.forEach(function(row) {
    row.groupLabel = nameMap[row.groupId] || row.groupId;
  });

  return rows;
}
