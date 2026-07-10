/**
 * WAIG Lite
 * データアクセス層
 *
 * 役割
 * - Spreadsheet接続
 * - シート取得
 * - マスタ取得
 * - group_setup取得
 *
 * 更新日: 2025-06-08
 */

/**
 * @summary CONFIGで指定されたスプレッドシートを取得する
 * @function getSpreadsheet
 * @read CONFIG.SPREADSHEET_ID
 * @write Spreadsheetオブジェクト
 * @update 2026-06-30
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

/**
 * @summary 指定されたシート名のシートを取得する
 * @function getSheet
 * @read CONFIG.SPREADSHEET_ID / sheetName
 * @write Sheetオブジェクト
 * @update 2026-06-30
 */
function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}


/**
 * @summary setupシートから指定キーの設定値を取得する
 * @function getSetupValue
 * @read setup
 * @write setup値
 * @update 2026-06-30
 */
function getSetupValue(key) {
  const sheet = getSheet('setup');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    const rowKey = String(values[i][0]).trim();

    if (rowKey === key) {
      return values[i][1];
    }
  }

  return null;
}


/**
 * @summary マスタシートから指定IDに対応する名称を取得する
 * @function getMasterName
 * @read sheetName / idColumnName / nameColumnName / targetId
 * @write マスタ名称
 * @update 2026-06-30
 */
function getMasterName(sheetName, idColumnName, nameColumnName, targetId) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  const idIndex = headers.indexOf(idColumnName);
  const nameIndex = headers.indexOf(nameColumnName);

  const row = values.slice(1).find(function(row) {
    return String(row[idIndex]).trim() === String(targetId).trim();
  });

  return row ? row[nameIndex] : '';
}


/**
 * @summary 指定条件に一致するシート行をオブジェクトとして取得する
 * @function findRowByValues
 * @read sheetName / conditions
 * @write 条件一致行オブジェクト
 * @update 2026-06-30
 */
function findRowByValues(sheetName, conditions) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());

  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    const matched = Object.keys(conditions).every(function(key) {
      const index = headers.indexOf(key);
      return String(row[index]).trim() === String(conditions[key]).trim();
    });

    if (matched) {
      const obj = {};
      headers.forEach(function(header, index) {
        obj[header] = row[index];
      });
      return obj;
    }
  }

  return null;
}

/**
 * @summary turn_logから現在のターン番号を取得する
 * @function getCurrentTurn
 * @read turn_log
 * @write 現在ターン番号
 * @update 2026-06-30
 */
function getCurrentTurn() {
  const sheet = getSheet('turn_log');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return 0;
  }

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });

  const logTypeIndex = headers.indexOf('log_type');
  const turnIndex = headers.indexOf('turn');

  const turnStarts = values.slice(1)
    .filter(function(row) {
      return String(row[logTypeIndex]).trim() === 'TURN_START';
    })
    .map(function(row) {
      return Number(row[turnIndex]);
    })
    .filter(function(turn) {
      return !isNaN(turn);
    });

  if (turnStarts.length === 0) {
    return 0;
  }

  return Math.max.apply(null, turnStarts);
}


/**
 * @summary setupシートから推奨最大ターン数を取得する
 * @function getMaxTurn
 * @read setup
 * @write 最大ターン数
 * @update 2026-06-30
 */
function getMaxTurn() {
  const value = getSetupValue('RECOMMENDED_TURNS');
  const maxTurn = Number(value);

  if (isNaN(maxTurn) || maxTurn <= 0) {
    return 6;
  }

  return maxTurn;
}

/**
 * @summary 指定シートの値をキャッシュ付きで取得する
 * @function getCachedSheetValues_
 * @read sheetName / CacheService / 対象シート
 * @write シート値配列 / CacheService
 * @update 2026-06-30
 * @note 内部処理用
 */
function getCachedSheetValues_(sheetName, cacheSeconds) {
  const cache = CacheService.getScriptCache();
  const key = 'waig2_' + sheetName;
  const cached = cache.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  cache.put(key, JSON.stringify(values), cacheSeconds || 600);

  return values;
}

/**
 * @summary WAIG-2で使用するスクリプトキャッシュを削除する
 * @function clearWaig2Cache
 * @read CacheService
 * @write CacheService
 * @update 2026-06-30
 */
function clearWaig2Cache() {
  const cache = CacheService.getScriptCache();

  const keys = [
    'waig2_ac_mst',
    'waig2_cd_mst',
    'waig2_tr_mst',
    'waig2_tc_mst',
    'waig2_ms_mst',
    'waig2_sk_mst',
    'waig2_scenario_mst',
    'waig2_scenario_profile',
    'waig2_sum_mst'
  ];

  cache.removeAll(keys);
}
