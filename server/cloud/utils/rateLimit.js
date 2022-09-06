/* eslint-disable @typescript-eslint/no-var-requires */
const { RedisCacheAdapter } = require('parse-server');

const redisClient = new RedisCacheAdapter({ url: process.env.REDIS_CONNECTION_STRING });

const getRateLimitKeys = (identifier) => `ratelimit_${identifier}`;

const resetTtl = async (key) => {
  await redisClient.put(key, 0, process.env.RATE_LIMIT_TTL * 1000);
  return 0;
};

const updateRecord = (key) => {
  redisClient.client.incr(key);
};

const redisQuery = async (key) => {
  return new Promise((resolve) => {
    redisClient.client.ttl(key, async (error, data) => {
      if (data < 0) {
        resolve(resetTtl(key));
      }
      const result = await redisClient.get(key);
      resolve(result);
    });
  });
};

const checkStatus = async (identifier, requestLimit) => {
  const key = getRateLimitKeys(identifier);
  const rateLimitCount = await redisQuery(key);
  let response;
  if (rateLimitCount < requestLimit) {
    updateRecord(key);
    response = true;
  } else {
    response = false;
  }
  return response;
};

const handleRateLimit = async (user, ip) => {
  let status;
  if (user && user.id) {
    status = await checkStatus(user.id, process.env.RATE_LIMIT_AUTHENTICATED);
  }
  status = await checkStatus(ip, process.env.RATE_LIMIT_ANONYMOUS);

  return status;
};

module.exports = { handleRateLimit };
