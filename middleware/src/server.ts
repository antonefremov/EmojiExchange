import express = require('express');
import * as keys from './keys';

const Web3 = require('web3');
const contractABI = require('./MyEmojiExchange.json').abiDefinition;

const app: express.Application = express();

// local connection config (Embark simulator)
const masterAccount: string = "0xb92ae0cb7c6598aeaf5ab7952601b28eb0ab8791";
const deploymentAddress: string = "0xe37013c993935b2FecA4c5f3e313ccf2FC3B175b";
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8556"));
const contractInstance = new web3.eth.Contract(contractABI, deploymentAddress);

// remote connection config (Quorum)
// const web3 = new Web3(new Web3.providers.HttpProvider(keys.serviceKey.rpc));
// const masterAccount: string = keys.serviceKey.address;
// const contractInstance = new web3.eth.Contract(contractABI, keys.deployedContractAddress);

app.post('/create', async function (req: any, res: any) {
  let newAccount = await web3.eth.accounts.create();
  console.log("New account is " + JSON.stringify(newAccount));

  web3.eth.personal.unlockAccount(masterAccount, keys.deployedPass, 1000000, async function (error: any, result: any) {
    if (error) {
      console.error(error);
      res.send(error);
    }
    let depositResult = await contractInstance.methods.initialDeposit(newAccount.address, 10000).send({
      from: masterAccount, gas: 5000000
    });
  
    res.send(depositResult.events.Transfer.returnValues.to);
  });
});

app.get('/balance', async function (req: any, res: any) {
  const accountId: string = req.get("accountId");
  let balance = 0;
  try {
    balance = await contractInstance.methods.balanceOf(accountId).call(); // {from: masterAccount}
    res.send(balance);

  } catch(e) {
    console.log(e);
    res.statusCode = 502;
    res.send(e);
  }
});

app.get('/fullBalance', async function (req: any, res: any) {
  const accountId: string = req.get("accountId");
  let balance: Object;
  try {
    balance = await contractInstance.methods.fullEmojiBalanceOf(accountId).call({from: masterAccount});
    res.send(balance);
  } catch(e) {
    console.log(e);
    res.statusCode = 502;
    res.send(e);
  }
});

app.post('/buy', async function (req: any, res: any) {
  const accountId: string = req.get("accountId");
  const emojiIndex: Number = +req.get("emojiIndex");

  try {
    await contractInstance.methods.buyEmoji(accountId, emojiIndex).send({
      from: masterAccount, gas: 5000000
    });
    let balance = await contractInstance.methods.balanceOf(accountId).call();
    res.send(balance);
  } catch(e) {
    console.log(e);
    res.statusCode = 502;
    res.send(e);
  }
});

app.post('/sell', async function (req: any, res: any) {
  const accountId: string = req.get("accountId");
  const emojiIndex: Number = +req.get("emojiIndex");

  try {
    await contractInstance.methods.sellEmoji(accountId, emojiIndex).send({
      from: masterAccount, gas: 5000000
    });
    let balance = await contractInstance.methods.balanceOf(accountId).call();
    res.send(balance);
  } catch(e) {
    console.log(e);
    res.statusCode = 502;
    res.send(e);
  }
});

app.get('/accounts', async function (req: any, res: any) {
  let accounts = await web3.eth.getAccounts();
  res.send(accounts);
});

app.listen(8082, async function () {
  console.log('The middleware app has started on port 8082');
});
