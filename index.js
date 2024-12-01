import elliptic from 'elliptic';
import Transaction from './libs/Transaction.js';
import Blockchain from './libs/Blockchain.js';
import express from 'express';

const { ec: EC } = elliptic;
const ec = new EC('secp256k1');

const app = express();

// Create new instance of Blockchain class
const aleaCoin = new Blockchain();

// Middleware untuk parsing JSON
app.use(express.json());

app.get('/api/blockchain', (req, res) => {
    res.json(aleaCoin);
});
app.get('/api/blocks', (req, res) => {
    res.json(aleaCoin.chain);
});
app.get('/api/validate', (req, res) => {
    res.json({
        "isValid" : aleaCoin.isChainValid()
    });
});
app.get('/api/pending_transactions', (req, res) => {
    res.json(aleaCoin.pendingTransactions);
});
app.post('/api/balance', (req, res) => {
    const { address } = req.body;
    res.json({
        "balance" : aleaCoin.getBalanceOfAddress(address)
    });
});
app.post('/api/wallet_transactions', (req, res) => {
    const { address } = req.body;
    res.json(aleaCoin.getAllTransactionsForWallet(address));
});
app.post('/api/mining', (req, res) => {
    const { address } = req.body;
    aleaCoin.minePendingTransactions(address);
    res.json({
        "minedBlock": aleaCoin.getLatestBlock(),
        "balance" : aleaCoin.getBalanceOfAddress(address)
    });
});
app.post('/api/inquiry_transaction', (req, res) => {
    const { fromAddress, toAddress, amount } = req.body;
    
    const trx = new Transaction(fromAddress, toAddress, amount);
    const trxHash = trx.calculateHash();
    const trxId = trx.getTrxId();

    res.json({
        "trxHash": trxHash,
        "trxId" : trxId
    });
});
app.post('/api/request_transaction', (req, res) => {
    const { fromAddress, toAddress, amount, trxId, signature } = req.body;
    
    const trx = new Transaction(fromAddress, toAddress, amount);
    trx.setSignature(signature);
    trx.setTrxId(trxId);

    console.log(trx);

    if(trx.isValid()){
        aleaCoin.addTransaction(trx);
        res.json({
            "status": trx.isValid(),
            "message" : "Transaction is pending. Waiting for verification"
        });
    }else{
        res.json({
            "status": trx.isValid(),
            "message" : "Invalid signature"
        });
    }
});

// Menjalankan server
const port = 3100;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const { ec: EC } = elliptic;
// const ec = new EC('secp256k1');

// Your private key goes here
// const myKey = ec.keyFromPrivate(
//   '55f2042061530e975917c32c6ef97cf2c968867d322692950c7828d05d47302f'
// );

// From that we can calculate your public key (which doubles as your wallet address)
// const myWalletAddress = myKey.getPublic('hex');
// const myWalletAddress = '0437577c47f5864cc69b68ac8bf81a65675c204b35c706b193ac92575a2c81107a7334670565a517a5932c1e4fc83b4215888f98b3f26e90452cac2ff57b26255a';

// Create new instance of Blockchain class
// const savjeeCoin = new Blockchain();

// Mine first block
// savjeeCoin.minePendingTransactions(myWalletAddress);

// Create a transaction & sign it with your key
// const tx1 = new Transaction(myWalletAddress, '040dc67fdf5e19a52f67b0eaecc291b88d4ea08472635a35b5945dcb6014648abb1f90d238b44e2bbf78c4d3c63f53248ac230c40e855e3f8d34aaa195cda88cc0', 100);

// Menghitung hash transaksi
// const tx1Hash = tx1.calculateHash();
// const trxId = tx1.getTrxId();

// console.log("trxHash",tx1Hash);
// console.log("trxId",trxId);

// const signature = myKey.sign(tx1Hash, 'base64').toDER('hex');
// tx1.setSignature(signature);

// tx1.setSignature("3044022078e3c1e0e4d547287052bbad4db038e4b13755e3cf054e9b6a30f3ec659a8fbe02203e7f546e528c33946c1431128fa72f71a296efb127099ebff816e7093831fd24");
// tx1.setTrxId("1733014342467");
// console.log(tx1.isValid());

// aleaCoin.addTransaction(tx1);

// // Mine block
// savjeeCoin.minePendingTransactions(myWalletAddress);

// // Create second transaction
// const tx2 = new Transaction(myWalletAddress, 'address1', 50);
// tx2.signTransaction(myKey);
// savjeeCoin.addTransaction(tx2);

// // Mine block
// savjeeCoin.minePendingTransactions(myWalletAddress);

// console.log();
// console.log(
//   `Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`
// );

// console.log(JSON.stringify(aleaCoin, 0, 4));

// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
// console.log('\n');
// console.log('Blockchain valid?', savjeeCoin.isChainValid() ? 'Yes' : 'No');