const deploy = require('./app/deploy.js')

if(process.argv.length != 3) {
  console.error('Usage: node oracle_deployer.js <solidity contract>')
  process.exit(1)
}

let filePath = process.argv[2]
deploy(filePath)
