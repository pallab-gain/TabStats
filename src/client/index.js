import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import intl from 'intl';

// apply polyfill
if (!window.Intl) {
  window.Intl = intl;
}

ReactDOM.render(<App/>, document.getElementById('reactbody'));
