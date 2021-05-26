import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { createStyles, Theme, withStyles } from '@material-ui/core';

import App from './App';

const TransparentBg = withStyles((theme: Theme) => createStyles({
  body: {
    backgroundColor: 'transparent',
  },
}))(() => null);

ReactDOM.render(
  <React.StrictMode>
    <TransparentBg />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
