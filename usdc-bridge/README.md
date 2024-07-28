# Build a Noble to Ethereum USDC bridge

## Table of contents

* [Install](#install)
* [Run project](#run-project)
* [Report](#report)
* [Ressources](#ressources)

## Install

```bash
nvm use
npm install
```

## Run project

```bash
npm run dev
```

## Report

Before starting to code I tried to gather as much information as needed to fulfill the test. Since I knew I would have to consume a lot of new informations, I wanted to have a rough plan ahead to keep a broad picture of the overall feature when delving into each step.

To complete this exercise I thought about dividing the test into four main stages:

1. Set up
2. Connect wallet and show informations
3. Burn and Mint
4. UI, errors and details

### Set up

Set up working wallets with testnet USDC, in order to make it functional from a user's standpoint. 

#### Noble
Install Keplr wallet, connect to the noble testnet and get USDC from the faucet.

*Note that I could not access the web page's faucet provided, so I used the one from Circle.*

#### Ethereum
Install Metamask Wallet, display the tokens and import the USDC contract.

### Connecting Wallet and show informations

After bootstraping a Vite React + Typescript template, it was the first step to validate that we could connect the Keplr wallet successfully and get the address and account USDC balance.

*Note that the Keplr wallet browser extension could not connect to the `grand-1` testnet chain, with the default chain infos provided, but the USDC are showing in the mobile Keplr wallet with the same settings.*

### Burn and Mint

Basically, read the Circle's documentation and adapt the code example provided on their Github.

Verify the transaction on Mintscan and Sepolia Etherscan websites.

Verify that the expected amount of USDC tokens is showing in the Metamask wallet.

### UI details and errors

From user's input errors to transaction errors. 

UI/UX related details like error messages, loading indications, disabled button, text ellipsis, minimal responsiveness, etc.

## Ressources

https://www.mintscan.io/

https://sepolia.etherscan.io/

https://faucet.circle.com/

https://docs.noble.xyz/

https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#detecting-keplr

https://developers.circle.com/stablecoins/docs/transfer-usdc-on-testnet-from-noble-to-ethereum

https://cosmos.github.io/cosmjs/latest/stargate/index.html

https://tailwindcss.com/
