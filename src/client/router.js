import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Main from './containers/main';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" name="home" component={Main}/>
    </BrowserRouter>
  );
};

export default AppRouter;
