'use strict';

const INTERVAL_DURATION_IN_MS = 1000; // in millisecond
const SYNC_INTERVAL_IN_SECOND = 60; // in second
const {
  getKey,
  safeExecute
} = require('./utils');
// eslint-disable-next-line no-unused-vars
const { toShortDuration } = require('../client/utils/utils');
const TabInfo = require('./tab.info');
const moment = require('moment');
const db = require('./cache');
const lo = require('lodash');

const maybeSyncRecords = async () => {
  const epoch = moment().unix();
  const lastUpdateEpochInSecond = await db.getLastUpdate();
  if (epoch - lastUpdateEpochInSecond <= SYNC_INTERVAL_IN_SECOND) {
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

const handleTabState = async (tabList = [], windowId) => {
  if (!tabList || tabList.length < 1) {
    return;
  }
  await safeExecute(async () => {
    await db.maybePullFromDB();
  });

  await safeExecute(async () => {
    await maybeSyncRecords();
  });
  // get list of active tabs
  const activeTabList = tabList.filter(currentTab => currentTab.windowId === windowId);
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

/**
 * Get a list of active tab for currently focused window
 * @return {Promise<undefined|Tab|Object>}
 */
const getActiveTab = async () => {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
      const { focused, id } = currentWindow;
      if (!focused) {
        return resolve(undefined);
      }
      // eslint-disable-next-line no-undef
      chrome.tabs.query({ active: true, currentWindow: true }, async (activeTabs) => {
        resolve({ activeTabs, windowId: id });
      });
    });
  });
};

const runnable = async () => {
  const activeWindow = await getActiveTab();
  if (!activeWindow) {
    return;
  }
  const { activeTabs, windowId } = activeWindow;
  await handleTabState(activeTabs, windowId);
};
setInterval(runnable, INTERVAL_DURATION_IN_MS);
