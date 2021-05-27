import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, createStyles, CssBaseline, Theme, ThemeProvider, withStyles } from '@material-ui/core';

import App from './App';

const TransparentBg = withStyles((theme: Theme) => createStyles({
  body: {
    backgroundColor: 'transparent',
  },
}))(() => null);

const theme = createMuiTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <TransparentBg />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
