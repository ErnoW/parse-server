/* eslint-disable @typescript-eslint/no-var-requires */
/* global Parse */

require('./generated/evmApi');
require('./generated/solApi');
const { handleRateLimit } = require('./utils/rateLimit');

Parse.Cloud.define('core-test', () => {
  handleRateLimit();
});

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return [];
});


Parse.Cloud.define('getServerTime', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return null
});


