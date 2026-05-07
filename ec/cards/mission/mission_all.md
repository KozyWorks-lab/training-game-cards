<!--
2026.5.6
WEB ANALYTICS IMPROVEMENT GAME
ミッションカード確定版
一般流入／広告流入分離・加減算補正版
-->

# ミッションカード確定版

本ファイルは、スプレッドシート更新後の確定データをもとにしたミッションカードMDです。

## 共通計算式

- 総流入 ＝ 一般流入 ＋ 広告流入
- 商品ページ到達数 ＝ 総流入 ×（1 − 離脱率）× 回遊率
- CV数 ＝ 商品ページ到達数 × CVR
- 売上 ＝ CV数 × AOV
- 広告費 ＝ 広告流入 × CPC

---

---
id: M01
name: 新規立ち上げ
display: M01｜新規立ち上げ
type: MISSION

initial:
  general_inflow: 6500
  ad_inflow: 2500
  total_inflow: 9000
  bounce: 0.58
  browse: 1.45
  cvr: 0.012
  aov: 3800
  cpc: 55

calculated:
  sales: 249934
  ad_cost: 137500

mission:
  goal: 売上立ち上げ・拡大

modifier:
  general_inflow: 975
  ad_inflow: 0
  bounce: 0
  browse: -0.0725
  cvr: -0.0006
  aov: 0
  cpc: 0
---

## M01｜新規立ち上げ

### ミッション

売上立ち上げ・拡大

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 6,500 |
| 広告流入 | 2,500 |
| 総流入 | 9,000 |
| 離脱率 | 0.58 |
| 回遊率 | 1.45 |
| CVR | 0.012 |
| AOV | 3,800円 |
| CPC | 55円 |

### 参考計算値

- 売上: 249,934円
- 広告費: 137,500円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 975 |
| 広告流入 | 0 |
| 離脱率 | 0 |
| 回遊率 | -0.0725 |
| CVR | -0.0006 |
| AOV | 0 |
| CPC | 0 |

---

---
id: M02
name: 広告依存型
display: M02｜広告依存型
type: MISSION

initial:
  general_inflow: 5500
  ad_inflow: 3500
  total_inflow: 9000
  bounce: 0.6
  browse: 1.4
  cvr: 0.011
  aov: 4200
  cpc: 55

calculated:
  sales: 232848
  ad_cost: 192500

mission:
  goal: CPA改善・効率化

modifier:
  general_inflow: 0
  ad_inflow: 525
  bounce: 0
  browse: 0
  cvr: -0.00165
  aov: 0
  cpc: 8.25
---

## M02｜広告依存型

### ミッション

CPA改善・効率化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 5,500 |
| 広告流入 | 3,500 |
| 総流入 | 9,000 |
| 離脱率 | 0.6 |
| 回遊率 | 1.4 |
| CVR | 0.011 |
| AOV | 4,200円 |
| CPC | 55円 |

### 参考計算値

- 売上: 232,848円
- 広告費: 192,500円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 0 |
| 広告流入 | 525 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | -0.00165 |
| AOV | 0 |
| CPC | 8.25 |

---

---
id: M03
name: コンテンツ型
display: M03｜コンテンツ型
type: MISSION

initial:
  general_inflow: 8500
  ad_inflow: 1500
  total_inflow: 10000
  bounce: 0.54
  browse: 1.75
  cvr: 0.012
  aov: 4000
  cpc: 40

calculated:
  sales: 386400
  ad_cost: 60000

mission:
  goal: CVR向上・最適化

modifier:
  general_inflow: 1275
  ad_inflow: -225
  bounce: 0
  browse: 0.2625
  cvr: 0
  aov: 0
  cpc: -6
---

## M03｜コンテンツ型

### ミッション

CVR向上・最適化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 8,500 |
| 広告流入 | 1,500 |
| 総流入 | 10,000 |
| 離脱率 | 0.54 |
| 回遊率 | 1.75 |
| CVR | 0.012 |
| AOV | 4,000円 |
| CPC | 40円 |

### 参考計算値

- 売上: 386,400円
- 広告費: 60,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 1275 |
| 広告流入 | -225 |
| 離脱率 | 0 |
| 回遊率 | 0.2625 |
| CVR | 0 |
| AOV | 0 |
| CPC | -6 |

---

---
id: M04
name: ブランド強化
display: M04｜ブランド強化
type: MISSION

initial:
  general_inflow: 7500
  ad_inflow: 2500
  total_inflow: 10000
  bounce: 0.52
  browse: 1.6
  cvr: 0.012
  aov: 5200
  cpc: 45

calculated:
  sales: 479232
  ad_cost: 112500

mission:
  goal: AOV向上・価値強化

modifier:
  general_inflow: -375
  ad_inflow: 0
  bounce: 0
  browse: 0
  cvr: 0
  aov: 780
  cpc: 0
---

