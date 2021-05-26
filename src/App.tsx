import './App.css';

import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  app: {
    visibility: 'hidden',
    width: '100vw',
    height:' 100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    '&$show': {
      visibility: 'visible',
    }
  },
  box: {
    width: '100px',
    height: '100px',
    backgroundColor: 'aqua',
  },
  show: {},
}))

function App() {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  const toggleVisibility = useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  useEffect(() => {
    const hotkeyListener = (event: overwolf.settings.hotkeys.OnPressedEvent) => {
      if (event.name === 'toggle_ingame') {
        toggleVisibility();
      }
    };

    overwolf.settings.hotkeys.onPressed.addListener(hotkeyListener);
    return () => overwolf.settings.hotkeys.onPressed.removeListener(hotkeyListener);
  }, [toggleVisibility]);

  return (
    <div id='App' className={classNames(classes.app, { [classes.show]: show })}>
      <div className={classes.box}></div>
    </div>
  );
}

export default App;
