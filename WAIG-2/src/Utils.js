/**
 * @summary group_mst を基準に、G1〜G12のプレイヤー枠と登録状況を取得する
 * @function getPlayerSlots
 * @read group_mst, member_log, CONFIG.SPREADSHEET_ID
 * @write プレイヤー枠ごとの登録情報を含む配列を返す
 * @update 2026-06-30
 */
 function getPlayerSlots() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const groupSheet = ss.getSheetByName(SHEETS.GROUP_MST);
  const memberSheet = ss.getSheetByName(SHEETS.MEMBER_LOG);

  const groupValues = groupSheet.getDataRange().getValues();
  const memberValues = memberSheet.getDataRange().getValues();

  // member_log を group_id 単位で引けるようにする
  const membersByGroup = {};

  for (let i = 1; i < memberValues.length; i++) {
    const row = memberValues[i];

    const memberId = row[1];      // member_id
    const groupId = row[2];       // group_id
    const name = row[3];          // name
    const displayName = row[4];   // display_name
    const aiUse = row[5];         // ai_use
    const status = row[6];        // status
    const memo = row[7];          // memo

    if (!groupId) continue;
    if (status !== 'active') continue;

    membersByGroup[groupId] = {
      memberId: memberId,
      groupId: groupId,
      name: name,
      displayName: displayName,
      aiUse: aiUse,
      status: status,
      memo: memo
    };
  }

  const result = [];

  for (let i = 1; i < groupValues.length; i++) {
    const row = groupValues[i];

    const groupId = row[0];       // group_id
    const groupName = row[1];     // group_name
    const status = row[2];        // status
    const memo = row[3];          // memo

    if (!groupId) continue;
    if (status !== 'active') continue;

    const member = membersByGroup[groupId];

    result.push({
      groupId: groupId,
      groupName: groupName,
      status: status,
      memo: memo,

      memberId: member ? member.memberId : '',
      name: member ? member.name : '',
      displayName: member ? member.displayName : groupName,
      aiUse: member ? member.aiUse : '',
      registered: !!member
    });
  }

  return result;
}

/**
 * @summary 登録済み active プレイヤーのみを取得する
 * @function getActivePlayers
 * @read getPlayerSlots()
 * @write active 登録済みプレイヤーの配列を返す
 * @update 2026-06-30
 */
 function getActivePlayers() {
  const slots = getPlayerSlots();

  return slots
    .filter(function(slot) {
      return slot.registered;
    })
    .map(function(slot) {
      return {
        groupId: slot.groupId,
        memberId: slot.memberId,
        name: slot.name,
        displayName: slot.displayName,
        aiUse: slot.aiUse,
        status: slot.status
      };
    });
}

/**
 * @summary group_id から画面表示用のプレイヤー名を取得する
 * @function getPlayerDisplayName
 * @read groupId, getPlayerSlots()
 * @write displayName、groupName、groupId の順で表示名を返す
 * @update 2026-06-30
 */
function getPlayerDisplayName(groupId) {
  const slots = getPlayerSlots();

  const target = slots.find(function(slot) {
    return slot.groupId === groupId;
  });

  if (!target) {
    return groupId;
  }

  return target.displayName || target.groupName || groupId;
}

/**
 * @summary 内部処理：初期設定が完了している有効なプレイヤーグループID一覧を取得する
 * @function getCompletedPlayerGroupIds_
 * @read group_setup, CONFIG.SPREADSHEET_ID
 * @write is_valid_group が true かつ setup_status が completed の group_id 配列を返す
 * @update 2026-06-30
 */

function getCompletedPlayerGroupIds_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.GROUP_SETUP);

  if (!sheet) {
    throw new Error('group_setup シートが見つかりません');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const groupCol = headers.indexOf('group_id');
  const validCol = headers.indexOf('is_valid_group');
  const setupCol = headers.indexOf('setup_status');

  if (groupCol === -1) throw new Error('group_setup に group_id 列がありません');
  if (validCol === -1) throw new Error('group_setup に is_valid_group 列がありません');
  if (setupCol === -1) throw new Error('group_setup に setup_status 列がありません');

  const groupIds = [];

  values.slice(1).forEach(function(row) {
    const groupId = String(row[groupCol] || '').trim();
    const isValid = row[validCol];
    const setupStatus = String(row[setupCol] || '').trim();

    if (!groupId) return;
    if (groupId === 'G0' || groupId === 'G00' || groupId === 'GM') return;

    if (isValid === true && setupStatus === 'completed') {
      groupIds.push(groupId);
    }
  });

  return groupIds;
}

