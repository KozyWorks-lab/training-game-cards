/**
 * @summary 未登録の参加枠を初期登録用グループ候補として取得する
 * @function getEntryGroupOptions
 * @read player slots
 * @write グループ選択用オプション配列
 * @update 2026-06-30
 */
function getEntryGroupOptions() {
  return getPlayerSlots()
    .filter(function(slot) {
      return !slot.registered;
    })
    .map(function(slot) {
      return {
        id: slot.groupId,
        name: slot.groupName || slot.groupId,
        displayName: slot.groupName || slot.groupId,
        groupId: slot.groupId,
        registered: slot.registered
      };
    });
}

/**
 * @summary 初期設定画面で使用する選択肢一式を取得する
 * @function getEntryOptions
 * @read member_log / cd_mst / ms_mst / sk_mst
 * @write 初期設定用オプションオブジェクト
 * @update 2026-06-30
 */
function getEntryOptions() {

  const groups =
    getRegisteredGroupOptions();

  return {
    groups: groups,
    challenges: getChallengeOptions(),
    missions: getMissionOptions(),
    skills: getSkillOptions()
  };
}

/**
 * @summary 課題カードの選択肢を取得する
 * @function getChallengeOptions
 * @read cd_mst
 * @write 課題カード選択肢配列
 * @update 2026-06-30
 */
function getChallengeOptions() {
  return getMasterOptions('cd_mst', 'challenge_id', 'challenge_name');
}

/**
 * @summary ミッションカードの選択肢を取得する
 * @function getMissionOptions
 * @read ms_mst
 * @write ミッションカード選択肢配列
 * @update 2026-06-30
 */
function getMissionOptions() {
  return getMasterOptions('ms_mst', 'mission_id', 'mission_name');
}

/**
 * @summary スキルカードの選択肢を取得する
 * @function getSkillOptions
 * @read sk_mst
 * @write スキルカード選択肢配列
 * @update 2026-06-30
 */
function getSkillOptions() {
  return getMasterOptions('sk_mst', 'skill_id', 'skill_name');
}

/**
 * @summary 登録済みプレイヤーを初期設定用グループ候補として取得する
 * @function getRegisteredGroupOptions
 * @read member_log
 * @write グループ選択用オプション配列
 * @update 2026-06-30
 */
function getRegisteredGroupOptions() {
  const players = getActivePlayers();

  return players.map(function(player) {
    return {
      id: player.groupId,
      name: player.displayName || player.groupId,
      displayName: player.displayName || player.groupId,
      groupId: player.groupId,
      memberId: player.memberId,
      playerName: player.name || ''
    };
  });
}

/**
 * @summary 指定マスタシートからIDと名称の選択肢を取得する
 * @function getMasterOptions
 * @read sheetName / idColumnName / nameColumnName
 * @write マスタ選択肢配列
 * @update 2026-06-30
 */
function getMasterOptions(sheetName, idColumnName, nameColumnName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  const idIndex = headers.indexOf(idColumnName);
  const nameIndex = headers.indexOf(nameColumnName);

  return values.slice(1)
    .filter(function(row) {
      return row[idIndex];
    })
    .map(function(row) {
      return {
        id: row[idIndex],
        name: row[nameIndex]
      };
    });
}

/**
 * @summary 課題カードに対応するミッション選択肢を取得する
 * @function getMissionOptionsByChallenge
 * @read cd_mst / ms_mst
 * @write ミッションカード選択肢配列
 * @update 2026-06-30
 */
function getMissionOptionsByChallenge(challengeId) {
  const sheet = getSheet('cd_mst');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  function idx(name) {
    return headers.indexOf(name);
  }

  const row = values.slice(1).find(function(row) {
    return String(row[idx('challenge_id')]).trim() === String(challengeId).trim();
  });

  if (!row) {
    return [];
  }

  const missionIds = [
    row[idx('mission_1')],
    row[idx('mission_2')],
    row[idx('mission_3')],
    row[idx('mission_4')]
  ].filter(function(id) {
    return id;
  });

  const missions = getMissionOptions();

  return missions.filter(function(mission) {
    return missionIds.indexOf(mission.id) !== -1;
  });
}

/**
 * @summary 指定マスタシートからIDに一致する1レコードを取得する
 * @function getMasterRecordById_
 * @read sheetName / idColumnName / idValue
 * @write マスタレコードオブジェクト
 * @update 2026-06-30
 * @note 内部処理用
 */
function getMasterRecordById_(sheetName, idColumnName, idValue) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  const idIndex = headers.indexOf(idColumnName);

  if (idIndex === -1) {
    throw new Error(sheetName + ' に列がありません: ' + idColumnName);
  }

  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    if (String(row[idIndex]).trim() === String(idValue).trim()) {
      const record = {};

      headers.forEach(function(header, index) {
        record[header] = row[index];
      });

      return record;
    }
  }

  return null;
}

/**
 * @summary グループ初期設定をgroup_setupに保存する
 * @function saveEntry
 * @read group_setup / cd_mst / ms_mst / sk_mst / scenario_profile
 * @write group_setup
 * @update 2026-06-30
 */
function saveEntry(entry) {
  const sheet = getSheet('group_setup');
  const lastRow = sheet.getLastRow();

  // 既存の同一 group_id を無効化する
  // G列: is_valid_group
  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, 17).getValues();

    values.forEach(function(row, index) {
      const rowGroupId = String(row[1]).trim(); // B: group_id

      if (rowGroupId === String(entry.groupId).trim()) {
        const targetRow = index + 2;
        sheet.getRange(targetRow, 7).setValue(false); // G: is_valid_group
      }
    });
  }

  const challenge = getMasterRecordById_('cd_mst', 'challenge_id', entry.challengeId);
  const mission = getMasterRecordById_('ms_mst', 'mission_id', entry.missionId);
  const skill = getMasterRecordById_('sk_mst', 'skill_id', entry.skillId);

  const scenarioId = entry.scenarioId || 'SCN01';
  const scenarioProfile = getMasterRecordById_('scenario_profile', 'scenario_id', scenarioId);

  if (!challenge) throw new Error('cd_mstに該当IDがありません: ' + entry.challengeId);
  if (!mission) throw new Error('ms_mstに該当IDがありません: ' + entry.missionId);
  if (!skill) throw new Error('sk_mstに該当IDがありません: ' + entry.skillId);
  if (!scenarioProfile) throw new Error('scenario_profileに該当IDがありません: ' + scenarioId);
  
  const nextRow = sheet.getLastRow() + 1;

  sheet.getRange(nextRow, 1, 1, 17).setValues([[
    new Date(),                    // A timestamp
    entry.groupId,                 // B group_id
    entry.challengeId,             // C challenge_id
    entry.missionId,               // D mission_id
    entry.skillId,                 // E skill_id
    'active',                      // F status
    true,                          // G is_valid_group
    'completed',                   // H setup_status
    scenarioId,                    // I scenario_id
    scenarioProfile.scenario_name || '',  // J scenario_name
    scenarioProfile.difficulty || '',     // K scenario_difficulty
    challenge.challenge_name || '',// L challenge_label
    mission.mission_name || '',    // M mission_label
    mission.difficulty || '',      // N mission_difficulty
    skill.skill_name || '',        // O skill_label
    skill.activation || '',     // P activation
    entry.memo || ''               // Q memo
  ]]);

  return {
    success: true,
    groupId: entry.groupId,
    sheetName: sheet.getName(),
    writtenRow: nextRow
  };
}
