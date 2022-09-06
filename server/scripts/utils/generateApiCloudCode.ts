import { Endpoint } from '../types/Endpoint';
import fs from 'fs';

type Module = 'EvmApi' | 'SolApi';

const getModulePrefix = (module: Module) => {
  switch (module) {
    case 'EvmApi':
      return '';
    case 'SolApi':
      return 'sol-';
    default:
      throw new Error(`No prefix defined for module '${module}'`);
  }
};

const generateCloudCode = (module: Module, endpoint: Endpoint) => {
  let code = '';
  const name = `${getModulePrefix(module)}${endpoint.name}`;
  code += `Parse.Cloud.define("${name}", async ({params, user, ip}) => {
  try {
    await beforeApiRequest(user, ip, '${endpoint.name}');
    const result = await Moralis.${module}.${endpoint.group}.${endpoint.name}(params);
    return result.raw;
  } catch (error) {
    throw new Error(getErrorMessage(error, '${name}'));
  }
})`;

  return code;
};

const generateAllCloudCode = (module: Module, endpoints: Endpoint[]) => {
  let output = `/* global Parse */
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

  return \`API error while calling \${name}\`
}

const beforeApiRequest = async (user, ip, name) => {
  if (!(await handleRateLimit(user, ip))) {
    throw new Error(
      \`Too many requests to \${name} API from this particular client, the clients needs to wait before sending more requests.\`
    );
  }
}

`;

  endpoints.forEach((endpoint) => {
    output += generateCloudCode(module, endpoint);
    output += '\n\n';
  });

  return output;
};

export const createCloudFile = async (outPath: string, module: Module, endpoints: Endpoint[]) => {
  const code = generateAllCloudCode(module, endpoints);
  await fs.writeFileSync(outPath, code);
};
