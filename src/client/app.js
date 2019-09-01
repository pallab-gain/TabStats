import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import AppStore from './store';
import Main from './containers/main';

class App extends React.Component {
  render () {
    return (
      <Provider store={AppStore}>
        <IntlProvider locale="en">
          <Main/>
        </IntlProvider>
      </Provider>
    );
  }
}

export default App;
