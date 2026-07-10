/**
 * @summary 指定ターンの成長率ランキングを取得する
 * @function getTurnRanking
 * @read compare_db / group_setup / member_log
 * @write ランキング行配列
 * @update 2026-06-30
 */
function getTurnRanking(turn) {
  const data = getCompareDbData();
  const completedGroupIds = getCompletedPlayerGroupIds_();

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

  const nameMap = getGroupDisplayNameMap();

  rows.forEach(function(row) {
    row.groupLabel = nameMap[row.groupId] || row.groupId;
  });

  return rows;
}

/**
 * @summary 指定グループのターン別成績履歴を取得する
 * @function getGroupHistory
 * @read compare_db / group_setup / member_log / turn_log
 * @write グループ履歴行配列
 * @update 2026-06-30
 * @note 各ターンの成長率順位も付与する
 */
function getGroupHistory(groupId) {
  const data = getCompareDbData();
  const currentTurn = getCurrentTurn();
  const completedGroupIds = getCompletedPlayerGroupIds_();

  // Turnごとの利益成長率順位を作る
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
      return String(row[data.idx('group_id')]).trim() === String(groupId).trim() &&
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
 * @summary compare_dbの全データと列参照関数を取得する
 * @function getCompareDbData
 * @read compare_db
 * @write compare_dbデータオブジェクト
 * @update 2026-06-30
 */
function getCompareDbData() {
  const sheet = getSheet('compare_db');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  return {
    values: values,
    headers: headers,
    idx: function(name) {
      return headers.indexOf(name);
    }
  };
}

/**
 * @summary 現在有効なグループID一覧を取得する
 * @function getActiveGroupIds
 * @read group_setup / member_log
 * @write グループID配列
 * @update 2026-06-30
 */
function getActiveGroupIds() {
  return getGroupOptions().map(function(group) {
    return String(group.groupId).trim();
  });
}

/**
 * @summary compare_dbの1行を結果表示用オブジェクトへ変換する
 * @function buildResultRow
 * @read compare_db
 * @write 結果表示用オブジェクト
 * @update 2026-06-30
 */
function buildResultRow(row, data) {
  const sales = Number(row[data.idx('sales')]);
  const adCost = Number(row[data.idx('ad_cost')]);
  const aov = Number(row[data.idx('aov')]);
  const growthRate = Number(row[data.idx('growth_rate')] || 0);

  const cvCount = aov > 0 ? Math.round(sales / aov) : '';
  const cpa = cvCount > 0 ? Math.round(adCost / cvCount) : '';

  return {
    turn: row[data.idx('turn')],
    groupId: row[data.idx('group_id')],
    sales: sales,
    adCost: adCost,
    profit: Number(row[data.idx('profit')]),
    roas: row[data.idx('roas')],
    cpa: cpa,
    cvCount: cvCount,
    rank: row[data.idx('rank')],
    growthRate: growthRate,

    gi: Number(row[data.idx('gi')]),
    ai: Number(row[data.idx('ai')]),
    bounce: Number(row[data.idx('bounce')]),
    browse: Number(row[data.idx('browse')]),
    cvr: Number(row[data.idx('cvr')]),
    aov: Number(row[data.idx('aov')]),
    cpc: Number(row[data.idx('cpc')])


  };
}

/**
 * @summary 利益順に順位を付与する
 * @function applyProfitRank
 * @read rows
 * @write rows
 * @update 2026-06-30
 * @note 同順位の場合は同じ順位を付与する
 */
function applyProfitRank(rows) {
  let previousProfit = null;
  let currentRank = 0;

  rows.forEach(function(row, index) {
    if (
      previousProfit === null ||
      Number(row.profit) !== Number(previousProfit)
    ) {
      currentRank = index + 1;
      previousProfit = row.profit;
    }

    row.rank = currentRank;
  });
}

/**
 * @summary 結果画面で選択可能なターン一覧を取得する
 * @function getAvailableResultTurns
 * @read turn_log
 * @write ターン選択肢配列
 * @update 2026-06-30
 */
function getAvailableResultTurns() {
  const currentTurn = getCurrentTurn();
  const turns = [];

  for (let turn = 0; turn <= currentTurn; turn++) {
    turns.push({
      turn: turn,
      enabled: true
    });
  }

  return turns;
}

/**
 * @summary 指定グループの施策履歴を取得する
 * @function getActionHistory
 * @read turn_log / group_setup / member_log / ac_mst / sy_mst / market_event_log
 * @write 施策履歴配列
 * @update 2026-06-30
 * @note 施策、組み合わせ効果、市場情報、スキル情報をまとめて返す
 */
function getActionHistory(groupId) {
  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const actionInfoMap = getActionInfoMap();
  const synergyInfoMap = getSynergyInfoMap();
  const marketInfoMap = getTurnMarketInfoMap_();

  const group = getGroups().find(function(g) {
    return String(g.groupId).trim() === String(groupId).trim();
  });

  const skillId = group ? String(group.skillId || '').trim() : '';
  const skillName = group ? String(group.skillLabel || group.skillName || '').trim() : '';
  const skillActivation = group ? String(group.activation || group.skillActivation || '').trim() : '';

  const history = [];

  values.slice(1).forEach(function(row) {
    const logType = String(row[idx('log_type')] || '').trim();
    const rowGroupId = String(row[idx('group_id')] || '').trim();

    if (logType !== 'HUMAN_ACTION') return;
    if (rowGroupId !== String(groupId).trim()) return;

    const turn = Number(row[idx('turn')]);
    const marketInfo = marketInfoMap[turn] || {};

    const action1 = String(row[idx('action_1')] || '').trim();
    const action2 = String(row[idx('action_2')] || '').trim();
    const actionIds = [action1, action2].filter(Boolean);

    const actions = actionIds.map(function(actionId) {
      const actionInfo = actionInfoMap[actionId] || {
        label: actionId,
        effectShort: ''
      };

      return {
        actionId: actionId,
        actionLabel: actionInfo.label,
        effectShort: actionInfo.effectShort || ''
      };
    });

    const effects = actions
      .map(function(action) {
        return action.effectShort || '';
      })
      .filter(Boolean);

    const synergyKey = buildSynergyKey_(action1, action2);
    const synergyInfo = synergyInfoMap[synergyKey];

    let synergy = null;

    if (synergyInfo) {
      synergy = {
        synergyKey: synergyKey,
        synergyLabel:
          '組み合わせ効果：' +
          synergyInfo.actionA +
          ' × ' +
          synergyInfo.actionB,
        synergyDescription: synergyInfo.description || '',
        synergyEffectShort: synergyInfo.effectShort || ''
      };

      if (synergyInfo.effectShort) {
        effects.push(synergyInfo.effectShort);
      }
    }

    history.push({
      turn: turn,

      trendId: marketInfo.trendId || '',
      trendLabel: marketInfo.trendLabel || '',
      tcId: marketInfo.tcId || '',
      tcLabel: marketInfo.tcLabel || '',

      actions: actions,
      synergy: synergy,
      effects: effects,

      skillId: skillId,
      skillName: skillName,
      skillActivation: skillActivation
    });
  });

  return history.sort(function(a, b) {
    return Number(a.turn) - Number(b.turn);
  });
}

/**
 * @summary 施策マスタから施策情報マップを取得する
 * @function getActionInfoMap
 * @read ac_mst
 * @write 施策情報マップ
 * @update 2026-06-30
 */
function getActionInfoMap() {
  const values = getCachedSheetValues_('ac_mst', 600);
  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const map = {};

  values.slice(1).forEach(function(row) {
    const actionId = String(row[idx('action_id')]).trim();

    if (!actionId) return;

    map[actionId] = {
      label: String(row[idx('action_label')]).trim(),
      effectShort: String(row[idx('effect_short')]).trim()
    };
  });

  return map;
}

/**
 * @summary 組み合わせ効果マスタから組み合わせ効果情報マップを取得する
 * @function getSynergyInfoMap
 * @read sy_mst
 * @write 組み合わせ効果情報マップ
 * @update 2026-06-30
 */
function getSynergyInfoMap() {
  const sheet = getSheet('sy_mst');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const map = {};

  values.slice(1).forEach(function(row) {
    const key = String(row[idx('key')] || '').trim();

    if (!key) return;

    const parts = [
      String(row[idx('action_a')] || '').trim(),
      String(row[idx('action_b')] || '').trim()
    ].filter(Boolean);

    map[key] = {
      key: key,
      actionA: parts[0] || '',
      actionB: parts[1] || '',
      description: String(row[idx('description')] || '').trim(),
      effectShort: buildSynergyEffectShort_(row, idx)
    };
  });

  return map;
}

/**
 * @summary 組み合わせ効果のKPI影響を短い表示文字列に整形する
 * @function buildSynergyEffectShort_
 * @read sy_mst
 * @write KPI効果文字列
 * @update 2026-06-30
 * @note 内部処理用
 */
function buildSynergyEffectShort_(row, idx) {
  const effects = [];

  const gi = Number(row[idx('general_inflow')] || 0);
  const ai = Number(row[idx('ad_inflow')] || 0);
  const bounce = Number(row[idx('bounce')] || 0);
  const browse = Number(row[idx('browse')] || 0);
  const cvr = Number(row[idx('cvr')] || 0);
  const aov = Number(row[idx('aov')] || 0);
  const cpc = Number(row[idx('cpc')] || 0);

  if (gi !== 0) effects.push('GI' + formatSigned_(gi));
  if (ai !== 0) effects.push('AI' + formatSigned_(ai));
  if (bounce !== 0) effects.push('BR' + formatSigned_(bounce));
  if (browse !== 0) effects.push('回遊' + formatSigned_(browse));
  if (cvr !== 0) effects.push('CVR' + formatSigned_(cvr));
  if (aov !== 0) effects.push('AOV' + formatSigned_(aov));
  if (cpc !== 0) effects.push('CPC' + formatSigned_(cpc));

  return effects.join(' / ');
}

/**
 * @summary 数値を符号付き文字列に整形する
 * @function formatSigned_
 * @read value
 * @write 符号付き文字列
 * @update 2026-06-30
 * @note 内部処理用
 */
function formatSigned_(value) {
  const num = Number(value);
  if (num > 0) return '+' + num;
  return String(num);
}

/**
 * @summary 2つの施策IDから組み合わせ効果キーを生成する
 * @function buildSynergyKey_
 * @read actionId1 / actionId2
 * @write 組み合わせ効果キー
 * @update 2026-06-30
 * @note 内部処理用。施策IDの順序差を吸収する
 */
function buildSynergyKey_(actionId1, actionId2) {
  const a = String(actionId1 || '').trim();
  const b = String(actionId2 || '').trim();

  if (!a || !b) return '';

  return a < b ? a + '_' + b : b + '_' + a;
}

/**
 * @summary 指定グループの初期値と指定ターンのKPI差分を取得する
 * @function getKpiDiffState
 * @read compare_db
 * @write KPI差分オブジェクト
 * @update 2026-06-30
 */
function getKpiDiffState(groupId, targetTurn) {

  const sheet = getSheet('compare_db');
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(h => String(h).trim());

  function idx(name) {
    return headers.indexOf(name);
  }

  const baseRow = values.slice(1).find(function(row) {
    return Number(row[idx('turn')]) === 0 &&
      String(row[idx('group_id')]).trim() === String(groupId).trim() &&
      String(row[idx('target_role')]).trim() === 'HUMAN';
  });

  const currentRow = values.slice(1).find(function(row) {
    return Number(row[idx('turn')]) === Number(targetTurn) &&
      String(row[idx('group_id')]).trim() === String(groupId).trim() &&
      String(row[idx('target_role')]).trim() === 'HUMAN';
  });

  if (!baseRow || !currentRow) {
    return {
      success: false,
      message: '比較対象データが見つかりません。'
    };
  }

  function getDiff(field) {
    return Number(currentRow[idx(field)]) - Number(baseRow[idx(field)]);
  }

  return {
    success: true,

    groupId: groupId,

    baseTurn: 0,
    targetTurn: targetTurn,

    gi: {
      base: Number(baseRow[idx('gi')]),
      current: Number(currentRow[idx('gi')]),
      diff: getDiff('gi')
    },

    ai: {
      base: Number(baseRow[idx('ai')]),
      current: Number(currentRow[idx('ai')]),
      diff: getDiff('ai')
    },

    bounce: {
      base: Number(baseRow[idx('bounce')]),
      current: Number(currentRow[idx('bounce')]),
      diff: getDiff('bounce')
    },

    browse: {
      base: Number(baseRow[idx('browse')]),
      current: Number(currentRow[idx('browse')]),
      diff: getDiff('browse')
    },

    cvr: {
      base: Number(baseRow[idx('cvr')]),
      current: Number(currentRow[idx('cvr')]),
      diff: getDiff('cvr')
    },

    aov: {
      base: Number(baseRow[idx('aov')]),
      current: Number(currentRow[idx('aov')]),
      diff: getDiff('aov')
    },

    cpc: {
      base: Number(baseRow[idx('cpc')]),
      current: Number(currentRow[idx('cpc')]),
      diff: getDiff('cpc')
    }
  };
}

/**
 * @summary 有効な市場イベント情報をターン別マップとして取得する
 * @function getTurnMarketInfoMap_
 * @read market_event_log
 * @write ターン別市場情報マップ
 * @update 2026-06-30
 * @note 内部処理用
 */
function getTurnMarketInfoMap_() {
  const sheet = getSheet(SHEETS.MARKET_EVENT_LOG);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {};
  }

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    const index = headers.indexOf(name);
    if (index === -1) {
      throw new Error('market_event_log に ' + name + ' 列がありません。');
    }
    return index;
  }

  const map = {};

  values.slice(1).forEach(function(row) {
    const status = String(row[idx('status')] || '').trim();
    if (status !== 'active') return;

    const turn = Number(row[idx('turn')]);
    if (!turn) return;

    const trendId = String(row[idx('trend_id')] || '').trim();
    const tcId = String(row[idx('tc_id')] || '').trim();

    map[turn] = {
      trendId: trendId,
      trendLabel: row[idx('trend_label')] || trendId,
      trendEffectShort: row[idx('trend_effect_short')] || '',

      tcId: tcId,
      tcLabel: row[idx('tc_label')] || tcId,
      tcEffectShort: row[idx('tc_effect_short')] || '',

      scenarioId: row[idx('scenario_id')] || '',
      scenarioName: row[idx('scenario_name')] || ''
    };
  });

  return map;
}
