import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClientContext } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_IDS, Network } from '../constants'

export function useMintNFT() {
  const account = useCurrentAccount()
  const { network } = useSuiClientContext()
  const { mutate: signAndExecute, isPending, isSuccess, isError, error, reset } =
    useSignAndExecuteTransaction()

  const mint = (name: string, description: string, imageUrl: string) => {
    if (!account) return

    const packageId = PACKAGE_IDS[network as Network]
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::studio::mint`,
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