## M04｜ブランド強化

### ミッション

AOV向上・価値強化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 7,500 |
| 広告流入 | 2,500 |
| 総流入 | 10,000 |
| 離脱率 | 0.52 |
| 回遊率 | 1.6 |
| CVR | 0.012 |
| AOV | 5,200円 |
| CPC | 45円 |

### 参考計算値

- 売上: 479,232円
- 広告費: 112,500円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | -375 |
| 広告流入 | 0 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | 0 |
| AOV | 780 |
| CPC | 0 |

---

---
id: M05
name: 価格競争型
display: M05｜価格競争型
type: MISSION

initial:
  general_inflow: 6500
  ad_inflow: 3000
  total_inflow: 9500
  bounce: 0.61
  browse: 1.45
  cvr: 0.01
  aov: 3400
  cpc: 60

calculated:
  sales: 182656
  ad_cost: 180000

mission:
  goal: 利益改善・最適化

modifier:
  general_inflow: 0
  ad_inflow: 300
  bounce: 0
  browse: 0
  cvr: -0.0015
  aov: 0
  cpc: 9
---

## M05｜価格競争型

### ミッション

利益改善・最適化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 6,500 |
| 広告流入 | 3,000 |
| 総流入 | 9,500 |
| 離脱率 | 0.61 |
| 回遊率 | 1.45 |
| CVR | 0.01 |
| AOV | 3,400円 |
| CPC | 60円 |

### 参考計算値

- 売上: 182,656円
- 広告費: 180,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 0 |
| 広告流入 | 300 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | -0.0015 |
| AOV | 0 |
| CPC | 9 |

---

---
id: M06
name: リピーター重視
display: M06｜リピーター重視
type: MISSION

initial:
  general_inflow: 7000
  ad_inflow: 1000
  total_inflow: 8000
  bounce: 0.53
  browse: 1.7
  cvr: 0.013
  aov: 4800
  cpc: 35

calculated:
  sales: 398861
  ad_cost: 35000

mission:
  goal: LTV向上・関係強化

modifier:
  general_inflow: 350
  ad_inflow: -150
  bounce: 0
  browse: 0.085
  cvr: 0
  aov: 0
  cpc: 0
---

## M06｜リピーター重視

### ミッション

LTV向上・関係強化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 7,000 |
| 広告流入 | 1,000 |
| 総流入 | 8,000 |
| 離脱率 | 0.53 |
| 回遊率 | 1.7 |
| CVR | 0.013 |
| AOV | 4,800円 |
| CPC | 35円 |

### 参考計算値

- 売上: 398,861円
- 広告費: 35,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 350 |
| 広告流入 | -150 |
| 離脱率 | 0 |
| 回遊率 | 0.085 |
| CVR | 0 |
| AOV | 0 |
| CPC | 0 |

---

---
id: M07
name: 改善停滞
display: M07｜改善停滞
type: MISSION

initial:
  general_inflow: 7000
  ad_inflow: 2500
  total_inflow: 9500
  bounce: 0.64
  browse: 1.35
  cvr: 0.009
  aov: 4200
  cpc: 55

calculated:
  sales: 174523
  ad_cost: 137500

mission:
  goal: 構造改善・全体最適化

modifier:
  general_inflow: 0
  ad_inflow: 0
  bounce: 0.096
  browse: 0
  cvr: -0.00135
  aov: 0
  cpc: 0
---

## M07｜改善停滞

### ミッション

構造改善・全体最適化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 7,000 |
| 広告流入 | 2,500 |
| 総流入 | 9,500 |
| 離脱率 | 0.64 |
| 回遊率 | 1.35 |
| CVR | 0.009 |
| AOV | 4,200円 |
| CPC | 55円 |

### 参考計算値

- 売上: 174,523円
- 広告費: 137,500円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 0 |
| 広告流入 | 0 |
| 離脱率 | 0.096 |
| 回遊率 | 0 |
| CVR | -0.00135 |
| AOV | 0 |
| CPC | 0 |

---

---
id: M08
name: 急成長
display: M08｜急成長
type: MISSION

initial:
  general_inflow: 8500
  ad_inflow: 3500
  total_inflow: 12000
  bounce: 0.58
  browse: 1.45
  cvr: 0.011
  aov: 3900
  cpc: 60

calculated:
  sales: 313513
  ad_cost: 210000

mission:
  goal: 利益維持・成長制御

modifier:
  general_inflow: 850
  ad_inflow: 350
  bounce: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: -6
---

## M08｜急成長

### ミッション

利益維持・成長制御

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 8,500 |
| 広告流入 | 3,500 |
| 総流入 | 12,000 |
| 離脱率 | 0.58 |
| 回遊率 | 1.45 |
| CVR | 0.011 |
| AOV | 3,900円 |
| CPC | 60円 |

### 参考計算値

