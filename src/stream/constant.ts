export const testSteamSettings: overwolf.streaming.StreamSettings = {
    provider: "VideoRecorder",
    settings: {
        audio: {
            game: {
                volume: 100,
                enable: true,
                device_id: "{0.0.0.00000000}.{bc179202-8665-441e-a071-acc2d5b8c9e1}",
                filtered_capture: {
                    enable: true,
                    additional_process_names: []
                }
            },
            mic: {
                volume: 100,
                enable: true,
                device_id: "{0.0.1.00000000}.{d27fa6de-14ee-4092-85c3-5852903ba300}"
            }
        },
        video: {
            auto_calc_kbps: false,
            buffer_length: 20000,
            include_full_size_video: true,
            notify_dropped_frames_ratio: 0.5,
            test_drop_frames_interval: 5000,
            indication_position: "None",
            indication_type: "NoIndication",
            enable_on_demand_split: true,
            keep_game_capture_on_lost_focus: true,
            max_kbps: 8000,
            encoder: {
                name: "AMD_AMF",
                config: {
                    preset: "SPEED",
                    rate_control: "RC_CBR"
                }
            },
            fps: 30,
            width: 1920,
            height: 1080,
            override_overwolf_setting: true,
            game_window_capture: {
                enable_when_available: true,
                capture_overwolf_windows: true
            }
        },
        peripherals: {
            capture_mouse_cursor: "both"
        }
    }
};
