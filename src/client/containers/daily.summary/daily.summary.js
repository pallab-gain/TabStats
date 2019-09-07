import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Loading from '../loading/loading';

import styles from './daily.summary.css';

class DailySummary extends React.Component {
  constructor (props) {
    super(props);
    this.onLoadingGraph = this.onLoadingGraph.bind(this);

    this.state = {
      isLoading: true,
      chartOptions: {
        chart: {
          type: 'column',
          events: {
            load: this.onLoadingGraph
          }
        },
        title: {
          text: this.props.pieChartDataTitles,
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
            stacking: 'normal'
          }
        },
        series: this.props.dailySummaryChartData
      }
    };
  }

  onLoadingGraph () {
    this.setState({
      isLoading: false
    });
  }

  render () {
    return (
      <div className={`row ${styles.container} text-center`}>
        {this.state.isLoading && <Loading/>}
        <span style={{ display: this.state.isLoading ? 'none' : 'block' }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.state.chartOptions}
          />
        </span>

      </div>
    );
  }
}

DailySummary.propTypes = {
  hourListInDays: PropTypes.array,
  dailySummaryChartData: PropTypes.array,
  pieChartDataTitles: PropTypes.string
};

export default DailySummary;
