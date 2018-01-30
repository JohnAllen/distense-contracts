# Distense Smart Contracts

[![codecov](https://codecov.io/gh/Distense/distense-contracts/branch/master/graph/badge.svg)](https://codecov.io/gh/Distense/distense-contracts)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Build Status](https://travis-ci.org/Distense/distense-contracts.svg?branch=master)](https://travis-ci.org/Distense/distense-contracts)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

- clone this repo
- install npm if you don't have it
- `npm i`

## Usage

- the primary way we interact with our smart contracts is by testing, so when developing we make changes to our contracts, test, then interact in the UI
- to test run `npm test` (if this fails make sure you don't have another testrpc shell running)


Once you get past the initial code->testing phase and want to view your changes in the UI

- Install `ganache`, an application that is a local Ethereum testnet: Download the appropriate version from here: https://github.com/trufflesuite/ganache/releases
- run ganache
- Then you need to compile and deploy your updated version of the contracts: `npm run migrateLocal`
- Once your contracts are migrated you can install and run the distense-ui client to interact with them:
    - `git clone https://github.com/Distense/distense-ui`
    - `cd distense-ui`
    - `npm install`
- What we normally do at this point is remove the npm published version of our contracts from the distense-ui node_modules: `rm -r node_modules/distense-contracts`.
- Then you can symlink _your_ version of our contracts into the proper location in the client:
    - `sudo ln ~/distense-contracts ~/distense-ui/node_modules`
- Then you can run the distense-ui with `npm run start`
- You can interact with your version of the contracts at this point and modify the distense-ui if you want


## Contribute

- See #Install and #Usage
- By contributing to this repo you will earn DID an Ethereum token that gives you governance and economic rights over Distense
    - See instructions on how to submit your work there

## License

All Rights Reserved © 2018 Distense
