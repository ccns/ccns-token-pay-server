# CCNS Token Pay Server

A payment system for erc20 token based on Parity RPC API

## Installation

### Windows
1. Install [Parity](https://github.com/paritytech/parity/releases)
2. Fetch this repository by `git clone https://github.com/ccns/ccns-token-pay-server`
3. Edit `misc/config-sample.toml` and save to `%AppData%\Parity\Ethereum\config.toml`

The sample config file is setup for ropsten testnet. Create your own config by [Parity Config Generator](https://paritytech.github.io/parity-config-generator/) and see [Configuring Parity](https://github.com/paritytech/parity/wiki/Configuring-Parity) if you have no idea for the configurations.

:::warning
If you want to setup your own config file, remeber to turn on `personal` and `parity_accounts` for RPC API. See [JSONRPC](https://github.com/paritytech/parity/wiki/JSONRPC)
:::

4. Lauch the server
```
npm install
npm start
```

## TODO

- [ ] Security issue about the user password storage.