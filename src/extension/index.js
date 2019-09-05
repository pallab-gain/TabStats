'use strict';

const INTERVAL_DURATION_IN_MS = 1000; // every second
const SYNC_INTERVAL = 60; // in second
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
let focusedWindowId = null;

const maybeSyncRecords = async () => {
  const epoch = moment().unix();
  const lastUpdateEpochInSecond = await db.getLastUpdate();
  if (epoch - lastUpdateEpochInSecond <= SYNC_INTERVAL) {
    return undefined;
  }
  await db.setLastUpdate(epoch);
  await db.removeObsolete();
};

const setBadge = async (tabList = []) => {
  const currentTab = lo.first(tabList);
  if (!currentTab) {
    return undefined;
  }
  const key = await getKey(currentTab);
  const totalDurationInSecond = await db.getRecordsCountByKey(key);
  const duration = toShortDuration(totalDurationInSecond);
  // eslint-disable-next-line no-undef
  chrome.browserAction.setBadgeText({ text: duration }, () => {});
};

const handleTabState = async (tabList = []) => {
  if (!tabList || tabList.length < 1) {
    return;
  }
  await safeExecute(async () => {
    await maybeSyncRecords();
  });
  // get list of active tabs
  const activeTabList = tabList.filter(currentTab => currentTab.active === true && currentTab.windowId === focusedWindowId);
  // update the active tabs status
  for (const currentTab of activeTabList) {
    const tabInfo = TabInfo(currentTab.title, currentTab.url, currentTab.favIconUrl, moment().unix());
    await safeExecute(async () => {
      const key = await getKey(tabInfo);
      await db.updateTabStatus(tabInfo, key);
    });
  }
  // update badge
  await safeExecute(async () => {
    await setBadge(tabList);
  });
};

const runnable = () => {
  // eslint-disable-next-line no-undef
  chrome.tabs.query({ active: true }, async (tabList = []) => {
    await handleTabState(tabList);
  });
};

// eslint-disable-next-line no-undef
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  focusedWindowId = windowId;
});
setInterval(runnable, INTERVAL_DURATION_IN_MS);
