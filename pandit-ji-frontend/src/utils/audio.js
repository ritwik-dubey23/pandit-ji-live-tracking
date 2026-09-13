// Web Audio API Synthesized Audio Player with HTML5 Fallback & Deduplication

const playedNotificationIds = new Set();
let audioContext = null;

export const isSoundEnabled = () => {
    const pref = localStorage.getItem("pandit_ji_sound_enabled");
    return pref === null ? true : pref === "true";
};

export const setSoundEnabled = (enabled) => {
    localStorage.setItem("pandit_ji_sound_enabled", enabled ? "true" : "false");
};

export const playNotificationSound = (notificationId = null) => {
    if (!isSoundEnabled()) {
        console.log("[AUDIO] Sound disabled in settings");
        return false;
    }

    if (notificationId) {
        if (playedNotificationIds.has(notificationId)) {
            console.log(`[AUDIO DUP] Sound already played for notification ID: ${notificationId}`);
            return false;
        }
        playedNotificationIds.add(notificationId);
        if (playedNotificationIds.size > 200) {
            const first = playedNotificationIds.values().next().value;
            playedNotificationIds.delete(first);
        }
    }

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;

        if (!audioContext) {
            audioContext = new AudioCtx();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const now = audioContext.currentTime;

        // Dual-Tone Pleasant Chime (880Hz A5 -> 1046.5Hz C6)
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc1.type = "sine";
        osc2.type = "sine";

        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12);

        osc2.frequency.setValueAtTime(1318.5, now + 0.12); // E6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);

        osc1.start(now);
        osc1.stop(now + 0.18);

        osc2.start(now + 0.12);
        osc2.stop(now + 0.35);

        return true;
    } catch (err) {
        console.warn("[AUDIO ERROR] Audio playback failed:", err.message);
        return false;
    }
};
