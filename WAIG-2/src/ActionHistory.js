/**
 * @summary 観戦画面から参照し、初期設定済みグループの提出状況一覧を取得する
 * @function getWatchSubmitStatus
 * @read getGroupDisplayNameMap(), getGroups(), getSubmitState()
 * @write グループごとの表示名・ラベル・提出済み状態を返す
 * @update 2026-06-30
 */
function getWatchSubmitStatus() {
  // ★修正：getGroupDisplayNameMap() に修正
  const nameMap = getGroupDisplayNameMap();
  const groups = getGroups();

  return groups
    .filter(function(group) {
      return group.groupId &&
        group.groupId !== 'G0' &&
        group.groupId !== 'G00' &&
        group.groupId !== 'GM' &&
        group.status === 'active' &&
        group.isValidGroup === true &&
        group.setupStatus === 'completed';
    })
    .map(function(group) {
      const submitState = getSubmitState(group.groupId);

      return {
        groupId: group.groupId,
        displayName: nameMap[group.groupId] || '',
        // ここで「G1｜営業部」のようなキレイなラベルが作られます！
        groupLabel: nameMap[group.groupId] || group.groupId,
        submitted: submitState.submitted
      };
    });
}

/**
 * @summary 観戦画面・表示処理から参照し、グループIDと表示名の対応表を取得する
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

  const headers = values[0].map(function(h) {
    return String(h).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const groupIdIndex = idx('group_id');
  const displayNameIndex = idx('display_name');
  const statusIndex = idx('status');

  if (groupIdIndex === -1) throw new Error('member_log に group_id 列がありません');
  if (displayNameIndex === -1) throw new Error('member_log に display_name 列がありません');
  if (statusIndex === -1) throw new Error('member_log に status 列がありません');

  const map = {};

  values.slice(1).forEach(function(row) {
    const groupId = String(row[groupIdIndex] || '').trim();
    const displayName = String(row[displayNameIndex] || '').trim();
    const status = String(row[statusIndex] || '').trim();

    if (!groupId) return;
    if (groupId === 'G0' || groupId === 'G00' || groupId === 'GM') return;
    if (status !== 'active') return;

    map[groupId] = displayName || groupId;
  });

  return map;
}

/**
 * @summary クライアント処理：サーバーから市場環境マトリクスを取得する
 * @function loadMarketMatrix
 * @read google.script.run.getWatchMarketMatrix()
 * @write 取得成功時は renderMarketMatrix() を実行し、失敗時は market-matrix にエラーを表示する
 * @update 2026-06-30
 */
function loadMarketMatrix() {
  google.script.run
    .withSuccessHandler(renderMarketMatrix)
    .withFailureHandler(function(error) {
      document.getElementById('market-matrix').innerHTML =
        '<p style="color:red;">市場環境取得失敗</p><pre>' +
        (error.message || error) +
        '</pre>';
    })
    .getWatchMarketMatrix();
}

/**
 * @summary クライアント処理：市場環境マトリクスをHTMLテーブルとして描画する
 * @function renderMarketMatrix
 * @read data
 * @write market-matrix 要素のinnerHTMLを更新する
 * @update 2026-06-30
 */
function renderMarketMatrix(data) {
  const area = document.getElementById('market-matrix');

  if (!area) {
    console.log('market-matrix が見つかりません');
    return;
  }

  if (!data || data.length === 0) {
    area.innerHTML = '<p>市場環境データがありません。</p>';
    return;
  }

  let html = '<table>';
  html += '<tr>';
  html += '<th>Turn</th>';
  html += '<th>トレンド</th>';
  html += '<th>トレンド効果</th>';
  html += '<th>3C・競合変化</th>';
  html += '<th>3C効果</th>';
  html += '</tr>';

  data.forEach(function(row) {
    html += '<tr>';
    html += '<td>T' + row.turn + '</td>';
    html += '<td>' + (row.trendLabel || row.trendId || '-') + '</td>';
    html += '<td>' + (row.trendEffect || '') + '</td>';
    html += '<td>' + (row.tcLabel || row.tcId || '-') + '</td>';
    html += '<td>' + (row.tcEffect || '') + '</td>';
    html += '</tr>';
  });

  html += '</table>';

  area.innerHTML = html;
}

