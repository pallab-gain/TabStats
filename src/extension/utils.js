'use strict';

/**
 * Take tab info and return origin as hostname
 * @param tabInfo
 * @return {Promise<string>}
 */
const getKey = async (tabInfo = undefined) => {
  const url = new URL(tabInfo.url);
  return url.hostname;
};

const safeExecute = async (fn) => {
  try {
    const retval = await fn();
    return retval || true;
  } catch (e) {
    return false;
  }
};

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
};

module.exports = {
  getKey,
  safeExecute,
  sleep
};
