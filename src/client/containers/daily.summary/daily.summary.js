import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

class DailySummary extends React.Component {
  constructor (props) {
    super(props);
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
          categories: this.props.hourListInDays
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
        series: this.props.dailySummaryChartData
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
  hourListInDays: PropTypes.array,
  dailySummaryChartData: PropTypes.array
};

export default DailySummary;
