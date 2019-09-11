'use strict';
import React from 'react';
import styles from './main.css';

import Loading from './loading/loading';
import Error from './error/error';
import PopupUI from './popup.ui/popup.ui';

import {
  getPieChartTitle,
  getHighChartPieData,
  getHourList,
  getRecordsByHours,
  getRecordsBySites
} from '../utils/libs';

const lo = require('lodash');
const db = require('../../extension/cache');

// fetch pie chart related data
/**
 *
 * @param recordsList
 * @return {Promise<void>}
 */
const fetchPieChartData = async (recordsList = []) => {
  const pieChartDataTitles = getPieChartTitle(recordsList);
  const pieChartData = getHighChartPieData(recordsList);
  return {
    pieChartDataTitles,
    pieChartData
  };
};

// fetch daily summary chart related data
/**
 *
 * @param recordsList
 * @return {Promise<void>}
 */
const fetchDailySummaryChartData = async (recordsList = []) => {
  const hourListInDays = getHourList();
  const dailySummaryChartData = getRecordsByHours(recordsList);
  return {
    hourListInDays,
    dailySummaryChartData
  };
};

const fetchWordCloudChartData = async (recordList = []) => {
  const wordCloudChartData = getRecordsBySites(recordList);
  return {
    wordCloudChartData
  };
};

const fetchData = async () => {
  const recordList = await db.getRecords();
  return new Promise((resolve, reject) => {
    Promise.all([
      fetchPieChartData(recordList),
      fetchDailySummaryChartData(recordList),
      fetchWordCloudChartData(recordList)
    ]).then(([pieChartData, dailySummaryData, wordCloudChartData]) => {
      resolve({ ...pieChartData, ...dailySummaryData, ...wordCloudChartData, recordList });
    }).catch(err => {
      reject(err);
    });
  });
};

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: undefined,
      inProgress: true,
      records: undefined
    };
  }

  componentDidMount () {
    Promise.all([
      fetchData(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]).then(recordsList => {
      const records = lo.first(recordsList);
      this.setState({
        error: false,
        inProgress: false,
        records: records
      });
    }).catch(err => {
      this.setState({
        error: err,
        inProgress: false,
        records: undefined
      });
    });
  };

  render () {
    return (
      <div className={`container-fluid ${styles.container_div}`}>
        { this.state.inProgress && <Loading/> }
        { !this.state.inProgress && this.state.error && <Error/> }
        { !this.state.inProgress && !this.state.error && this.state.records &&
          <PopupUI records={this.state.records}/> }
      </div>
    );
  }
}
export default Main;
