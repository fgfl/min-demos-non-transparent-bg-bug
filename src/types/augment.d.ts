declare namespace overwolf {
  declare namespace windows {
    interface WindowInfo extends overwolf.windows.WindowInfo {
      dpiScale: number;
      logicalBounds: {
        top: number;
        left: number;
        width: number;
        height: number;
      };
    }

    function getWindow(windowName: string, callback: (result: overwolf.windows.WindowResult) => void)
  }
}
