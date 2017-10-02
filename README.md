# CCNS Token Pay Server

A payment system for erc20 token based on Parity RPC API

## Installation

### Windows
#### Install Parity

Install Parity from [Parity Releases](https://github.com/paritytech/parity/releases)

#### Fetch this repository 

```
git clone https://github.com/ccns/ccns-token-pay-server
```

#### Edit Parity config file

Edit `misc\config-sample.toml` and save it to `%AppData%\Parity\Ethereum\config.toml`

The sample config file is setup for ropsten testnet. Create your own config by [Parity Config Generator](https://paritytech.github.io/parity-config-generator/) and see [Configuring Parity](https://github.com/paritytech/parity/wiki/Configuring-Parity) if you have no idea for the configurations.

If you want to setup your own config file, remeber to turn on `personal` and `parity_accounts` for RPC API. See [JSONRPC](https://github.com/paritytech/parity/wiki/JSONRPC)

#### Lauch the server

```
npm install
npm start
```

## API Reference

- [versions](#versions)

### Usage

#### versions

Returns version information of all related app.

`GET` api/versions

##### Url Params

None

##### Data Params

None

##### Return
  
```json
{
	"api":"0.20.2",
	"node":"Parity//v1.7.2-beta-9f47909-20170918/x86_64-windows-msvc/rustc1.19.0",
	"network":"3",
	"ethereum":"63"
}
```

#### balance

Returns the balance of specific address (must be in the Parity wallet list).

`GET` api/balance

##### Url Params

- address - Ethereum address in hexademical 

##### Data Params

None

##### Return
  
```json
"9999000000"
```

## TODO

- [ ] Security issue about the user password storage.