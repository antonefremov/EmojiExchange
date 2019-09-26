// /*global contract, config, it, assert*/

const MyFioriToken = require('Embark/contracts/MyEmojiExchange');
const { toWei, fromWei } = web3.utils;

contract("MyEmojiExchange", function (accounts) {
  const _name = "Emoji Token";
  const _symbol = "FIO";
  const _decimals = 3;
  const TOTAL_SUPPLY = 100000000;
  let fcInstance;

  beforeEach(async function () {
    fcInstance = await MyFioriToken.deploy({ arguments: [_name, _symbol, _decimals] }).send();
  });

  it("Should create a contract with initial supply", async function () {
    let result = await fcInstance.methods.totalSupply().call();
    assert.equal(fromWei(result, 'wei'), TOTAL_SUPPLY);
  });

  it("Should create a contract with initial supply assigned to zero account", async function () {
    const account0 = accounts[0];
    let result = await fcInstance.methods.balanceOf(account0).call();
    assert.equal(fromWei(result, 'wei'), TOTAL_SUPPLY);
  });

  it("Should create a contract with zero balance for an account", async function () {
    const account1 = accounts[1];
    let result = await fcInstance.methods.balanceOf(account1).call();
    assert.equal(fromWei(result, 'wei'), 0);
  });

  it("Should transfer tokens to an account", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });
    const result = await fcInstance.methods.balanceOf(account1).call();
    const balance = parseFloat(fromWei(result, 'wei'));
    assert.equal(balance, 10000);
  });

  it("Should not allow minting tokens for same account twice", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });
    const result = await fcInstance.methods.balanceOf(account1).call();
    const balance = parseFloat(fromWei(result, 'wei'));
    assert.equal(balance, 10000);
  });

  // do not remove
  // it("Should create a contract with zero emoji balance for an account", async function () {
  //   const account0 = accounts[0];
  //   const account1 = accounts[1];
  //   let res = await fcInstance.methods.emojiBalanceOf(account0, 0).send({ from: account0 });
  //   console.log("Res = " + JSON.stringify(res));
  //   assert.equal(undefined);
  // });

  it("Should allow buying an emoji", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });

    // let emojiPrice = await fcInstance.methods.getEmojiPrice(1).call();

    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 }); //.send({ from: account0 });
    let balance = await fcInstance.methods.emojiBalanceOf(account1, 1).call();
    // const fullPrice = tx.events.BuyEmoji.returnValues.fullPrice;
    assert.equal(balance, 1);

    // console.log(JSON.stringify(tx));
    // console.log("fullPrice = " + fullPrice);
    // console.log("emojiBalanceOf = " + JSON.stringify(balance));
    //const resultBalance = await fcInstance.methods.balanceOf(account1).call();
    // const resultBalance = await fcInstance.methods.balanceOf(account1).call();
    // const accountBalance = parseFloat(fromWei(resultBalance, 'wei'));
    // console.log("resultBalance = " + accountBalance);
    // console.log(toWei('10', 'wei'));

    // emojiPrice = await fcInstance.methods.getEmojiPrice(1).call();
    // console.log("emojiPrice2 = " + emojiPrice);

  });

  it("Should keep the account balance correct after buying an emoji", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });

    let emojiPrice1 = await fcInstance.methods.getEmojiPrice(1).call();
    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });

    let emojiPrice2 = await fcInstance.methods.getEmojiPrice(2).call();
    await fcInstance.methods.buyEmoji(account1, 2).send({ from: account0 });

    const remainingBalance = await fcInstance.methods.balanceOf(account1).call();
    assert.equal(+emojiPrice1 + +emojiPrice2 + +remainingBalance, 10000);
    
    // console.log("emojiPrice1 = " + emojiPrice1);
    // console.log("emojiPrice2 = " + emojiPrice2);
    // console.log("remainingBalance = " + remainingBalance);
  });

  it("Should allow buying and selling emojis randomly", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('1000', 'wei')).send({ from: account0 });

    // let emojiPrice0 = await fcInstance.methods.getEmojiPrice(0).call();
    await fcInstance.methods.buyEmoji(account1, 0).send({ from: account0 });

    // let emojiPrice1 = await fcInstance.methods.getEmojiPrice(1).call();
    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });

    // let emojiPrice2 = await fcInstance.methods.getEmojiPrice(2).call();
    await fcInstance.methods.buyEmoji(account1, 2).send({ from: account0 });

    await fcInstance.methods.sellEmoji(account1, 2).send({ from: account0 });
    await fcInstance.methods.sellEmoji(account1, 0).send({ from: account0 });
    await fcInstance.methods.sellEmoji(account1, 1).send({ from: account0 });

    // let emojiPrice3 = await fcInstance.methods.getEmojiPrice(3).call();
    await fcInstance.methods.buyEmoji(account1, 3).send({ from: account0 });

    const remainingBalance = await fcInstance.methods.balanceOf(account1).call();
    assert.ok(remainingBalance);
    // assert.equal(+emojiPrice0 + +emojiPrice1 + +emojiPrice2 + +emojiPrice3 + +remainingBalance, 1000);
    
    // console.log("emojiPrice0 = " + emojiPrice0);
    // console.log("emojiPrice1 = " + emojiPrice1);
    // console.log("emojiPrice2 = " + emojiPrice2);
    // console.log("emojiPrice3 = " + emojiPrice3);
    // console.log(+emojiPrice0 + +emojiPrice1 + +emojiPrice2 + +emojiPrice3);
    // console.log("remainingBalance = " + remainingBalance);
  });

  it("Should allow selling an emoji", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });

    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });
    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });
    let balance = await fcInstance.methods.emojiBalanceOf(account1, 1).call();
    assert.equal(balance, 2);

    await fcInstance.methods.sellEmoji(account1, 1).send({ from: account0 });
    balance = await fcInstance.methods.emojiBalanceOf(account1, 1).call();
    assert.equal(balance, 1);
  });

  it("Should keep the account balance correct after selling an emoji", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];
    await fcInstance.methods.initialDeposit(account1, toWei('10000', 'wei')).send({ from: account0 });

    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });
    await fcInstance.methods.buyEmoji(account1, 1).send({ from: account0 });

    let emojiPrice = await fcInstance.methods.getEmojiPrice(1).call();
    const beforeBalance = await fcInstance.methods.balanceOf(account1).call();

    await fcInstance.methods.sellEmoji(account1, 1).send({ from: account0 });
    const afterBalance = await fcInstance.methods.balanceOf(account1).call();
    // console.log("beforeBalance = " + beforeBalance);
    // console.log("afterBalance = " + afterBalance);
    // console.log("emojiPrice = " + emojiPrice);

    assert.equal(+emojiPrice + +beforeBalance, +afterBalance);
  });

  // it("Should pass tokens between accounts", async function () {
  //   const account0 = accounts[0];
  //   const account1 = accounts[1];

  //   await fcInstance.methods.initialDeposit().send({ from: account0, value: toWei('10', 'wei') });
  //   const result0 = await fcInstance.methods.balanceOf(account0).call();
  //   const balance0 = parseFloat(fromWei(result0, 'wei'));
  //   assert.equal(balance0, 10);

  //   await fcInstance.methods.deposit().send({ from: account1, value: toWei('10', 'wei') });
  //   const result1 = await fcInstance.methods.balanceOf(account1).call();
  //   const balance1 = parseFloat(fromWei(result1, 'wei'));
  //   assert.equal(balance1, 10);

  //   await fcInstance.methods.transfer(account1, toWei('2', 'wei')).send({ from: account0 });
  //   const result2 = await fcInstance.methods.balanceOf(account1).call();
  //   const balance2 = parseFloat(fromWei(result2, 'wei'));
  //   assert.equal(balance2, 12);

  //   const result3 = await fcInstance.methods.balanceOf(account0).call();
  //   const balance3 = parseFloat(fromWei(result3, 'wei'));
  //   assert.equal(balance3, 8);
  // });
});
