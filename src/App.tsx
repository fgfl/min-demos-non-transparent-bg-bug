import React, { useEffect, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import BackgroundWindow from './BackgroundWindow';
import InGameWindow from './InGameWindow';
import DesktopWindow from './DesktopWindow';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {},
  loader: {
    background: 'red',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  }
}), { name: 'App' });

const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.loader}>
      <h1>Loading</h1>
    </div>
  );
}

const CurrentWindow = ({ windowName }: { windowName: string }) => {
  switch (windowName) {
    case 'background':
      return <BackgroundWindow />
    case 'in_game':
      return <InGameWindow />
    case 'desktop':
      return <DesktopWindow />
    default:
      return <Loader />;
  }
};

function App() {
  const [currentWindowName, setCurrentWindowName] = useState('');

  useEffect(() => {
    overwolf.windows.getCurrentWindow(result => {
      setCurrentWindowName(result.window.name);
    })
  }, []);

  return (
    <CurrentWindow windowName={currentWindowName} />
  );
}

export default App;
