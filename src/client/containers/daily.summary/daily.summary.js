import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import lo from 'lodash';
import moment from 'moment';
import { toMinutes } from '../../utils/utils';
const HighChartEntry = require('../../db/highchart.pie.stack');
/**
 * Get list of hours for a day in 24 format
 * 0,1,2,3....23
 * @return {[]}
 */
const getHourList = () => {
  const categories = [];
  for (let i = 0; i < 24; i += 1) {
    categories.push(i);
  }
  return categories;
};

const inBetween = (lo, hi, pivot) => {
  return pivot >= lo && pivot < hi;
};

const getVisitByHours = (siteInfo = undefined) => {
  let visitDurationListInSecond = [];
  for (let curHour = 0; curHour < 24; curHour += 1) {
    const visitCount = siteInfo.sitesList.filter(curVisit => {
      const currentHour = moment.unix(curVisit.epoch).hours();
      return inBetween(curHour, curHour + 1, currentHour);
    }).length;
    visitDurationListInSecond.push(visitCount);
  }
  return HighChartEntry(siteInfo.scope, visitDurationListInSecond.map(item => toMinutes(item)));
};

const getRecordsByHours = (recordList = []) => {
  let retval = [];
  const siteList = lo.uniqBy(recordList, record => record.scope);
  for (const curSite of siteList) {
    const visitByHours = getVisitByHours(curSite);
    retval.push(visitByHours);
  }
  return retval;
};

class DailySummary extends React.Component {
  constructor (props) {
    super(props);
    getRecordsByHours(this.props.recordList);
    this.state = {
      chartOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Daily sites visit',
          style: {
            color: '#274b6d',
            fontSize: '14px'
          }
        },
        xAxis: {
          categories: getHourList()
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Time spent in minutes',
            style: {
              color: '#274b6d',
              fontSize: '12px'
            }
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: ( // theme
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
              ) || 'gray'
            }
          }
        },
        legend: {
          layout: 'horizontal',
          maxHeight: 80,
          alignColumns: false
        },
        tooltip: {
          formatter: function () {
            const duration = `${this.point.y.toFixed(0)}m`;
            return `${this.series.name} <br/> Time spent : <b> ${duration} </b> `;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: getRecordsByHours(this.props.recordList)
      }
    };
  }
  render () {
    return (
      <div className={`row`}>
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state.chartOptions}
        />
      </div>
    );
  }
}

DailySummary.propTypes = {
  recordList: PropTypes.array
};

export default DailySummary;
