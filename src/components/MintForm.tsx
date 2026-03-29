import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'

export default function MintForm() {
  const account = useCurrentAccount()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const isConnected = account !== null

  const handleMint = () => {
    // TODO: implement mint transaction
  }

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">タイトル</label>
        <input
          type="text"
          placeholder="NFTの名前"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          placeholder="このNFTについての説明..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">画像URL</label>
        <input
          type="text"
          placeholder="ipfs://... または https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <button
        onClick={handleMint}
        disabled={!isConnected}
        className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        ミント
      </button>
    </div>
  )
}
