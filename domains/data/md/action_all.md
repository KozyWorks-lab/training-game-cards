# WEB ANALYTICS IMPROVEMENT GAME

Created by KozyWorks

Educational Use Welcome  
See LICENSE.md for details.

---

# 施策カード統合マスタ

---

---
id: A01
domain: EC
type: STRATEGY
name: SEO強化
category: 集客
cost: 2
main_kpi: GI

kpi:
  general_inflow: 1000
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A13
    effect:
      general_inflow: 500
      cvr: 0.001
---

## 効果
一般流入: +1000

## 内容
・商品ページの検索キーワードを最適化する
・比較記事やSEO記事を追加する
・内部リンク構造を整理する

## 副作用
・成果が出るまで時間がかかる
・継続的な記事更新コストが発生する

## 相乗効果
A13（LP改善）→一般流入+500/CVR+0.001

---

---
id: A02
domain: EC
type: STRATEGY
name: SNS運用強化
category: 集客
cost: 1
main_kpi: GI / BR

kpi:
  general_inflow: 1000
  ad_inflow: 0
  bounce: 0
  browse: 0.01
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A11
    effect:
      general_inflow: 300
      browse: 0.03
      cvr: 0.0005
---

## 効果
一般流入: +1000 / 回遊: +0.01

## 内容
・Instagramで商品紹介投稿を増やす
・Xでキャンペーン情報を発信する
・UGC投稿を活用して拡散を促進する

## 副作用
・継続運用の負荷が高い
・流入品質が不安定になりやすい

## 相乗効果
A11（記事コンテンツ追加）→一般流入+300/回遊+0.03/CVR+0.0005

---

---
id: A03
domain: EC
type: STRATEGY
name: 広告出稿拡大
category: 集客
cost: 3
main_kpi: AI / CPC

kpi:
  general_inflow: 0
  ad_inflow: 1500
  bounce: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: 10

synergy:
  - target: A21
    effect:
      ad_inflow: 500
      cvr: 0.0005
      cpc: -5
---

## 効果
広告流入: +1500 / CPC: +10

## 内容
・リスティング広告の予算を増額する
・新しい広告媒体へ出稿する
・高CVキーワードへ入札を集中する

## 副作用
・広告費が急増する
・CPAが悪化する可能性がある

## 相乗効果
A21（広告精査）→広告流入+500/CVR+0.0005/CPC-5

---

---
id: A04
domain: EC
type: STRATEGY
name: インフルエンサー施策
category: 集客
cost: 2
main_kpi: GI / BR / CVR

kpi:
  general_inflow: 800
  ad_inflow: 0
  bounce: 0
  browse: 0.005
  cvr: 0.0003
  aov: 0
  cpc: 0

synergy: []
---

## 効果
一般流入: +800 / 回遊: +0.005 / CVR: +0.0003

## 内容
・インフルエンサーへ商品レビューを依頼する
・SNSタイアップ投稿を実施する
・レビュー動画を拡散する

## 副作用
・効果が一時的になりやすい
・ブランドイメージに影響する可能性がある

## 相乗効果
なし

---

---
id: A05
domain: EC
type: STRATEGY
name: ファーストビュー改善
category: UX
cost: 2
main_kpi: BO / CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: -0.05
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy:
  - target: A14
    effect:
      bounce: -0.03
      cvr: 0.0015
---

## 効果
離脱: -0.05 / CVR: +0.0005

## 内容
・ファーストビューの訴求文を改善する
・CTAボタンを目立つ位置へ変更する
・商品価値を伝える画像へ差し替える

## 副作用
・期待値が上がりすぎる可能性がある
・デザイン変更コストが発生する

## 相乗効果
A14（フォーム改善）→離脱-0.03/CVR+0.0015

---

---
id: A06
domain: EC
type: STRATEGY
name: 導線改善
category: UX
cost: 2
main_kpi: BO / BR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: -0.03
  browse: 0.03
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A10
    effect:
      bounce: -0.02
      browse: 0.03
      cvr: 0.0005
