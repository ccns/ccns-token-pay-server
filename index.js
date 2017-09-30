const express = require('express')
const app = express()

const config = require('config')
const web3_provider = config.get("web3_provider")
const ABI = config.get("ABI")
const contract_address = config.get("contract_address")
const token_owner = config.get("token_owner")

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(web3_provider))

web3._extend({
    property: 'parity',
    methods: [new web3._extend.Method({
      name: 'getAccountsInfo',
      call: 'parity_allAccountsInfo',
      params: 0
    }),new web3._extend.Method({
      name: 'newAccountFromPhrase',
      call: 'parity_newAccountFromPhrase',
      params: 2
    }),new web3._extend.Method({
      name: 'setAccountName',
      call: 'parity_setAccountName',
      params: 2
    }),new web3._extend.Method({
      name: 'setAccountMeta',
      call: 'parity_setAccountMeta',
      params: 2
    })],
    properties: [new web3._extend.Property({
      name: 'accountsInfo',
      getter: 'parity_allAccountsInfo'
    })]
})

const request = require('request')
const bip39 = require('bip39')
const _ = require('underscore')

const contract = web3.eth.contract(ABI)
const token = contract.at(contract_address)
const tokenOwner = token_owner

const Passport = require('passport');
const LocalStrategy = require( 'passport-local' ).Strategy;
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

const localStrategy = 

app.use(bodyParser.json())
app.use(flash())
app.use(session({
  saveUninitialized: false,
  resave: true,
  secret: 'secret'
}))

app.use(Passport.initialize())
app.use(Passport.session())

Passport.serializeUser(function(user, done){
  done(null, user.uuid)
})

Passport.deserializeUser(function(uuid, done){
  users = _.where(web3.parity.accountsInfo, {uuid: uuid})
  done(null, users[0])
})

Passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  function(username, password, done) {
    users = _.where(web3.parity.accountsInfo, {name: username})
    user = users[0]
    user.meta = JSON.parse(user.meta)

    if ( !users.length ) {
      return done( null, false, { message: 'Invalid user' } )
    }
    if(password != user.meta.pw) {
      return done( null, false, { message: 'Invalid password' } )
    }

    done( null, user )
  }
))

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

app.get('/accounts', function (req, res) {
  res.send(web3.parity.accountsInfo)
})

app.get('/genPhrase', function (req, res) {
  res.send(bip39.generateMnemonic())
})

app.get('/login', function (req, res) {
  res.send(req.flash())
})

app.post('/send', function (req, res) {
  var fromAddress = req.body.from
  var toAddress = req.body.to
  var password = req.body.password
  var amount = parseInt(req.body.amount) * 100000
	res.send(token.transfer(toAddress, amount, { from: fromAddress }))
})

app.post('/pay', function (req, res) {
  var fromAddress = req.body.from
  var toAddress = tokenOwner
  var password = req.body.password
  var amount = parseInt(req.body.amount) * 100000
	res.send(token.transfer(toAddress, amount, { from: fromAddress }))
})

app.post('/newAccount', function (req, res) {
  var phrase = req.body.phrase
  var password = req.body.password
  var name = req.body.name
  var pw = req.body.pw
  if(_.where(web3.parity.accountsInfo, {name: name}).length)
    return res.send("Duplicated name.")
  var address = web3.parity.newAccountFromPhrase(phrase, password)
  web3.parity.setAccountName(address, name)
  web3.parity.setAccountMeta(address, JSON.stringify({pw: pw}))
  request("http://faucet.ropsten.be:3001/donate/"+address, 
  (err, response, body) => { 
    if(!err)
      res.send(body)
    else
      res.send(err)
  })
})

app.post('/login',
  Passport.authenticate('local', {
    successRedirect: '/',
    successFlash: 'Welcome',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
  })
);

app.listen(3030, function () {
  console.log('Example app listening on port 3030!')
})