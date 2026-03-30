# Orbit — Sui NFT ミントアプリ

Torus Studio が制作した、Sui ブロックチェーン上で NFT をミントするための Web アプリです。
ウォレットを接続してフォームを入力するだけで、自分のウォレットに NFT が届きます。

---

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [ローカル開発の立ち上げ方](#ローカル開発の立ち上げ方)
3. [スマートコントラクト（Move）の操作](#スマートコントラクトmoveの操作)
   - [テストネットへの再デプロイ](#テストネットへの再デプロイ)
   - [メインネットへ移行する場合](#メインネットへ移行する場合)
4. [CLIで手動ミント・バーン](#cliで手動ミントバーン)
5. [ネットワーク・コントラクト情報](#ネットワークコントラクト情報)

---

## プロジェクト構成

```
orbit-online/
├── src/
│   ├── main.tsx          # エントリーポイント（Provider の設定）
│   ├── App.tsx           # 画面レイアウト
│   ├── constants.ts      # PACKAGE_ID / NETWORK の設定
│   ├── components/
│   │   ├── Header.tsx    # ロゴ + ウォレット接続ボタン
│   │   ├── MintForm.tsx  # ミントフォーム（タイトル・説明・画像URL）
│   │   └── Footer.tsx    # ネットワーク情報の表示
│   └── hooks/
│       └── useMintNFT.ts # トランザクション構築・実行
│
└── torus-studio-orbit/   # Sui Move スマートコントラクト
    ├── sources/
    │   └── studio.move   # NFT の定義・mint・burn 関数
    ├── Move.toml          # Move パッケージ設定
    ├── mint_nft.sh        # CLI ミントスクリプト
    ├── burn_nft.sh        # CLI バーンスクリプト
    └── config.local.sample  # CLI スクリプト用の設定テンプレート
```

---

## ローカル開発の立ち上げ方

### 必要なもの

- Node.js 18 以上
- npm または pnpm

### 手順

```bash
# 1. 依存パッケージのインストール
npm install
# または
pnpm install

# 2. 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` を開くと動作確認できます。

### ビルド・プレビュー

```bash
# 本番用ビルド（dist/ に出力される）
npm run build

# ビルド結果をローカルで確認
npm run preview
```

---

## スマートコントラクト（Move）の操作

コントラクトは `torus-studio-orbit/` ディレクトリで管理しています。

### 必要なもの

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) v1.62.0 以上

Sui CLI のインストール確認：
```bash
sui --version
```

### テストネットへの再デプロイ

> コントラクトを変更した場合や、新しいパッケージ ID で再デプロイしたい場合に実施します。

```bash
# 1. コントラクトのディレクトリへ移動
cd torus-studio-orbit

# 2. ビルドして問題がないか確認
sui move build

# 3. テストネットへデプロイ（ウォレットにテストネット SUI が必要）
sui client publish --gas-budget 200000000
```

デプロイが成功すると、ターミナルに `Published Objects` として新しい **Package ID** が表示されます。
その ID を `src/constants.ts` の `PACKAGE_ID` に貼り付けてください。

```typescript
// src/constants.ts
export const PACKAGE_ID = '0x新しいPackageID'
export const NETWORK = 'testnet' as const
```

### テストネット用 SUI の取得

テストネットの SUI（ガス代）が必要な場合：

```bash
sui client faucet
```

または [Sui Testnet Faucet](https://faucet.sui.io/) にアクセスし、ウォレットアドレスを入力してください。

### メインネットへ再デプロイする場合

1. Sui CLI のネットワークをメインネットに切り替える：
   ```bash
   sui client switch --env mainnet
   ```

2. メインネットへデプロイ：
   ```bash
   cd torus-studio-orbit
   sui client publish --gas-budget 200000000
   ```

3. 出力の `Published Objects` にある `PackageID` を `src/constants.ts` の `mainnet` に反映：
   ```typescript
   export const PACKAGE_IDS = {
     testnet: '0xd21845...25fa',
     mainnet: '0x新しいPackageID',
   }
   ```

---

## CLIで手動ミント・バーン

Web アプリを使わず、コマンドラインから直接 NFT を操作できます。

### 初期設定

```bash
cd torus-studio-orbit

# サンプルをコピーして設定ファイルを作成
cp config.local.sample config.local
```

`config.local` を開いて内容を書き換えます：

```bash
PACKAGE_ID="0xd21845143eb18c5a9135482f01f21470d266fcb58ac0305a95875f1d4cca25fa"

IMAGE_URL="ipfs://[PinataなどでアップロードしたCIDを入れる]"
NFT_TITLE="[NFTのタイトル]"
NFT_DESC="[NFTの説明文]"
```

### NFT のミント

```bash
# 自分のウォレットへミント
./mint_nft.sh 0x自分のアドレス

# 他の人のウォレットへ配布
./mint_nft.sh 0x相手のアドレス
```

### NFT のバーン（削除）

自分が所有している NFT を削除できます。

```bash
./burn_nft.sh 0xNFTのObjectID
```

NFT の Object ID は [Sui Explorer](https://suiexplorer.com/?network=testnet) や [SuiVision](https://suivision.xyz/) でウォレットアドレスを検索すると確認できます。

---

## ネットワーク・コントラクト情報

画面下のバッジをタップするだけで Mainnet / Testnet を切り替えられます。デフォルトは Mainnet です。

| 項目 | Mainnet | Testnet |
|------|---------|---------|
| Package ID | `0x4d6aa0...3802` | `0xd21845...25fa` |
| モジュール | `studio` | `studio` |
| NFT 構造体 | `Orbit` | `Orbit` |

**Package ID（フル）**

- Mainnet: `0x4d6aa0933cafdd406873365b83da0d4d800e80a48cd917de5661030823773802`
- Testnet: `0xd21845143eb18c5a9135482f01f21470d266fcb58ac0305a95875f1d4cca25fa`

### コントラクトの確認

- [Sui Mainnet Explorer](https://suiexplorer.com/object/0x4d6aa0933cafdd406873365b83da0d4d800e80a48cd917de5661030823773802?network=mainnet)
- [Sui Testnet Explorer](https://suiexplorer.com/object/0xd21845143eb18c5a9135482f01f21470d266fcb58ac0305a95875f1d4cca25fa?network=testnet)

---

*Created by Torus Studio.*