/**
 * @summary 観戦画面から参照し、現在ターンまでの市場環境とシナリオ情報を取得する
 * @function getWatchMarketMatrix
 * @read market_event_log, tr_mst, tc_mst, scenario_profile, getCurrentTurn()
 * @write シナリオプロフィールとターン別市場環境配列を返す
 * @update 2026-06-30
 */
function getWatchMarketMatrix() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const marketSheet = ss.getSheetByName(SHEETS.MARKET_EVENT_LOG);
  const trendSheet = ss.getSheetByName(SHEETS.TR_MST);
  const tcSheet = ss.getSheetByName(SHEETS.TC_MST);
  const profileSheet = ss.getSheetByName(SHEETS.SCENARIO_PROFILE);

  if (!marketSheet) {
    throw new Error('market_event_log シートが見つかりません');
  }
  if (!trendSheet) {
    throw new Error('tr_mst シートが見つかりません');
  }
  if (!tcSheet) {
    throw new Error('tc_mst シートが見つかりません');
  }
  if (!profileSheet) {
    throw new Error('scenario_profile シートが見つかりません');
  }
  const marketValues = marketSheet.getDataRange().getValues();
  const trendValues = trendSheet.getDataRange().getValues();
  const tcValues = tcSheet.getDataRange().getValues();
  const profileValues = profileSheet.getDataRange().getValues();

  if (marketValues.length <= 1) {
    return [];
  }

  function buildIndexMap(values, keyName) {
    const headers = values[0].map(function(h) {
      return String(h).trim();
    });

    function idx(name) {
      const index = headers.indexOf(name);
      if (index === -1) {
        throw new Error(keyName + ' に ' + name + ' 列がありません');
      }
      return index;
    }

    return {
      headers: headers,
      idx: idx
    };
  }

  const market = buildIndexMap(marketValues, 'market_event_log');
  const trend = buildIndexMap(trendValues, 'tr_mst');
  const tc = buildIndexMap(tcValues, 'tc_mst');

  const trendMap = {};
  trendValues.slice(1).forEach(function(row) {
    const trendId = String(row[trend.idx('trend_id')] || '').trim();
    if (!trendId) return;

    trendMap[trendId] = {
      trendId: trendId,
      trendName: row[trend.idx('trend_name')],
      trendLabel: row[trend.idx('trend_label')],
      effectText: row[trend.idx('effect_text')],
      effectShort: row[trend.idx('effect_short')]
    };
  });

  const tcMap = {};
  tcValues.slice(1).forEach(function(row) {
    const tcId = String(row[tc.idx('tc_id')] || '').trim();
    if (!tcId) return;

    tcMap[tcId] = {
      tcId: tcId,
      tcName: row[tc.idx('tc_name')],
      tcLabel: row[tc.idx('tc_label')],
      effectText: row[tc.idx('effect_text')],
      effectShort: row[tc.idx('effect_short')]
    };
  });

const profileMap = {};

