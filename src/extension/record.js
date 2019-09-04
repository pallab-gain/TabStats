'use strict';

/**
 * @public
 * @param title
 * @param url
 * @param favIconUrl
 * @param epoch
 * @param scope
 * @param totalTimeInSec
 * @return {{totalTimeInSec: *, scope: *, favIconUrl: *, epoch: *, title: *, url: *}}
 * @constructor
 */
const Record = ({ title, url, favIconUrl, epoch }, scope, totalTimeInSec) => {
  return {
    title,
    url,
    favIconUrl,
    epoch,
    scope,
    totalTimeInSec
  };
};

module.exports = Record;
