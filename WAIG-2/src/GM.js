

/**
 * @summary 内部処理：CONFIGで指定されたスプレッドシートを取得する
 * @function getSpreadsheet
 * @read CONFIG.SPREADSHEET_ID
 * @write Spreadsheetオブジェクトを返す
 * @update 2026-06-30
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

/**
 * @summary 内部処理：指定されたシート名のシートを取得する
 * @function getSheet
 * @read sheetName, getSpreadsheet()
 * @write Sheetオブジェクトを返す
 * @update 2026-06-30
 */
function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

/**
 * @summary スプレッドシート内のシート名一覧をログ出力する
 * @function listSheets
 * @read Spreadsheet
 * @write Logger
 * @update 2026-06-29
 * @note 開発・動作確認用の診断関数
 */
function listSheets() {
  const ss = getSpreadsheet();
  const sheets = ss.getSheets();

  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('Sheet count: ' + sheets.length);

  sheets.forEach(sheet => {
    Logger.log(sheet.getName());
  });
}

/**
 * @summary 有効なグループ初期設定の最新データを取得する
 * @function getGroups
 * @read group_setup
 * @write
 * @update 2026-06-29
 * @note group_idごとにis_valid_group=trueの最新行を返す
 */
function getGroups() {
  const sheet = getSheet('group_setup');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  function idx(name) {
    const index = headers.indexOf(name);
    if (index === -1) {
      throw new Error('group_setupに列がありません: ' + name);
    }
    return index;
  }

  const latestByGroup = {};

  values.slice(1).forEach(function(row) {
    const groupId = String(row[idx('group_id')] || '').trim();
    const timestamp = row[idx('timestamp')];
    const isValidGroup = row[idx('is_valid_group')];

    if (!groupId || isValidGroup !== true) return;

    if (!latestByGroup[groupId]) {
      latestByGroup[groupId] = row;
      return;
    }

    const currentTimestamp = latestByGroup[groupId][idx('timestamp')];

    if (new Date(timestamp) > new Date(currentTimestamp)) {
      latestByGroup[groupId] = row;
    }
  });

  return Object.values(latestByGroup).map(function(row) {
    return {
      timestamp: row[idx('timestamp')],
      groupId: row[idx('group_id')],

      challengeId: row[idx('challenge_id')],
      challengeName: row[idx('challenge_label')],
      challengeLabel: row[idx('challenge_label')],

      missionId: row[idx('mission_id')],
      missionLabel: row[idx('mission_label')],
      missionDifficulty: row[idx('mission_difficulty')],

      skillId: row[idx('skill_id')],
      skillName: row[idx('skill_label')],
      skillLabel: row[idx('skill_label')],
      skillActivation: row[idx('activation')],
      activation: row[idx('activation')],

      scenarioId: row[idx('scenario_id')],
      scenarioName: row[idx('scenario_name')],
      scenarioDifficulty: row[idx('scenario_difficulty')],

      status: row[idx('status')],
      isValidGroup: row[idx('is_valid_group')],
      setupStatus: row[idx('setup_status')],

      memo: row[idx('memo')]
    };
  });
}

/**
 * @summary 現在ターンにおける各グループの施策提出状況を取得する
 * @function getSubmissionStatus
 * @read turn_log, group_setup, action_mst, setup
 * @write 現在ターンの提出状況、ターン終了状態、全員提出済み判定を返す
 * @update 2026-07-06
 * @note HUMAN_ACTION または GM_ACTION の有無で提出済みを判定し、TURN_ENDの有無でターン終了状態を判定する
 */
function getSubmissionStatus() {
  const currentTurn = getCurrentTurn();

  const groups = getGroupOptions();

  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  function isActionSubmitLog_(logType) {
    const value = String(logType || '').trim();
    return value === 'HUMAN_ACTION' || value === 'GM_ACTION';
  }

  const actionLabelMap = getActionLabelMap();

  const statusList = groups.map(function(group) {
    const submittedRow = values.slice(1).reverse().find(function(row) {
      return isActionSubmitLog_(row[idx('log_type')]) &&
        Number(row[idx('turn')]) === Number(currentTurn) &&
        String(row[idx('group_id')]).trim() === String(group.groupId).trim();
    });

    const submitted = !!submittedRow;

    const action1Id = submittedRow
      ? String(submittedRow[idx('action_1')]).trim()
      : '';

    const action2Id = submittedRow
      ? String(submittedRow[idx('action_2')]).trim()
      : '';

    const logType = submittedRow
      ? String(submittedRow[idx('log_type')]).trim()
      : '';

    return {
      currentTurn: currentTurn,
      groupId: group.groupId,
      displayName: group.displayName || group.groupId,
      submitted: submitted,
      logType: logType,
      isGmAction: logType === 'GM_ACTION',
      action1: actionLabelMap[action1Id] || action1Id,
      action2: actionLabelMap[action2Id] || action2Id
    };
  });

  const turnEnded = values.slice(1).some(function(row) {
    return String(row[idx('log_type')]).trim() === 'TURN_END' &&
      Number(row[idx('turn')]) === Number(currentTurn);
  });

  const maxTurn = getMaxTurn();

  return {
    currentTurn: currentTurn,
    maxTurn: maxTurn,
    turnEnded: turnEnded,
    gameEnded: currentTurn >= maxTurn && turnEnded,
    allSubmitted: statusList.every(function(row) {
      return row.submitted;
    }),
    groups: statusList
  };
}

/**
 * @summary 内部処理：行データから指定インデックスの値を取得する
 * @function rowValue
 * @read row, index
 * @write 指定位置のセル値、または空文字を返す
 * @update 2026-06-30
 */
function rowValue(row, index) {
  if (index < 0) return '';
  return row[index];
}

/**
 * @summary 施策マスタから施策IDと施策ラベルの対応表を作成する
 * @function getActionLabelMap
 * @read ac_mst, getCachedSheetValues_()
 * @write 施策IDをキー、施策ラベルを値とするMapオブジェクトを返す
 * @update 2026-06-30
 */
