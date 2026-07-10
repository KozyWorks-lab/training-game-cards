/**
 * WAIG-2
 * プレイヤー向けロジック
 *
 * 役割
 * - グループ選択
 * - プレイヤー状態取得
 * - 行動選択
 * - 結果取得
 */

/**
 * @summary プレイヤー画面から参照し、初期設定が完了したアクティブプレイヤー一覧を取得する
 * @function getGroupOptions
 * @read getActivePlayers(), getCompletedPlayerGroupIds_(), getGroups()
 * @write プレイヤー選択用のグループ情報配列を返す
 * @update 2026-06-30
 */
function getGroupOptions() {
  const activePlayers = getActivePlayers();
  const completedGroupIds = getCompletedPlayerGroupIds_();
  const groups = getGroups();

  const groupMap = {};

  groups.forEach(function(group) {
    const groupId = String(group.groupId || '').trim();

    if (!groupId) return;

    groupMap[groupId] = group;
  });

  return activePlayers
    .filter(function(player) {
      return completedGroupIds.indexOf(player.groupId) !== -1;
    })
    .map(function(player) {
      const groupId = String(player.groupId || '').trim();
      const group = groupMap[groupId] || {};

      return {
        groupId: player.groupId,
        displayName: player.displayName || player.groupLabel || player.groupId,
        groupLabel: player.groupLabel || player.displayName || player.groupId,

        challengeId: group.challengeId || player.challengeId || '',
        challengeName: group.challengeLabel || group.challengeName || player.challengeName || '',

        missionId: group.missionId || player.missionId || '',
        missionName: group.missionLabel || group.missionName || '',
        missionDifficulty: group.missionDifficulty || '',

        skillId: group.skillId || '',
        skillName: group.skillLabel || group.skillName || '',
        skillActivation: group.activation || group.skillActivation || ''
      };
    });
}

/**
 * @summary プレイヤー表示用に、グループIDと表示名の対応表を取得する
 * @function getGroupDisplayNameMap
 * @read member_log
 * @write group_id をキー、display_name を値とするMapオブジェクトを返す
 * @update 2026-06-30
 */
function getGroupDisplayNameMap() {
  const sheet = getSheet('member_log');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {};
  }

  const headers = values[0].map(h => String(h).trim());

  const groupIdIndex = headers.indexOf('group_id');
  const displayNameIndex = headers.indexOf('display_name');
  const roleIndex = headers.indexOf('role');
  const statusIndex = headers.indexOf('status');

  const map = {};

  values.slice(1).forEach(row => {
    const groupId = String(row[groupIdIndex]).trim();
    const displayName = String(row[displayNameIndex]).trim();
    const role = roleIndex >= 0 ? String(row[roleIndex]).trim() : '';
    const status = statusIndex >= 0 ? String(row[statusIndex]).trim() : '';

    if (!groupId) return;
    if (!groupId || groupId === 'G0' || groupId === 'G00' || groupId === 'GM') return;
    if (role === 'GM') return;
    if (status && status !== 'active') return;

    map[groupId] = displayName || groupId;
  });

  return map;
}

/**
 * @summary プレイヤー画面から参照し、現在ターン情報を取得する
 * @function getCurrentTurnState
 * @read getCurrentTurn()
 * @write currentTurn を持つ状態オブジェクトを返す
 * @update 2026-06-30
 */
function getCurrentTurnState() {
  return {
    currentTurn: getCurrentTurn()
  };
}

/**
 * @summary プレイヤー画面から参照し、参加可能なプレイヤー一覧と初期設定情報を取得する
 * @function getPlayerGroupList
 * @read getActivePlayers(), getCompletedPlayerGroupIds_(), getGroups()
 * @write プレイヤー一覧と課題・ミッション・スキル情報を返す
 * @update 2026-06-30
 */
function getPlayerGroupList() {
  const activePlayers = getActivePlayers();
  const completedGroupIds = getCompletedPlayerGroupIds_();
  const groups = getGroups();

  const groupMap = {};

  groups.forEach(function(group) {
    groupMap[String(group.groupId || '').trim()] = group;
  });

  return activePlayers
    .filter(function(player) {
      return completedGroupIds.indexOf(player.groupId) !== -1;
    })
    .map(function(player) {
      const groupId = String(player.groupId || '').trim();
      const group = groupMap[groupId] || {};

      return {
        groupId: groupId,
        displayName: player.displayName || player.groupLabel || groupId,
        groupLabel: player.groupLabel || player.displayName || groupId,

        challengeId: group.challengeId || '',
	challengeName: group.challengeLabel || group.challengeName || '',
	challengeLabel: group.challengeLabel || group.challengeName || '',

	missionId: group.missionId || '',
	missionName: group.missionLabel || group.missionName || '',
	missionLabel: group.missionLabel || group.missionName || '',
	missionDifficulty: group.missionDifficulty || '',

	skillId: group.skillId || '',
	skillName: group.skillLabel || group.skillName || '',
	skillLabel: group.skillLabel || group.skillName || '',
	skillActivation: group.activation || group.skillActivation || '',
	activation: group.activation || group.skillActivation || ''
      };
    });
}