---

## 効果
離脱: -0.03 / 回遊: +0.03

## 内容
・商品ページへの導線を短縮する
・関連商品リンクを増やす
・カテゴリ構造を整理する

## 副作用
・導線が複雑になる可能性がある
・回遊過多でCVが遅れる場合がある

## 相乗効果
A10（レビュー強化）→離脱-0.02/回遊+0.03/CVR+0.0005

---

---
id: A07
domain: EC
type: STRATEGY
name: モバイル最適化
category: UX
cost: 2
main_kpi: BO / CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: -0.04
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy: []
---

## 効果
離脱: -0.04 / CVR: +0.0005

## 内容
・スマホUIを最適化する
・タップ領域を改善する
・縦スクロール設計を見直す

## 副作用
・開発負荷が増加する
・PC表示との整合性が崩れる場合がある

## 相乗効果
なし

---

---
id: A08
domain: EC
type: STRATEGY
name: ページ速度改善
category: UX
cost: 1
main_kpi: BO / BR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: -0.02
  browse: 0.005
  cvr: 0
  aov: 0
  cpc: 0

synergy: []
---

## 効果
離脱: -0.02 / 回遊: +0.005

## 内容
・画像圧縮を行う
・不要スクリプトを削減する
・キャッシュ設定を最適化する

## 副作用
・機能制限が発生する可能性がある
・技術対応コストが発生する

## 相乗効果
なし

---

---
id: A09
domain: EC
type: STRATEGY
name: セット販売の導入
category: AOV改善
cost: 2
main_kpi: BR / CVR / AOV

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0.01
  cvr: 0.0003
  aov: 400
  cpc: 0

synergy: []
---

## 効果
回遊: +0.01 / CVR: +0.0003 / AOV: +400

## 内容
・関連商品のセット販売を提案する
・まとめ買い割引を導入する
・商品ページで組み合わせ提案を行う

## 副作用
・在庫管理が複雑化する
・単品購入率が低下する可能性がある

## 相乗効果
なし

---

---
id: A10
domain: EC
type: STRATEGY
name: レビュー強化
category: コンテンツ
cost: 1
main_kpi: BR / CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0.01
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy:
  - target: A19
    effect:
      general_inflow: 200
      ad_inflow: 200
      browse: 0.02
      cvr: 0.0005
---

## 効果
回遊: +0.01 / CVR: +0.0005

## 内容
・購入者レビューを掲載する
・星評価を表示する
・写真付きレビューを収集する

## 副作用
・ネガティブレビューの影響を受ける可能性がある
・レビュー管理工数が増加する

## 相乗効果
A19（リターゲティング）→一般流入+200/広告流入+200/回遊+0.02/CVR+0.0005

---

---
id: A11
domain: EC
type: STRATEGY
name: 記事コンテンツ追加
category: コンテンツ
cost: 2
main_kpi: GI / BR

kpi:
  general_inflow: 500
  ad_inflow: 0
  bounce: 0
  browse: 0.03
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A13
    effect:
      browse: 0.02
      cvr: 0.001
---

## 効果
一般流入: +500 / 回遊: +0.03

## 内容
・SEO記事を継続的に追加する
・比較記事やランキング記事を作成する
・検索意図に沿った記事構成へ改善する

## 副作用
・即効性が低い
・継続的な更新工数が発生する

## 相乗効果
A13（LP改善）→回遊+0.02/CVR+0.001

---

---
id: A12
domain: EC
type: STRATEGY
name: 動画コンテンツ導入
category: コンテンツ
cost: 2
main_kpi: BR / CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0.02
  cvr: 0.0003
  aov: 0
  cpc: 0

synergy:
  - target: A18
    effect:
      general_inflow: 200
      browse: 0.02
      cvr: 0.0005
      aov: 100
---

## 効果
回遊: +0.02 / CVR: +0.0003

## 内容
・商品動画を掲載する
・レビュー動画を制作する
・サービス説明動画を導入する