function getActionLabelMap() {
  const values = getCachedSheetValues_('ac_mst', 600);
  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  const idIndex = headers.indexOf('action_id');
  const labelIndex = headers.indexOf('action_label');

  const map = {};

  values.slice(1).forEach(function(row) {
    const actionId = String(row[idIndex]).trim();
    const actionLabel = String(row[labelIndex]).trim();

    if (!actionId) return;

    map[actionId] = actionLabel || actionId;
  });

  return map;
}

/**
 * @summary GM画面から実行し、全グループ提出済みの場合に現在ターンを終了する
 * @function endCurrentTurn
 * @read getSubmissionStatus(), turn_log
 * @write turn_log に TURN_END ログを追加し、処理結果を返す
 * @update 2026-06-30
 */
function endCurrentTurn() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const status = getSubmissionStatus();

    if (!status.allSubmitted) {
      throw new Error('未提出のグループがあります。ターン終了できません。');
    }

    if (status.turnEnded) {
      throw new Error('このターンはすでに終了しています。');
    }

    const sheet = getSheet('turn_log');
    const nextRow = sheet.getLastRow() + 1;

    // A〜D列
    sheet.getRange(nextRow, 1, 1, 4).setValues([[
      new Date(),
      'TURN_END',
      status.currentTurn,
      'GM'
    ]]);

    // E列 member_id は数式列なので書かない
    // F列 role
    sheet.getRange(nextRow, 6).setValue('GM');

    return {
      success: true,
      turn: status.currentTurn
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * @summary GM画面から実行し、現在ターンの終了確認後に次ターンを開始する
 * @function startNextTurn
 * @read getCurrentTurn(), turn_log
 * @write turn_log に TURN_START ログを追加し、success と turn を返す
 * @update 2026-06-30
 */
function startNextTurn() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {

    const currentTurn = getCurrentTurn();

    const sheet = getSheet('turn_log');
    const values = sheet.getDataRange().getValues();

    const headers = values[0].map(function(header) {
      return String(header).trim();
    });

    function idx(name) {
      return headers.indexOf(name);
    }

    const nextTurn = currentTurn + 1;

    // Turn1以降はTURN_END必須
    if (currentTurn > 0) {

      const turnEnded = values.slice(1).some(function(row) {
        return String(row[idx('log_type')]).trim() === 'TURN_END' &&
          Number(row[idx('turn')]) === Number(currentTurn);
      });

      if (!turnEnded) {
        throw new Error(
          'ターン ' +
          currentTurn +
          ' が終了していません。'
        );
      }
    }

    // 二重開始防止
    const alreadyStarted = values.slice(1).some(function(row) {
      return String(row[idx('log_type')]).trim() === 'TURN_START' &&
        Number(row[idx('turn')]) === Number(nextTurn);
    });

    if (alreadyStarted) {
      throw new Error(
        'ターン ' +
        nextTurn +
        ' はすでに開始済みです。'
      );
    }

    const nextRow = sheet.getLastRow() + 1;

    // A〜D列
    sheet.getRange(nextRow, 1, 1, 4).setValues([[
      new Date(),
      'TURN_START',
      nextTurn,
      'GM'
    ]]);

    // F列 role
    sheet.getRange(nextRow, 6).setValue('GM');

    return {
      success: true,
      turn: nextTurn
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * @summary GM画面から実行し、turn_log の入力済みターンログを初期化する
 * @function resetTurnLog
 * @read turn_log
 * @write turn_log の2行目以降のA〜D列、F〜R列をクリアし、処理結果を返す
 * @update 2026-06-30
 */
function resetTurnLog() {
  const sheet = getSheet('turn_log');

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return {
      success: true,
      clearedRows: 0
    };
  }

  const rowCount = lastRow - 1;

  // A〜D列をクリア
  sheet.getRange(2, 1, rowCount, 4).clearContent();

  // F〜R列をクリア
  sheet.getRange(2, 6, rowCount, 13).clearContent();

  return {
    success: true,
    clearedRows: rowCount
  };
}

/**
 * @summary GM画面から実行し、メンバー登録ログを初期化する
 * @function resetMemberLog
 * @read SHEETS.MEMBER_LOG
 * @write member_log の2行目以降をクリアし、処理結果を返す
 * @update 2026-06-30
 */
function resetMemberLog() {
  const sheet = getSheet(SHEETS.MEMBER_LOG);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow <= 1) {
    return {
      success: true,
      clearedRows: 0,
      message: 'クリア対象のメンバー登録はありません。'
    };
  }

  const clearRows = lastRow - 1;

  sheet
    .getRange(2, 1, clearRows, lastColumn)
    .clearContent();

  return {
    success: true,
    clearedRows: clearRows,
    message: 'メンバー登録をクリアしました。'
  };
}

/**
 * @summary GM画面から実行し、グループ初期設定ログを初期化する
 * @function resetGroupSetup
 * @read SHEETS.GROUP_SETUP
 * @write group_setup の2行目以降をクリアし、処理結果を返す
 * @update 2026-06-30
 */
function resetGroupSetup() {
  const sheet = getSheet(SHEETS.GROUP_SETUP);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow <= 1) {
    return {
      success: true,
      clearedRows: 0,
      message: 'クリア対象のグループ初期設定はありません。'
    };
  }

  const clearRows = lastRow - 1;

  sheet
    .getRange(2, 1, clearRows, lastColumn)
    .clearContent();

  return {
    success: true,
    clearedRows: clearRows,
    message: 'グループ初期設定をクリアしました。'
  };
}

/**
 * @summary GM画面から参照し、メンバー登録とグループ初期設定の完了状況を取得する
 * @function getMemberGroupStatus
 * @read member_log, group_setup, CONFIG.SPREADSHEET_ID, SHEETS.MEMBER_LOG, SHEETS.GROUP_SETUP
 * @write グループごとのメンバー登録状況と初期設定状況の一覧を返す
 * @update 2026-06-30
 */
