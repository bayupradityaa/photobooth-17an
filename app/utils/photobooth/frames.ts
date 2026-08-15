import type { FrameConfig } from "./types";

export const FRAMES_CONFIG: FrameConfig[] = [
  {
    id: "mock-frame-default",
    name: "Classic 4-Strip",
    // 1x1 transparent pixel as frame overlay (no visible frame)
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    canvasWidth: 600,
    canvasHeight: 1800,
    slots: [
      { x: 50, y: 50, width: 500, height: 350 },
      { x: 50, y: 450, width: 500, height: 350 },
      { x: 50, y: 850, width: 500, height: 350 },
      { x: 50, y: 1250, width: 500, height: 350 }
    ],
    watermark: {
      logo: "",
      text: "PHOTOBOOTH",
      position: "bottom-global"
    }
  }
];
