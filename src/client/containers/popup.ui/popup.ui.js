import React from 'react';
import PropTypes from 'prop-types';
import PIEChart from '../pie.chart/pie.chart';

import OptionText from './option.text/option';
import styles from './popup.ui.css';

const lo = require('lodash');

const options = ['Default', 'Top 5', 'Daily summary'];
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
                  <OptionText text={curOption}
                    selected={this.state.selected === curOption}
                    onSelectionChange={this.onSelectionChange}/>
                </div>
              ))
            }
          </div>
        </div>

        <div className={`col-sm-12`}>
          { this.state.selected === lo.get(options, 0) && <PIEChart recordList={this.props.recordList}/>}
        </div>

      </div>
    );
  }
}

PopupUI.propTypes = {
  recordList: PropTypes.array
};

export default PopupUI;
