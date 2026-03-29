import { PACKAGE_ID, NETWORK } from '../constants'

const shortId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-4 py-3 text-center">
      <p className="text-xs text-gray-400">
        Sui {NETWORK} / Package {shortId(PACKAGE_ID)}
      </p>
    </footer>
  )
}
