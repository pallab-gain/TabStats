'use strict';
const moment = require('moment');
const localForge = require('localforage');
const lo = require('lodash');
const { safeExecute } = require('./utils');
const Record = require('./record');

const STATS_DATABASE_NAME = 'xerxes.tab.stats.v2';
const STATS_DATABASE_TIME_SPENT = 'xerxes.tab.stats.time.spent.v2';
const ADMIN_DATABASE_NAME = 'xerxes.tab.admin.v2';
const MAX_STORE_DURATION = 1; // in days

class Database {
  constructor () {
    this._name = 'database';
    this._statsDB = localForge.createInstance({
      name: STATS_DATABASE_NAME
    });
    // will store total cumulative time in seconds just for quick access
    this._statsDBTimeSpent = localForge.createInstance({
      name: STATS_DATABASE_TIME_SPENT
    });
    this._adminDB = localForge.createInstance({
      name: ADMIN_DATABASE_NAME
    });
  }

  /**
   * @public
   * Update tab status
   * @param tabInfo
   * @param key
   * @return {Promise<undefined|Object>}
   */
  async updateTabStatus (tabInfo = undefined, key = null) {
    if (!tabInfo) {
      return undefined;
    }
    const todayInDays = moment.unix(tabInfo.epoch).dayOfYear();
    const visitList = await this.getSitesByKey(key);
    const visitListToday = await this.purgeOld(visitList, todayInDays);
    visitListToday.push(tabInfo);
    await this._statsDB.setItem(key, visitListToday);
    await this._statsDBTimeSpent.setItem(key, visitListToday.length);
  }

  /**
   * @private
   * Remove yesterday record
   * @param records
   * @param todayInDays
   * @return {Promise<Array>}
   */
  async purgeOld (records = [], todayInDays = 0) {
    while (records.length > 0) {
      const timeInDays = moment.unix(records[0].epoch).dayOfYear();
      // if the current day is today then there is no longer any old record
      if (todayInDays === timeInDays) {
        break;
      }
      records.shift();
    }
    return records;
  }

  /**
   * @public
   * Get list of sites by key
   * @param key
   * @return {Promise<void|Array>}
   */
  async getSitesByKey (key = null) {
    if (!key) {
      return [];
    }
    const retval = await this._statsDB.getItem(key) || [];
    return retval;
  }

  /**
   * @public
   * Update/remove obsolete entries
   * @return {Promise<void>}
   */
  async removeObsolete () {
    const keys = await this._statsDB.keys() || [];
    const epoch = moment().unix();
    const todayInDays = moment.unix(epoch).dayOfYear();

    for (const curKey of keys) {
      const entries = await this._statsDB.getItem(curKey) || [];
      const latestEntry = lo.last(entries);
      if (latestEntry) {
        await safeExecute(async () => {
          const lastUpdateInDays = moment.unix(latestEntry.epoch || epoch).dayOfYear();
          // delete items that are more than max MAX_STORE_DURATION old
          if (todayInDays - lastUpdateInDays >= MAX_STORE_DURATION) {
            await this._statsDB.removeItem(curKey);
            await this._statsDBTimeSpent.removeItem(curKey);
          }
        });
      }
    }
  }

  /**
   * Set last sync time
   * @param unixTime
   * @return {Promise<void>}
   */
  async setLastUpdate (unixTime = null) {
    await this._adminDB.setItem('lastUpdate', unixTime);
  }

  /**
   * Get last sync time
   * @return {Promise<Number>}
   */
  async getLastUpdate () {
    const retval = await this._adminDB.getItem('lastUpdate') || 0;
    return retval;
  }

  /**
   * @public
   * Get today's record
   * @return {Promise<void|Number|Object>}
   */
  async getRecords () {
    const keys = await this._statsDB.keys() || [];
    const epoch = moment().unix();
    const todayInDays = moment.unix(epoch).dayOfYear();
    const recordList = [];
    for (const curKey of keys) {
      const entries = await this._statsDB.getItem(curKey) || [];
      // total number of today's entry in second
      const visitList = entries.filter(item => {
        const lastUpdateInDays = moment.unix(item.epoch || epoch).dayOfYear();
        return todayInDays === lastUpdateInDays;
      });
      if (visitList.length > 0) {
        const lastItem = lo.last(entries) || {};
        recordList.push(Record(lastItem, curKey, visitList.length, visitList));
      }
    }
    return recordList;
  }

  /**
   * @public
   * Get list of sites by key for today only
   * @param key
   * @return {Promise<void|Number>}
   */
  async getRecordsCountByKey (key = null) {
    if (!key) {
      return 0;
    }
    const timeSpentInSecond = await this._statsDBTimeSpent.getItem(key) || 0;
    // total number of today's entry in second
    return timeSpentInSecond;
  }
}

module.exports = Database;
