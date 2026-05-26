# くわばらFPオフィス｜AI相談準備デモ

FP相談の申込前に、相談者の悩みを整理するためのスマホUIデモです。

## 内容

- `index.html`：画面構成
- `style.css`：デザイン
- `script.js`：画面遷移・簡易診断ロジック
- 外部ライブラリなし
- GitHub Pagesにそのまま配置可能

## 画面構成

1. トップ画面
2. 相談テーマ選択
3. 家族・家計状況入力
4. AI整理中
5. 整理結果の要約
6. 相談前チェックリスト
7. LINE相談・初回面談予約

## 使い方

1. このフォルダの `index.html` をブラウザで開く
2. スマホ表示で確認する
3. 問題なければGitHub PagesやVercelにアップロードする

## URL差し替え箇所

`script.js` の先頭にある以下を差し替えてください。

```js
const CONFIG = {
  lineUrl: "https://lin.ee/Wf1NplO",
  reserveUrl: "https://app.spirinc.com/t/i51z4D0myb7D1Fd-R63M6/as/he_EM0oRj1WhJec_xsWiC/confirm"
};
```

- `lineUrl`：LINE公式アカウントの友だち追加URL
- `reserveUrl`：Spir、Googleカレンダー予約、または予約ページURL

## 反映済みURL

- LINE公式アカウント：https://lin.ee/Wf1NplO
- 初回面談予約：https://app.spirinc.com/t/i51z4D0myb7D1Fd-R63M6/as/he_EM0oRj1WhJec_xsWiC/confirm

## 注意

このデモは「相談前整理」のためのプロトタイプです。  
特定の金融商品・保険・投資判断を推奨するものではありません。

## 推奨する次の改善

1. くわばらFPオフィスの既存LPへリンクまたは埋め込み
2. くわばらFPオフィスの既存LPへリンクまたは埋め込み
3. Googleフォーム版MVPを追加
4. フォーム送信時にGASでGmail通知・相談メモ生成
