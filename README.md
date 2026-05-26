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
  lineUrl: "https://lin.ee/REPLACE_ME",
  reserveUrl: "https://example.com/reservation"
};
```

- `lineUrl`：LINE公式アカウントの友だち追加URL
- `reserveUrl`：Spir、Googleカレンダー予約、または予約ページURL

## 注意

このデモは「相談前整理」のためのプロトタイプです。  
特定の金融商品・保険・投資判断を推奨するものではありません。

## 推奨する次の改善

1. LINE公式URLを本番URLに差し替える
2. 予約URLを本番URLに差し替える
3. くわばらFPオフィスの既存LPへリンクまたは埋め込み
4. Googleフォーム版MVPを追加
5. フォーム送信時にGASでGmail通知・相談メモ生成


## 更新履歴

### v2-scroll-fix
- スマホモック内の画面を縦スクロール可能に修正
- 下部ナビゲーションに入力フォームやボタンが隠れないよう余白を追加
- LINE公式URLとSpir予約URLを本番リンクに設定