if (profileValues.length > 1) {
  const profile = buildIndexMap(profileValues, 'scenario_profile');

  profileValues.slice(1).forEach(function(row) {
    const scenarioId = String(row[profile.idx('scenario_id')] || '').trim();

    if (!scenarioId) return;

    profileMap[scenarioId] = {
      scenarioId: scenarioId,
      scenarioName: row[profile.idx('scenario_name')],
      scenarioIntent: row[profile.idx('scenario_intent')],
      difficulty: row[profile.idx('difficulty')],
      recommendedUse: row[profile.idx('recommended_use')],
      memo: row[profile.idx('memo')]
    };
  });
}



  const currentTurn = Number(getCurrentTurn());

  const rows = marketValues.slice(1)
    .filter(function(row) {
      const turn = Number(row[market.idx('turn')]);
      const status = String(row[market.idx('status')] || '').trim();

      return turn >= 1 &&
        turn <= currentTurn &&
        status === 'active';
    })
    .map(function(row) {
      const trendId = String(row[market.idx('trend_id')] || '').trim();
      const tcId = String(row[market.idx('tc_id')] || '').trim();

      const trendInfo = trendMap[trendId] || {};
      const tcInfo = tcMap[tcId] || {};

      return {
        turn: Number(row[market.idx('turn')]),
        marketKey: row[market.idx('market_key')],
        scenarioId: row[market.idx('scenario_id')],

        trendId: trendId,
        trendName: trendInfo.trendName || '',
        trendLabel: trendInfo.trendLabel || trendId,
        trendEffect: trendInfo.effectShort || trendInfo.effectText || '',

        tcId: tcId,
        tcName: tcInfo.tcName || '',
        tcLabel: tcInfo.tcLabel || tcId,
        tcEffect: tcInfo.effectShort || tcInfo.effectText || '',

        memo: row[market.idx('memo')],
        status: row[market.idx('status')]
      };
    })
    .sort(function(a, b) {
      return Number(a.turn) - Number(b.turn);
    });

  const activeScenarioId = rows.length > 0
  ? String(rows[0].scenarioId || '').trim()
  : '';

  const scenarioProfile = profileMap[activeScenarioId] || {
    scenarioId: activeScenarioId,
    scenarioName: '',
    scenarioIntent: '',
    difficulty: '',
    recommendedUse: '',
    memo: ''
  };

  return {
    scenarioProfile: scenarioProfile,
    rows: rows
  };

}

/**
 * @summary 観戦画面から参照し、各グループのターン別施策履歴と組み合わせ効果を取得する
 * @function getWatchActionMatrix
 * @read getGroups(), turn_log, getActionInfoMap(), getSynergyInfoMap(), compare_db
 * @write プレイヤー別の施策履歴マトリクスを利益成長率順で返す
 * @update 2026-06-30
 */
function getWatchActionMatrix() {
  const groups = getGroups()
    .filter(function(group) {
      return group.groupId &&
        group.groupId !== 'G0' &&
        group.groupId !== 'G00' &&
        group.groupId !== 'GM' &&
        group.status === 'active' &&
        group.isValidGroup === true &&
        group.setupStatus === 'completed';
    });

  const actionInfoMap = getActionInfoMap();
  const synergyInfoMap = getSynergyInfoMap();

  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0].map(function(h) {
    return String(h).trim().toLowerCase();
  });

  const logTypeIdx = headers.indexOf('log_type');
  const groupIdIdx = headers.indexOf('group_id');
  const turnIdx = headers.indexOf('turn');
  const action1Idx = headers.indexOf('action_1');
  const action2Idx = headers.indexOf('action_2');

  if (
    logTypeIdx === -1 ||
    groupIdIdx === -1 ||
    turnIdx === -1 ||
    action1Idx === -1 ||
    action2Idx === -1
  ) {
    Logger.log('エラー: 必要な列が見つかりません。');
    return [];
  }

  const nameMap = getGroupDisplayNameMap();

  const result = groups.map(function(group) {
  const missionId = String(group.missionId || '').trim();

  return {
    groupId: group.groupId,
    groupLabel: nameMap[group.groupId] || group.groupId,

    challengeId: group.challengeId || '',
    challengeName: group.challengeLabel || group.challengeName || '',

    missionId: missionId,
    missionName: group.missionLabel || group.missionName || '',
    missionDifficulty: group.missionDifficulty || '',

    skillId: group.skillId || '',
    skillName: group.skillLabel || group.skillName || '',
    skillActivation: group.activation || group.skillActivation || '',

    turns: {}
  };
});

  values.slice(1).forEach(function(row) {
    if (String(row[logTypeIdx]).trim() !== 'HUMAN_ACTION') return;

    const groupId = String(row[groupIdIdx]).trim();
    const turn = Number(row[turnIdx]);

    const action1 = String(row[action1Idx] || '').trim();
    const action2 = String(row[action2Idx] || '').trim();

    const target = result.find(function(item) {
      return item.groupId === groupId;
    });

    if (!target) return;

    const actions = [];

    [action1, action2].forEach(function(actionId) {
      if (!actionId) return;

      const actionInfo = actionInfoMap[actionId] || {
        label: actionId,
        effectShort: ''
      };

      actions.push({
        actionId: actionId,
        actionLabel: actionInfo.label,
        effectShort: actionInfo.effectShort || ''
      });
    });

    const turnData = {
      actions: actions
    };

    if (actions[0]) {
      turnData.actionId = actions[0].actionId;
      turnData.actionLabel = actions[0].actionLabel;
    }

    if (actions[1]) {
      turnData.actionId2 = actions[1].actionId;
      turnData.actionLabel2 = actions[1].actionLabel;
    }

    const synergyKey = buildSynergyKey_(action1, action2);
    const synergyInfo = synergyInfoMap[synergyKey];

    if (synergyInfo) {
      turnData.synergyKey = synergyKey;
      turnData.synergyLabel =
        '組み合わせ効果：' +
        synergyInfo.actionA +
        ' × ' +
        synergyInfo.actionB;
      turnData.synergyDescription = synergyInfo.description;
      turnData.synergyEffectShort = synergyInfo.effectShort;
    }

    target.turns[turn] = turnData;
  });

  const compareData = getCompareDbData();
  const currentTurn = Number(getCurrentTurn());
  const growthRateMap = {};

  compareData.values.slice(1).forEach(function(row) {
    const turn = Number(row[compareData.idx('turn')]);
    const groupId = String(row[compareData.idx('group_id')] || '').trim();
    const targetRole = String(row[compareData.idx('target_role')] || '').trim();
    const sumType = String(row[compareData.idx('sum_type')] || '').trim();

    if (
      turn === currentTurn &&
      targetRole === 'HUMAN' &&
      sumType === 'player'
    ) {
      growthRateMap[groupId] =
        Number(row[compareData.idx('growth_rate')] || 0);
    }
  });

  result.sort(function(a, b) {
    return Number(growthRateMap[b.groupId] || 0) -
           Number(growthRateMap[a.groupId] || 0);
  });

  return result;
}

