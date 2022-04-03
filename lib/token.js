import * as spl from "@solana/spl-token"
import {createMetadata} from './metaplex.js'

export const createMintAccount = async (
  connection,
  feePayer,
  mintAuthority,
  decimals=9,
  freezeAuthority=null,
) => await spl.createMint(
  connection,
  feePayer,
  mintAuthority,
  freezeAuthority,
  decimals,
)

export const createMintAccountWithMetadata = async (
  connection,
  feePayer,
  mintAuthority,
  uri,
  name,
  symbol,
  decimals=9,
  freezeAuthority=null,
) => {
  const mint = await createMintAccount(
    connection,
    feePayer,
    mintAuthority.publicKey,
    decimals,
    freezeAuthority
  )

  const metadata = await createMetadata(
    connection,
    feePayer,
    mintAuthority,
    mint,
    uri,
    name,
    symbol
  )

  return [mint, metadata]
}

export const createAssociatedTokenAccount = async (
  connection,
  feePayer,
  mint,
  owner,
  allowOwnerOffCurve
) => await spl.getOrCreateAssociatedTokenAccount(
  connection,
  feePayer,
  mint,
  owner,
  allowOwnerOffCurve
)

export const setAuthority = async (
  connection,
  feePayer,
  mint,
  mintAuthority,
  newMintAuthority
) => await spl.setAuthority(
  connection,
  feePayer,
  mint,
  mintAuthority,
  spl.AuthorityType.MintTokens,
  newMintAuthority
)

export const mintTo = async (
  connection,
  feePayer,
  mint,
  dest,
  authority,
  amount,
  multiSigners=[]
) => {
  return await spl.mintTo(
    connection,
    feePayer,
    mint,
    dest,
    authority,
    amount,
    multiSigners,
  )
}

export const transfer = async (
  connection,
  feePayer,
  sourceTokenAccount,
  dest,
  sourceTokenAccountOwner,
  amount,
  multiSigners=[]
) => await spl.transfer(
  connection,
  feePayer,
  sourceTokenAccount,
  dest,
  sourceTokenAccountOwner,
  amount,
  multiSigners,
)

export const approve = async (
  connection,
  feePayer,
  sourceTokenAccount,
  delegate,
  sourceTokenAccountOwner,
  amount,
  multiSigners=[]
) => await spl.approve(
  connection,
  feePayer,
  sourceTokenAccount,
  delegate,
  sourceTokenAccountOwner,
  amount,
  multiSigners,
)

export const createNft = async (
  connection,
  feePayer,
  authority,
  disableMinting=true
) => {
  // 1. create a new Mint account with 0 decimals
  const token = await createMintAccount(
    connection,
    feePayer,
    authority.publicKey,
    0
  )

  // 2. create a new associated token account
  const tokenAccount = await createAssociatedTokenAccount(
    connection,
    feePayer,
    token,
    authority.publicKey,
  )

  // 3. mint 1 token into the recipient associated token account
  await mintTo(
    connection,
    feePayer,
    token,
    tokenAccount.address,
    authority,
    1,
  )

  if(disableMinting) {
    // 4. disable future minting by setting the mint authority to none
    await setAuthority(
      connection,
      feePayer,
      token,
      authority,
      spl.AuthorityType.MintTokens,
      null
    )
  }

  return token
}

export const createNftWithMetadata = async (
  connection,
  feePayer,
  mintAuthority,
  uri,
  name,
  symbol
) => {
  const mint = await createNft(
    connection,
    feePayer,
    mintAuthority,
    false
  )

  const metadata = await createMetadata(
    connection,
    feePayer,
    mintAuthority,
    mint,
    uri,
    name,
    symbol
  )

  return [mint, metadata]
}

export const getAccountInfo = async (token, account) => await token.getAccountInfo(account)

export const getAssociatedTokenAddress = async (token, owner, allowOwnerOffCurve) => spl.getAssociatedTokenAddress(token, owner, allowOwnerOffCurve)

export const getTokenProgramId = () => TOKEN_PROGRAM_ID
