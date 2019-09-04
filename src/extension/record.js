'use strict';

/**
 * @public
 * @param title
 * @param url
 * @param favIconUrl
 * @param epoch
 * @param scope
 * @param totalTimeInSec
 * @param sitesList
 * @return {{totalTimeInSec: *, sitesList: *, scope: *, favIconUrl: *, epoch: *, title: *, url: *}}
 * @constructor
 */
const Record = ({ title, url, favIconUrl, epoch }, scope, totalTimeInSec, sitesList = []) => {
  return {
    title,
    url,
    favIconUrl,
    epoch,
    scope,
    totalTimeInSec,
    sitesList
  };
};

module.exports = Record;
