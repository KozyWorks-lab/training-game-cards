/* ==========================================
 * WAIG-2 Config
 * システム共通定数
 * ========================================== */

/**
 * @summary WAIG-2で使用する共通設定
 * @constant CONFIG
 * @read
 * @write
 * @update 2026-07-10
 */
const CONFIG = {

  // スプレッドシート
  SPREADSHEET_ID: '1inI1NIM-UHG0lzNagvsy4n-_g9o1ggCjcAUdplPdZz0',

  // 外部リンク
  LINKS: {
    HOME: 'https://kozyworks.jp/decision-training/',
    RULE: 'https://kozyworks.jp/cards/index.html',
    CARD_LIST: 'https://kozyworks.jp/cards/index_card.html',
    GITHUB: 'https://github.com/KozyWorks-lab/training-game-cards'
  }

};

/**
 * @summary WAIGアプリケーション情報を定義する
 * @constant APP_INFO
 * @read
 * @write
 * @update 2026-07-10
 */
const APP_INFO = {

  NAME: 'WAIG-2',

  VERSION: '2.0.0',
  
  AUTHOR: 'KozyWorks'

};

/**
 * @summary WAIGで使用するシート名を定義する
 * @constant SHEETS
 * @read
 * @write
 * @update 2026-06-30
 * @note 仕様書のシート利用一覧では、この定数に登録された値だけを実シート名として扱う
 */
const SHEETS = {
  SETUP: 'setup',

  MEMBER_LOG: 'member_log',
  GROUP_MST: 'group_mst',
  GROUP_SETUP: 'group_setup',
  TURN_LOG: 'turn_log',
  COMPARE_DB: 'compare_db',
  MARKET_EVENT_LOG: 'market_event_log',
  AI_FEEDBACK: 'ai_feedback',

  CD_MST: 'cd_mst',
  MS_MST: 'ms_mst',
  SK_MST: 'sk_mst',
  AC_MST: 'ac_mst',
  TR_MST: 'tr_mst',
  TC_MST: 'tc_mst',
  SUM_MST: 'sum_mst',
  SY_MST: 'sy_mst',

  SCENARIO_MST: 'scenario_mst',
  SCENARIO_PROFILE: 'scenario_profile',
  SCENARIO_TR_MST: 'scenario_tr_mst',
  SCENARIO_TC_MST: 'scenario_tc_mst',

  APP_LITE_STATUS: 'app_lite_status',
  APP_LITE_LOG: 'app_lite_log'
};