function getMemberGroupStatus() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const memberSheet = ss.getSheetByName(SHEETS.MEMBER_LOG);
  const setupSheet = ss.getSheetByName(SHEETS.GROUP_SETUP);

  if (!memberSheet) throw new Error('member_log シートが見つかりません');
  if (!setupSheet) throw new Error('group_setup シートが見つかりません');

  const members = memberSheet.getDataRange().getValues();
  const setups = setupSheet.getDataRange().getValues();

  const memberHeader = members[0].map(function(h) {
    return String(h).trim();
  });

  const setupHeader = setups[0].map(function(h) {
    return String(h).trim();
  });

  const mGroupCol = memberHeader.indexOf('group_id');
  const mNameCol = memberHeader.indexOf('display_name');
  const mStatusCol = memberHeader.indexOf('status');

  const sGroupCol = setupHeader.indexOf('group_id');
  const sChallengeCol = setupHeader.indexOf('challenge_id');
  const sMissionCol = setupHeader.indexOf('mission_id');
  const sSkillCol = setupHeader.indexOf('skill_id');

  if (mGroupCol === -1) throw new Error('member_log に group_id 列がありません');
  if (mNameCol === -1) throw new Error('member_log に display_name 列がありません');
  if (mStatusCol === -1) throw new Error('member_log に status 列がありません');

  if (sGroupCol === -1) throw new Error('group_setup に group_id 列がありません');
  if (sChallengeCol === -1) throw new Error('group_setup に challenge_id 列がありません');
  if (sMissionCol === -1) throw new Error('group_setup に mission_id 列がありません');
  if (sSkillCol === -1) throw new Error('group_setup に skill_id 列がありません');

  const setupMap = {};

  setups.slice(1).forEach(function(row) {
    const groupId = row[sGroupCol];
    if (!groupId || groupId === 'G0' || groupId === 'G00' || groupId === 'GM') return;

    const challengeId = row[sChallengeCol];
    const missionId = row[sMissionCol];
    const skillId = row[sSkillCol];

    // 空白行や未完了行で上書きしない
    if (!challengeId || !missionId || !skillId) return;

    setupMap[groupId] = {
      challengeId: challengeId,
      missionId: missionId,
      skillId: skillId
    };
  });

  const memberMap = {};

  members.slice(1).forEach(function(row) {
    const groupId = row[mGroupCol];
    const status = row[mStatusCol];

    if (!groupId || groupId === 'G0' || groupId === 'G00' || groupId === 'GM') return;
    if (status !== 'active') return;

    memberMap[groupId] = {
      groupId: groupId,
      displayName: row[mNameCol] || groupId,
      memberStatus: '登録済'
    };
  });

  return Object.values(memberMap)
    .map(function(member) {
      const setup = setupMap[member.groupId];

      const isSetupDone =
        setup &&
        setup.challengeId &&
        setup.missionId &&
        setup.skillId;

      return {
        groupId: member.groupId,
        displayName: member.displayName,
        memberStatus: member.memberStatus,
        setupStatus: isSetupDone ? '完了' : '未設定'
      };
    })
    .sort(function(a, b) {
      return getGroupNumber_(a.groupId) - getGroupNumber_(b.groupId);
    });
}

function getGroupNumber_(groupId) {
  return Number(String(groupId).replace('G', '')) || 999;
}

/**
 * @summary GM画面から実行し、未提出プレイヤーをA00+A00の一手パスとして処理する
 * @function submitPassByGm
 * @read groupId, turn_log, getCurrentTurn()
 * @write turn_log に GM_ACTION / A00 / A00 を追加する
 * @update 2026-07-06
 */
