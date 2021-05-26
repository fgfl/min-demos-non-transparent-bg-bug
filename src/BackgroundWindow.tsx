import classNames from 'classnames';
import React, { useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface BackgroundWindowOwnProps {
  className?: string;
}

type BackgroundWindowProps = BackgroundWindowOwnProps;

function BackgroundWindow(props: BackgroundWindowProps) {
  const handleGameNotRunning = () => {
    overwolf.windows.close('in_game');
  };

  const handleGameRunning = () => {
    overwolf.windows.obtainDeclaredWindow('in_game', () => {
      overwolf.windows.restore('in_game');
    });
  };

  useEffect(() => {
    overwolf.games.getRunningGameInfo(gameInfo => {
      console.log('gameInfo:', gameInfo);
      if (gameInfo?.isRunning) {
        handleGameRunning();
      } else {
        handleGameNotRunning();
      }
    })
  }, []);

  useEffect(() => {
    const gameLaunchListener = (event: overwolf.games.RunningGameInfo) => {
      if (event.isRunning) {
        handleGameRunning();
      } else {
        handleGameNotRunning();
      }
    };

    overwolf.games.onGameLaunched.addListener(gameLaunchListener);
    return () => overwolf.games.onGameLaunched.removeListener(gameLaunchListener);
  }, []);

  return null;
}

export default React.memo(BackgroundWindow);
