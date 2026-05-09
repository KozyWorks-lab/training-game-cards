<!--
統合版：ECミッションカード M01〜M12
作成日：2026-05-09
元ファイル12個を、各項目に忠実に統合。
-->

# ECミッションカード一覧（M01〜M12）


---

# M01｜新規立ち上げ

---
id: M01
domain: EC
type: MISSION
name: 新規立ち上げ
difficulty: 中級

initial:
  general_inflow: 5600
  paid_inflow: 2400
  exit: 0.65
  browse: 1.3
  cvr: 0.005
  aov: 3500
  cpc: 60

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 0.95
  cvr: 0.95
  aov: 1
  cpc: 1

challenges:
  - Q01
  - Q04
  - Q06
  - Q08
  - Q09
  - Q12
  - Q14
  - Q15
---

## 難易度
中級

## 初期状態
広告必須の状況でスタートする。

## ミッション
売上立ち上げ・拡大

## 特徴
広告必須

## 対応する課題カード
Q01, Q04, Q06, Q08, Q09, Q12, Q14, Q15


---

# M02｜広告依存型

---
id: M02
domain: EC
type: MISSION
name: 広告依存型
difficulty: 初中級

initial:
  general_inflow: 4500
  paid_inflow: 10500
  exit: 0.6
  browse: 1.4
  cvr: 0.006
  aov: 4000
  cpc: 80

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 0.85
  aov: 1
  cpc: 1.15

challenges:
  - Q02
  - Q03
  - Q06
  - Q07
  - Q10
  - Q13
  - Q17
  - Q18
  - Q19
  - Q20
---

## 難易度
初中級

## 初期状態
CPC高止まりの状況でスタートする。

## ミッション
CPA改善

## 特徴
CPC高止まり

## 対応する課題カード
Q02, Q03, Q06, Q07, Q10, Q13, Q17, Q18, Q19, Q20


---

# M03｜コンテンツ型

---
id: M03
domain: EC
type: MISSION
name: コンテンツ型
difficulty: 初中級

initial:
  general_inflow: 7200
  paid_inflow: 1800
  exit: 0.55
  browse: 1.8
  cvr: 0.009
  aov: 3800
  cpc: 40

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1.15
  cvr: 1
  aov: 1
  cpc: 0.85

challenges:
  - Q01
  - Q02
  - Q03
  - Q04
  - Q05
  - Q06
  - Q07
  - Q08
  - Q09
  - Q12
  - Q14
  - Q15
  - Q17
  - Q18
---

## 難易度
初中級

## 初期状態
SEO重視の状況でスタートする。

## ミッション
CVR向上

## 特徴
SEO重視

## 対応する課題カード
Q01, Q02, Q03, Q04, Q05, Q06, Q07, Q08, Q09, Q12, Q14, Q15, Q17, Q18


---

# M04｜ブランド強化

---
id: M04
domain: EC
type: MISSION
name: ブランド強化
difficulty: 初級

initial:
  general_inflow: 7000
  paid_inflow: 3000
  exit: 0.5
  browse: 1.5
  cvr: 0.012
  aov: 5000
  cpc: 50

modifier:
  general_inflow: 0
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 1
  aov: 1.15
  cpc: 1

challenges:
  - Q05
  - Q10
  - Q11
  - Q13
  - Q16
  - Q19
  - Q20
---

## 難易度
初級

## 初期状態
短期弱の状況でスタートする。

## ミッション
AOV向上

## 特徴
短期弱

## 対応する課題カード
Q05, Q10, Q11, Q13, Q16, Q19, Q20


---

# M05｜価格競争型

---
id: M05
domain: EC
type: MISSION
name: 価格競争型
difficulty: 初中級

initial:
  general_inflow: 8400
  paid_inflow: 3600
  exit: 0.62
  browse: 1.4
  cvr: 0.005
  aov: 3200
  cpc: 70

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 0.85
  aov: 1
  cpc: 1.15

challenges:
  - Q05
  - Q10
  - Q11
  - Q13
  - Q16
  - Q19
  - Q20
---

## 難易度
初中級

## 初期状態
割引依存の状況でスタートする。

## ミッション
利益改善

## 特徴
割引依存

## 対応する課題カード
Q05, Q10, Q11, Q13, Q16, Q19, Q20


---

# M06｜リピーター重視

---
id: M06
domain: EC
type: MISSION
name: リピーター重視
difficulty: 中級

initial:
  general_inflow: 5950
  paid_inflow: 1050
  exit: 0.55
  browse: 1.6
  cvr: 0.009
  aov: 4500
  cpc: 30

modifier:
  general_inflow: 0
  paid_inflow: 0
  exit: 1
  browse: 1.05
  cvr: 1
  aov: 1
  cpc: 1

