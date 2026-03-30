import { useSuiClientContext } from '@mysten/dapp-kit'
import { PACKAGE_IDS, Network } from '../constants'

const shortId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`

export default function Footer() {
  const { network, selectNetwork } = useSuiClientContext()
  const packageId = PACKAGE_IDS[network as Network]
  const isMainnet = network === 'mainnet'

  return (
    <footer className="border-t border-gray-200 px-4 py-3">
      <div className="max-w-sm mx-auto flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Package {shortId(packageId)}
        </p>
        <button
          onClick={() => selectNetwork(isMainnet ? 'testnet' : 'mainnet')}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
            isMainnet
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          {isMainnet ? 'Mainnet' : 'Testnet'}
        </button>
      </div>
    </footer>
  )
}