/**
 * @summary 観戦画面から参照し、指定ターンの利益ランキングを取得する
 * @function getWatchTurnRanking
 * @read turn, compare_db, getCompletedPlayerGroupIds_(), getGroupDisplayNameMap()
 * @write 指定ターンの利益ランキング配列を返す
 * @update 2026-06-30
 */
function getWatchTurnRanking(turn) {
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
      return Number(b.profit) - Number(a.profit);
    });

  applyProfitRank(rows);

  const nameMap = getGroupDisplayNameMap();

  rows.forEach(function(row) {
    row.groupLabel = nameMap[row.groupId] || row.groupId;
  });

  return rows;
}

/**
 * @summary クライアント処理：サーバーから観戦画面に必要な現在ターン・ランキング・施策履歴を取得する
 * @function loadWatchState
 * @read google.script.run.getWatchState()
 * @write current-turn、ランキング表示、施策履歴マトリクスを更新する
 * @update 2026-06-30
 */
function loadWatchState() {
  google.script.run
    .withSuccessHandler(function(data) {
      document.getElementById('current-turn').innerHTML =
        '<h3>Turn ' + data.currentTurn + '</h3>';

      latestRankingOrder = data.ranking.map(function(row) {
        return row.groupId;
      });

      renderRanking(data.rankingTurn, data.ranking);
      renderActionMatrix(data.actionMatrix);
    })
    .withFailureHandler(function(error) {
      document.getElementById('current-turn').innerHTML =
        '<p style="color:red;">観戦データ取得失敗</p><pre>' +
        (error.message || error) +
        '</pre>';
    })
    .getWatchState();
}

/**
 * @summary 観戦画面から参照し、現在ターン・直前ターンランキング・施策履歴をまとめて取得する
 * @function getWatchState
 * @read getCurrentTurn(), getWatchTurnRanking(), getWatchActionMatrix()
 * @write 観戦画面表示用の状態オブジェクトを返す
 * @update 2026-06-30
 */
function getWatchState() {

  const currentTurn = Number(getCurrentTurn());
  const rankingTurn = currentTurn - 1;

  return {
    currentTurn: currentTurn,
    rankingTurn: rankingTurn,

    ranking:
      rankingTurn >= 0
        ? getWatchTurnRanking(rankingTurn)
        : [],

    actionMatrix:
      getWatchActionMatrix()
  };

}

