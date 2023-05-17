import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { testSteamSettings } from './stream/constant';
import { getStreamSettings } from './stream/getStreamSettings';

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

  const [streamId, setStreamId] = useState<number>();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const streamStartListener = (event: overwolf.streaming.StreamEvent) => {
      setStarted(true);
    };

    overwolf.streaming.onStartStreaming.addListener(streamStartListener);
    return () => {
      overwolf.streaming.onStartStreaming.removeListener(streamStartListener);
    }
  })

  const handleStartStream = useMemo(() => async () => {
    if (streamId) {
      return;
    }
    const setting = await getStreamSettings();
    console.log('Stream setting:', JSON.stringify(setting, null, 1));
    overwolf.streaming.start(
      setting,
      (result) => {
        console.log('start stream:', result);
        setStreamId(result.stream_id);
      },
    );
  }, [streamId]);

  const handleStopStream = useCallback(() => {
    if (streamId === undefined) {
      return;
    }
    overwolf.streaming.stop(streamId, (result) => {
      setStreamId(undefined);
      setStarted(false);
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
        <h3>Stream id: {started ? streamId : null}</h3>
      </div>
    </div>
  );
}

export default React.memo(InGameWindow);