## 副作用
・制作コストが高い
・読み込み速度へ影響する可能性がある

## 相乗効果
A18（LINE施策）→一般流入+200/回遊+0.02/CVR+0.0005/AOV+100

---

---
id: A13
domain: EC
type: STRATEGY
name: LP改善
category: CVR
cost: 2
main_kpi: CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: A22
    effect:
      ad_inflow: 300
      cvr: 0.001
      cpc: -3
---

## 効果
CVR: +0.001

## 内容
・CTA配置を最適化する
・購入前の不安解消要素を追加する
・訴求内容をターゲット別に調整する

## 副作用
・回遊率が低下する可能性がある
・訴求過多で信頼性が下がる場合がある

## 相乗効果
A22（ターゲティング改善）→広告流入+300/CVR+0.001/CPC-3

---

---
id: A14
domain: EC
type: STRATEGY
name: フォーム改善
category: CVR
cost: 2
main_kpi: CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.0007
  aov: 0
  cpc: 0

synergy:
  - target: A05
    effect:
      bounce: -0.03
      cvr: 0.0015
---

## 効果
CVR: +0.0007

## 内容
・入力項目を削減する
・エラー表示を改善する
・スマホ入力を最適化する

## 副作用
・情報不足になる可能性がある
・誤入力が増加する可能性がある

## 相乗効果
A05（ファーストビュー改善）→離脱-0.03/CVR+0.0015

---

---
id: A15
domain: EC
type: STRATEGY
name: ABテスト
category: CVR
cost: 1
main_kpi: CVR

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy: []
---

## 効果
CVR: +0.0005

## 内容
・複数LPを比較検証する
・コピーやデザインを比較する
・UI改善案をテストする

## 副作用
・判断に時間がかかる
・検証工数が増加する

## 相乗効果
なし

---

---
id: A16
domain: EC
type: STRATEGY
name: 限定キャンペーン
category: CVR
cost: 2
main_kpi: CVR / AOV

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.001
  aov: 100
  cpc: 0

synergy:
  - target: A17
    effect:
      general_inflow: 300
      cvr: 0.0015
      aov: 200
---

## 効果
CVR: +0.001 / AOV: +100

## 内容
・期間限定割引を実施する
・特典キャンペーンを導入する
・数量限定販売を行う

## 副作用
・利益率が低下する
・ブランド価値が下がる可能性がある

## 相乗効果
A17（メルマガ強化）→一般流入+300/CVR+0.0015/AOV+200

---

---
id: A17
domain: EC
type: STRATEGY
name: メルマガ強化
category: CRM
cost: 1
main_kpi: GI / CVR / AOV

kpi:
  general_inflow: 300
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.001
  aov: 50
  cpc: 0

synergy:
  - target: A16
    effect:
      general_inflow: 300
      cvr: 0.0015
      aov: 200
---

## 効果
一般流入: +300 / CVR: +0.001 / AOV: +50

## 内容
・セグメント別メルマガを配信する
・キャンペーン情報を定期送信する
・既存顧客向け再訪導線を設計する

## 副作用
・解除率が上昇する可能性がある
・コンテンツ制作負荷が増える

## 相乗効果
A16（限定キャンペーン）→一般流入+300/CVR+0.0015/AOV+200

---

---
id: A18
domain: EC
type: STRATEGY
name: LINE施策
category: CRM
cost: 2
main_kpi: GI / BR / CVR

kpi:
  general_inflow: 500
  ad_inflow: 0
  bounce: 0
  browse: 0.02
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy:
  - target: A12
    effect:
      general_inflow: 200
      browse: 0.02
      cvr: 0.0005
      aov: 100
---

## 効果
一般流入: +500 / 回遊: +0.02 / CVR: +0.0005

## 内容
・LINE公式アカウントを運用する
・クーポン配信を行う
・ステップ配信を設計する

## 副作用
・ブロック率が上昇する可能性がある
・運用設計に工数がかかる

