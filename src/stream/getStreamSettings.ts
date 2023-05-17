import { promisifyOverwolf } from "../utils/overwolf-wrappers";

function getEncoderPriority(name: string) {
  switch (name) {
    case "NVIDIA_NVENC_NEW":
      return 4;
    case "AMD_AMF":
      return 3;
    case "Intel":
      return 2;
    case "X264":
      return 1;
    default:
      return 0;
  }
}
async function getVideoEncoder() {
  const encoderData = (await promisifyOverwolf(overwolf.streaming.getStreamEncoders)()
    .then(({ encoders }) => {
      return encoders
        ?.filter(({ valid }) => valid)
        ?.sort((a, b) => getEncoderPriority(b.name) - getEncoderPriority(a.name));
    })
  )
  return encoderData?.[0];
}

export async function getStreamSettings(): Promise<overwolf.streaming.StreamSettings> {
  const videoEncoder = await getVideoEncoder()
  const videoEncoderSettings = videoEncoder ? {
    name: videoEncoder.name,
    config: {
      preset: videoEncoder.presets[0],
      rateControl: videoEncoder.rateControls[0],
    }
  } : {

  };

  return {
    provider: 'VideoRecorder' as overwolf.streaming.enums.StreamingProvider,
    settings: {
      video: {
        fps: 30,
        encoder: videoEncoderSettings,
      },
      peripherals: {
        capture_mouse_cursor: 'both' as overwolf.streaming.enums.StreamMouseCursor,
      }

    }
  }
}