/**
 * @summary 施策振り返り用の集計データを取得する
 * @function getActionReviewSummary
 * @read getWatchActionMatrix(), getActionInfoMap(), getWatchTurnRanking(), getCurrentTurn()
 * @write 施策ランキング・組み合わせランキング・未使用施策・勝者施策を返す
 * @update 2026-07-08
 */
function getActionReviewSummary() {
  const actionMatrix = getWatchActionMatrix();
  const actionInfoMap = getActionInfoMap();

  const completedTurn = getLatestCompletedRankingTurn_();
  const ranking = completedTurn >= 0 ? getWatchTurnRanking(completedTurn) : [];
  const resultMap = buildActionReviewResultMap_(ranking);

  const actionStats = {};
  const pairStats = {};
  const usedActionIds = {};
  const winnerActionStats = {};

  actionMatrix.forEach(function(player) {
    const playerResult = resultMap[player.groupId] || {};

    Object.keys(player.turns || {}).forEach(function(turnKey) {
      const turnData = player.turns[turnKey];
      const actions = Array.isArray(turnData.actions) ? turnData.actions : [];

      actions.forEach(function(action) {
        const actionId = String(action.actionId || '').trim();
        if (!actionId) return;

        usedActionIds[actionId] = true;

        addActionStat_(actionStats, actionId, action.actionLabel, playerResult);

        if (playerResult.rank >= 1 && playerResult.rank <= 3) {
          addActionStat_(winnerActionStats, actionId, action.actionLabel, playerResult);
        }
      });

      if (actions.length >= 2) {
        const pair = buildActionReviewPair_(actions[0], actions[1]);
        addPairStat_(pairStats, pair, playerResult);
      }
    });
  });

    const playerCount = actionMatrix.length;

    return {
      completedTurn: completedTurn,
      actionRanking: finalizeActionStats_(actionStats, playerCount),
      pairRanking: finalizePairStats_(pairStats, playerCount),
      unusedActions: buildUnusedActionList_(actionInfoMap, usedActionIds),
      winnerActions: finalizeActionStats_(winnerActionStats, Math.min(3, playerCount))
    };
}

/**
 * @summary 施策振り返りで参照する最新完了ターンを取得する
 * @function getLatestCompletedRankingTurn_
 * @read getCurrentTurn(), getWatchTurnRanking()
 * @write ランキング取得可能な最新ターン番号を返す
 * @update 2026-07-08
 */
function getLatestCompletedRankingTurn_() {
  const currentTurn = Number(getCurrentTurn());

  for (let turn = currentTurn; turn >= 0; turn--) {
    const rows = getWatchTurnRanking(turn);
    if (rows && rows.length > 0) {
      return turn;
    }
  }

  return -1;
}

/**
 * @summary 施策振り返り用にプレイヤー別結果Mapを生成する
 * @function buildActionReviewResultMap_
 * @read ranking
 * @write groupIdをキーにした順位・利益・成長率Mapを返す
 * @update 2026-07-08
 */
function buildActionReviewResultMap_(ranking) {
  const map = {};

  ranking.forEach(function(row, index) {
    map[row.groupId] = {
      rank: index + 1,
      growthRate: Number(row.growthRate || row.growth_rate || 0),
      cvr: Number(row.cvr || 0)
    };
  });

  return map;
}

/**
 * @summary 施策別集計に1件分の利用実績を加算する
 * @function addActionStat_
 * @read stats, actionId, actionLabel, playerResult
 * @write 指定施策の使用回数・順位合計・成長率合計・CVR合計・集計件数を更新する
 * @update 2026-07-08
 */
