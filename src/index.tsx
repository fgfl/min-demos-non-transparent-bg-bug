import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, createStyles, CssBaseline, Theme, ThemeProvider, withStyles } from '@material-ui/core';

import App from './App';

const TransparentBg = withStyles((theme: Theme) => createStyles({
  '@global': {
    body: {
      backgroundColor: 'transparent',
    },
  },
}))(() => null);

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

// Can override the background colour using the above theme or use the default theme below

// const = createMuiTheme();

// and have the `TransparentBg` component override the background color

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline />
      {/* <TransparentBg /> */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
