import React from 'react';
import PropTypes from 'prop-types';
import PIEChart from '../pie.chart/pie.chart';

import OptionText from './option.text/option';
import styles from './popup.ui.css';
import TopFive from '../top.5/top.5';

const lo = require('lodash');
const options = ['Default', 'Top 5', 'Daily summary'];

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
                <div key={`${curOption}-${indx}`} className={`col-sm-4 text-center`}>
                  { curOption && this.state.selected && <OptionText
                    text={curOption}
                    isSelected={getIsSelected(this.state.selected, curOption)}
                    onSelectionChange={this.onSelectionChange}/> }
                </div>
              ))
            }
          </div>
        </div>

        <div className={`col-sm-12`}>
          { this.state.selected === lo.get(options, 0) && <PIEChart recordList={this.props.recordList}/>}
          { this.state.selected === lo.get(options, 1) && <TopFive recordList={this.props.recordList}/>}
        </div>

      </div>
    );
  }
}

PopupUI.propTypes = {
  recordList: PropTypes.array
};

export default PopupUI;
