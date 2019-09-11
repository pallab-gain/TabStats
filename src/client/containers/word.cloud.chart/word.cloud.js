import React from 'react';
import PropTypes from 'prop-types';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import wordCloud from 'highcharts/modules/wordcloud.js';

import Loading from '../loading/loading';
import styles from './word.cloud.css';
import { toHumanReadableDuration } from '../../utils/utils';

class WordCloud extends React.Component {
  constructor (props) {
    super(props);
    wordCloud(Highcharts);

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
        tooltip: {
          formatter: function () {
            const duration = toHumanReadableDuration(this.point.weight);
            return `${this.point.name} <br/> Time spent : <b> ${duration} </b> `;
          }
        },
        series: [{
          type: 'wordcloud',
          data: this.props.wordCloudChartData
        }]
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

WordCloud.propTypes = {
  wordCloudChartData: PropTypes.array,
  pieChartDataTitles: PropTypes.string
};

export default WordCloud;