function addActionStat_(stats, actionId, actionLabel, playerResult) {
  if (!stats[actionId]) {
    stats[actionId] = {
      actionId: actionId,
      actionLabel: actionLabel || actionId,
      count: 0,
      rankTotal: 0,
      growthRateTotal: 0,
      cvrTotal: 0,
      resultCount: 0
    };
  }

  stats[actionId].count++;

  if (playerResult && playerResult.rank) {
    stats[actionId].rankTotal += Number(playerResult.rank || 0);
    stats[actionId].growthRateTotal += Number(playerResult.growthRate || 0);
    stats[actionId].cvrTotal += Number(playerResult.cvr || 0);
    stats[actionId].resultCount++;
  }
}

/**
 * @summary 施策ペア集計用のキーと表示名を生成する
 * @function buildActionReviewPair_
 * @read actionA, actionB
 * @write 施策ID順に正規化したペア情報を返す
 * @update 2026-07-08
 */
function buildActionReviewPair_(actionA, actionB) {
  const items = [actionA, actionB].map(function(action) {
    return {
      actionId: String(action.actionId || '').trim(),
      actionLabel: action.actionLabel || action.actionId || ''
    };
  }).filter(function(action) {
    return action.actionId;
  });

  items.sort(function(a, b) {
    return a.actionId.localeCompare(b.actionId);
  });

  return {
    pairKey: items.map(function(action) {
      return action.actionId;
    }).join('__'),
    pairLabel: items.map(function(action) {
      return action.actionLabel;
    }).join(' ＋ ')
  };
}

/**
 * @summary 施策ペア集計に1件分の利用実績を加算する
 * @function addPairStat_
 * @read stats, pair, playerResult
 * @write statsの件数・順位・利益・成長率を更新する
 * @update 2026-07-08
 */
function addPairStat_(stats, pair, playerResult) {
  if (!pair || !pair.pairKey) return;

  if (!stats[pair.pairKey]) {
    stats[pair.pairKey] = {
      pairKey: pair.pairKey,
      pairLabel: pair.pairLabel,
      count: 0,
      rankTotal: 0,
      growthRateTotal: 0,
      cvrTotal: 0,
      resultCount: 0
    };
  }

  stats[pair.pairKey].count++;

  if (playerResult && playerResult.rank) {
    stats[pair.pairKey].rankTotal += Number(playerResult.rank || 0);
    stats[pair.pairKey].growthRateTotal += Number(playerResult.growthRate || 0);
    stats[pair.pairKey].cvrTotal += Number(playerResult.cvr || 0);
    stats[pair.pairKey].resultCount++;
  }
}

/**
 * @summary 施策別集計を表示用配列に整形する
 * @function finalizeActionStats_
 * @read stats
 * @write 使用回数順の施策集計配列を返す
 * @update 2026-07-08
 */
function finalizeActionStats_(stats, playerCount) {
  const rows = Object.keys(stats).map(function(key) {
    const row = stats[key];
    const resultCount = Number(row.resultCount || 0);

    return {
      actionId: row.actionId,
      actionLabel: row.actionLabel,
      count: row.count,
      averageGrowthRate: resultCount > 0 ? row.growthRateTotal / resultCount : null
    };
  });

  addReviewScores_(rows, playerCount);

  return rows.sort(function(a, b) {
    return Number(b.count) - Number(a.count) ||
           Number(b.averageGrowthRate || 0) - Number(a.averageGrowthRate || 0);
  });
}

/**
 * @summary 施策ペア集計を表示用配列に整形する
 * @function finalizePairStats_
 * @read stats
 * @write 使用回数順の施策ペア集計配列を返す
 * @update 2026-07-08
 */
function finalizePairStats_(stats, playerCount) {
  const rows = Object.keys(stats).map(function(key) {
    const row = stats[key];
    const resultCount = Number(row.resultCount || 0);

    return {
      pairKey: row.pairKey,
      pairLabel: row.pairLabel,
      count: row.count,
      averageGrowthRate: resultCount > 0 ? row.growthRateTotal / resultCount : null
    };
  });

  addReviewScores_(rows, playerCount);

  return rows.sort(function(a, b) {
    return Number(b.count) - Number(a.count) ||
           Number(b.averageGrowthRate || 0) - Number(a.averageGrowthRate || 0);
  });
}


/**
 * @summary 未使用施策一覧を作成する
 * @function buildUnusedActionList_
 * @read actionInfoMap, usedActionIds
 * @write 一度も使われていない施策の配列を返す
 * @update 2026-07-08
 */