challenges:
  - Q01
  - Q03
  - Q04
  - Q07
  - Q08
  - Q12
  - Q13
  - Q16
  - Q17
  - Q18
---

## 難易度
中級

## 初期状態
新規弱の状況でスタートする。

## ミッション
LTV向上

## 特徴
新規弱

## 対応する課題カード
Q01, Q03, Q04, Q07, Q08, Q12, Q13, Q16, Q17, Q18


---

# M07｜改善停滞

---
id: M07
domain: EC
type: MISSION
name: 改善停滞
difficulty: 上級

initial:
  general_inflow: 7700
  paid_inflow: 3300
  exit: 0.68
  browse: 1.2
  cvr: 0.004
  aov: 4000
  cpc: 60

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1.15
  browse: 1
  cvr: 0.85
  aov: 1
  cpc: 1

challenges:
  - Q02
  - Q04
  - Q06
  - Q14
  - Q15
  - Q17
---

## 難易度
上級

## 初期状態
構造問題の状況でスタートする。

## ミッション
全体改善

## 特徴
構造問題

## 対応する課題カード
Q02, Q04, Q06, Q14, Q15, Q17


---

# M08｜急成長

---
id: M08
domain: EC
type: MISSION
name: 急成長
difficulty: 中級

initial:
  general_inflow: 9000
  paid_inflow: 9000
  exit: 0.6
  browse: 1.4
  cvr: 0.006
  aov: 3800
  cpc: 70

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 1
  aov: 1
  cpc: 0.85

challenges:
  - Q09
  - Q12
  - Q18
---

## 難易度
中級

## 初期状態
変動大の状況でスタートする。

## ミッション
利益維持

## 特徴
変動大

## 対応する課題カード
Q09, Q12, Q18


---

# M09｜高単価

---
id: M09
domain: EC
type: MISSION
name: 高単価
difficulty: 上級

initial:
  general_inflow: 4200
  paid_inflow: 1800
  exit: 0.58
  browse: 1.3
  cvr: 0.004
  aov: 8000
  cpc: 50

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 0.85
  aov: 1.15
  cpc: 1

challenges:
  - Q02
  - Q05
  - Q11
  - Q16
  - Q20
---

## 難易度
上級

## 初期状態
検討長の状況でスタートする。

## ミッション
CVR向上

## 特徴
検討長

## 対応する課題カード
Q02, Q05, Q11, Q16, Q20


---

# M10｜激戦区

---
id: M10
domain: EC
type: MISSION
name: 激戦区
difficulty: 上級

initial:
  general_inflow: 9800
  paid_inflow: 4200
  exit: 0.63
  browse: 1.4
  cvr: 0.005
  aov: 3500
  cpc: 90

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 1
  aov: 1
  cpc: 0.85

challenges:
  - Q03
  - Q07
  - Q10
  - Q11
  - Q19
---

## 難易度
上級

## 初期状態
CPC高騰の状況でスタートする。

## ミッション
差別化

## 特徴
CPC高騰

## 対応する課題カード
Q03, Q07, Q10, Q11, Q19


---

# M11｜大量販売

---
id: M11
domain: EC
type: MISSION
name: 大量販売
difficulty: 最難関

initial:
  general_inflow: 14000
  paid_inflow: 6000
  exit: 0.7
  browse: 1.2
  cvr: 0.003
  aov: 2500
  cpc: 40

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1
  browse: 1
  cvr: 1
  aov: 0.85
  cpc: 1

challenges:
  - Q02
  - Q05
  - Q10
  - Q11
  - Q13
  - Q16
  - Q19
  - Q20
---

## 難易度
最難関

## 初期状態
薄利の状況でスタートする。

## ミッション
売上拡大

## 特徴
薄利

## 対応する課題カード
Q02, Q05, Q10, Q11, Q13, Q16, Q19, Q20


---

# M12｜バランス型

---
id: M12
domain: EC
type: MISSION
name: バランス型
difficulty: 初級

initial:
  general_inflow: 8400
  paid_inflow: 3600
  exit: 0.6
  browse: 1.5
  cvr: 0.006
  aov: 4000
  cpc: 50

modifier:
  general_inflow: 1
  paid_inflow: 0
  exit: 1.05
  browse: 1.05
  cvr: 1.05
  aov: 1.05
  cpc: 1.05

challenges:
  - Q01
  - Q08
  - Q09
  - Q14
  - Q15
---

## 難易度
初級

## 初期状態
なしの状況でスタートする。

## ミッション
安定成長

## 特徴
なし

## 対応する課題カード
Q01, Q08, Q09, Q14, Q15
