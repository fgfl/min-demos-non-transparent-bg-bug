import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { testSteamSettings } from './stream/constant';

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

  const [show, setShow] = useState(true);

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

  const [streamId, setStreamId] = useState<number>()

  const handleStartStream = useCallback(() => {
    overwolf.streaming.start(
      testSteamSettings,
    (result) => {
      console.log('start stream:', result);
      setStreamId(result.stream_id)
    });
  }, []);

  const handleStopStream = useCallback(() => {
    if (streamId === undefined) {
      return;
    }
    overwolf.streaming.stop(streamId, (result) => {

    })
  }, [streamId]);

  return (
    <div id='InGameWindow' className={classNames(classes.root, { [classes.show]: show })}>
      <div className={classes.box}>
        <button onClick={handleStartStream}>
          start
        </button>
        <button onClick={handleStopStream}>
          stop
        </button>
      </div>
    </div>
  );
}

export default React.memo(InGameWindow);
