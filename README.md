# Avax wallet viewer for NFT

Shows your NFT on a screen.

Intended to use with a Raspberry with touch-screen.

Not finished. 20% completed.

## wallet.ts
Use avalanche-wallet-sdk to fetch all transactions of wallet, but it doesn't work, package is in beta, not every addresses of wallet are returned.

## explorer.ts
Use avalanche explorer api. Fetch all transactions of addresses in secrets.json, and payload of each transaction with img url. Works but you have to manually input all adresses of wallet.

Writes already scanned addresses with their img url to data.json to prevent getting banned temporarly from the api from too many calls (since address changes after every transaction or so, it shouldn't miss any transaction).