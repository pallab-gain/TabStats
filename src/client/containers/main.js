'use strict';
import React from 'react';
import styles from './main.css';

import Loading from './loading/loading';
import Error from './error/error';
import PopupUI from './popup.ui/popup.ui';
const lo = require('lodash');

const db = require('../../extension/database');
class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: undefined,
      inProgress: true,
      recordList: []
    };
  }

  componentDidMount () {
    Promise.all([
      db.getRecords(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]).then(recordsList => {
      this.setState({
        error: false,
        inProgress: false,
        recordList: lo.first(recordsList)
      });
    }).catch(err => {
      this.setState({
        error: err,
        inProgress: false,
        recordList: []
      });
    });
  }

  render () {
    return (
      <div className={`container-fluid ${styles.container_div}`}>
        { this.state.inProgress && <Loading/> }
        { !this.state.inProgress && this.state.error && <Error/> }
        { !this.state.inProgress && !this.state.error && this.state.recordList.length > 0 && <PopupUI recordList={this.state.recordList}/> }
      </div>
    );
  }
}
export default Main;
