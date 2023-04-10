import { Theme, createStyles, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
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
}), { name: 'DesktopWindow' });

function DesktopWindow(props: DesktopWindowProps) {
  const classes = useStyles(props);
  const { className } = props;

  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    console.log('width: ', width, 'height: ', height)
  }, [height, width])

  const { onDragStart, onMouseMove } = useDrag('desktop');

  return (
    <div
    ref={ref}
    className={classNames(classes.root, className)}
    onMouseDown={onDragStart}
    onMouseMove={onMouseMove}
    >
      <h1>Desktop Window</h1>
      <p>Width: {width}</p>
      <p>Height: {height}</p>
    </div>
  );
}

export default React.memo(DesktopWindow);