/**
 * @summary プレイヤー画面から参照し、指定グループの現在状態と初期設定情報を取得する
 * @function getPlayerState
 * @read groupId, getGroups(), getCurrentTurn()
 * @write 指定グループの現在ターン・課題・ミッション・スキル情報を返す
 * @update 2026-06-30
 */
function getPlayerState(groupId) {
  const groups = getGroups();

  const group = groups.find(function(g) {
    return String(g.groupId || '').trim() === String(groupId || '').trim();
  });

  if (!group) {
    throw new Error('このプレイヤーはまだ初期設定されていません: ' + groupId);
  }

  const currentTurn = getCurrentTurn();

  return {
    groupId: group.groupId,
    currentTurn: currentTurn,

    challengeId: group.challengeId,
    challengeName: group.challengeLabel || group.challengeName || '',

    missionId: group.missionId,
    missionName: group.missionLabel || group.missionName || '',
    missionDifficulty: group.missionDifficulty || '',

    skillId: group.skillId,
    skillName: group.skillLabel || group.skillName || '',
    skillActivation: group.activation || group.skillActivation || ''
  };
}

/**
 * @summary プレイヤー施策選択画面から参照し、現在ターンに必要な表示状態をまとめて取得する
 * @function getPlayerActionScreenState
 * @read groupId, getPlayerState(), getScenarioState(), getActionPageState()
 * @write プレイヤー状態・市場環境・施策選択状態を含む画面表示用オブジェクトを返す
 * @update 2026-06-30
 */
function getPlayerActionScreenState(groupId) {
  const start = new Date().getTime();

  const playerState = getPlayerState(groupId);
  const tPlayerState = new Date().getTime();

  const currentTurn = Number(playerState.currentTurn);

  const result = {
    playerState: playerState,
    currentTurn: currentTurn,
    previousTurnResult: null,
    scenarioState: null,
    actionPageState: null
  };

  if (currentTurn === 0) {
    console.log('getPlayerState:', tPlayerState - start, 'ms');
    console.log('total:', new Date().getTime() - start, 'ms');
    return result;
  }

  result.scenarioState = getScenarioState(currentTurn);
  const tScenario = new Date().getTime();

  result.actionPageState = getActionPageState(groupId);
  const tAction = new Date().getTime();

  console.log('getPlayerState:', tPlayerState - start, 'ms');
  console.log('getScenarioState:', tScenario - tPlayerState, 'ms');
  console.log('getActionPageState:', tAction - tScenario, 'ms');
  console.log('total:', tAction - start, 'ms');

  return result;
}

/**
 * @summary プレイヤー施策選択画面から参照し、選択可能な施策カード一覧を取得する
 * @function getActionOptions
 * @read ac_mst, getCachedSheetValues_()
 * @write actionId, actionLabel, description を持つ施策一覧を返す
 * @update 2026-06-30
 */
function getActionOptions() {
  const values = getCachedSheetValues_('ac_mst', 600);
  const headers = values[0];

  const idIndex = headers.indexOf('action_id');
  const labelIndex = headers.indexOf('action_label');
  const descIndex = headers.indexOf('description');

  return values.slice(1)
    .filter(row => row[idIndex])
    .map(row => ({
      actionId: row[idIndex],
      actionLabel: row[labelIndex],
      description: row[descIndex]
    }));
}

/**
 * @summary プレイヤー施策選択画面から参照し、提出状態・使用済み施策・施策一覧を取得する
 * @function getActionPageState
 * @read groupId, getSubmitState(), getUsedActionIds(), getActionOptions()
 * @write 施策選択画面表示用の状態オブジェクトを返す
 * @update 2026-06-30
 */
function getActionPageState(groupId) {
  const submitState = getSubmitState(groupId);
  const usedActionIds = getUsedActionIds(groupId);
  const actions = getActionOptions();

  return {
    submitState: submitState,
    usedActionIds: usedActionIds,
    actions: actions
  };
}

/**
 * @summary プレイヤー画面から実行し、現在ターンの施策2枚を提出または再提出する
 * @function submitTurnAction
 * @read data, turn_log, getCurrentTurn(), validateUnusedAction_()
 * @write turn_log に HUMAN_ACTION を追加または更新し、提出結果を返す
 * @update 2026-06-30
 */
