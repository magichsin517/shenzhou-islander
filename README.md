# 神州上的島民 ｜ Shenzhou Islander

> **在大陸辦事，少卡 80%**
> 給滬漂台胞的便民工具 PWA——人手一張的悠游卡。

v0.3.0 ｜ 2026-05-19 起 ｜ 永興手作

---

## 一句話

剛來大陸的台胞，前 30 天少卡關 80%——靠個性化的工具卡（居住證 / 銀行卡 / 手機卡 / 支付寶綁定 / 醫保 / 個稅 / 回台助手 / 緊急卡），不靠社群互動。社群外包給 FB「台灣人在上海」5 萬人社團。

## 檔案結構

```
神州岛民/
├── index.html              ← 主檔（PWA，單檔內嵌 CSS+JS）
├── manifest.json           ← PWA 設定
├── sw.js                   ← Service Worker（離線快取 + 自動更新）
├── favicon.ico
├── _headers                ← Cloudflare Pages 標頭（PWA + 安全）
├── _redirects              ← SPA fallback
├── icons/
│   ├── icon.svg            ← 矢量原圖
│   ├── icon-192.png        ← PWA 一般版 192
│   ├── icon-512.png        ← PWA 一般版 512
│   ├── icon-192-maskable.png  ← Android maskable 192
│   ├── icon-512-maskable.png  ← Android maskable 512
│   └── apple-touch-icon.png   ← iOS 加到主畫面 180
├── README.md
└── docs/
    ├── 神州上的島民_產品規劃_v0.1.md     ← 歷史檔（社群版，已淘汰）
    └── 神州上的島民_onboarding_demo_v0.1.html ← 歷史 demo
```

> 完整 v0.2 產品規劃在 about-me skill `references/shenzhou-islander.md`。

## 本機開發 / 預覽

純前端，沒有 build step。

```bash
cd 神州岛民
python3 -m http.server 8000
# 或 npx serve .
open http://localhost:8000
```

**注意**：直接雙擊 `index.html` 用 `file://` 開會壞——Service Worker 必須跑在 `http://` 或 `https://`。

## Cloudflare Pages 部署

### 第一次部署

1. 進 [Cloudflare Pages](https://dash.cloudflare.com)，「Create a project」→「Connect to Git」
2. 選 GitHub repo `magichsin517/shenzhou-islander`（之後永興要建）
3. Build 設定：
   - **Framework preset**: None
   - **Build command**: 空白
   - **Build output directory**: `/`（根目錄）
4. 部署完拿到 `xxx.pages.dev` 網址
5. 之後 `git push` 自動部署

### Domain（之後再買）

建議的域名候選：
- `islander.tw`（簡潔，台灣 .tw 後綴對台胞更親）
- `shenzhou.tw`
- `daoming.tw`（島民拼音）

⚠️ **不要買 .cn**（中國境內域名要備案，內容不友善）。

## 內容維護

11 張工具卡的內容直接寫在 `index.html` 的 `catalog` 物件裡。要改內容：

1. 打開 `index.html`，搜尋 `const catalog`
2. 找到要改的卡（key 如 `rent_doc` / `bank` / `alipay` ...）
3. 修步驟 `steps` / 材料 `materials` / 提醒 `tips` / Wiki seed `wiki`
4. 存檔，瀏覽器 hard refresh（Cmd+Shift+R）看效果

### 新增一張卡

```js
new_card_id: {
  emoji: '🆕',
  title: '卡片標題',
  meta: '副標 · 地點',
  est: '預計時長',
  steps: ['步驟1', '步驟2', ...],
  materials: ['需要準備的東西', ...],
  tips: ['老島民提醒', ...],
  wiki: [{ q: '初始 Wiki 內容', who: '永興', when: '本月' }],
  reminderSuggest: { label: '建議提醒', months: 36 }, // 選填
},
```

然後在 `buildToolbox()` 裡決定什麼條件下推這張卡。

### 緊急聯絡卡（特殊）

`sos` 卡的結構不一樣——用 `calls` 而非 `steps`：

```js
sos: {
  emoji: '🆘', title: '緊急聯絡卡', pinned: true,
  calls: [{ name: '報警', num: '110', emoji: '🚓' }, ...],
  ...
}
```

`pinned: true` 會永久置頂在「🆘 緊急時刻」區。

## 版本更新流程

改了 catalog 或 UI 後：

1. 改 `index.html` 裡的 `APP_VERSION = 'x.y.z'`
2. 改 `sw.js` 裡的 `VERSION = 'shenzhou-vx.y.z'`
3. 改 `manifest.json` 不需要動
4. `git commit` + `git push`
5. 用戶下次開 app 時 SW 會自動拉新版（背景更新，下次開生效）

## 個資紅線（再次提醒）

✅ 存（在 localStorage，不上傳）：onboarding 三問結果、暱稱、區、卡片進度、Wiki 補充、提醒日期
❌ 不存：台胞證號、身份證號、銀行卡號、護照影本、精確地址、真實姓名

## 北極星指標（之後接 GA / Cloudflare Analytics 再追）

- Onboarding 完成率 > 85%
- 第 7 天回訪 > 60%
- 第 30 天 checklist 完成率 > 80%
- 平均完成卡 / 用戶 > 6
- 「我提醒到了」事件 / 用戶 > 10

## Roadmap

### v0.3.x（當前）
- [x] Onboarding 三問 + 個性化推卡
- [x] 11 張工具卡完整內容
- [x] localStorage 進度持久化
- [x] 緊急卡永久置頂 + 一鍵直撥
- [x] FB 群深連結（每張卡帶搜尋字）
- [x] 提醒系統（Notification API）
- [x] PWA（可裝到主畫面、離線可用）
- [x] Wiki 補充（本機儲存）
- [x] 產品矩陣推薦（初唤 / 同游 / 樂活卡卡 / Podcast）

### v0.4（FB 試水溫後）
- [ ] 依 FB 群回饋調整 11 張卡優先序
- [ ] 新增「居住證年審」獨立卡
- [ ] 新增「車險 / 駕照」（陪伴者要求）
- [ ] 加 GA / Cloudflare Web Analytics
- [ ] 共建管理員系統（1-3 個老島民認領卡片）

### v0.5（內容到位）
- [ ] 接 Supabase（Wiki 補充上雲端、跨裝置同步）
- [ ] Magic Link 登入（不要 Google OAuth，避免大陸不通）
- [ ] 「老島民簽名」系統

### v1.0（App Store）
- [ ] Capacitor 包 iOS（弟弟 Apple Developer 帳號）
- [ ] App Store 台灣區上架
- [ ] 出 Podcast 宣傳集

### 不做的事
- ❌ 即時聊天、私訊、群組（社群完全外包 FB）
- ❌ 大陸應用商店上架（「島民」「神州」對審查不友善）
- ❌ 收集敏感個資（台胞證號、銀行卡）
- ❌ 廣告變現（Phase 1-3 全免費，靠矩陣互推）

## 聯絡

永興 ｜ FB「台灣人在上海」管理員之一 ｜ magichsin517@gmail.com
