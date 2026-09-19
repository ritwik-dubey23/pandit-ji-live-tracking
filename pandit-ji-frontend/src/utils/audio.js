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

const playedBookingConfirmationIds = new Set();

export const playBookingConfirmationSound = (bookingId) => {
    if (!bookingId) return false;

    if (playedBookingConfirmationIds.has(bookingId)) {
        console.log(`[AUDIO DUP GUARD] Confirmation sound already played for booking: ${bookingId}`);
        return false;
    }

    playedBookingConfirmationIds.add(bookingId);

    try {
        const audio = new Audio("/booking-confirmed.mp3");
        audio.volume = 1.0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("[AUDIO PLAYBACK WARN] HTML5 Audio autoplay prevented by browser:", err.message);
                // Web Audio API synth fallback if HTML5 Audio autoplay blocked
                playNotificationSound(bookingId);
            });
        }
        return true;
    } catch (err) {
        console.warn("[AUDIO ERROR] Failed to play booking confirmation sound:", err.message);
        return false;
    }
};

const playedArrivalIds = new Set();

let repeatingArrivalInterval = null;
let activeArrivalBookingId = null;
let currentArrivalAudioInstance = null;

export const playPanditArrivedAudioOnce = () => {
    try {
        if (currentArrivalAudioInstance) {
            currentArrivalAudioInstance.pause();
            currentArrivalAudioInstance.currentTime = 0;
        }
        const audio = new Audio("/pandit-arrived.mp3");
        audio.volume = 1.0;
        currentArrivalAudioInstance = audio;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("[AUDIO WARN] HTML5 Audio play prevented by browser:", err.message);
                playNotificationSound("arrival_fallback");
            });
        }
        return true;
    } catch (err) {
        console.warn("[AUDIO ERROR] Failed to play arrival audio:", err.message);
        return false;
    }
};

export const startRepeatingArrivalSound = (bookingId = null) => {
    if (!isSoundEnabled()) return false;
    const bId = bookingId || "default";

    if (activeArrivalBookingId === bId && repeatingArrivalInterval) {
        console.log(`[AUDIO REPEAT] Arrival alert already repeating for booking: ${bId}`);
        return false;
    }

    stopRepeatingArrivalSound();
    activeArrivalBookingId = bId;

    playPanditArrivedAudioOnce();

    repeatingArrivalInterval = setInterval(() => {
        playPanditArrivedAudioOnce();
    }, 6000);

    return true;
};

export const stopRepeatingArrivalSound = () => {
    if (repeatingArrivalInterval) {
        clearInterval(repeatingArrivalInterval);
        repeatingArrivalInterval = null;
    }
    if (currentArrivalAudioInstance) {
        try {
            currentArrivalAudioInstance.pause();
            currentArrivalAudioInstance.currentTime = 0;
        } catch (e) {
            console.warn("Error pausing arrival audio:", e);
        }
        currentArrivalAudioInstance = null;
    }
    activeArrivalBookingId = null;
};

export const playPanditArrivedSound = (id = null) => {
    return startRepeatingArrivalSound(id);
};

export const playChatMessageSentSound = () => {
    if (!isSoundEnabled()) return;
    try {
        const audio = new Audio("/message-notification.wav");
        audio.volume = 0.6;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("[AUDIO WARN] Sent message sound fallback to synth:", err.message);
                playSynthMessageSentSound();
            });
        }
    } catch (err) {
        playSynthMessageSentSound();
    }
};

export const playChatMessageReceivedSound = () => {
    if (!isSoundEnabled()) return;
    try {
        const audio = new Audio("/message-notification.wav");
        audio.volume = 1.0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("[AUDIO WARN] Received message sound fallback to synth:", err.message);
                playSynthMessageReceivedSound();
            });
        }
    } catch (err) {
        playSynthMessageReceivedSound();
    }
};

const playSynthMessageSentSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    } catch (err) {
        console.warn("Synth sent sound error:", err);
    }
};

const playSynthMessageReceivedSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    } catch (err) {
        console.warn("Synth received sound error:", err);
    }
};


