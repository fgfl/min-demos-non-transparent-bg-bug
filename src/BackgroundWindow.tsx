import React, { useCallback, useEffect } from 'react';
import { DESKTOP_MIN_HEIGHT, WINDOWS_DEFAULT_DPI } from './constants';
import { promisifyOverwolf } from './utils/overwolf-wrappers';

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

  useEffect(() => {
    // Adjust the desktop window min size when the monitor's scale/resolution changes
    // or when the desktop window is moved to a different monitor.
    // Do this to prevent the desktop window from being too big to fit on the screen.
    // Also need to show less ads if the window is too small.
    let timeout: number;
    const listener  = async (event: overwolf.windows.onScreenPropertyChangedEvent) => {
      const { monitor, name } = event;
      if (name === 'desktop') {
        // `event.window.dpiScale` refers to the value before it was moved to the new monitor or before the screen resolution/scale change.
        // So we need to calculate the scale ourselves.
        const monitorScale = monitor.dpiY / WINDOWS_DEFAULT_DPI;
        const monitorVirtualHeight = monitor.height / monitorScale;
        const taskbarHeight = 48;

        const { window: desktop } = await promisifyOverwolf(overwolf.windows.getWindow)('desktop');
        if (!desktop) {
          return;
        }

        const minHeight = Object.entries(DESKTOP_MIN_HEIGHT).reduce((minHeight, [key, height]) => {
          if (monitorVirtualHeight - taskbarHeight < minHeight) {
            minHeight = height;
          }
          return minHeight;
        }, DESKTOP_MIN_HEIGHT.default);
        const minSizeRes = await promisifyOverwolf(overwolf.windows.setMinSize)('desktop', 1212, minHeight);
        console.log('minSizeRes:', JSON.stringify(minSizeRes, null, 2));

      console.log('screen change event:', JSON.stringify(event, null, 2), JSON.stringify(desktop, null, 2), 'minHeight:', minHeight);
      // TODO: need to fix below. size not changing
        if (desktop.logicalBounds.height >= monitorVirtualHeight - taskbarHeight) {
          promisifyOverwolf((changeSizeParams: overwolf.windows.ChangeWindowSizeParams, callback: overwolf.CallbackFunction<overwolf.Result>) => {
            overwolf.windows.changeSize(changeSizeParams, callback);
          })({
            window_id: 'desktop',
            width: desktop.logicalBounds.width,
            height: minHeight,
            auto_dpi_resize: true
          })
            .then((res) => {
              console.log('change size res:', JSON.stringify(res, null, 2));
            });

          // timeout = window.setTimeout(() => desktopWindow.changeSize(desktop.logicalBounds.width, minHeight)
          //   .then((res) => {
          //     console.log('change size res:', JSON.stringify(res, null, 2));
          //   }),
          //   1000);
        }
      }
    };

    overwolf.windows.onScreenPropertyChanged.addListener(listener);
    return () => {
      overwolf.windows.onScreenPropertyChanged.removeListener(listener);
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}

export default React.memo(BackgroundWindow);
