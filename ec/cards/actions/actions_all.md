```md
<!--
WEB ANALYTICS IMPROVEMENT GAME
施策カード統合マスタ
-->

# 施策カード統合マスタ

---

---
id: A01
domain: EC
type: STRATEGY
name: SEO強化
category: 集客
cost: 2

kpi:
  inflow_general: 1500
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: C03
    effect:
      inflow_general: 1000
      inflow_paid: 0
      browse: 0.02
---

## 効果
流入: +1500

## 内容
・商品ページの検索キーワード最適化  
・検索意図に合わせた記事コンテンツの追加  
・内部リンク構造の見直し  

## 副作用
・成果が出るまで時間がかかる  
・コンテンツ制作コストが増加する  

## 相乗効果
C03 と組み合わせ → 流入 +1000 / 回遊 +0.02

---

---
id: A02
domain: EC
type: STRATEGY
name: SNS運用強化
category: 集客
cost: 1

kpi:
  inflow_general: 1000
  inflow_paid: 0
  exit: 0
  browse: 0.02
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: C04
    effect:
      browse: 0.03
      cvr: 0.001
---

## 効果
流入: +1000 / 回遊: +0.02

## 内容
・Instagramで商品紹介投稿を増やす  
・Xでキャンペーン情報を拡散する  
・ユーザー投稿を活用したUGC施策  

## 副作用
・流入の質が不安定になりやすい  
・運用負荷が継続的に発生する  

## 相乗効果
C04 と組み合わせ → 回遊 +0.03 / CVR +0.001

---

---
id: A03
domain: EC
type: STRATEGY
name: 広告出稿拡大
category: 集客
cost: 3

kpi:
  inflow_general: 0
  inflow_paid: 2000
  exit: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: 10

synergy:
  - target: F02
    effect:
      cvr: 0.001
      cpc: -5
---

## 効果
流入: +2000 / CPC: +10

## 内容
・リスティング広告の予算増額  
・ディスプレイ広告の配信拡大  
・新規媒体への広告出稿  

## 副作用
・CPAが悪化する可能性  
・広告費が急増する  

## 相乗効果
F02 と組み合わせ → CVR +0.001 / CPC -5

---

---
id: A04
domain: EC
type: STRATEGY
name: インフルエンサー施策
category: 集客
cost: 2

kpi:
  inflow_general: 1200
  inflow_paid: 0
  exit: 0
  browse: 0.01
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy:
  - target: C04
    effect:
      cvr: 0.001
---

## 効果
流入: +1200 / 回遊: +0.01 / CVR: +0.0005

## 内容
・インフルエンサーによる商品紹介  
・レビュー動画の制作依頼  
・SNSでのタイアップ投稿  

## 副作用
・効果が一時的になりやすい  
・ブランドイメージに影響する可能性  

## 相乗効果
C04 と組み合わせ → CVR +0.001

---

---
id: A05
domain: EC
type: STRATEGY
name: ファーストビュー改善
category: UX
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: -0.05
  browse: 0
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: C01
    effect:
      cvr: 0.001
---

## 効果
離脱: -0.05 / CVR: +0.001

## 内容
・ファーストビューのキャッチコピーを改善する  
・ユーザーに刺さるビジュアル（画像・動画）に変更する  
・CTAボタンを視認性の高い位置に配置する  

## 副作用
・過剰な訴求により信頼性が低下する可能性がある  
・期待値を上げすぎると離脱後の不満が増える  

## 相乗効果
C01 と組み合わせ → CVR +0.001

---

---
id: A06
domain: EC
type: STRATEGY
name: 導線改善
category: UX
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: -0.03
  browse: 0.05
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: C01
    effect:
      browse: 0.03
      cvr: 0.001
---

## 効果
離脱: -0.03 / 回遊: +0.05

## 内容
・グローバルナビゲーションを整理する  
・商品ページへの導線を強化する  
・関連商品やおすすめリンクを設置する  

## 副作用
・回遊が増えすぎてCVポイントに到達しにくくなる  
・導線が複雑になりユーザーが迷う可能性がある  

## 相乗効果
C01 と組み合わせ → 回遊 +0.03 / CVR +0.001

---

---
id: A07
domain: EC
type: STRATEGY
name: モバイル最適化
category: UX
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: -0.04
  browse: 0
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: F03
    effect:
      cvr: 0.001
---

## 効果
離脱: -0.04 / CVR: +0.001

## 内容
・スマホ画面に最適化したレイアウトに変更する  
・タップしやすいボタンサイズに調整する  
・スクロールしやすいUIに改善する  

## 副作用
・PC表示とのデザイン差が大きくなる  
・開発コストや工数が増加する  

## 相乗効果
F03 と組み合わせ → CVR +0.001

---

---
id: A08
domain: EC
type: STRATEGY
name: ページ速度改善
category: UX
cost: 1

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: -0.02
  browse: 0.01
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A01
    effect:
      inflow_general: 500
      inflow_paid: 0
---

## 効果
離脱: -0.02 / 回遊: +0.01

## 内容
・画像ファイルを圧縮して軽量化する  
・不要なJavaScriptやCSSを削減する  
・キャッシュ機能を活用して表示速度を向上させる  

## 副作用
・機能制限によりユーザー体験が低下する可能性がある  
・技術的な対応コストが発生する  

## 相乗効果
A01 と組み合わせ → 流入 +500

---

---
id: A09
domain: EC
type: STRATEGY
name: セット販売の導入
category: AOV改善
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0.02
  cvr: 0.0005
  aov: 800
  cpc: 0
---

## 効果
・流入：0  
・離脱：0  
・回遊：+0.02  
・CVR：+0.0005  
・AOV：+800  
・CPC：0  

## 内容
・関連商品のセット販売を導入  
・まとめ買い割引を提示  
・商品ページで組み合わせ提案  

## 副作用
・単品購入率が下がる可能性  
・在庫管理が複雑になる  

## 相乗効果
・A04（レコメンド強化）と組み合わせでAOVさらに上昇  
・A05（LP改善）と組み合わせでCVR向上

---

---
id: A10
domain: EC
type: STRATEGY
name: レビュー強化
category: コンテンツ
cost: 1

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0.02
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: D04
    effect:
      cvr: 0.001
---

## 効果
回遊: +0.02 / CVR: +0.001

## 内容
・購入者レビューを掲載する  
・星評価やランキングを表示する  
・写真付きレビューを収集・表示する  

## 副作用
・ネガティブレビューが影響する可能性  
・レビュー操作と疑われるリスク  

## 相乗効果
D04 と組み合わせ → CVR +0.001

---

---
id: A11
domain: EC
type: STRATEGY
name: 記事コンテンツ追加
category: コンテンツ
cost: 2

kpi:
  inflow_general: 500
  inflow_paid: 0
  exit: 0
  browse: 0.05
  cvr: 0
  aov: 0
  cpc: 0

synergy:
  - target: A01
    effect:
      inflow_general: 1000
      inflow_paid: 0
---

## 効果
流入: +500 / 回遊: +0.05

## 内容
・SEOを意識した記事を定期的に追加する  
・比較記事やランキング記事を作成する  
・ユーザーの悩みを解決するハウツー記事を掲載する  

## 副作用
・即効性が低く成果まで時間がかかる  
・継続的な運用負荷が発生する  

## 相乗効果
A01 と組み合わせ → 流入 +1000

---

---
id: A12
domain: EC
type: STRATEGY
name: 動画コンテンツ導入
category: コンテンツ
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0.04
  cvr: 0.0005
  aov: 0
  cpc: 0

synergy:
  - target: A02
    effect:
      cvr: 0.001
---

## 効果
回遊: +0.04 / CVR: +0.0005

## 内容
・商品の使用動画を掲載する  
・レビュー動画を制作する  
・サービス説明動画を導入する  

## 副作用
・制作コストが高くなる  
・読み込み速度に影響する可能性  

## 相乗効果
A02 と組み合わせ → CVR +0.001

---

---
id: A13
domain: EC
type: STRATEGY
name: LP改善
category: CVR
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.002
  aov: 0
  cpc: 0

synergy:
  - target: F02
    effect:
      cvr: 0.002
      cpc: -3
---

## 効果
CVR: +0.002

## 内容
・ファーストビューの構成を見直す  
・CTAボタンの配置と文言を最適化する  
・購入前の不安を解消する要素を追加する  

## 副作用
・回遊が減少する可能性  
・過剰な訴求で信頼性が低下する  

## 相乗効果
F02 と組み合わせ → CVR +0.002 / CPC -3

---

---
id: A14
domain: EC
type: STRATEGY
name: フォーム改善
category: CVR
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.0015
  aov: 0
  cpc: 0

synergy:
  - target: E03
    effect:
      cvr: 0.001
---

## 効果
CVR: +0.0015

## 内容
・入力項目を削減する  
・エラー表示を分かりやすくする  
・スマホ入力に最適化する  

## 副作用
・情報不足により質が低下する可能性  
・スパムや誤入力が増える  

## 相乗効果
E03 と組み合わせ → CVR +0.001

---

---
id: A15
domain: EC
type: STRATEGY
name: ABテスト
category: CVR
cost: 1

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: A13
    effect:
      cvr: 0.001
---

## 効果
CVR: +0.001

## 内容
・複数のLPパターンを比較する  
・コピーやデザインの検証を行う  
・最適なUIを選定する  

## 副作用
・結果が出るまで時間がかかる  
・判断が遅れる可能性  

## 相乗効果
A13 と組み合わせ → CVR +0.001

---

---
id: A16
domain: EC
type: STRATEGY
name: 限定キャンペーン
category: CVR
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.002
  aov: 200
  cpc: 0

synergy:
  - target: A10
    effect:
      cvr: 0.001
---

## 効果
CVR: +0.002 / AOV: +200

## 内容
・期間限定割引を実施する  
・数量限定販売を行う  
・特典付きキャンペーンを実施する  

## 副作用
・利益率が低下する  
・ブランド価値が下がる可能性  

## 相乗効果
A10 と組み合わせ → CVR +0.001

---

---
id: A17
domain: EC
type: STRATEGY
name: メルマガ強化
category: CRM
cost: 1

kpi:
  inflow_general: 300
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.001
  aov: 100
  cpc: 0

synergy:
  - target: A20
    effect:
      aov: 200
---

## 効果
流入: +300 / CVR: +0.001 / AOV: +100

## 内容
・定期的なメールマガジン配信を行う  
・セグメント別に配信内容を最適化する  
・キャンペーン情報や新商品情報を配信する  

## 副作用
・配信頻度が高すぎると解除されやすい  
・コンテンツ作成の負荷が継続的に発生する  

## 相乗効果
A20 と組み合わせ → AOV +200

---

---
id: A18
domain: EC
type: STRATEGY
name: LINE施策
category: CRM
cost: 2

kpi:
  inflow_general: 500
  inflow_paid: 0
  exit: 0
  browse: 0.03
  cvr: 0.001
  aov: 0
  cpc: 0

synergy:
  - target: A19
    effect:
      cvr: 0.001
---

## 効果
流入: +500 / 回遊: +0.03 / CVR: +0.001

## 内容
・LINE公式アカウントで情報配信する  
・クーポンや特典を配布する  
・ステップ配信で継続的に接点を持つ  

## 副作用
・過剰配信によりブロックされる可能性  
・運用設計に手間がかかる  

## 相乗効果
A19 と組み合わせ → CVR +0.001

---

---
id: A19
domain: EC
type: STRATEGY
name: リターゲティング
category: CRM
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 400
  exit: 0
  browse: 0
  cvr: 0.0015
  aov: 0
  cpc: 0

synergy:
  - target: A14
    effect:
      cvr: 0.001
---

## 効果
流入: +400 / CVR: +0.0015

## 内容
・サイト訪問者への追跡広告を配信する  
・カゴ落ちユーザーへの再アプローチ  
・閲覧履歴に基づいた広告配信  

## 副作用
・広告の表示が多すぎると嫌悪感を持たれる  
・広告費が増加しやすい  

## 相乗効果
A14 と組み合わせ → CVR +0.001

---

---
id: A20
domain: EC
type: STRATEGY
name: 会員制度導入
category: CRM
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0.02
  cvr: 0.001
  aov: 300
  cpc: 0

synergy:
  - target: A17
    effect:
      aov: 200
---

## 効果
回遊: +0.02 / CVR: +0.001 / AOV: +300

## 内容
・ポイント制度を導入する  
・会員限定特典を提供する  
・ランク制度で優遇条件を設定する  

## 副作用
・運用や管理のコストが増加する  
・制度が複雑化すると理解されにくい  

## 相乗効果
A17 と組み合わせ → AOV +200
```