/**
 * @summary 数値をパーセント表記に整形する
 * @function formatPercent
 * @read value, digit
 * @write 指定桁数のパーセント文字列を返す
 * @update 2026-06-30
 */
function formatPercent(value, digit) {
  return (Number(value || 0) * 100).toFixed(digit) + '%';
}

/**
 * @summary 内部処理：現在ターンに対応するシナリオIDを取得する
 * @function getCurrentScenarioId_
 * @read market_event_log, getCurrentTurn()
 * @write 現在ターンの scenario_id、または空文字を返す
 * @update 2026-06-30
 */
function getCurrentScenarioId_() {
  const sheet = getSheet(SHEETS.MARKET_EVENT_LOG);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return '';
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  const turnIdx = headers.indexOf('turn');
  const scenarioIdx = headers.indexOf('scenario_id');
  const statusIdx = headers.indexOf('status');

  if (turnIdx === -1 || scenarioIdx === -1) {
    return '';
  }

  const currentTurn = Number(getCurrentTurn());
  let scenarioId = '';

  values.slice(1).forEach(function(row) {
    const turn = Number(row[turnIdx]);
    const status = statusIdx >= 0 ? String(row[statusIdx] || '').trim() : '';

    if (turn === currentTurn && status !== 'deleted') {
      scenarioId = String(row[scenarioIdx] || '').trim();
    }
  });

  return scenarioId;
}

/**
 * @summary 内部処理：ミッションマスタからミッション名と難易度の対応表を取得する
 * @function getMissionInfoMap_
 * @read ms_mst, getCachedSheetValues_()
 * @write mission_id をキーに missionName と missionDifficulty を持つMapオブジェクトを返す
 * @update 2026-06-30
 */
function getMissionInfoMap_() {
  const values = getCachedSheetValues_('ms_mst', 600);

  if (values.length <= 1) {
    return {};
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const missionIdIdx = idx('mission_id');
  const missionNameIdx = idx('mission_name');
  const difficultyIdx = idx('difficulty');

  if (missionIdIdx < 0) {
    throw new Error('ms_mst に mission_id 列が見つかりません。');
  }

  const map = {};

  values.slice(1).forEach(function(row) {
    const missionId = String(row[missionIdIdx] || '').trim();

    if (!missionId) return;

    map[missionId] = {
      missionId: missionId,
      missionName: missionNameIdx >= 0
        ? String(row[missionNameIdx] || '').trim()
        : '',
      missionDifficulty: difficultyIdx >= 0
        ? String(row[difficultyIdx] || '').trim()
        : ''
    };
  });

  return map;
}

/**
 * @summary 内部処理：日時値を画面表示用の日時文字列に整形する
 * @function formatDateTimeForView_
 * @read value, Session.getScriptTimeZone()
 * @write yyyy/MM/dd HH:mm:ss 形式の日時文字列を返す
 * @update 2026-06-30
 */
function formatDateTimeForView_(value) {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    'yyyy/MM/dd HH:mm:ss'
  );
}

/**
 * @summary 内部処理：順位に応じたポイントを取得する
 * @function getPointByRank_
 * @read rank
 * @write 1位は10点、2位は7点、3位は5点、それ以外は1点を返す
 * @update 2026-06-30
 */
function getPointByRank_(rank) {
  if (rank === 1) return 10;
  if (rank === 2) return 7;
  if (rank === 3) return 5;
  return 1;
}

/**
 * @summary 内部処理：指定指標におけるグループの順位を計算する
 * @function getRank_
 * @read players, groupId, key, order
 * @write 指定指標の順位、または null を返す
 * @update 2026-06-30
 */
function getRank_(players, groupId, key, order) {
  const sorted = players
    .filter(p => p[key] !== '' && p[key] != null && !isNaN(Number(p[key])))
    .sort((a, b) => {
      const av = Number(a[key]);
      const bv = Number(b[key]);
      return order === 'asc' ? av - bv : bv - av;
    });

  const index = sorted.findIndex(p => p.group_id === groupId);
  return index >= 0 ? index + 1 : null;
}

