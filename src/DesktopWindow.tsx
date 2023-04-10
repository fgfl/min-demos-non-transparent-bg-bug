import { Theme, createStyles, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';

interface DesktopWindowOwnProps {
  className?: string;
}

type DesktopWindowProps = DesktopWindowOwnProps;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    background: 'white',
    width: '100%',
    height: '100%',
  },
}), { name: 'DesktopWindow' });

function DesktopWindow(props: DesktopWindowProps) {
  const classes = useStyles(props);
  const { className } = props;

  const { width, height, ref } = useResizeDetector();

  return (
    <div ref={ref} className={classNames(classes.root, className)}>
      <h1>Desktop Window</h1>
      <p>Width: {width}</p>
      <p>Height: {height}</p>
    </div>
  );
}

export default React.memo(DesktopWindow);