function buildUnusedActionList_(actionInfoMap, usedActionIds) {
  return Object.keys(actionInfoMap).filter(function(actionId) {
    return !usedActionIds[actionId];
  }).map(function(actionId) {
    const info = actionInfoMap[actionId] || {};

    return {
      actionId: actionId,
      actionLabel: info.label || info.actionLabel || actionId,
      effectShort: info.effectShort || ''
    };
  });
}

/**
 * @summary 施策振り返り用に人気度・成果度・判定を付与する
 * @function addReviewScores_
 * @read rows, playerCount, averageGrowthRate
 * @write rowsに popularityRate, popularityStars, performanceStars, reviewJudge を追加する
 * @update 2026-07-08
 */
function addReviewScores_(rows, playerCount) {
  if (!rows || rows.length === 0) {
    return;
  }

  const baseCount = Math.max(1, Number(playerCount || 1));

  const growthRates = rows
    .map(function(row) {
      return row.averageGrowthRate;
    })
    .filter(function(value) {
      return value !== null && value !== undefined && !isNaN(value);
    });

  const maxGrowth = growthRates.length > 0 ? Math.max.apply(null, growthRates) : 0;
  const minGrowth = growthRates.length > 0 ? Math.min.apply(null, growthRates) : 0;

  rows.forEach(function(row) {
    const popularityRate = Number(row.count || 0) / baseCount;

    const popularityLevel = getPopularityLevel_(popularityRate);
    const performanceLevel = getPerformanceLevel_(
      row.averageGrowthRate,
      minGrowth,
      maxGrowth
    );

    row.popularityRate = popularityRate;
    row.popularityStars = buildStarText_(popularityLevel);
    row.performanceStars = buildStarText_(performanceLevel);
    row.reviewJudge = getReviewJudge_(popularityLevel, performanceLevel);
  });
}

/**
 * @summary 人気度を5段階レベルに変換する
 * @function getPopularityLevel_
 * @read popularityRate
 * @write 1〜5の人気度レベルを返す
 * @update 2026-07-08
 */
function getPopularityLevel_(popularityRate) {
  const rate = Number(popularityRate || 0);

  if (rate >= 0.80) return 5;
  if (rate >= 0.60) return 4;
  if (rate >= 0.40) return 3;
  if (rate >= 0.20) return 2;
  return 1;
}

/**
 * @summary 成果度を5段階レベルに変換する
 * @function getPerformanceLevel_
 * @read value, minValue, maxValue
 * @write 1〜5の成果度レベルを返す
 * @update 2026-07-08
 */
function getPerformanceLevel_(value, minValue, maxValue) {
  if (value === null || value === undefined || isNaN(value)) {
    return 1;
  }

  const min = Number(minValue || 0);
  const max = Number(maxValue || 0);
  const current = Number(value || 0);

  if (max === min) {
    return 3;
  }

  const score = (current - min) / (max - min);

  if (score >= 0.80) return 5;
  if (score >= 0.60) return 4;
  if (score >= 0.40) return 3;
  if (score >= 0.20) return 2;
  return 1;
}

/**
 * @summary 5段階レベルを星表記に変換する
 * @function buildStarText_
 * @read level
 * @write 星5個の文字列を返す
 * @update 2026-07-08
 */
function buildStarText_(level) {
  const value = Math.max(1, Math.min(5, Number(level || 1)));
  return '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value);
}

/**
 * @summary 人気度と成果度から施策判定を返す
 * @function getReviewJudge_
 * @read popularityLevel, performanceLevel
 * @write 定番施策・人気先行・注目施策・要検討のいずれかを返す
 * @update 2026-07-08
 */
function getReviewJudge_(popularityLevel, performanceLevel) {
  if (popularityLevel >= 4 && performanceLevel >= 4) {
    return '定番施策';
  }

  if (popularityLevel >= 4 && performanceLevel <= 3) {
    return '人気先行';
  }

  if (popularityLevel <= 3 && performanceLevel >= 4) {
    return '注目施策';
  }

  return '要検討';
}
