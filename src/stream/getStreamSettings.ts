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

async function getDefaultAudioDeviceIds() {
  return await promisifyOverwolf(overwolf.streaming.getAudioDevices)()
    .then(({ default_recording_device_id, default_playback_device_id }) => ({
      default_recording_device_id,
      default_playback_device_id,
    }))
};

export async function getStreamSettings(): Promise<overwolf.streaming.StreamSettings> {
  const videoEncoder = await getVideoEncoder()
  const videoEncoderSettings = videoEncoder ? {
    name: videoEncoder.name,
    config: {
      preset: videoEncoder.presets[0],
      rateControl: videoEncoder.rateControls[0],
    }
  } : {};

  const audioDevices = await getDefaultAudioDeviceIds();

  return {
    provider: 'VideoRecorder' as overwolf.streaming.enums.StreamingProvider,
    settings: {
      audio: {
        game: {
          volume: 100,
          enable: true,
          device_id: audioDevices.default_playback_device_id,
          filtered_capture: {
            enable: true,
            additional_process_names: [],
          }
        },
        mic: {
          volume: 100,
          enable: true,
          device_id: audioDevices.default_recording_device_id,
        },
      },
      video: {
        fps: 30,
        height: 1080,
        width: 1920,
        encoder: videoEncoderSettings,
      },
      peripherals: {
        capture_mouse_cursor: 'both' as overwolf.streaming.enums.StreamMouseCursor,
      }

    }
  }
}
