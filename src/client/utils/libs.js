'use strict';
import moment from 'moment';
import { toHumanReadableDuration, toMinutes } from './utils';
import lo from 'lodash';
const HighChartPieEntry = require('../db/highchart.pie.entry');
const HighChartStackEntry = require('../db/highchart.stack.entry');
const HighChartWordCloudEntry = require('../db/highchart.word.cloud.entry');

/**
 * Get list of hours for a day in 24 format
 * 0,1,2,3....23
 * @return {[]}
 */
export const getHourList = () => {
  const categories = [];
  for (let i = 0; i < 24; i += 1) {
    categories.push(i);
  }
  return categories;
};

export const getSiteVisitByHours = (siteInfo = undefined) => {
  const visitDurationListInSecond = [];
  let at = 0;
  for (let currentHour = 0; currentHour < 24; currentHour += 1) {
    let visitCount = 0;
    while (at < siteInfo.sitesList.length) {
      const tempHour = moment.unix(siteInfo.sitesList[at].epoch).hours();
      if (tempHour > currentHour) {
        break;
      }
      visitCount += 1;
      at += 1;
    }
    visitDurationListInSecond.push(visitCount);
  }
  const highChartEntry = HighChartStackEntry(siteInfo.scope, visitDurationListInSecond.map(item => toMinutes(item)));
  return highChartEntry;
};

export const getRecordsByHours = (recordList = []) => {
  const retval = [];
  const siteList = lo.uniqBy(recordList, record => record.scope);
  for (const curSite of siteList) {
    const visitByHours = getSiteVisitByHours(curSite);
    retval.push(visitByHours);
  }
  return retval;
};

export const getPieChartTitle = (recordList = []) => {
  const totalDurationInSecond = recordList.reduce(
    (accumulator, record) => accumulator + record.totalTimeInSec, 0);
  const duration = toHumanReadableDuration(totalDurationInSecond);

  return `You spent total ${duration}`;
};

export const getHighChartPieData = (recordList = []) => {
  const totalDurationInSecond = recordList.reduce(
    (accumulator, record) => accumulator + record.totalTimeInSec, 0);

  const chartData = recordList.map(item => {
    const { scope, totalTimeInSec } = item;
    const percentage = (100.0 * totalTimeInSec) / totalDurationInSecond;
    return HighChartPieEntry(scope, totalTimeInSec, percentage);
  });
  return chartData;
};

export const getUniqueSites = (recordList = []) => {
  const siteList = lo.uniqBy(recordList, record => record.scope);
  return siteList;
};

export const getRecordsBySites = (recordList = []) => {
  const siteList = lo.uniqBy(recordList, record => record.scope);
  const retval = [];
  for (const curSite of siteList) {
    // total time in second is actually the weight here
    const weight = curSite.totalTimeInSec;
    retval.push(HighChartWordCloudEntry(curSite.scope, weight));
  }
  return retval;
};
