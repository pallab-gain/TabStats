'use strict';
const moment = require('moment');
const lo = require('lodash');
const { safeExecute } = require('./utils');
const Database = require('./database');

// cache update interval in second
const UPDATE_INTERVAL_IN_SECOND = 15;
const MAX_STORE_DURATION_IN_DAY = 1; // in days

class Cache extends Database {
  constructor () {
    super();
    this._lastUpdate = 0;
    this._quick_application_cache = {};
    this._pulled_from_db = false;
  }

  /**
   * pull from the db if this is first time
   * @return {Promise<void>}
   */
  async maybePullFromDB () {
    if (this._pulled_from_db) {
      return undefined;
    }
    this._pulled_from_db = true;
    const keys = await this._statsDB.keys() || [];
    for (const curKey of keys) {
      const visitList = await this._statsDB.getItem(curKey) || [];
      this._quick_application_cache[curKey] = visitList;
    }
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
    let visitListToday = this._quick_application_cache[key];
    if (!visitListToday) {
      this._quick_application_cache[key] = [tabInfo];
    } else {
      visitListToday = await this.purgeOld(visitListToday, todayInDays);
      visitListToday.push(tabInfo);
      // at this point should update the application_cache automatically since
      // dealing with reference
    }
    // don't cache total time tracking since it is quite light operation
    await this._statsDBTimeSpent.setItem(key, this._quick_application_cache[key].length);

    // since we only cache the stats db try to sync it if needed
    await this.maybeSyncDatabase(key);
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
   * @private
   * Sync the in memory storage with database
   * @param key
   * @return {Promise<void>}
   */
  async maybeSyncDatabase (key = null) {
    if (!key) {
      return;
    }
    const epoch = moment().unix();
    if (epoch - this._lastUpdate < UPDATE_INTERVAL_IN_SECOND) {
      return;
    }
    this._lastUpdate = epoch;
    await this._statsDB.setItem(key, this._quick_application_cache[key]);
  }

  /**
   * @public
   * Update/remove obsolete entries
   * @return {Promise<void>}
   */
  async removeObsolete () {
    // remove from the database
    await super.removeObsolete();

    // take care of in memory application cache
    const keys = Object.keys(this._quick_application_cache);
    const epoch = moment().unix();
    const todayInDays = moment.unix(epoch).dayOfYear();
    for (const curKey of keys) {
      const entries = this._quick_application_cache[curKey] || [];
      const latestEntry = lo.last(entries);
      if (latestEntry) {
        await safeExecute(async () => {
          const lastUpdateInDays = moment.unix(latestEntry.epoch || epoch).dayOfYear();
          // delete items that are more than max MAX_STORE_DURATION old
          if (todayInDays - lastUpdateInDays >= MAX_STORE_DURATION_IN_DAY) {
            delete this._quick_application_cache[curKey];
          }
        });
      }
    }
  }
}
const databaseSingleton = new Cache();
module.exports = databaseSingleton;
