import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface InGameWindowOwnProps {
  className?: string;
}

type InGameWindowProps = InGameWindowOwnProps;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
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
}), { name: 'InGameWindow' });

function InGameWindow(props: InGameWindowProps) {
  const classes = useStyles(props);
  const { className } = props;

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
    <div id='App' className={classNames(classes.root, { [classes.show]: show })}>
      <div className={classes.box}></div>
    </div>
  );
}

export default React.memo(InGameWindow);