---
id: A21
domain: EC
type: STRATEGY
name: 広告精査
category: 広告最適化
cost: 1

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.0005
  aov: 0
  cpc: -5

synergy:
  - target: A22
    effect:
      cpc: -3
---

## 効果
CVR: +0.0005 / CPC: -5

## 内容
・無駄な広告キーワードを削除する  
・成果の低い広告を停止する  
・配信媒体を見直す  

## 副作用
・流入が減少する可能性  
・機会損失が発生する  

## 相乗効果
A22 と組み合わせ → CPC -3

---

---
id: A22
domain: EC
type: STRATEGY
name: ターゲティング改善
category: 広告最適化
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0.001
  aov: 0
  cpc: -3

synergy:
  - target: A13
    effect:
      cvr: 0.002
---

## 効果
CVR: +0.001 / CPC: -3

## 内容
・ユーザー属性に応じた配信設定を行う  
・ターゲットセグメントを細分化する  
・類似オーディエンスを活用する  

## 副作用
・リーチが狭くなる可能性  
・偏ったユーザーにしか届かない  

## 相乗効果
A13 と組み合わせ → CVR +0.002

---

---
id: A23
domain: EC
type: STRATEGY
name: クリエイティブ改善
category: 広告最適化
cost: 1

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0.01
  cvr: 0.001
  aov: 0
  cpc: -2

synergy:
  - target: A07
    effect:
      cvr: 0.001
---

## 効果
回遊: +0.01 / CVR: +0.001 / CPC: -2

## 内容
・広告バナーのデザインを改善する  
・訴求コピーを見直す  
・ABテストで最適な表現を見つける  

## 副作用
・効果が短期間で変動しやすい  
・制作コストが継続的に発生する  

## 相乗効果
A07 と組み合わせ → CVR +0.001

---

---
id: A24
domain: EC
type: STRATEGY
name: 入札最適化
category: 広告最適化
cost: 2

kpi:
  inflow_general: 0
  inflow_paid: 0
  exit: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: -8

synergy:
  - target: A21
    effect:
      cpc: -5
---

## 効果
CPC: -8

## 内容
・入札単価を調整する  
・自動入札を活用する  
・時間帯やデバイス別に入札調整を行う  

## 副作用
・表示回数が減少する可能性  
・細かい制御が難しくなる  

## 相乗効果
A21 と組み合わせ → CPC -5
---
