import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

// eslint-disable-next-line no-unused-vars
import { toHumanReadableDuration } from '../../utils/utils';
const HighChartEntry = require('../../../extension/highchart.entry');

const getTitle = (recordList = []) => {
  const totalDurationInSecond = recordList.reduce(
    (accumulator, record) => accumulator + record.totalTimeInSec, 0);
  const duration = toHumanReadableDuration(totalDurationInSecond);

  return `You spent total ${duration}`;
};

const getHighChartData = (recordList = []) => {
  const totalDurationInSecond = recordList.reduce(
    (accumulator, record) => accumulator + record.totalTimeInSec, 0);

  const chartData = recordList.map(item => {
    const { title, totalTimeInSec } = item;
    const percentage = (100.0 * totalTimeInSec) / totalDurationInSecond;
    return HighChartEntry(title, totalTimeInSec, percentage);
  });
  return chartData;
};

class PIEChart extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      chartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: getTitle(this.props.recordList),
          style: {
            color: '#274b6d',
            fontSize: '14px'
          }
        },
        tooltip: {
          formatter: function () {
            const duration = toHumanReadableDuration(this.point.totalTimeInSec);
            const percentage = this.point.y.toFixed(2);
            return `${this.point.name} <br/> Time Spend : <b> ${duration} </b> <br/>Percentage: <b> ${percentage} % <b> <br/>`;
          }
        },
        legend: {
          layout: 'horizontal',
          maxHeight: 80,
          alignColumns: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Visit status',
          colorByPoint: true,
          data: getHighChartData(this.props.recordList)
        }]
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

PIEChart.propTypes = {
  recordList: PropTypes.array
};

export default PIEChart;
