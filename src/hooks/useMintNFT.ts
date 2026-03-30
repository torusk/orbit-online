import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID } from '../constants'

export function useMintNFT() {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending, isSuccess, isError, error, reset } =
    useSignAndExecuteTransaction()

  const mint = (name: string, description: string, imageUrl: string) => {
    if (!account) return

    const tx = new Transaction()
    tx.moveCall({
      target: `${PACKAGE_ID}::studio::mint`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(imageUrl),
        tx.pure.address(account.address),
      ],
    })

    signAndExecute({ transaction: tx })
  }

  return { mint, isPending, isSuccess, isError, error, reset }
}