function submitPassByGm(groupId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const sheet = getSheet('turn_log');
    const values = sheet.getDataRange().getValues();

    const currentTurn = Number(getCurrentTurn());
    const targetGroupId = String(groupId || '').trim();

    if (!targetGroupId) {
      throw new Error('プレイヤーIDが指定されていません。');
    }

    if (currentTurn <= 0) {
      throw new Error('まだ施策を提出できるターンではありません。');
    }

    if (values.length <= 0) {
      throw new Error('turn_log にヘッダー行がありません。');
    }

    const headers = values[0].map(function(h) {
      return String(h).trim();
    });

    function idx(name) {
      const index = headers.indexOf(name);
      if (index < 0) {
        throw new Error('turn_log に ' + name + ' 列がありません。');
      }
      return index;
    }

    const logTypeIndex = idx('log_type');
    const turnIndex = idx('turn');
    const groupIdIndex = idx('group_id');
    const roleIndex = idx('role');
    const action1Index = idx('action_1');
    const action2Index = idx('action_2');

    const memberIdIndex = headers.indexOf('member_id');
    const memoIndex = headers.indexOf('memo');

    const alreadySubmitted = values.slice(1).some(function(row) {
      const logType = String(row[logTypeIndex] || '').trim();
      const rowTurn = Number(row[turnIndex]);
      const rowGroupId = String(row[groupIdIndex] || '').trim();

      return (
        (logType === 'HUMAN_ACTION' || logType === 'GM_ACTION') &&
        rowTurn === currentTurn &&
        rowGroupId === targetGroupId
      );
    });

    if (alreadySubmitted) {
      throw new Error('このプレイヤーはすでに提出済みです。');
    }

    const nextRow = sheet.getLastRow() + 1;

    sheet.getRange(nextRow, 1).setValue(new Date());
    sheet.getRange(nextRow, logTypeIndex + 1).setValue('GM_ACTION');
    sheet.getRange(nextRow, turnIndex + 1).setValue(currentTurn);
    sheet.getRange(nextRow, groupIdIndex + 1).setValue(targetGroupId);

    if (memberIdIndex >= 0) {
      sheet.getRange(nextRow, memberIdIndex + 1).setValue('');
    }

    sheet.getRange(nextRow, roleIndex + 1).setValue('HUMAN');
    sheet.getRange(nextRow, action1Index + 1).setValue('A00');
    sheet.getRange(nextRow, action2Index + 1).setValue('A00');

    if (memoIndex >= 0) {
      sheet.getRange(nextRow, memoIndex + 1).setValue('GM処理：一手パス');
    }

    return {
      success: true,
      mode: 'gm_pass',
      groupId: targetGroupId,
      turn: currentTurn,
      actionIds: ['A00', 'A00'],
      writtenRow: nextRow
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * @summary GM画面から参照し、現在ターンの成績・市場環境・施策履歴をもとにAI分析用プロンプトを生成する
 * @function getAiAnalysisPrompt
 * @read getCurrentTurn(), getTurnRanking(), getWatchMarketMatrix(), getWatchActionMatrix()
 * @write WAIG-2の振り返り分析に使うプロンプト文字列を返す
 * @update 2026-06-30
 */
function getAiAnalysisPrompt() {
  const currentTurn = Number(getCurrentTurn());

  const ranking = getTurnRanking(currentTurn);

  const rawMarketMatrix = getWatchMarketMatrix();
  const marketMatrix = normalizeMarketMatrixForPrompt_(rawMarketMatrix);

  const actionMatrix = getWatchActionMatrix();

  let text = '';

  text += '# WAIG-2 ゲーム結果分析プロンプト\n\n';

  text += 'あなたは、EC改善を題材にした意思決定トレーニングゲーム「WAIG-2」の分析担当です。\n';
  text += '以下のデータをもとに、参加者向けの振り返りコメントを作成してください。\n\n';

  text += '## 分析の目的\n\n';
  text += '- どのプレイヤーが、なぜ良い結果を出したのかを分析する\n';
  text += '- 市場環境の変化に対して、各プレイヤーの施策選択が適切だったかを見る\n';
  text += '- 利益成長率を中心に評価する\n';
  text += '- ただし、利益成長率だけでなく、最終利益・売上・ROAS・ミッション難易度も合わせて見る\n';
  text += '- 単なる順位ではなく、意思決定の質を振り返る\n';
  text += '- 次回プレイに向けた学びを提示する\n\n';

  text += '## 勝利条件\n\n';
  text += '主な評価指標は「利益成長率」です。\n';
  text += '利益成長率は、Turn0の利益を基準に、現在利益がどれだけ伸びたかを示します。\n';
  text += 'ただし、Turn0の利益が小さいプレイヤーは、利益が増えたときに成長率が大きく表示されます。\n';
  text += 'そのため、分析では利益成長率だけでなく、最終利益・売上・ROAS・ミッション難易度・施策履歴も合わせて評価してください。\n\n';

  text += '## 最終成績：Turn ' + currentTurn + ' 利益成長率ランキング\n\n';
  text += '順位\tプレイヤー\tミッション\tミッション難易度\t利益成長率\t利益\t売上\tROAS\tCPA\tCV数\n';

  if (!ranking || ranking.length === 0) {
    text += 'ランキングデータがありません。\n';
  } else {
    ranking.forEach(function(row, index) {
      const missionText = buildPromptMissionText_(row);

      text += [
        index + 1,
        row.groupLabel || row.groupId || '',
        missionText.mission,
        missionText.difficulty,
        formatPercent(row.growthRate, 2),
        Number(row.profit || 0).toLocaleString(),
        Number(row.sales || 0).toLocaleString(),
        row.roas || '',
        Number(row.cpa || 0).toLocaleString(),
        Number(row.cvCount || 0).toLocaleString()
      ].join('\t') + '\n';
    });
  }

  text += '\n';

  text += '## ターン別市場環境\n\n';
  text += 'Turn\tトレンド\tトレンド効果\t3C・競合変化\t3C効果\n';

  if (!marketMatrix || marketMatrix.length === 0) {
    text += '市場環境データがありません。\n';
  } else {
    marketMatrix.forEach(function(row) {
      text += [
        'T' + (row.turn || ''),
        row.trendLabel || row.trendId || '',
        formatPromptEffectText_(row.trendEffect || ''),
        row.tcLabel || row.tcId || '',
        formatPromptEffectText_(row.tcEffect || '')
      ].join('\t') + '\n';
    });
  }

  text += '\n';

  text += '## 各プレイヤーの施策履歴\n\n';
  text += 'プレイヤー\tミッション\tミッション難易度\tT1\tT2\tT3\tT4\tT5\tT6\n';

  if (!actionMatrix || !Array.isArray(actionMatrix) || actionMatrix.length === 0) {
    text += '施策履歴データがありません。\n';
  } else {
    actionMatrix.forEach(function(player) {
      const line = [];

      line.push(player.groupLabel || player.displayName || player.groupId || '');

      const mission =
        (player.missionId || '') +
        (player.missionName ? '｜' + player.missionName : '');

      line.push(mission || '-');
      line.push(player.missionDifficulty || '-');

      for (let turn = 1; turn <= 6; turn++) {
        const action = player.turns ? player.turns[turn] : null;
        line.push(formatPromptActionCell_(action));
      }

      text += line.join('\t') + '\n';
    });
  }

  text += '\n';

  text += '## 分析時の注意\n\n';
  text += '- 各ターンでプレイヤーは施策カードを2枚選択しています。\n';
  text += '- 施策の組み合わせによって、追加の組み合わせ効果が発生する場合があります。\n';
  text += '- 組み合わせ効果がある場合は、単独施策だけでなく、2枚の相性も評価してください。\n';
  text += '- ミッション難易度が高いプレイヤーは、順位が低くても挑戦度が高い可能性があります。\n';
  text += '- 利益成長率が極端に大きい場合は、Turn0利益が小さかった可能性を考慮してください。\n\n';

  text += '## 出力してほしい内容\n\n';
  text += '以下の構成で、参加者に共有できる振り返りを作成してください。\n\n';
  text += '1. 全体講評\n';
  text += '2. 上位プレイヤーの勝因\n';
  text += '3. 中位・下位プレイヤーの改善ポイント\n';
  text += '4. 市場環境の変化と施策選択の関係\n';
  text += '5. 特に学びになる意思決定\n';
  text += '6. 次回プレイへのアドバイス\n\n';

  text += '文体は、やさしく、学習効果が高く、参加者を責めない表現にしてください。\n';
  text += '単に勝敗を述べるのではなく、「なぜその判断が有効だったのか」「どのタイミングで差がついたのか」を重視してください。\n';
  text += 'また、順位だけでなく、ミッション難易度や施策の組み合わせにも触れてください。\n';

  return text;
}


/**
 * @summary 内部処理：施策履歴の1ターン分をAI分析プロンプト用の文字列に整形する
 * @function formatPromptActionCell_
 * @read action, formatPromptEffectText_()
 * @write 施策名と組み合わせ効果を含む表示用文字列を返す
 * @update 2026-06-30
 */
function formatPromptActionCell_(action) {
  if (!action) {
    return '-';
  }

  const parts = [];

  if (Array.isArray(action.actions) && action.actions.length > 0) {
    const actionLabels = action.actions
      .map(function(item) {
        return item.actionLabel || item.label || item.actionId || '';
      })
      .filter(Boolean);

    if (actionLabels.length > 0) {
      parts.push(actionLabels.join(' ／ '));
    }
  } else if (action.actionLabel) {
    parts.push(action.actionLabel);
  }

  if (action.synergyLabel || action.synergyDescription) {
    let synergyText = '';

    if (action.synergyLabel) {
      synergyText += String(action.synergyLabel)
        .replace(/^組み合わせ効果：/, '');
    }

    if (action.synergyDescription) {
      synergyText += synergyText
        ? '｜' + action.synergyDescription
        : action.synergyDescription;
    }

    if (action.synergyEffectShort) {
      synergyText += '（' + formatPromptEffectText_(action.synergyEffectShort) + '）';
    }

    if (synergyText) {
      parts.push('組み合わせ効果：' + synergyText);
    }
  }

  return parts.length > 0 ? parts.join(' / ') : '-';
}

/**
 * @summary 内部処理：ランキング行のグループIDからミッション名と難易度を取得し、AI分析プロンプト用に整形する
 * @function buildPromptMissionText_
 * @read row.groupId, getGroupOptions()
 * @write mission と difficulty を持つ表示用オブジェクトを返す
 * @update 2026-06-30
 */
function buildPromptMissionText_(row) {
  const groupId = String(row.groupId || '').trim();
  const groups = getGroupOptions();
  const group = groups.find(function(item) {
    return String(item.groupId || '').trim() === groupId;
  });

  if (!group) {
    return {
      mission: '-',
      difficulty: '-'
    };
  }

  const mission =
    (group.missionId || '') +
    (group.missionName ? '｜' + group.missionName : '');

  return {
    mission: mission || '-',
    difficulty: group.missionDifficulty || '-'
  };
}

/**
 * @summary 内部処理：KPI略称をAI分析プロンプト向けの説明付き表記に変換する
 * @function formatPromptEffectText_
 * @read text
 * @write KPI略称を日本語説明付きに置換した文字列を返す
 * @update 2026-06-30
 */
function formatPromptEffectText_(text) {
  if (!text) return '';

  return String(text)
    .replace(/BO/g, '離脱率')
    .replace(/BR/g, '回遊')
    .replace(/GI/g, 'GI（一般流入）')
    .replace(/AI/g, 'AI（広告流入）')
    .replace(/CVR/g, 'CVR（購入率）')
    .replace(/AOV/g, 'AOV（平均注文額）')
    .replace(/CPC/g, 'CPC（広告単価）')
    .replace(/ROAS/g, 'ROAS（広告費回収率）');
}

/**
 * @summary 内部処理：市場環境データの形式ゆれを吸収し、AI分析プロンプト用の配列に正規化する
 * @function normalizeMarketMatrixForPrompt_
 * @read raw
 * @write turn, trendId, trendLabel, trendEffect, tcId, tcLabel, tcEffect を持つ配列を返す
 * @update 2026-06-30
 */
function normalizeMarketMatrixForPrompt_(raw) {
  if (!raw) {
    return [];
  }

  // すでに配列の場合
  if (Array.isArray(raw)) {
    // オブジェクト配列の場合
    if (raw.length === 0) {
      return [];
    }

    if (!Array.isArray(raw[0])) {
      return raw;
    }

    // 2次元配列の場合：1行目をヘッダーとして扱う
    const headers = raw[0];
    const rows = raw.slice(1);

    return rows
      .filter(function(row) {
        return row && row.join('') !== '';
      })
      .map(function(row) {
        const obj = {};

        headers.forEach(function(header, index) {
          obj[header] = row[index];
        });

        return {
          turn: obj.turn || obj.Turn || obj['ターン'] || '',
          trendId: obj.trendId || obj.trend_id || obj['トレンドID'] || '',
          trendLabel: obj.trendLabel || obj.trend_label || obj['トレンド'] || '',
          trendEffect: obj.trendEffect || obj.trend_effect || obj['トレンド効果'] || '',
          tcId: obj.tcId || obj.tc_id || obj['3C_ID'] || obj['競合ID'] || '',
          tcLabel: obj.tcLabel || obj.tc_label || obj['3C'] || obj['競合'] || '',
          tcEffect: obj.tcEffect || obj.tc_effect || obj['3C効果'] || obj['競合効果'] || ''
        };
      });
  }

  // オブジェクトで返ってきた場合の吸収
  if (raw.rows && Array.isArray(raw.rows)) {
    return raw.rows;
  }

  if (raw.data && Array.isArray(raw.data)) {
    return raw.data;
  }

  if (raw.matrix && Array.isArray(raw.matrix)) {
    return normalizeMarketMatrixForPrompt_(raw.matrix);
  }

  if (raw.marketMatrix && Array.isArray(raw.marketMatrix)) {
    return normalizeMarketMatrixForPrompt_(raw.marketMatrix);
  }

  return [];
}

/**
 * @summary GM画面から実行し、AIによる全体講評を非公開状態で保存する
 * @function saveAiFeedback
 * @read feedbackText, getCurrentTurn(), getCurrentScenarioId_(), SHEETS.AI_FEEDBACK
 * @write ai_feedback に講評本文・ターン・シナリオID・公開状態を追加し、処理結果を返す
 * @update 2026-06-30
 */
function saveAiFeedback(feedbackText) {
  const text = String(feedbackText || '').trim();

  if (!text) {
    throw new Error('保存する振り返り本文が空です。');
  }

  const sheet = getSheet(SHEETS.AI_FEEDBACK);
  const currentTurn = Number(getCurrentTurn());

  const scenarioId = getCurrentScenarioId_();

  sheet.appendRow([
    new Date(),
    scenarioId,
    currentTurn,
    'OVERALL',
    text,
    'hidden',
    'GM'
  ]);

  return {
    success: true,
    message: 'WAIG博士の振り返りを保存しました。公開するには「講評を公開」を押してください。',
    turn: currentTurn,
    scenarioId: scenarioId,
    status: 'hidden'
  };
}

/**
 * @summary GM画面から参照し、シナリオマスタとシナリオプロフィールから選択可能なシナリオ一覧を取得する
 * @function getScenarioOptions
 * @read scenario_mst, scenario_profile, getCachedSheetValues_()
 * @write シナリオID・名称・意図・難易度・ターン構成を持つシナリオ一覧を返す
 * @update 2026-06-30
 */
function getScenarioOptions() {
  const scenarioValues = getCachedSheetValues_(SHEETS.SCENARIO_MST, 600);
  const profileValues = getCachedSheetValues_(SHEETS.SCENARIO_PROFILE, 600);

  if (scenarioValues.length <= 1) {
    return [];
  }

  const scenarioHeaders = scenarioValues[0].map(function(h) {
    return String(h).trim();
  });

  function scenarioIdx(name) {
    const index = scenarioHeaders.indexOf(name);
    if (index === -1) {
      throw new Error('scenario_mst に ' + name + ' 列がありません。');
    }
    return index;
  }

  const scenarioIdIdx = scenarioIdx('scenario_id');
  const turnIdx = scenarioIdx('turn');
  const trendIdIdx = scenarioIdx('scenario_tr_id');
  const tcIdIdx = scenarioIdx('scenario_tc_id');

  const profileMap = {};

  if (profileValues.length > 1) {
    const profileHeaders = profileValues[0].map(function(h) {
      return String(h).trim();
    });

    function profileIdx(name) {
      return profileHeaders.indexOf(name);
    }

    const pScenarioIdIdx = profileIdx('scenario_id');
    const nameIdx = profileIdx('scenario_name');
    const intentIdx = profileIdx('scenario_intent');
    const difficultyIdx = profileIdx('difficulty');
    const recommendedUseIdx = profileIdx('recommended_use');
    const memoIdx = profileIdx('memo');

    profileValues.slice(1).forEach(function(row) {
      const scenarioId = String(row[pScenarioIdIdx] || '').trim();

      if (!scenarioId) {
        return;
      }

      profileMap[scenarioId] = {
        scenarioId: scenarioId,
        scenarioName: nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '',
        scenarioIntent: intentIdx >= 0 ? String(row[intentIdx] || '').trim() : '',
        difficulty: difficultyIdx >= 0 ? String(row[difficultyIdx] || '').trim() : '',
        recommendedUse: recommendedUseIdx >= 0 ? String(row[recommendedUseIdx] || '').trim() : '',
        memo: memoIdx >= 0 ? String(row[memoIdx] || '').trim() : ''
      };
    });
  }

  const scenarioMap = {};

  scenarioValues.slice(1).forEach(function(row) {
    const scenarioId = String(row[scenarioIdIdx] || '').trim();

    if (!scenarioId) {
      return;
    }

    if (!scenarioMap[scenarioId]) {
      const profile = profileMap[scenarioId] || {};

      scenarioMap[scenarioId] = {
        scenarioId: scenarioId,
        scenarioName: profile.scenarioName || '',
        scenarioIntent: profile.scenarioIntent || '',
        difficulty: profile.difficulty || '',
        recommendedUse: profile.recommendedUse || '',
        memo: profile.memo || '',
        turnCount: 0,
        turns: []
      };
    }

    const turn = Number(row[turnIdx]);
    const trendId = String(row[trendIdIdx] || '').trim();
    const tcId = String(row[tcIdIdx] || '').trim();

    scenarioMap[scenarioId].turns.push({
      turn: turn,
      trendId: trendId,
      tcId: tcId
    });

    scenarioMap[scenarioId].turnCount++;
  });

  return Object.keys(scenarioMap)
    .sort()
    .map(function(scenarioId) {
      const scenario = scenarioMap[scenarioId];

      scenario.turns.sort(function(a, b) {
        return Number(a.turn) - Number(b.turn);
      });

      scenario.scenarioLabel =
        scenario.scenarioId + '｜' +
        (scenario.scenarioName || '名称未設定') +
        '｜' +
        (scenario.difficulty || '難易度未設定');

      return scenario;
    });
}

/**
 * @summary GM画面から実行し、指定シナリオを market_event_log に反映する
 * @function applyScenarioToMarketLog
 * @read scenarioId, scenario_mst, scenario_profile, market_event_log, tr_mst, tc_mst
 * @write market_event_log の既存Turn1以降を archived にし、指定シナリオの市場イベントを active で追加する
 * @update 2026-06-30
 */
function applyScenarioToMarketLog(scenarioId) {
  const targetScenarioId = String(scenarioId || '').trim();

  if (!targetScenarioId) {
    throw new Error('シナリオIDが指定されていません。');
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const scenarioSheet = ss.getSheetByName(SHEETS.SCENARIO_MST);
  const marketSheet = ss.getSheetByName(SHEETS.MARKET_EVENT_LOG);
  const trendSheet = ss.getSheetByName(SHEETS.TR_MST);
  const tcSheet = ss.getSheetByName(SHEETS.TC_MST);
  const profileSheet = ss.getSheetByName(SHEETS.SCENARIO_PROFILE);

  if (!scenarioSheet) throw new Error('scenario_mst シートが見つかりません。');
  if (!marketSheet) throw new Error('market_event_log シートが見つかりません。');
  if (!trendSheet) throw new Error('tr_mst シートが見つかりません。');
  if (!tcSheet) throw new Error('tc_mst シートが見つかりません。');
  if (!profileSheet) throw new Error('scenario_profile シートが見つかりません。');

  const scenarioValues = scenarioSheet.getDataRange().getValues();
  const marketValues = marketSheet.getDataRange().getValues();
  const trendValues = trendSheet.getDataRange().getValues();
  const tcValues = tcSheet.getDataRange().getValues();
  const profileValues = profileSheet.getDataRange().getValues();

  if (scenarioValues.length <= 1) {
    throw new Error('scenario_mst にデータがありません。');
  }

  function buildIndexMap(values, sheetName) {
    const headers = values[0].map(function(h) {
      return String(h).trim();
    });

    return {
      idx: function(name) {
        const index = headers.indexOf(name);
        if (index === -1) {
          throw new Error(sheetName + ' に ' + name + ' 列がありません。');
        }
        return index;
      }
    };
  }

  const scenario = buildIndexMap(scenarioValues, 'scenario_mst');
  const market = buildIndexMap(marketValues, 'market_event_log');
  const trend = buildIndexMap(trendValues, 'tr_mst');
  const tc = buildIndexMap(tcValues, 'tc_mst');
  const profile = buildIndexMap(profileValues, 'scenario_profile');

  const scenarioIdIdx = scenario.idx('scenario_id');
  const turnIdx = scenario.idx('turn');
  const trendIdIdx = scenario.idx('scenario_tr_id');
  const tcIdIdx = scenario.idx('scenario_tc_id');
  const scenarioTurnKeyIdx = scenario.idx('scenario_turn_key');

  const scenarioRows = scenarioValues.slice(1)
    .filter(function(row) {
      return String(row[scenarioIdIdx] || '').trim() === targetScenarioId &&
        Number(row[turnIdx]) >= 1;
    })
    .sort(function(a, b) {
      return Number(a[turnIdx]) - Number(b[turnIdx]);
    });

  if (scenarioRows.length === 0) {
    throw new Error(targetScenarioId + ' のTurn1以降のシナリオデータがありません。');
  }

  const trendMap = {};
  trendValues.slice(1).forEach(function(row) {
    const trendId = String(row[trend.idx('trend_id')] || '').trim();
    if (!trendId) return;

    trendMap[trendId] = {
      trendLabel: row[trend.idx('trend_label')] || trendId,
      trendEffectShort: row[trend.idx('effect_short')] || ''
    };
  });

  const tcMap = {};
  tcValues.slice(1).forEach(function(row) {
    const tcId = String(row[tc.idx('tc_id')] || '').trim();
    if (!tcId) return;

    tcMap[tcId] = {
      tcLabel: row[tc.idx('tc_label')] || tcId,
      tcEffectShort: row[tc.idx('effect_short')] || ''
    };
  });

  let scenarioName = '';
  profileValues.slice(1).some(function(row) {
    const id = String(row[profile.idx('scenario_id')] || '').trim();
    if (id === targetScenarioId) {
      scenarioName = row[profile.idx('scenario_name')] || '';
      return true;
    }
    return false;
  });

  const now = new Date();

  // 既存の market_event_log の Turn1以降を archived にする
  if (marketValues.length > 1) {
    const turnIdxForMarket = market.idx('turn');
    const statusIdxForMarket = market.idx('status');

    for (let i = 2; i <= marketValues.length; i++) {
      const rowTurn = Number(
        marketSheet.getRange(i, turnIdxForMarket + 1).getValue()
      );

      const currentStatus = String(
        marketSheet.getRange(i, statusIdxForMarket + 1).getValue() || ''
      ).trim();

      if (
        rowTurn >= 1 &&
        currentStatus !== 'archived' &&
        currentStatus !== 'deleted'
      ) {
        marketSheet.getRange(i, statusIdxForMarket + 1).setValue('archived');
      }
    }
  }

  const rowsToAppend = scenarioRows.map(function(row) {
    const turn = Number(row[turnIdx]);
    const trendId = String(row[trendIdIdx] || '').trim();
    const tcId = String(row[tcIdIdx] || '').trim();
    const scenarioTurnKey = String(row[scenarioTurnKeyIdx] || '').trim();

    const trendInfo = trendMap[trendId] || {};
    const tcInfo = tcMap[tcId] || {};

    return [
      now,                                                       // timestamp
      scenarioTurnKey || targetScenarioId + '_T' + String(turn).padStart(2, '0'), // market_key
      turn,                                                      // turn
      trendId,                                                   // trend_id
      trendInfo.trendLabel || trendId,                           // trend_label
      trendInfo.trendEffectShort || '',                          // trend_effect_short
      tcId,                                                      // tc_id
      tcInfo.tcLabel || tcId,                                    // tc_label
      tcInfo.tcEffectShort || '',                                // tc_effect_short
      'SCENARIO',                                                // source_type
      targetScenarioId,                                          // scenario_id
      scenarioName,                                              // scenario_name
      'GM画面でシナリオ設定',                                      // memo
      'active'                                                   // status
    ];
  });

  marketSheet
    .getRange(
      marketSheet.getLastRow() + 1,
      1,
      rowsToAppend.length,
      rowsToAppend[0].length
    )
    .setValues(rowsToAppend);

  return {
    success: true,
    message: targetScenarioId + ' を market_event_log に反映しました。',
    scenarioId: targetScenarioId,
    scenarioName: scenarioName,
    turnCount: rowsToAppend.length
  };
}

/**
 * @summary GM画面から参照し、現在シナリオ・現在ターンのAI講評の保存状態と公開状態を取得する
 * @function getAiFeedbackStatus
 * @read ai_feedback, getCurrentScenarioId_(), getCurrentTurn()
 * @write 最新のAI講評ステータス、本文有無、プレビューを返す
 * @update 2026-06-30
 */
function getAiFeedbackStatus() {
  const sheet = getSheet('ai_feedback');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      exists: false
    };
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const idx = function(name) {
    return headers.indexOf(name);
  };

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

    if (scenarioId !== currentScenarioId) return;
    if (turn !== currentTurn) return;
    if (feedbackType !== 'OVERALL') return;

    rows.push({
      rowNumber: i + 2,
      timestamp: row[timestampIdx],
      scenarioId: scenarioId,
      turn: turn,
      feedbackType: feedbackType,
      feedbackText: row[feedbackTextIdx],
      status: String(row[statusIdx] || '').trim(),
      updatedBy: String(row[updatedByIdx] || '').trim()
    });
  });

  if (rows.length === 0) {
    return {
      exists: false,
      scenarioId: currentScenarioId,
      turn: currentTurn,
      feedbackType: 'OVERALL'
    };
  }

  rows.sort(function(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const latest = rows[0];

  return {
    exists: true,
  scenarioId: latest.scenarioId,
  turn: latest.turn,
  feedbackType: latest.feedbackType,
  status: latest.status,
  updatedBy: latest.updatedBy,
  timestamp: formatDateTimeForView_(latest.timestamp),
  hasText: !!latest.feedbackText,
  feedbackPreview: String(latest.feedbackText || '').substring(0, 120)
  };
}

/**
 * @summary GM画面から実行し、最新のAI講評を公開状態に変更する
 * @function publishLatestAiFeedback
 * @read updateLatestAiFeedbackStatus_()
 * @write 最新のAI講評ステータスを published に更新し、処理結果を返す
 * @update 2026-06-30
 */
function publishLatestAiFeedback() {
  return updateLatestAiFeedbackStatus_('published');
}

/**
 * @summary GM画面から実行し、最新のAI講評を非公開状態に変更する
 * @function hideLatestAiFeedback
 * @read updateLatestAiFeedbackStatus_()
 * @write 最新のAI講評ステータスを hidden に更新し、処理結果を返す
 * @update 2026-06-30
 */
function hideLatestAiFeedback() {
  return updateLatestAiFeedbackStatus_('hidden');
}

/**
 * @summary GM画面から実行し、公開済みAI講評のうち最新以外を archived に整理する
 * @function archiveOldPublishedAiFeedback
 * @read ai_feedback, getCurrentScenarioId_(), getCurrentTurn()
 * @write ai_feedback の過去公開講評ステータスを archived に更新し、処理結果を返す
 * @update 2026-06-30
 */
function archiveOldPublishedAiFeedback() {
  const sheet = getSheet('ai_feedback');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      message: '整理対象の講評がありません。'
    };
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const idx = function(name) {
    return headers.indexOf(name);
  };

  const timestampIdx = idx('timestamp');
  const scenarioIdIdx = idx('scenario_id');
  const turnIdx = idx('turn');
  const feedbackTypeIdx = idx('feedback_type');
  const statusIdx = idx('status');

  const currentScenarioId = getCurrentScenarioId_();
  const currentTurn = Number(getCurrentTurn());

  const publishedRows = [];

  values.slice(1).forEach(function(row, i) {
    const scenarioId = String(row[scenarioIdIdx] || '').trim();
    const turn = Number(row[turnIdx] || 0);
    const feedbackType = String(row[feedbackTypeIdx] || '').trim();
    const status = String(row[statusIdx] || '').trim();

    if (feedbackType !== 'OVERALL') return;
    if (status !== 'published') return;

    publishedRows.push({
      rowNumber: i + 2,
      timestamp: row[timestampIdx],
      scenarioId: scenarioId,
      turn: turn
    });
  });

  if (publishedRows.length <= 1) {
    return {
      message: '整理対象の過去講評はありません。'
    };
  }

  publishedRows.sort(function(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const latestRowNumber = publishedRows[0].rowNumber;
  let archivedCount = 0;

  publishedRows.forEach(function(item) {
    if (item.rowNumber === latestRowNumber) return;

    sheet.getRange(item.rowNumber, statusIdx + 1).setValue('archived');
    archivedCount++;
  });

  return {
    message: archivedCount + '件の過去公開講評を archived に変更しました。'
  };
}

/**
 * @summary 内部処理：現在シナリオ・現在ターンの最新AI講評ステータスを更新する
 * @function updateLatestAiFeedbackStatus_
 * @read newStatus, ai_feedback, getCurrentScenarioId_(), getCurrentTurn()
 * @write ai_feedback の最新講評ステータスと更新者を変更し、処理結果を返す
 * @update 2026-06-30
 */
function updateLatestAiFeedbackStatus_(newStatus) {
  const sheet = getSheet('ai_feedback');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    throw new Error('WAIG博士の振り返りがまだ保存されていません。');
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const idx = function(name) {
    return headers.indexOf(name);
  };

  const timestampIdx = idx('timestamp');
  const scenarioIdIdx = idx('scenario_id');
  const turnIdx = idx('turn');
  const feedbackTypeIdx = idx('feedback_type');
  const statusIdx = idx('status');
  const updatedByIdx = idx('updated_by');

  const currentScenarioId = getCurrentScenarioId_();
  const currentTurn = Number(getCurrentTurn());

  const rows = [];

  values.slice(1).forEach(function(row, i) {
    const scenarioId = String(row[scenarioIdIdx] || '').trim();
    const turn = Number(row[turnIdx] || 0);
    const feedbackType = String(row[feedbackTypeIdx] || '').trim();

    if (scenarioId !== currentScenarioId) return;
    if (turn !== currentTurn) return;
    if (feedbackType !== 'OVERALL') return;

    rows.push({
      rowNumber: i + 2,
      timestamp: row[timestampIdx]
    });
  });

  if (rows.length === 0) {
    throw new Error('現在のシナリオ・ターンに対応する講評がありません。先に保存してください。');
  }

  rows.sort(function(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const latestRowNumber = rows[0].rowNumber;

  sheet.getRange(latestRowNumber, statusIdx + 1).setValue(newStatus);

  if (updatedByIdx >= 0) {
    sheet.getRange(latestRowNumber, updatedByIdx + 1).setValue('GM');
  }

  const labelMap = {
    published: '公開',
    hidden: '非公開',
    archived: '過去分'
  };

  return {
    message: 'WAIG博士の振り返りを「' + (labelMap[newStatus] || newStatus) + '」にしました。'
  };
}
