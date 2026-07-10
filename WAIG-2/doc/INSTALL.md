# WAIG-2 導入手順

## 1. ファイルを取得する

GitHubからWAIG-2一式をダウンロードします。

## 2. カードDBを準備する

`card-db` フォルダ内のExcelファイルをGoogle Driveへアップロードし、Googleスプレッドシートとして開きます。

## 3. GASプロジェクトを作成する

新しいGoogle Apps Scriptプロジェクトを作成し、`src` フォルダ内のソースを反映します。

## 4. スプレッドシートIDを設定する

`Config.gs` の次の値を、自分のスプレッドシートIDへ変更します。

```javascript
SPREADSHEET_ID: 'ここにスプレッドシートID'

## 5.外部リンクを設定する
CONFIG.LINKS のURLを、必要に応じて変更します。

## ６．Webアプリとしてデプロイする

Apps ScriptでWebアプリとしてデプロイし、発行されたexec URLへアクセスします。