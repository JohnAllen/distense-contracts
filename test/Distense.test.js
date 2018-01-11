const web3 = global.web3
const DIDToken = artifacts.require('DIDToken')
const Distense = artifacts.require('Distense')
const convertBytes32ToString = require('./helpers/utils')
const assertJump = require('./helpers/assertJump')


contract('Distense contract', function (accounts) {

  const proposalPctDIDToApproveParameter = {
    title: 'proposalPctDIDToApprove',
    value: 250 // Hard coded in constructor function in contract
  }

  const pullRequestPctDIDParameter = {
    title: 'pctDIDRequiredToMergePullRequest',
    // Hard coded in constructor function in contract
    //  This is 10 because no floating point in Solidity
    value: 100
  }

  const votingIntervalParameter = {
    title: 'votingInterval',
    value: 1296000 // Equal to 15 days in Solidity
  }

  const numDIDRequiredToRewardVoteTask = {
    title: 'votingInterval',
    value: 150 // Equal to 15 days in Solidity
  }

  const numDIDRequiredToApproveVotePullRequest = {
    title: 'votingInterval',
    value: 300 // Equal to 15 days in Solidity
  }


  it('should set the initial attributes correctly', async function () {

    let param = await distense.getParameterByTitle(
      pullRequestPctDIDParameter.title
    )
    assert.equal(
      convertBytes32ToString(param[0]),
      pullRequestPctDIDParameter.title
    )
    assert.equal(param[1].toNumber(), pullRequestPctDIDParameter.value)

  })


  it('should set the proposalPctDIDApprovalParameter correctly', async function () {
    let param = await distense.getParameterByTitle(
      proposalPctDIDToApproveParameter.title
    )

    assert.equal(
      convertBytes32ToString(param[0].toString()),
      proposalPctDIDToApproveParameter.title
    )
    assert.equal(param[1], proposalPctDIDToApproveParameter.value)
  })


  it('should set the initial attributes correctly', async function () {
    const numParameters = await distense.getNumParameters.call()
    assert.equal(numParameters.toNumber(), 8)
  })


  it('should reject parameter votes with values equal to the current value', async function () {

    let equalValueError
    const didToken = await DIDToken.new()

    const distense = await Distense.new(didToken.address)
    try {
      await distense.voteOnParameter(
        pullRequestPctDIDParameter.title,
        pullRequestPctDIDParameter.value
      )
    } catch (error) {
      equalValueError = error
    }
    assert.notEqual(equalValueError, undefined, 'Error must be thrown')

    let votingIntervalParameterError
    try {
      await distense.voteOnParameter(
        votingIntervalParameter.title,
        votingIntervalParameter.value
      )
    } catch (error) {
      votingIntervalParameterError = error
    }
    assert.notEqual(votingIntervalParameterError, undefined, 'Error must be thrown')


  })


  it(`should disallow voting for those who don't own DID`, async function () {
    let equalValueError
    try {
      await distense.voteOnParameter(pullRequestPctDIDParameter.title, 122, {
        from: accounts[2] // no DID for this account
      })
    } catch (error) {
      equalValueError = error
    }
    assert.notEqual(
      equalValueError,
      undefined,
      'reject parameter votes from those who don\'t own DID'
    )
  })

  //  Begin accounts[0] owns 200 or 100%
  let didToken
  let distense

  beforeEach(async function () {
    didToken = await DIDToken.new()
    didToken.issueDID(accounts[0], 200)
    distense = await Distense.new(didToken.address)
  })


  it(`should restrict voting again if the votingInterval hasn't passed`, async function () {

    let contractError

    try {

      const userBalance = await didToken.balances.call(accounts[0])
      assert.isAbove(userBalance, 0, 'user should have DID here to vote')

      await distense.voteOnParameter(
        votingIntervalParameter.title,
        votingIntervalParameter.value + 1
      )

      await distense.voteOnParameter(
        votingIntervalParameter.title,
        votingIntervalParameter.value + 1
      )


    } catch (error) {
      contractError = error
      // assertJump(error)
    }

    assert.notEqual(
      contractError,
      undefined,
      'should throw an error because the voter is trying to vote twice'
    )

  })


  it(`should allow voting after the votingInterval has passed`, async function () {

    const userBalance = await didToken.balances.call(accounts[0])
    assert.isAbove(userBalance, 0, 'user should have DID here to vote')

    let contractError
    try {


      await distense.voteOnParameter(
        votingIntervalParameter.title,
        votingIntervalParameter.value + 123
      )

      // increaseTime(1)
      await distense.voteOnParameter(
        votingIntervalParameter.title,
        votingIntervalParameter.value + 1
      )

    } catch (error) {
      // assertJump(error)
     contractError = error
    }

    assert.notEqual(
      contractError,
      undefined,
      'should throw an error because the voter is trying to vote twice'
    )

  })
})

const increaseTime = addSeconds => {
  web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_increaseTime',
    params: [addSeconds], id: 0
  })
}

