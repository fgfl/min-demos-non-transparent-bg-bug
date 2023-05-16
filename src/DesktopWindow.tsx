import { Theme, createStyles, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from './hooks/useDrag';

interface DesktopWindowOwnProps {
  className?: string;
}

type DesktopWindowProps = DesktopWindowOwnProps;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    background: 'white',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  video: {
    border: '1px solid red',
    background: 'black',
    height: 200,
  },
}), { name: 'DesktopWindow' });

function DesktopWindow(props: DesktopWindowProps) {
  const classes = useStyles(props);
  const { className } = props;

  const { onDragStart, onMouseMove } = useDrag('desktop');

  // video
  const vidRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>();
  const vidRef2 = useRef<HTMLVideoElement>(null);
  const [src2, setSrc2] = useState<string>();

  useEffect(() => {
    const streamStopListener = (event: overwolf.streaming.StopStreamingEvent) => {
      setSrc(event.file_path);
      window.setTimeout(() => {
        setSrc2(event.file_path);
      }, 5000);
    };

    overwolf.streaming.onStopStreaming.addListener(streamStopListener);
    return () => {
      overwolf.streaming.onStopStreaming.removeListener(streamStopListener);
    }
  })

  const handleReady = useCallback(() => {
    console.log('Can play video.');
  }, []);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('video error:', event.currentTarget?.error?.code, event.currentTarget?.error?.message)
  }, []);

  return (
    <div
    className={classNames(classes.root, className)}
    onMouseDown={onDragStart}
    onMouseMove={onMouseMove}
    >
      <h1>Desktop Window</h1>

      <h2>Video 1</h2>
      <p>src: {src}</p>
      <p>Error: {vidRef?.current?.error?.code} {vidRef?.current?.error?.message}</p>
      <video
      ref={vidRef}
      src={src}
      onError={handleError}
      onCanPlay={handleReady}
      className={classes.video}
      />

      <h2>Video 2</h2>
      <p>src: {src2}</p>
      <p>Error: {vidRef2?.current?.error?.code} {vidRef2?.current?.error?.message}</p>
      <video
      ref={vidRef2}
      src={src2}
      onError={handleError}
      onCanPlay={handleReady}
      className={classes.video}
      />
    </div>
  );
}

export default React.memo(DesktopWindow);
