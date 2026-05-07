```md
<!--
WEB ANALYTICS IMPROVEMENT GAME
スキルカード統合マスタ
-->

# スキルカード統合マスタ

---

---
id: S01
domain: EC
type: SKILL
name: 広告運用研修
category: 広告
target: strength
activation: next_turn

modifier:
  general_inflow: 0.05
  paid_inflow: 0.05
---

## 研修内容
広告運用の基本（入札、ターゲティング、広告文改善、効果検証）を学ぶ。

## 獲得スキル
・広告効果をKPIで判断できる  
・無駄なクリックを見つけて改善できる  
・広告施策の優先順位を整理できる  

## 効果
広告強み補正を強化する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S02
domain: EC
type: SKILL
name: UX改善研修
category: UX
target: strength
activation: next_turn

modifier:
  cvr: 0.05
---

## 研修内容
UX設計の基本（離脱要因、導線設計、ファーストビュー改善）を学ぶ。

## 獲得スキル
・ユーザー行動を構造的に把握できる  
・離脱要因を特定できる  
・CVR改善につながる導線を設計できる  

## 効果
UX強み補正を強化する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S03
domain: EC
type: SKILL
name: コンテンツ戦略研修
category: コンテンツ
target: strength
activation: next_turn

modifier:
  browse: 0.05
---

## 研修内容
記事、比較情報、商品説明、内部リンクを使ったコンテンツ設計を学ぶ。

## 獲得スキル
・ユーザーの検討行動を支援できる  
・回遊を促すコンテンツ構造を作れる  
・検索意図に合った情報を整理できる  

## 効果
コンテンツ強み補正を強化する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S04
domain: EC
type: SKILL
name: 商品設計研修
category: 商品
target: strength
activation: next_turn

modifier:
  aov: 0.05
---

## 研修内容
価格、セット販売、上位商品、価値訴求を使った商品設計を学ぶ。

## 獲得スキル
・商品価値を言語化できる  
・AOVを高める組み合わせを設計できる  
・価格以外の訴求を組み立てられる  

## 効果
商品強み補正を強化する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S05
domain: EC
type: SKILL
name: CRM戦略研修
category: CRM
target: strength
activation: next_turn

modifier:
  cvr: 0.03
---

## 研修内容
リピート、会員制度、メール、LINEなどの顧客関係構築を学ぶ。

## 獲得スキル
・顧客との継続接点を設計できる  
・再訪・再購入を促す施策を考えられる  
・LTV向上の視点で改善を考えられる  

## 効果
CRM強み補正をCVRと回遊に分散して強化する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S06
domain: EC
type: SKILL
name: 広告改善研修
category: 広告
target: weakness
activation: next_turn

modifier:
  cpc: -0.10
---

## 研修内容
CPC最適化、広告精査、ターゲティング改善、無駄削減を学ぶ。

## 獲得スキル
・非効率な広告配信を見抜ける  
・CPC悪化の原因を整理できる  
・広告依存を弱める改善案を考えられる  

## 効果
広告弱み補正を軽減する。

## 弱み補填
CPC弱み ×1.15 を ×1.05 へ軽減する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S07
domain: EC
type: SKILL
name: UX基礎研修
category: UX
target: weakness
activation: next_turn

modifier:
  exit: -0.05
---

## 研修内容
離脱改善、スマホUX、導線整理、ページ構造の基本を学ぶ。

## 獲得スキル
・致命的な離脱要因を見つけられる  
・最低限の導線改善を設計できる  
・使いにくさによる機会損失を減らせる  

## 効果
UX弱み補正を軽減する。

## 弱み補填
離脱弱み ×1.10 を ×1.05 へ軽減する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S08
domain: EC
type: SKILL
name: コンテンツ基礎研修
category: コンテンツ
target: weakness
activation: next_turn

modifier:
  browse: 0.05
---

## 研修内容
商品説明、比較コンテンツ、FAQ、内部リンクの基本を学ぶ。

## 獲得スキル
・不足している情報を補える  
・ユーザーの検討を支援できる  
・回遊不足を改善する導線を作れる  

## 効果
コンテンツ弱み補正を軽減する。

## 弱み補填
回遊弱み ×0.90 を ×0.95 へ軽減する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S09
domain: EC
type: SKILL
name: 商品改善研修
category: 商品
target: weakness
activation: next_turn

modifier:
  aov: 0.05
---

## 研修内容
価格設計、商品構成、セット販売、価値訴求の基本を学ぶ。

## 獲得スキル
・低単価構造の原因を整理できる  
・AOVを上げる商品設計を考えられる  
・値引き以外の価値訴求を組み立てられる  

## 効果
商品弱み補正を軽減する。

## 弱み補填
AOV弱み ×0.90 を ×0.95 へ軽減する。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。

---

---
id: S10
domain: EC
type: SKILL
name: CRM基礎研修
category: CRM
target: weakness
activation: next_turn

modifier:
  cvr: 0.03
---

## 研修内容
再訪促進、メール、LINE、会員制度、リピート施策の基本を学ぶ。

## 獲得スキル
・顧客との接点を設計できる  
・リピート低下の原因を整理できる  
・継続購入につながる施策を考えられる  

## 効果
CRM弱み補正をCVRと回遊に分散して軽減する。

## 弱み補填
CRM弱みをCVR・回遊の軽減補正として扱う。

## 発動タイミング
使用したターンは効果なし。次ターンから有効。
```
