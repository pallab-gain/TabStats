'use strict';
import React from 'react';
import styles from './main.css';

import PIEChart from './pie.chart/pie.chart';
import Loading from './loading/loading';
import Error from './error/error';

// eslint-disable-next-line no-unused-vars
const db = require('../../extension/database');

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: false,
      recordList: []
    };
  }
  componentDidMount () {
    console.log('component did mount');
    db.getRecords().then(_recordsList => {
      this.setState({
        error: false,
        recordList: _recordsList
      });
    }).catch(err => {
      this.setState({
        error: err,
        recordList: []
      });
    });
  }

  render () {
    return (
      <div className={`container ${styles.container_div}`}>
        {this.state.error &&
          <Error error={this.state.error}/>}
        {!this.state.error && this.state.recordList.length < 1 &&
          <Loading/>}
        {!this.state.error && this.state.recordList.length > 0 &&
          <PIEChart recordList={this.state.recordList}/>}
      </div>
    );
  }
}
export default Main;
