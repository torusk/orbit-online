import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useMintNFT } from '../hooks/useMintNFT'

export default function MintForm() {
  const account = useCurrentAccount()
  const { mint, isPending, isSuccess, isError, error, reset } = useMintNFT()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const isConnected = account !== null
  const canSubmit = isConnected && !isPending && title.trim() && imageUrl.trim()

  const handleMint = () => {
    reset()
    mint(title.trim(), description.trim(), imageUrl.trim())
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
          disabled={isPending}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          placeholder="このNFTについての説明..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none disabled:opacity-50"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">画像URL</label>
        <input
          type="text"
          placeholder="ipfs://... または https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isPending}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        />
      </div>

      <button
        onClick={handleMint}
        disabled={!canSubmit}
        className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        {isPending ? '処理中...' : 'ミント'}
      </button>

      {isSuccess && (
        <p className="text-sm text-green-600 text-center">ミント成功しました</p>
      )}
      {isError && (
        <p className="text-sm text-red-500 text-center">
          {(error as Error)?.message ?? 'エラーが発生しました'}
        </p>
      )}
    </div>
  )
}
