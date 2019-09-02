'use strict';

const INTERVAL_DURATION_IN_MS = 1000; // every second
const SYNC_INTERVAL = 1; // in days
const BADGE_UPDATE_INTERVAL = 5; // in second
const {
  getKey,
  safeExecute
} = require('./utils');
// eslint-disable-next-line no-unused-vars
const { toShortDuration } = require('../client/utils/utils');
const TabInfo = require('./tab.info');
const moment = require('moment');
const db = require('./database');
const lo = require('lodash');
let lastBadgeUpdateInSecond = 0;

const maybeSyncRecords = async () => {
  const epoch = moment().unix();
  const todayInDays = moment.unix(epoch).dayOfYear();
  const lastUpdateEpoch = await db.getLastUpdate();
  const lastUpdateInDays = moment.unix(lastUpdateEpoch).dayOfYear();
  if (todayInDays - lastUpdateInDays <= SYNC_INTERVAL) {
    return undefined;
  }
  await db.setLastUpdate(epoch);
  await db.removeObsolete();
};

const handleTabState = async (tabList = []) => {
  if (!tabList || tabList.length < 1) {
    return;
  }
  await safeExecute(async () => {
    await maybeSyncRecords();
  });

  // fetch the list of tab details from database
  for (const currentTab of tabList) {
    if (currentTab.active === true) {
      const tabInfo = TabInfo(currentTab.title, currentTab.url, moment().unix());
      const key = await getKey(tabInfo);
      await safeExecute(async () => {
        await db.updateTabStatus(tabInfo, key);
      });
    }
  }
};
const setBadge = async (tabList = []) => {
  const epoch = moment().unix();
  if (epoch - lastBadgeUpdateInSecond <= BADGE_UPDATE_INTERVAL) {
    return;
  }
  lastBadgeUpdateInSecond = epoch;
  const currentTab = lo.first(tabList);
  if (!currentTab) {
    return undefined;
  }
  const tabInfo = TabInfo(currentTab.title, currentTab.url, moment().unix());
  const key = await getKey(tabInfo);
  const totalDurationInSecond = await db.getRecordsByKey(key);
  const duration = toShortDuration(totalDurationInSecond);
  // eslint-disable-next-line no-undef
  chrome.browserAction.setBadgeText({ text: duration }, () => {});
};

const runnable = () => {
  // eslint-disable-next-line no-undef
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabList = []) => {
    await handleTabState(tabList);
    await setBadge(tabList);
  });
};

setInterval(runnable, INTERVAL_DURATION_IN_MS);
