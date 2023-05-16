import React, { useCallback, useEffect } from 'react';

interface BackgroundWindowOwnProps {
  className?: string;
}

type BackgroundWindowProps = BackgroundWindowOwnProps;

function BackgroundWindow(props: BackgroundWindowProps) {
  // game running / in game window
  const handleGameNotRunning = useCallback(() => {
    overwolf.windows.close('in_game');
  }, []);

  const handleGameRunning = useCallback(() => {
    overwolf.windows.obtainDeclaredWindow('in_game', () => {
      overwolf.windows.restore('in_game');
    });
  }, []);

  useEffect(() => {
    overwolf.games.getRunningGameInfo(gameInfo => {
      console.log('gameInfo:', gameInfo);
      if (gameInfo?.isRunning) {
        handleGameRunning();
      } else {
        handleGameNotRunning();
      }
    })
  }, [handleGameNotRunning, handleGameRunning]);

  useEffect(() => {
    const gameLaunchListener = (event: overwolf.games.GameInfoUpdatedEvent) => {
      if (event.gameInfo?.isRunning) {
        handleGameRunning();
      } else {
        handleGameNotRunning();
      }
    };

    overwolf.games.onGameInfoUpdated.addListener(gameLaunchListener);
    return () => overwolf.games.onGameInfoUpdated.removeListener(gameLaunchListener);
  }, [handleGameNotRunning, handleGameRunning]);

  // desktop window
  useEffect(() => {
    overwolf.windows.obtainDeclaredWindow('desktop', () => {
      overwolf.windows.restore('desktop');
    });
  }, [])

  return null;
}

export default React.memo(BackgroundWindow);
