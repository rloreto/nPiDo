/* global VERSION */
import React from 'react';
import App from 'react-toolbox/lib/app';
import AppBarToolbox from 'react-toolbox/lib/app_bar';
import ButtonToolbox from 'react-toolbox/lib/button';

import Test from  './components/test';


import style from './style';

const _hrefProject = () => {
  window.href = 'http://react-toolbox';
};

const Root = () => (
  <App className={style.app}>
    <AppBarToolbox fixed flat className={style.appbar}>
      <h1>React Toolbox <small>Spec</small></h1>
      <ButtonToolbox
        accent
        className={style.github}
        icon='web'
        floating
        onClick={_hrefProject}
      />
    </AppBarToolbox>
    <Test/>
  </App>
);

export default Root;
