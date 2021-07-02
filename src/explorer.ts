import { Buffer } from 'avalanche/dist';
import { PayloadBase, PayloadTypes } from 'avalanche/dist/utils';
import axios from 'axios';
import * as fs from 'fs';
import secrets from '../secrets.json';

const payloadtypes = PayloadTypes.getInstance();

async function main() {
    // Read data from src/data.json else create new data.json
    let data: { addresses: string[], imgs: string[] };
    try {
        const dataBuffer = fs.readFileSync("src/data.json");
        const dataString = dataBuffer.toString();
        if (dataString.length === 0) {
            throw { error: "Empty file src/data.json" };
        }
        data = JSON.parse(dataString);
    } catch (err) {
        data = { addresses: [], imgs: [] };
    }
    const imgs = data.imgs;
    // All addresses in wallet
    const addresses = [...secrets.addresses];
    // Remove already scanned addresses to prevent api quota ban
    data.addresses.forEach(address => {
        const index = addresses.indexOf(address);
        if (index !== -1) {
            addresses.splice(index, 1);
        }
    })
    // Fetch all transactions img url from these addresses
    for (const address of addresses) {
        const transacImgs = await getTransactionsImgs(address);
        transacImgs.forEach(img => imgs.push(img));
    }
    fs.writeFileSync("src/data.json", JSON.stringify({ addresses: secrets.addresses, imgs: imgs }))
    console.log(imgs);
}

main().then(() => console.log("Done"));

async function getTransactionsImgs(address: string): Promise<string[]> {
    const imgs = [];
    const response = await axios.get(`https://explorerapi.avax.network/v2/transactions?address=${address}`);
    const transactionsIds: string[] = response.data.transactions.map((t: any) => t.id);
    for (const transactionId of transactionsIds) {
        const responseTransaction = await axios.get(`https://explorerapi.avax.network/v2/transactions/${transactionId}`);
        const rawPayload = responseTransaction.data.outputs[1].payload;
        let payload = Buffer.from(rawPayload, 'base64')
        payload = Buffer.concat([new Buffer(4).fill(payload.length), payload])
        const pl = payloadtypes.getContent(payload);
        const payloadbase: PayloadBase = payloadtypes.select(24, pl);
        const content = payloadbase.getContent().toString();
        if (content != "") {
            const img = JSON.parse(content).avalanche.img;
            imgs.push(img);
        }
    }
    return imgs;
}