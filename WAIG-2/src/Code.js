/**
 * @summary Webアプリの初期画面または指定画面を表示する
 * @function doGet
 * @read URLパラメータ
 * @write HTML画面
 * @update 2026-07-10
 */
function doGet(e) {

  const parameter =
    e && e.parameter
      ? e.parameter
      : {};

  const page =
    parameter.page || '';

  if (!page || page === 'portal') {

    return createTemplate_(
      'PortalView',
      parameter
    )
      .evaluate()
      .setTitle(APP_INFO.NAME)
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );
  }

  return createTemplate_(
    'index',
    parameter
  )
    .evaluate()
    .setTitle(APP_INFO.NAME)
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/**
 * @summary HTML部品ファイルの内容を読み込む
 * @function include
 * @read HTMLファイル
 * @write HTML文字列
 * @update 2026-06-28
 */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

/**
 * @summary HTMLテンプレートへ共通情報を設定する
 * @function createTemplate_
 * @read CONFIG, APP_INFO, URLパラメータ
 * @write HTMLテンプレート
 * @update 2026-07-10
 */
function createTemplate_(fileName, parameter) {

  const template =
    HtmlService.createTemplateFromFile(fileName);

  parameter = parameter || {};

  template.page = parameter.page || '';
  template.groupId =
    parameter.group_id ||
    parameter.groupId ||
    '';

  template.mode =
    parameter.mode || '';

  template.appUrl =
    ScriptApp.getService().getUrl();

  template.ruleUrl =
    CONFIG.LINKS.RULE;

  template.cardListUrl =
    CONFIG.LINKS.CARD_LIST;

  template.homeUrl =
    CONFIG.LINKS.HOME;

  template.appName =
    APP_INFO.NAME;

  template.appVersion =
    APP_INFO.VERSION;

  template.githubUrl =
    CONFIG.LINKS.GITHUB;

  template.appName =
    APP_INFO.NAME;

  template.appVersion =
    APP_INFO.VERSION;

  return template;
}