## 相乗効果
A12（動画コンテンツ導入）→一般流入+200/回遊+0.02/CVR+0.0005/AOV+100

---

---
id: A19
domain: EC
type: STRATEGY
name: リターゲティング
category: CRM
cost: 2
main_kpi: AI / CVR

kpi:
  general_inflow: 0
  ad_inflow: 600
  bounce: 0
  browse: 0
  cvr: 0.0007
  aov: 0
  cpc: 0

synergy:
  - target: A10
    effect:
      general_inflow: 200
      ad_inflow: 200
      browse: 0.02
      cvr: 0.0005
---

## 効果
広告流入: +600 / CVR: +0.0007

## 内容
・追跡広告を配信する
・カゴ落ちユーザーへ再配信する
・閲覧履歴ベース広告を配信する

## 副作用
・広告嫌悪感を持たれる可能性がある
・広告費が増加しやすい

## 相乗効果
A10（レビュー強化）→一般流入+200/広告流入+200/回遊+0.02/CVR+0.0005

---

---
id: A20
domain: EC
type: STRATEGY
name: 会員制度導入
category: CRM
cost: 2
main_kpi: BR / CVR / AOV

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0.01
  cvr: 0.0005
  aov: 100
  cpc: 0

synergy: []
---

## 効果
回遊: +0.01 / CVR: +0.0005 / AOV: +100

## 内容
・ポイント制度を導入する
・ランク制度を設定する
・会員限定特典を提供する

## 副作用
・運用コストが増加する
・制度が複雑化する可能性がある

## 相乗効果
なし

---

---
id: A21
domain: EC
type: STRATEGY
name: 広告精査
category: 広告最適化
cost: 1
main_kpi: AI / CVR / CPC

kpi:
  general_inflow: 0
  ad_inflow: 300
  bounce: 0
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: -5

synergy:
  - target: A03
    effect:
      ad_inflow: 500
      cvr: 0.0005
      cpc: -5
---

## 効果
広告流入: +300 / CVR: +0.0005 / CPC: -5

## 内容
・成果の低い広告を停止する
・無駄キーワードを削除する
・媒体配分を見直す

## 副作用
・流入が減少する可能性がある
・機会損失が発生する場合がある

## 相乗効果
A03（広告出稿拡大）→広告流入+500/CVR+0.0005/CPC-5

---

---
id: A22
domain: EC
type: STRATEGY
name: ターゲティング改善
category: 広告最適化
cost: 2
main_kpi: CVR / CPC

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: -3

synergy:
  - target: A13
    effect:
      ad_inflow: 300
      cvr: 0.001
      cpc: -3
---

## 効果
CVR: +0.0005 / CPC: -3

## 内容
・ターゲット属性を見直す
・配信セグメントを細分化する
・類似オーディエンスを活用する

## 副作用
・リーチが減少する可能性がある
・配信対象が偏る場合がある

## 相乗効果
A13（LP改善）→広告流入+300/CVR+0.001/CPC-3

---

---
id: A23
domain: EC
type: STRATEGY
name: クリエイティブ改善
category: 広告最適化
cost: 1
main_kpi: BR / CVR / CPC

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0.005
  cvr: 0.0005
  aov: 0
  cpc: -2

synergy: []
---

## 効果
回遊: +0.005 / CVR: +0.0005 / CPC: -2

## 内容
・広告バナーを改善する
・訴求コピーを見直す
・ABテストで表現を最適化する

## 副作用
・制作負荷が増加する
・効果変動が大きい場合がある

## 相乗効果
なし

---

---
id: A24
domain: EC
type: STRATEGY
name: 入札最適化
category: 広告最適化
cost: 2
main_kpi: CPC

kpi:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: -8

synergy: []
---

## 効果
CPC: -8

## 内容
・入札単価を最適化する
・自動入札を活用する
・時間帯別に入札調整を行う

## 副作用
・表示回数が減少する可能性がある
・細かい制御が難しくなる

## 相乗効果
なし

---