function submitTurnAction(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const sheet = getSheet('turn_log');
    const values = sheet.getDataRange().getValues();

    const currentTurn = Number(getCurrentTurn());
    const targetGroupId = String(data.groupId || '').trim();

    // 2施策対応
    // 新方式：data.actionIds = ['A01', 'A13']
    // 旧方式：data.actionId = 'A01' も一応吸収する
    let targetActionIds = [];

    if (Array.isArray(data.actionIds)) {
      targetActionIds = data.actionIds
        .map(function(id) {
          return String(id || '').trim();
        })
        .filter(Boolean);
    } else if (data.actionId) {
      targetActionIds = [String(data.actionId || '').trim()];
    }

    if (!targetGroupId) {
      throw new Error('プレイヤーIDが指定されていません。');
    }

    if (currentTurn <= 0) {
      throw new Error('まだ施策を提出できるターンではありません。');
    }

    if (targetActionIds.length !== 2) {
      throw new Error('施策は2つ選択してください。');
    }

    if (targetActionIds[0] === targetActionIds[1] && targetActionIds[0] !== 'A00') {
      throw new Error('同じ施策を2つ選ぶことはできません。');
    }

    const action1 = targetActionIds[0];
    const action2 = targetActionIds[1];

    // 過去ターンで採用済みの施策は提出不可。
    // ただし、現在ターンで提出済みの施策をそのまま再提出する場合は許可。
    validateUnusedAction_(targetGroupId, action1, currentTurn);
    validateUnusedAction_(targetGroupId, action2, currentTurn);

    const headers = values[0].map(function(h) {
      return String(h).trim();
    });

    const logTypeIndex = headers.indexOf('log_type');
    const turnIndex = headers.indexOf('turn');
    const groupIdIndex = headers.indexOf('group_id');
    const roleIndex = headers.indexOf('role');
    const action1Index = headers.indexOf('action_1');
    const action2Index = headers.indexOf('action_2');

    if (
      logTypeIndex < 0 ||
      turnIndex < 0 ||
      groupIdIndex < 0 ||
      roleIndex < 0 ||
      action1Index < 0 ||
      action2Index < 0
    ) {
      throw new Error('turn_log の列構成が想定と異なります。');
    }

    const submittedIndex = values.slice(1).findIndex(function(row) {
      return String(row[logTypeIndex]).trim() === 'HUMAN_ACTION' &&
             Number(row[turnIndex]) === currentTurn &&
             String(row[groupIdIndex]).trim() === targetGroupId;
    });

    if (submittedIndex >= 0) {
      const targetRow = submittedIndex + 2;

      sheet.getRange(targetRow, 1).setValue(new Date());
      sheet.getRange(targetRow, roleIndex + 1).setValue('HUMAN');
      sheet.getRange(targetRow, action1Index + 1).setValue(action1);
      sheet.getRange(targetRow, action2Index + 1).setValue(action2);

      return {
        success: true,
        mode: 'update',
        groupId: targetGroupId,
        turn: currentTurn,
        actionIds: [action1, action2],
        actionId: action1,
        writtenRow: targetRow
      };
    }

    const nextRow = sheet.getLastRow() + 1;

    // 既存の列順に依存しすぎないよう、ヘッダー位置を使って書き込む
    sheet.getRange(nextRow, 1).setValue(new Date());
    sheet.getRange(nextRow, logTypeIndex + 1).setValue('HUMAN_ACTION');
    sheet.getRange(nextRow, turnIndex + 1).setValue(currentTurn);
    sheet.getRange(nextRow, groupIdIndex + 1).setValue(targetGroupId);
    sheet.getRange(nextRow, roleIndex + 1).setValue('HUMAN');
    sheet.getRange(nextRow, action1Index + 1).setValue(action1);
    sheet.getRange(nextRow, action2Index + 1).setValue(action2);

    return {
      success: true,
      mode: 'insert',
      groupId: targetGroupId,
      turn: currentTurn,
      actionIds: [action1, action2],
      actionId: action1,
      writtenRow: nextRow
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * @summary プレイヤー施策選択画面から参照し、現在ターンに必要な表示状態をまとめて取得する
 * @function getPlayerActionScreenState
 * @read groupId, getPlayerState(), getScenarioState(), getActionPageState()
 * @write プレイヤー状態・市場環境・施策選択状態を含む画面表示用オブジェクトを返す
 * @update 2026-06-30
 */
function getPlayerActionScreenState(groupId) {
  const start = new Date().getTime();

  const playerState = getPlayerState(groupId);
  const tPlayerState = new Date().getTime();

  const currentTurn = Number(playerState.currentTurn);

  const result = {
    playerState: playerState,
    currentTurn: currentTurn,
    previousTurnResult: null,
    scenarioState: null,
    actionPageState: null
  };

  if (currentTurn === 0) {
    console.log('getPlayerState:', tPlayerState - start, 'ms');
    console.log('total:', new Date().getTime() - start, 'ms');
    return result;
  }

  result.scenarioState = getScenarioState(currentTurn);
  const tScenario = new Date().getTime();

  result.actionPageState = getActionPageState(groupId);
  const tAction = new Date().getTime();

  console.log('getPlayerState:', tPlayerState - start, 'ms');
  console.log('getScenarioState:', tScenario - tPlayerState, 'ms');
  console.log('getActionPageState:', tAction - tScenario, 'ms');
  console.log('total:', tAction - start, 'ms');

  return result;
}

/**
 * @summary プレイヤー画面から参照し、現在ターンの施策提出状態を取得する
 * @function getSubmitState
 * @read groupId, turn_log, getCurrentTurn()
 * @write 提出済みフラグ、提出済み施策ID、現在ターン情報を返す
 * @update 2026-06-30
 */
function getSubmitState(groupId) {
  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  const currentTurn = Number(getCurrentTurn());
  const targetGroupId = String(groupId || '').trim();

  if (!targetGroupId) {
    throw new Error('プレイヤーIDが指定されていません。');
  }

  if (values.length <= 1) {
    return {
      currentTurn: currentTurn,
      nextTurn: currentTurn + 1,
      submitted: false,
      groupId: targetGroupId,
      turn: currentTurn,
      actionIds: []
    };
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const logTypeIndex = headers.indexOf('log_type');
  const turnIndex = headers.indexOf('turn');
  const groupIdIndex = headers.indexOf('group_id');
  const action1Index = headers.indexOf('action_1');
  const action2Index = headers.indexOf('action_2');

  if (
    logTypeIndex < 0 ||
    turnIndex < 0 ||
    groupIdIndex < 0 ||
    action1Index < 0 ||
    action2Index < 0
  ) {
    throw new Error('turn_log の列構成が想定と異なります。');
  }

  for (let i = values.length - 1; i >= 1; i--) {
    const row = values[i];

    const logType = String(row[logTypeIndex] || '').trim();
    const rowTurn = Number(row[turnIndex]);
    const rowGroupId = String(row[groupIdIndex] || '').trim();

    if (
      logType === 'HUMAN_ACTION' &&
      rowTurn === currentTurn &&
      rowGroupId === targetGroupId
    ) {
      const action1 = String(row[action1Index] || '').trim();
      const action2 = String(row[action2Index] || '').trim();

      const actionIds = [action1, action2].filter(Boolean);

      return {
        currentTurn: currentTurn,
        nextTurn: currentTurn + 1,
        submitted: true,
        groupId: targetGroupId,
        turn: currentTurn,

        // 旧互換用
        actionId: action1,

        // 2施策対応
        action1: action1,
        action2: action2,
        action_1: action1,
        action_2: action2,
        actionIds: actionIds
      };
    }
  }

  return {
    currentTurn: currentTurn,
    nextTurn: currentTurn + 1,
    submitted: false,
    groupId: targetGroupId,
    turn: currentTurn,
    actionIds: []
  };
}

/**
 * @summary プレイヤー画面から参照し、指定ターンの市場環境と競合環境を取得する
 * @function getScenarioState
 * @read turn, CURRENT_SCENARIO_ID, scenario_mst, tr_mst, tc_mst
 * @write 指定ターンのトレンド情報と3C・競合情報を返す
 * @update 2026-06-30
 */
function getScenarioState(turn) {
  const scenarioIdRaw = getSetupValue('CURRENT_SCENARIO_ID');

  const scenarioId = String(scenarioIdRaw)
    .split('｜')[0]
    .split('|')[0]
    .trim();

  const scenarioValues = getCachedSheetValues_('scenario_mst', 600);
  const trValues = getCachedSheetValues_('tr_mst', 600);
  const tcValues = getCachedSheetValues_('tc_mst', 600);

  const scenarioHeaders = scenarioValues[0].map(function(h) {
    return String(h).trim();
  });

  const trHeaders = trValues[0].map(function(h) {
    return String(h).trim();
  });

  const tcHeaders = tcValues[0].map(function(h) {
    return String(h).trim();
  });

  function scenarioIdx(name) {
    return scenarioHeaders.indexOf(name);
  }

  function trIdx(name) {
    return trHeaders.indexOf(name);
  }

  function tcIdx(name) {
    return tcHeaders.indexOf(name);
  }

  const scenarioIdIdx = scenarioIdx('scenario_id');
  const turnIdx = scenarioIdx('turn');
  const scenarioTrIdIdx = scenarioIdx('scenario_tr_id');
  const scenarioTcIdIdx = scenarioIdx('scenario_tc_id');

  const scenarioRow = scenarioValues.slice(1).find(function(row) {
    return String(row[scenarioIdIdx]).trim() === scenarioId &&
      Number(row[turnIdx]) === Number(turn);
  });

  if (!scenarioRow) {
    throw new Error('シナリオが見つかりません: ' + scenarioId + ' turn=' + turn);
  }

  const trId = String(scenarioRow[scenarioTrIdIdx] || '').trim();
  const tcId = String(scenarioRow[scenarioTcIdIdx] || '').trim();

  const trendIdIdx = trIdx('trend_id');
  const trendNameIdx = trIdx('trend_name');
  const trendEffectIdx = trIdx('effect_short');

  const tcIdIdx = tcIdx('tc_id');
  const tcNameIdx = tcIdx('tc_name');
  const tcEffectIdx = tcIdx('effect_short');

  const trendRow = trValues.slice(1).find(function(row) {
    return String(row[trendIdIdx]).trim() === trId;
  });

  const threeCRow = tcValues.slice(1).find(function(row) {
    return String(row[tcIdIdx]).trim() === tcId;
  });

  return {
    scenarioId: scenarioId,
    turn: Number(turn),

    trendId: trId,
    trendName: trendRow ? String(trendRow[trendNameIdx] || '').trim() : '',
    trendEffect: trendRow ? String(trendRow[trendEffectIdx] || '').trim() : '',

    tcId: tcId,
    tcName: threeCRow ? String(threeCRow[tcNameIdx] || '').trim() : '',
    tcEffect: threeCRow ? String(threeCRow[tcEffectIdx] || '').trim() : ''
  };
}

/**
 * @summary プレイヤー結果画面から参照し、直前ターンの成績表示情報を取得する
 * @function getTurnResultState
 * @read groupId, getCurrentTurn(), compare_db
 * @write 直前ターンのKPI・売上・利益・順位情報を返す
 * @update 2026-06-30
 */
function getTurnResultState(groupId) {
  const currentTurn = getCurrentTurn();
  const resultTurn = currentTurn - 1;

  const row = findRowByValues('compare_db', {
    turn: resultTurn,
    group_id: groupId,
    target_role: 'HUMAN',
    sum_type: 'player'
  });

  if (!row) {
    return {
      hasResult: false,
      message: '表示できるターン結果はまだありません。'
    };
  }

  return {
    hasResult: true,
    turn: resultTurn,
    groupId: row.group_id,
    displayName: row.display_name,

    gi: row.gi,
    ai: row.ai,
    bounce: row.bounce,
    browse: row.browse,
    cvr: row.cvr,
    aov: row.aov,
    cpc: row.cpc,

    sales: row.sales,
    adCost: row.ad_cost,
    profit: row.profit,
    roas: row.roas,
    rank: row.rank,
    rankDisplay: row.rank_display
  };
}

/**
 * @summary プレイヤー画面から参照し、現在ターンの市場変化と競合変化を取得する
 * @function getTurnEnvironment
 * @read getCurrentTurn(), scenario_mst, tr_mst, tc_mst
 * @write 現在ターンの市場環境テキストと博士コメントを返す
 * @update 2026-06-30
 */
function getTurnEnvironment() {
  const currentTurn = getCurrentTurn();

  const scenarioValues = getCachedSheetValues_('scenario_mst', 600);
  const trValues = getCachedSheetValues_('tr_mst', 600);
  const tcValues = getCachedSheetValues_('tc_mst', 600);

  const scenarioHeaders = scenarioValues[0].map(h => String(h).trim());

  const turnIndex = scenarioHeaders.indexOf('turn');
  const trIdIndex = scenarioHeaders.indexOf('scenario_tr_id');
  const tcIdIndex = scenarioHeaders.indexOf('scenario_tc_id');

  const scenarioRow = scenarioValues.slice(1).find(row =>
    Number(row[turnIndex]) === Number(currentTurn)
  );

  if (!scenarioRow) {
    return {
      turn: currentTurn,
      trendText: '市場変化データがありません。',
      competitorText: '競合変化データがありません。',
      hakaseComment: '今回の環境を確認してから、次の施策を考えるのですぞ。'
    };
  }

  const trId = scenarioRow[trIdIndex];
  const tcId = scenarioRow[tcIdIndex];

  const trendText = findMasterText(trValues, trId);
  const competitorText = findMasterText(tcValues, tcId);

  return {
    turn: currentTurn,
    trendId: trId,
    competitorId: tcId,
    trendText: trendText,
    competitorText: competitorText,
    hakaseComment: makeEnvironmentHakaseComment(trendText, competitorText)
  };
}

/**
 * @summary プレイヤー結果画面から参照し、指定グループの前ターン成績を取得する
 * @function getPreviousTurnResult
 * @read groupId, getCurrentTurn(), compare_db
 * @write 前ターンのKPI・売上・利益・ROAS・順位情報を返す
 * @update 2026-06-30
 */
function getPreviousTurnResult(groupId) {
  const currentTurn = getCurrentTurn();
  const previousTurn = Number(currentTurn) - 1;

  if (previousTurn < 0) {
    return null;
  }

  const sheet = getSheet('compare_db');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const row = values.slice(1).find(function(r) {
    return Number(r[idx('turn')]) === previousTurn &&
      String(r[idx('group_id')]).trim() === String(groupId).trim() &&
      String(r[idx('target_role')]).trim() === 'HUMAN';
  });

  if (!row) {
    return null;
  }

  return {
    turn: previousTurn,
     gi: row[idx('gi')],
     ai: row[idx('ai')],
     bounce: row[idx('bounce')],
     browse: row[idx('browse')],
     cvr: row[idx('cvr')],
     aov: row[idx('aov')],
     cpc: row[idx('cpc')],
     sales: row[idx('sales')],
     adCost: row[idx('ad_cost')],
     profit: row[idx('profit')],
      roas: row[idx('roas')],
      rank: row[idx('rank')]
  };
}

/**
 * @summary 内部処理：指定された現在ターンを基準に、指定グループの前ターン成績を取得する
 * @function getPreviousTurnResultByTurn_
 * @read groupId, currentTurn, compare_db
 * @write 前ターンのKPI・売上・利益・ROAS・順位情報を返す
 * @update 2026-06-30
 */
function getPreviousTurnResultByTurn_(groupId, currentTurn) {
  const previousTurn = Number(currentTurn) - 1;

  if (previousTurn < 0) {
    return null;
  }

  const sheet = getSheet('compare_db');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return null;
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const turnIdx = idx('turn');
  const groupIdIdx = idx('group_id');
  const targetRoleIdx = idx('target_role');

  const row = values.slice(1).find(function(r) {
    return Number(r[turnIdx]) === previousTurn &&
      String(r[groupIdIdx]).trim() === String(groupId).trim() &&
      String(r[targetRoleIdx]).trim() === 'HUMAN';
  });

  if (!row) {
    return null;
  }

  return {
    turn: previousTurn,
    gi: row[idx('gi')],
    ai: row[idx('ai')],
    bounce: row[idx('bounce')],
    browse: row[idx('browse')],
    cvr: row[idx('cvr')],
    aov: row[idx('aov')],
    cpc: row[idx('cpc')],
    sales: row[idx('sales')],
    adCost: row[idx('ad_cost')],
    profit: row[idx('profit')],
    roas: row[idx('roas')],
    rank: row[idx('rank')]
  };
}

/**
 * @summary プレイヤー画面から参照し、指定グループのTurn0時点のKPI初期値を取得する
 * @function getInitialKpiState
 * @read groupId, compare_db
 * @write Turn0のKPI・売上・利益・ROAS・順位情報を返す
 * @update 2026-06-30
 */
function getInitialKpiState(groupId) {
  const row = findRowByValues('compare_db', {
    turn: 0,
    group_id: groupId,
    target_role: 'HUMAN',
    sum_type: 'player'
  });

  if (!row) {
    return {
      hasInitialKpi: false,
      message: 'KPI初期値はまだ表示できません。'
    };
  }

  return {
    hasInitialKpi: true,
    turn: 0,
    groupId: row.group_id,
    displayName: row.display_name,

    gi: row.gi,
    ai: row.ai,
    bounce: row.bounce,
    browse: row.browse,
    cvr: row.cvr,
    aov: row.aov,
    cpc: row.cpc,

    sales: row.sales,
    adCost: row.ad_cost,
    profit: row.profit,
    roas: row.roas,
    rank: row.rank
  };
}

/**
 * @summary プレイヤー画面から参照し、現在ターンの制限時間と残り時間を取得する
 * @function getTimerState
 * @read getCurrentTurn(), TURN_LIMIT_MINUTES, turn_log
 * @write ターン開始時刻・制限時間・経過秒数・残り秒数を返す
 * @update 2026-06-30
 */
function getTimerState() {
  const currentTurn = Number(getCurrentTurn());

  if (currentTurn <= 0) {
    return {
      enabled: false,
      message: 'ゲーム開始前です。'
    };
  }

  const limitMinutes =
    Number(getSetupValue('TURN_LIMIT_MINUTES') || 10);

  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      enabled: false,
      message: 'turn_log にデータがありません。'
    };
  }

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  function idxAny(names) {
    for (let i = 0; i < names.length; i++) {
      const index = headers.indexOf(names[i]);
      if (index >= 0) return index;
    }
    return -1;
  }

  const timestampIndex = idxAny(['timestamp', 'タイムスタンプ']);
  const logTypeIndex = idxAny(['log_type']);
  const turnIndex = idxAny(['turn']);

  if (
    timestampIndex < 0 ||
    logTypeIndex < 0 ||
    turnIndex < 0
  ) {
    return {
      enabled: false,
      message: 'turn_log の列名が不足しています。',
      headers: headers
    };
  }

  const startRow = values.slice(1).reverse().find(function(row) {
    return String(row[logTypeIndex]).trim() === 'TURN_START' &&
      Number(row[turnIndex]) === currentTurn;
  });

  if (!startRow) {
    return {
      enabled: false,
      message: 'ターン開始時刻が見つかりません。'
    };
  }

  const startedAtValue = startRow[timestampIndex];
  let startedAt;

  if (startedAtValue instanceof Date) {
    startedAt = startedAtValue;
  } else {
    startedAt = new Date(startedAtValue);
  }

  if (isNaN(startedAt.getTime())) {
    return {
      enabled: false,
      message: 'ターン開始時刻が日付として認識できません。',
      rawStartedAt: String(startedAtValue)
    };
  }

  const now = new Date();

  const elapsedSeconds =
    Math.floor((now.getTime() - startedAt.getTime()) / 1000);

  const limitSeconds = limitMinutes * 60;

  const remainingSeconds =
    Math.max(limitSeconds - elapsedSeconds, 0);

  return {
    enabled: true,
    currentTurn: currentTurn,
    startedAt: Utilities.formatDate(
      startedAt,
      Session.getScriptTimeZone(),
      'yyyy/MM/dd HH:mm:ss'
    ),
    limitMinutes: limitMinutes,
    limitSeconds: limitSeconds,
    elapsedSeconds: elapsedSeconds,
    remainingSeconds: remainingSeconds,
    isTimeUp: remainingSeconds <= 0
  };
}

/**
 * @summary プレイヤー施策選択画面から参照し、指定グループが過去ターンで使用済みの施策ID一覧を取得する
 * @function getUsedActionIds
 * @read groupId, turn_log, getCurrentTurn()
 * @write 過去ターンで使用済みの施策ID配列を返す
 * @update 2026-06-30
 */
function getUsedActionIds(groupId) {
  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  const currentTurn = Number(getCurrentTurn());
  const targetGroupId = String(groupId || '').trim();

  if (!targetGroupId || values.length <= 1) {
    return [];
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const logTypeIndex = headers.indexOf('log_type');
  const turnIndex = headers.indexOf('turn');
  const groupIdIndex = headers.indexOf('group_id');
  const action1Index = headers.indexOf('action_1');
  const action2Index = headers.indexOf('action_2');

  if (
    logTypeIndex < 0 ||
    turnIndex < 0 ||
    groupIdIndex < 0 ||
    action1Index < 0 ||
    action2Index < 0
  ) {
    throw new Error('turn_log の列構成が想定と異なります。');
  }

  const usedMap = {};

  values.slice(1).forEach(function(row) {
    const logType = String(row[logTypeIndex] || '').trim();
    const rowTurn = Number(row[turnIndex]);
    const rowGroupId = String(row[groupIdIndex] || '').trim();

    if (logType !== 'HUMAN_ACTION') return;
    if (rowGroupId !== targetGroupId) return;

    // 現在ターンは再提出対象なので、使用済みに含めない
    if (rowTurn >= currentTurn) return;

    const action1 = String(row[action1Index] || '').trim();
    const action2 = String(row[action2Index] || '').trim();

    if (action1 && action1 !== 'A00') usedMap[action1] = true;
    if (action2 && action2 !== 'A00') usedMap[action2] = true;
  });

  return Object.keys(usedMap);
}

/**
 * @summary 内部処理：施策表示文字列から施策IDを抽出する
 * @function extractActionId_
 * @read value
 * @write A01形式の施策ID、または空文字を返す
 * @update 2026-06-30
 */
function extractActionId_(value) {
  const text = String(value || '').trim();

  if (!text) {
    return '';
  }

  const match = text.match(/^(A\d{2})/);
  return match ? match[1] : '';
}

/**
 * @summary 内部処理：指定グループ・指定ターンで提出済みの施策1IDを取得する
 * @function getCurrentTurnSubmittedActionId_
 * @read groupId, turn, turn_log
 * @write 現在ターンで提出済みの施策ID、または空文字を返す
 * @update 2026-06-30
 */
function getCurrentTurnSubmittedActionId_(groupId, turn) {
  const sheet = getSheet(SHEETS.TURN_LOG);

  if (!sheet) {
    throw new Error('turn_log シートが見つかりません。');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return '';
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    const index = headers.indexOf(name);
    if (index === -1) {
      throw new Error('turn_log に ' + name + ' 列がありません。');
    }
    return index;
  }

  const logTypeIdx = idx('log_type');
  const groupIdIdx = idx('group_id');
  const turnIdx = idx('turn');
  const action1Idx = idx('action_1');

  const targetGroupId = String(groupId || '').trim();
  const targetTurn = Number(turn);

  let submittedActionId = '';

  values.slice(1).forEach(function(row) {
    const logType = String(row[logTypeIdx] || '').trim();
    const rowGroupId = String(row[groupIdIdx] || '').trim();
    const rowTurn = Number(row[turnIdx]);

    if (
      logType === 'HUMAN_ACTION' &&
      rowGroupId === targetGroupId &&
      rowTurn === targetTurn
    ) {
      submittedActionId = extractActionId_(row[action1Idx]);
    }
  });

  return submittedActionId;
}

/**
 * @summary 内部処理：指定施策が過去ターンで使用済みでないか確認し、A00は常に許可する
 * @function validateUnusedAction_
 * @read groupId, actionId, currentTurn, extractActionId_(), getUsedActionIds(), getCurrentTurnSubmittedActionId_()
 * @write 使用可能な場合は true を返し、使用不可の場合はエラーを発生させる
 * @update 2026-07-06
 */
function validateUnusedAction_(groupId, actionId, currentTurn) {
  const targetActionId = extractActionId_(actionId);

  if (!targetActionId) {
    throw new Error('施策IDが取得できません。');
  }

  // A00｜パスは毎ターン使用可能・同一ターン2回選択可能
  if (targetActionId === 'A00') {
    return true;
  }

  const usedActionIds = getUsedActionIds(groupId);
  const currentSubmittedActionId =
    getCurrentTurnSubmittedActionId_(groupId, currentTurn);

  const isUsed = usedActionIds.indexOf(targetActionId) !== -1;
  const isCurrentSubmitted = targetActionId === currentSubmittedActionId;

  if (isUsed && !isCurrentSubmitted) {
    throw new Error(
      'この施策は過去ターンで選択済みです。別の施策を選んでください。'
    );
  }

  return true;
}

/**
 * @summary デバッグ用：指定グループの提出状態と使用済み施策IDを確認する
 * @function debugPlayerActionState
 * @read groupId, getCurrentTurn(), getSubmitState(), getUsedActionIds()
 * @write デバッグ確認用のプレイヤー施策状態を返す
 * @update 2026-06-30
 */
function debugPlayerActionState(groupId) {
  const targetGroupId = String(groupId || '').trim();
  const currentTurn = Number(getCurrentTurn());

  return {
    groupId: targetGroupId,
    currentTurn: currentTurn,
    submitState: getSubmitState(targetGroupId),
    usedActionIds: getUsedActionIds(targetGroupId)
  };
}

/**
 * @summary プレイヤー画面用：現在ターンの匿名提出状況を取得する
 * @function getPlayerSubmitProgress
 * @read turn_log, group_setup, getCurrentTurn(), getGroupOptions()
 * @write 現在ターンの提出済み人数、総人数、残人数、進行率を返す
 * @update 2026-07-06
 */
function getPlayerSubmitProgress() {
  const currentTurn = Number(getCurrentTurn());
  const groups = getGroupOptions();

  const total = Array.isArray(groups) ? groups.length : 0;

  if (currentTurn <= 0 || total === 0) {
    return {
      currentTurn: currentTurn,
      total: total,
      submitted: 0,
      remaining: total,
      percent: 0,
      message: 'ターン開始前です。'
    };
  }

  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      currentTurn: currentTurn,
      total: total,
      submitted: 0,
      remaining: total,
      percent: 0,
      message: 'まだ提出はありません。'
    };
  }

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  function idx(name) {
    const index = headers.indexOf(name);
    if (index < 0) {
      throw new Error('turn_log に ' + name + ' 列がありません。');
    }
    return index;
  }

  function isActionSubmitLog_(logType) {
    const value = String(logType || '').trim();
    return value === 'HUMAN_ACTION' || value === 'GM_ACTION';
  }

  const logTypeIndex = idx('log_type');
  const turnIndex = idx('turn');
  const groupIdIndex = idx('group_id');

  const activeGroupMap = {};
  groups.forEach(function(group) {
    const groupId = String(group.groupId || '').trim();
    if (groupId) {
      activeGroupMap[groupId] = true;
    }
  });

  const submittedMap = {};

  values.slice(1).forEach(function(row) {
    const logType = String(row[logTypeIndex] || '').trim();
    const rowTurn = Number(row[turnIndex]);
    const groupId = String(row[groupIdIndex] || '').trim();

    if (!isActionSubmitLog_(logType)) {
      return;
    }

    if (rowTurn !== currentTurn) {
      return;
    }

    if (!activeGroupMap[groupId]) {
      return;
    }

    submittedMap[groupId] = true;
  });

  const submitted = Object.keys(submittedMap).length;
  const remaining = Math.max(total - submitted, 0);
  const percent = total > 0 ? Math.round((submitted / total) * 100) : 0;

  let message = '';

  if (remaining === 0) {
    message = '全員の提出が完了しました。ターン終了を待っています。';
  } else {
    message = 'あと' + remaining + '人の提出を待っています。';
  }

  return {
    currentTurn: currentTurn,
    total: total,
    submitted: submitted,
    remaining: remaining,
    percent: percent,
    message: message
  };
}
