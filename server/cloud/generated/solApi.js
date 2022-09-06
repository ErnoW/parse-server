/* global Parse */
/* eslint-disable @typescript-eslint/no-var-requires */
const Moralis = require('moralis').default
const { handleRateLimit } = require('../utils/rateLimit');

const getErrorMessage = (error, name) => {
  // Resolve Axios data inside the MoralisError
  if (error.cause && error.cause.response && error.cause.response.data) {
    return JSON.stringify(error.cause.response.data);
  }

  if (error instanceof Error) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  } 

  return `API error while calling ${name}`
}

const beforeApiRequest = async (user, ip, name) => {
  if (!(await handleRateLimit(user, ip))) {
    throw new Error(
      `Too many requests to ${name} API from this particular client, the clients needs to wait before sending more requests.`
    );
  }
}

Parse.Cloud.define("sol-balance", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'balance');
    const result = await Moralis.SolApi.account.balance(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-balance'));
  }
})

Parse.Cloud.define("sol-getSPL", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'getSPL');
    const result = await Moralis.SolApi.account.getSPL(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-getSPL'));
  }
})

Parse.Cloud.define("sol-getNFTs", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'getNFTs');
    const result = await Moralis.SolApi.account.getNFTs(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-getNFTs'));
  }
})

Parse.Cloud.define("sol-getPortfolio", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'getPortfolio');
    const result = await Moralis.SolApi.account.getPortfolio(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-getPortfolio'));
  }
})

Parse.Cloud.define("sol-getNFTMetadata", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'getNFTMetadata');
    const result = await Moralis.SolApi.nft.getNFTMetadata(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-getNFTMetadata'));
  }
})

Parse.Cloud.define("sol-getTokenPrice", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, 'getTokenPrice');
    const result = await Moralis.SolApi.token.getTokenPrice(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'sol-getTokenPrice'));
  }
})

