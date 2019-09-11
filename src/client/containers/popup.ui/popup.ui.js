import React from 'react';
import PropTypes from 'prop-types';
import PIEChart from '../pie.chart/pie.chart';

import OptionText from './option.text/option';
import styles from './popup.ui.css';
import TopVisit from '../top.visit/top.visit';
import DailySummary from '../daily.summary/daily.summary';
import WordCloud from '../word.cloud.chart/word.cloud';

const lo = require('lodash');
const topVisitCount = 7;
const options = ['Default', `Top ${topVisitCount}`, 'Daily summary', 'Word Cloud'];

const getIsSelected = (prvOption, curOption) => {
  return prvOption === curOption;
};
class PopupUI extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selected: lo.first(options)
    };
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  onSelectionChange (selected) {
    this.setState({
      selected: selected
    });
  }

  render () {
    return (
      <div className={`row`}>
        <div className={`col-sm-12 ${styles.options_div}`}>
          <div className={`row`}>
            {
              options.map((curOption, indx) => (
                <div key={`${curOption}-${indx}`} className={`col-sm-3 text-center pl-0 pr-0 ml-0 mr-0`}>
                  <OptionText
                    text={curOption}
                    isSelected={getIsSelected(this.state.selected, curOption)}
                    onSelectionChange={this.onSelectionChange}/>
                </div>
              ))
            }
          </div>
        </div>

        <div className={`col-sm-12`}>
          { this.state.selected === lo.get(options, 0) &&
          <PIEChart
            pieChartData={lo.get(this.props, 'records.pieChartData', [])}
            pieChartDataTitles={lo.get(this.props, 'records.pieChartDataTitles', '')}
          />}
          { this.state.selected === lo.get(options, 1) &&
          <TopVisit recordList={lo.get(this.props, 'records.recordList', [])}
            totalCount={topVisitCount}/>}
          { this.state.selected === lo.get(options, 2) &&
          <DailySummary dailySummaryChartData={lo.get(this.props, 'records.dailySummaryChartData', [])}
            hourListInDays={lo.get(this.props, 'records.hourListInDays', [])}
            pieChartDataTitles={lo.get(this.props, 'records.pieChartDataTitles', '')}/>}

          { this.state.selected === lo.get(options, 3) &&
          <WordCloud wordCloudChartData={lo.get(this.props, 'records.wordCloudChartData', [])}
            pieChartDataTitles={lo.get(this.props, 'records.pieChartDataTitles', '')}/>}
        </div>

      </div>
    );
  }
}

PopupUI.propTypes = {
  records: PropTypes.object
};

export default PopupUI;
