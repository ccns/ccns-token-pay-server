const express = require('express')
const app = express()

const config = require('config')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.get("web3_provider")))

const contract = web3.eth.contract(config.get("ABI"))
const token = contract.at(config.get("contract_address"))
const tokenOwner = config.get("token_owner")

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/versions', function (req, res) {
  var vapi = web3.version.api
  var vnode = web3.version.node
  var vnetwork = web3.version.network
  var vethereum = web3.version.ethereum
  res.send({
  	api: vapi,
  	node: vnode,
  	network: vnetwork,
  	ethereum: vethereum
  })
})

app.post('/unlock', function (req, res) {
  var password = req.body.password
  var account = req.body.account
  res.send(web3.personal.unlockAccount(account, password))
})

app.get('/balance', function (req, res) {
  var account = req.query.account
  res.send(token.balanceOf(account))
})

app.post('/send', function (req, res) {
  var fromAddress = req.body.from
  var toAddress = req.body.to
  var password = req.body.password
  var amount = parseInt(req.body.amount) * 100000
  if(web3.personal.unlockAccount(fromAddress, password))
  	res.send(token.transfer(toAddress, amount, { from: fromAddress }))
})

app.post('/pay', function (req, res) {
  var fromAddress = req.body.from
  var toAddress = tokenOwner
  var password = req.body.password
  var amount = parseInt(req.body.amount) * 100000
  if(web3.personal.unlockAccount(fromAddress, password))
  	res.send(token.transfer(toAddress, amount, { from: fromAddress }))
})

app.listen(3030, function () {
  console.log('Example app listening on port 3030!')
})