/**
 * @summary 内部処理：指定指標で対象グループが1位かどうかを判定する
 * @function isTop_
 * @read players, groupId, key, order, getRank_()
 * @write 1位の場合は true、それ以外は false を返す
 * @update 2026-06-30
 */
function isTop_(players, groupId, key, order) {
  return getRank_(players, groupId, key, order) === 1;
}

/**
 * @summary 内部処理：プレイヤー成績から獲得バッジ一覧を生成する
 * @function buildBadges_
 * @read player, players, isTop_()
 * @write 集客賞・利益賞・UX改善賞などのバッジ配列を返す
 * @update 2026-06-30
 */
function buildBadges_(player, players) {
  const groupId = player.group_id;
  const badges = [];

  if (isTop_(players, groupId, 'general_sessions', 'desc')) {
    badges.push('📈 集客賞');
  }
  if (isTop_(players, groupId, 'profit', 'desc')) {
    badges.push('💰 利益賞');
  }
  if (isTop_(players, groupId, 'bounce_improvement_rate', 'desc')) {
    badges.push('🎯 UX改善賞');
  }
  if (isTop_(players, groupId, 'cvr_improvement_rate', 'desc')) {
    badges.push('⚡ コンバージョン賞');
  }
  if (isTop_(players, groupId, 'aov', 'desc')) {
    badges.push('🛒 客単価賞');
  }
  if (isTop_(players, groupId, 'cpc', 'asc')) {
    badges.push('📣 広告効率賞');
  }
  if (isTop_(players, groupId, 'roas', 'desc')) {
    badges.push('🚀 ROAS賞');
  }
  if (isTop_(players, groupId, 'growth_rate', 'desc')) {
    badges.push('🌱 成長賞');
  }

  return badges;
}

/**
 * @summary 内部処理：ランキング配列から指定グループの指標別順位を取得する
 * @function getMetricRank_
 * @read ranking, groupId, key, order
 * @write 指定指標の順位、または0を返す
 * @update 2026-06-30
 */
function getMetricRank_(ranking, groupId, key, order) {
  const sorted = (ranking || [])
    .filter(function(row) {
      const value = Number(row[key]);
      return !isNaN(value);
    })
    .sort(function(a, b) {
      const av = Number(a[key]);
      const bv = Number(b[key]);
      return order === 'asc' ? av - bv : bv - av;
    });

  const index = sorted.findIndex(function(row) {
    return String(row.groupId) === String(groupId);
  });

  return index >= 0 ? index + 1 : 0;
}

/**
 * @summary 内部処理：スコアカード用に指定グループの獲得バッジ一覧を生成する
 * @function buildScoreBadges_
 * @read groupId, ranking, getMetricRank_()
 * @write スコアカードに表示するバッジ配列を返す
 * @update 2026-06-30
 */
function buildScoreBadges_(groupId, ranking) {
  const badges = [];

  if (getMetricRank_(ranking, groupId, 'gi', 'desc') === 1) {
    badges.push('📈 集客賞');
  }

  if (getMetricRank_(ranking, groupId, 'profit', 'desc') === 1) {
    badges.push('💰 利益賞');
  }

  if (getMetricRank_(ranking, groupId, 'bounce', 'asc') === 1) {
    badges.push('🎯 UX改善賞');
  }

  if (getMetricRank_(ranking, groupId, 'cvr', 'desc') === 1) {
    badges.push('⚡ コンバージョン賞');
  }

  if (getMetricRank_(ranking, groupId, 'aov', 'desc') === 1) {
    badges.push('🛒 客単価賞');
  }

  if (getMetricRank_(ranking, groupId, 'cpc', 'asc') === 1) {
    badges.push('📣 広告効率賞');
  }

  if (getMetricRank_(ranking, groupId, 'roas', 'desc') === 1) {
    badges.push('🚀 ROAS賞');
  }

  if (getMetricRank_(ranking, groupId, 'growthRate', 'desc') === 1) {
    badges.push('🌱 成長賞');
  }

  return badges;
}

