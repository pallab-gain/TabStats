import React from 'react';
import PropTypes from 'prop-types';

class PIEChart extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      recordList: this.props.recordList
    };
  }

  render () {
    console.warn('->', this.props.recordList);
    return (
      <div className={`row`}>
        {`total record : ${this.state.recordList.length}`}
      </div>
    );
  }
}

PIEChart.propTypes = {
  recordList: PropTypes.array.isRequired
};

export default PIEChart;
