/**
 * @summary メンバー登録画面から参照し、未登録のプレイヤー枠一覧を取得する
 * @function getMemberGroupOptions
 * @read getPlayerSlots()
 * @write 未登録プレイヤー枠の選択肢配列を返す
 * @update 2026-06-30
 */
function getMemberGroupOptions() {
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
 * @summary メンバー登録画面から実行し、選択されたプレイヤー枠に参加者名を登録する
 * @function saveMember
 * @read member, member_log, isMemberRegistered()
 * @write member_log にメンバー登録情報を追加し、登録結果を返す
 * @update 2026-06-30
 */
function saveMember(member) {
  const sheet = getSheet(SHEETS.MEMBER_LOG);

  const groupId = String(member.groupId || '').trim();
  const name = String(member.memberName || '').trim();

  if (!groupId) {
    throw new Error('プレイヤー枠が選択されていません');
  }

  if (!name) {
    throw new Error('名前が入力されていません');
  }

  const memberId = groupId + '_H';
  const displayName = groupId + '_' + name;

  // 念のため、同じ group_id が active で登録済みでないか確認
  if (isMemberRegistered(groupId)) {
    throw new Error('このプレイヤー枠はすでに登録されています：' + groupId);
  }

  const nextRow = sheet.getLastRow() + 1;

  sheet.getRange(nextRow, 1, 1, 8).setValues([[
    new Date(),     // A timestamp
    memberId,       // B member_id
    groupId,        // C group_id
    name,           // D name
    displayName,    // E display_name
    'USE',          // F ai_use
    'active',       // G status
    ''              // H memo
  ]]);

  return {
    success: true,
    groupId: groupId,
    memberId: memberId,
    name: name,
    displayName: displayName,
    status: 'active',
    sheetName: sheet.getName(),
    writtenRow: nextRow
  };
}


/**
 * @summary 内部処理：指定されたプレイヤー枠が active 状態で登録済みか確認する
 * @function isMemberRegistered
 * @read groupId, member_log
 * @write 登録済みの場合は true、未登録の場合は false を返す
 * @update 2026-06-30
 */
function isMemberRegistered(groupId) {
  const sheet = getSheet(SHEETS.MEMBER_LOG);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return false;
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  return values.some(function(row) {
    const rowGroupId = String(row[2] || '').trim(); // C group_id
    const status = String(row[6] || '').trim();     // G status

    return rowGroupId === groupId && status === 'active';
  });
}