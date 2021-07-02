import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
import secrets from '../secrets.json';

const wallet = MnemonicWallet.fromMnemonic(secrets.mnemonic);

// Log nfts img url from transactions history
wallet.getHistory().then(histories => {
    histories.forEach((history: any) => {
        for (const address in history.nfts.received) {
            for (const group in history.nfts.received[address].groups) {
                const payload = JSON.parse(history.nfts.received[address].groups[group].payload);
                console.log(payload.avalanche.img);
            }
        }
    });
})

// Not every address is fetched
console.log(wallet.getAllAddressesX());


