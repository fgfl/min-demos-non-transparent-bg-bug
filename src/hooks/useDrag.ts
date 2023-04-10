import { useCallback, useState } from "react";

export function useDrag(_windowId: string) {
  const [windowId, setWindowId] = useState<string>(_windowId);
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const onDragStart = useCallback((event: React.MouseEvent) => {
    setMouseDown(true);
  }, [])

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!mouseDown) {
      return;
    }
    setMouseDown(false);

    overwolf.windows.dragMove(windowId);
  }, [mouseDown, windowId])

  return {
    onDragStart,
    onMouseMove,
  } as const;
}
