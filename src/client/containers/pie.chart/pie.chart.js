import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

import { toHumanReadableDuration } from '../../utils/utils';

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
          text: this.props.pieChartDataTitles,
          style: {
            color: '#274b6d',
            fontSize: '14px'
          }
        },
        tooltip: {
          formatter: function () {
            const duration = toHumanReadableDuration(this.point.totalTimeInSec);
            const percentage = this.point.y.toFixed(2);
            return `${this.point.name} <br/> Time spent : <b> ${duration} </b> <br/>Percentage: <b> ${percentage} % <b> <br/>`;
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
          data: this.props.pieChartData
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
  pieChartDataTitles: PropTypes.string,
  pieChartData: PropTypes.array
};

export default PIEChart;