- 売上: 313,513円
- 広告費: 210,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 850 |
| 広告流入 | 350 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | 0 |
| AOV | 0 |
| CPC | -6 |

---

---
id: M09
name: 高単価
display: M09｜高単価
type: MISSION

initial:
  general_inflow: 5500
  ad_inflow: 1000
  total_inflow: 6500
  bounce: 0.56
  browse: 1.45
  cvr: 0.01
  aov: 7800
  cpc: 45

calculated:
  sales: 323466
  ad_cost: 45000

mission:
  goal: CVR改善・検討短縮

modifier:
  general_inflow: 0
  ad_inflow: -100
  bounce: 0
  browse: 0
  cvr: -0.0015
  aov: 1170
  cpc: 0
---

## M09｜高単価

### ミッション

CVR改善・検討短縮

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 5,500 |
| 広告流入 | 1,000 |
| 総流入 | 6,500 |
| 離脱率 | 0.56 |
| 回遊率 | 1.45 |
| CVR | 0.01 |
| AOV | 7,800円 |
| CPC | 45円 |

### 参考計算値

- 売上: 323,466円
- 広告費: 45,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 0 |
| 広告流入 | -100 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | -0.0015 |
| AOV | 1170 |
| CPC | 0 |

---

---
id: M10
name: 激戦区
display: M10｜激戦区
type: MISSION

initial:
  general_inflow: 6500
  ad_inflow: 3500
  total_inflow: 10000
  bounce: 0.62
  browse: 1.4
  cvr: 0.01
  aov: 3600
  cpc: 65

calculated:
  sales: 191520
  ad_cost: 227500

mission:
  goal: 差別化強化・競争優位

modifier:
  general_inflow: 0
  ad_inflow: 350
  bounce: 0
  browse: 0
  cvr: 0
  aov: 0
  cpc: -9.75
---

## M10｜激戦区

### ミッション

差別化強化・競争優位

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 6,500 |
| 広告流入 | 3,500 |
| 総流入 | 10,000 |
| 離脱率 | 0.62 |
| 回遊率 | 1.4 |
| CVR | 0.01 |
| AOV | 3,600円 |
| CPC | 65円 |

### 参考計算値

- 売上: 191,520円
- 広告費: 227,500円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 0 |
| 広告流入 | 350 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | 0 |
| AOV | 0 |
| CPC | -9.75 |

---

---
id: M11
name: 大量販売
display: M11｜大量販売
type: MISSION

initial:
  general_inflow: 10000
  ad_inflow: 4000
  total_inflow: 14000
  bounce: 0.63
  browse: 1.35
  cvr: 0.009
  aov: 3000
  cpc: 45

calculated:
  sales: 188811
  ad_cost: 180000

mission:
  goal: 売上拡大・効率改善

modifier:
  general_inflow: 1500
  ad_inflow: 200
  bounce: 0
  browse: 0
  cvr: 0
  aov: -450
  cpc: 0
---

## M11｜大量販売

### ミッション

売上拡大・効率改善

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 10,000 |
| 広告流入 | 4,000 |
| 総流入 | 14,000 |
| 離脱率 | 0.63 |
| 回遊率 | 1.35 |
| CVR | 0.009 |
| AOV | 3,000円 |
| CPC | 45円 |

### 参考計算値

- 売上: 188,811円
- 広告費: 180,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 1500 |
| 広告流入 | 200 |
| 離脱率 | 0 |
| 回遊率 | 0 |
| CVR | 0 |
| AOV | -450 |
| CPC | 0 |

---

---
id: M12
name: バランス型
display: M12｜バランス型
type: MISSION

initial:
  general_inflow: 8000
  ad_inflow: 2500
  total_inflow: 10500
  bounce: 0.57
  browse: 1.55
  cvr: 0.011
  aov: 4200
  cpc: 50

calculated:
  sales: 323319
  ad_cost: 125000

mission:
  goal: 安定成長・バランス最適化

modifier:
  general_inflow: 400
  ad_inflow: 125
  bounce: 0.0285
  browse: 0.0775
  cvr: 0.00055
  aov: 210
  cpc: 2.5
---

## M12｜バランス型

### ミッション

安定成長・バランス最適化

### 初期状態

| 指標 | 数値 |
|---|---:|
| 一般流入 | 8,000 |
| 広告流入 | 2,500 |
| 総流入 | 10,500 |
| 離脱率 | 0.57 |
| 回遊率 | 1.55 |
| CVR | 0.011 |
| AOV | 4,200円 |
| CPC | 50円 |

### 参考計算値

- 売上: 323,319円
- 広告費: 125,000円

### ミッション補正（加減算）

| KPI | 補正値 |
|---|---:|
| 一般流入 | 400 |
| 広告流入 | 125 |
| 離脱率 | 0.0285 |
| 回遊率 | 0.0775 |
| CVR | 0.00055 |
| AOV | 210 |
| CPC | 2.5 |

---
