const compile = require('./compile.js');
const personal = require('./personal.js');
const utils = require('./utils.js');
const Eth = require('ethjs');
const Tx = require('ethereumjs-tx');
const Wallet = require('ethereumjs-wallet');

let eth = new Eth(new Eth.HttpProvider('http://localhost:18545'));

module.exports = async function deploy (filename) {
  let bytecode = compile(filename)

  let privateKey = Buffer.from('4d6cf3ce1ac71e79aa33cf481dedf2e73acb548b1294a70447c960784302d2fb', 'hex')
  let wallet = Wallet.fromPrivateKey(privateKey)
  let deployer = wallet.getAddress().toString('hex')

  await personal.send({to: deployer, value: utils.toWei(1)})

  let tx = new Tx({
    gas: 2000000,
    data: '0x' + bytecode + '0000000000000000000000004b274dfcd56656742A55ad54549b3770c392aA87',
    nonce: await eth.getTransactionCount(deployer),
    chainId: 17
  })
  tx.sign(privateKey)
  let txHash = await eth.sendRawTransaction(tx.serialize().toString('hex'))
  await setTimeout(async () => {
    let receipt = await eth.getTransactionReceipt(txHash)
    console.log('receipt:', receipt)
  }, 2000)
}
