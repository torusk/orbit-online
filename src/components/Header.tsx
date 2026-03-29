import { ConnectButton } from '@mysten/dapp-kit'

export default function Header() {
  return (
    <header className="border-b border-gray-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
      <div>
        <div className="font-bold text-gray-900 text-base leading-tight">Torus Studio</div>
        <div className="text-gray-400 text-xs">Orbit mint</div>
      </div>
      <ConnectButton />
      </div>
    </header>
  )
}
