// There is no documentation for the metaplex package.
// Examples taken from https://github.com/metaplex-foundation/metaplex-program-library/blob/master/token-metadata/js/test/create-metadata-account.test.ts
import {
  DataV2,
  CreateMetadataV2,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  PayerTransactionHandler,
} from '@metaplex-foundation/amman'

export const createMetadata = async (
  connection,
  feePayer,
  mintAuthority,
  mint,
  uri,
  name,
  symbol,
) => {
  const transactionHandler = new PayerTransactionHandler(connection, feePayer)
  const metadata = await Metadata.getPDA(mint)
  const metadataData = new DataV2({
    uri,
    name,
    symbol,
    sellerFeeBasisPoints: null,
    creators: null,
    collection: null,
    uses: null,
  })
  const createMetadataTx = new CreateMetadataV2(
    {feePayer: feePayer.publicKey},
    {
      metadata,
      metadataData,
      updateAuthority: mintAuthority.publicKey,
      mint,
      mintAuthority: mintAuthority.publicKey
    },
  )

  await transactionHandler.sendAndConfirmTransaction(createMetadataTx, [], {
    skipPreflight: false,
  })

  return metadata
}
