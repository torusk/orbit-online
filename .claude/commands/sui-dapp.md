# Sui dApp Development Skill

You are an expert in Sui blockchain dApp development. Apply the following knowledge and patterns when working on this project.

---

## Project Context

This is **Torus Studio Orbit** — a Sui NFT minting web application.

- **Smart contract**: Already deployed to Sui mainnet
  - Package ID: `0x8971df9b4ea946c47f01baf46ed492ac02290faf8d768b5d4adecd824ed8cbbf`
  - Module: `torus::studio`
  - Key functions: `studio::mint(name, description, url, recipient)`, `studio::burn(nft)`
- **Frontend**: React + TypeScript + Vite + `@mysten/dapp-kit`
- **Deploy target**: Vercel (static hosting, no server)
- **Networks**: testnet first → mainnet

Always read `./torus-studio-orbit/sources/studio.move` and `WEB_APP_SPEC.md` before implementing frontend features.

---

## Tech Stack

### Frontend
- **Framework**: React + TypeScript (strict mode)
- **Build**: Vite
- **Wallet SDK**: `@mysten/dapp-kit` (for wallet connection + transaction signing)
- **Sui SDK**: `@mysten/sui` for building transactions
- **Styling**: Tailwind CSS (mobile-first, 375px baseline)

### Smart Contract
- **Language**: Sui Move
- **Build tool**: Sui CLI (`sui move build`, `sui client publish`)

---

## Package Setup

```bash
pnpm create vite@latest . --template react-ts
pnpm add @mysten/dapp-kit @mysten/sui @tanstack/react-query
pnpm add -D tailwindcss @tailwindcss/vite
```

---

## Provider Setup (`src/main.tsx`)

```typescript
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl('testnet'),
    variables: { packageId: '<TESTNET_PACKAGE_ID>' },
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    variables: {
      packageId: '0x8971df9b4ea946c47f01baf46ed492ac02290faf8d768b5d4adecd824ed8cbbf',
    },
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

---

## Key Hooks

| Hook | Purpose |
|------|---------|
| `useCurrentAccount()` | Get connected wallet account (null if not connected) |
| `useSignAndExecuteTransaction()` | Sign + submit transaction in one step |
| `useCurrentWallet()` | Wallet connection status |
| `useSuiClientQuery()` | Query blockchain data |

---

## NFT Minting Pattern

```typescript
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = '0x8971df9b4ea946c47f01baf46ed492ac02290faf8d768b5d4adecd824ed8cbbf';

function useMintNFT() {
  const { mutate: signAndExecute, isPending, isSuccess, isError, error } =
    useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const mint = (name: string, description: string, imageUrl: string) => {
    if (!account) return;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::studio::mint`,
      arguments: [
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(name))),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(description))),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(imageUrl))),
        tx.pure.address(account.address),
      ],
    });

    signAndExecute({ transaction: tx });
  };

  return { mint, isPending, isSuccess, isError, error };
}
```

**Important**: The `mint` function in `studio.move` takes `vector<u8>` args, so encode strings as byte arrays.

---

## Move Contract Patterns

### File section order
```move
// === Imports ===
// === Errors ===
// === Constants ===
// === Structs ===
// === Events ===
// === Functions ===
```

### Naming conventions
- Structs: `PascalCase`
- Error constants: `EPascalCase` (e.g., `ENotOwner`)
- Other constants: `UPPER_SNAKE_CASE`
- Functions: `snake_case`

### CLI commands
```bash
# Build contract
sui move build

# Test
sui move test

# Publish to testnet
sui client publish --gas-budget 100000000

# Call mint function directly
sui client call \
  --package <PACKAGE_ID> \
  --module studio \
  --function mint \
  --args <name_bytes> <desc_bytes> <url_bytes> <recipient> \
  --gas-budget 10000000
```

---

## UI Patterns (This Project)

### Design rules
- White background, minimal decoration
- Mobile-first (375px baseline)
- Japanese UI labels
- Form only — no preview, no presets

### Component structure
```
src/
├── main.tsx              # Provider setup
├── App.tsx               # Root + network config
├── constants.ts          # PACKAGE_ID, network settings
├── components/
│   ├── Header.tsx        # Logo + ConnectButton
│   ├── MintForm.tsx      # Form + mint logic
│   └── Footer.tsx        # Network + Package ID display
└── hooks/
    └── useMintNFT.ts     # Mint transaction hook
```

### Address display utility
```typescript
const shortAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;
```

---

## .gitignore additions (Sui Move)

```gitignore
# Sui Move build artifacts
torus-studio-orbit/build/
torus-studio-orbit/Move.lock

# Sensitive config
config.local
```

---

## Common Pitfalls

1. **`vector<u8>` encoding**: Always encode strings with `TextEncoder` — do NOT pass raw strings.
2. **Gas budget**: Set `tx.setGasBudget(10_000_000)` if transactions fail silently.
3. **Wallet not connected**: Always check `account !== null` before building transactions.
4. **IPFS URLs**: The contract uses `url::new_unsafe_from_bytes` — validate URL format on the frontend.
5. **Network mismatch**: Ensure wallet network matches `defaultNetwork` in provider config.

---

## Deployment (Vercel)

```bash
# Build
pnpm build

# Preview locally
pnpm preview

# Deploy via Vercel CLI
vercel --prod
```

`vite.config.ts` needs no special server config — it's purely static.
