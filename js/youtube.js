// youtube.js
// Handles YouTube IFrame API with robust page-reload and async lifecycle support

let ytPlayer = null;
let ytPlayerReady = false;
let pendingAction = null;
let onPlayerStateChangeCallback = null;

// Function called by the YouTube IFrame API when it finishes loading
window.onYouTubeIframeAPIReady = function() {
    createYTPlayer();
};

function createYTPlayer() {
    // If player instance already exists, do not duplicate
    if (ytPlayer) return;

    // Check if the container element is in the DOM
    const container = document.getElementById('youtube-player-container');
    if (!container) return;

    try {
        ytPlayer = new YT.Player('youtube-player-container', {
            height: '200',
            width: '200',
            videoId: siteConfig.music[0].youtubeId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'rel': 0,
                'modestbranding': 1,
                'playsinline': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch (err) {
        console.error("Error creating YouTube player:", err);
    }
}

// Fallback in case YouTube IFrame API is already loaded in browser cache on page reload
if (typeof YT !== 'undefined' && YT && YT.Player) {
    createYTPlayer();
} else if (typeof YT !== 'undefined' && YT && typeof YT.ready === 'function') {
    YT.ready(createYTPlayer);
}

function onPlayerError(event) {
    console.error("YouTube Player Error:", event.data);
    document.dispatchEvent(new CustomEvent('ytPlayerError', { detail: event.data }));
}

function onPlayerReady(event) {
    ytPlayerReady = true;
    try {
        event.target.setVolume(Storage.getVolume());
    } catch (e) {}

    // If user clicked "Open This Little Surprise" before the player was ready, execute immediately
    if (pendingAction) {
        const action = pendingAction;
        pendingAction = null;
        try {
            action();
        } catch (e) {
            console.error("Error executing pending YouTube action:", e);
        }
    }

    document.dispatchEvent(new CustomEvent('ytPlayerReady'));
}

function onPlayerStateChange(event) {
    if (onPlayerStateChangeCallback) {
        const duration = (ytPlayer && ytPlayer.getDuration) ? ytPlayer.getDuration() : 0;
        onPlayerStateChangeCallback(event.data, duration);
    }
}

const YouTubeIntegration = {
    play() {
        if (this.isReady()) {
            ytPlayer.playVideo();
        } else {
            pendingAction = () => {
                if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
            };
        }
    },
    
    pause() {
        pendingAction = null;
        if (this.isReady() && ytPlayer.pauseVideo) {
            ytPlayer.pauseVideo();
        }
    },
    
    loadSong(youtubeId) {
        if (this.isReady()) {
            try {
                ytPlayer.loadVideoById({
                    videoId: youtubeId,
                    startSeconds: 0
                });
            } catch (e) {
                ytPlayer.loadVideoById(youtubeId);
            }
            setTimeout(() => {
                try {
                    if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
                } catch (e) {}
            }, 100);
        } else {
            pendingAction = () => {
                if (ytPlayer && ytPlayer.loadVideoById) {
                    try {
                        ytPlayer.loadVideoById({
                            videoId: youtubeId,
                            startSeconds: 0
                        });
                    } catch (e) {
                        ytPlayer.loadVideoById(youtubeId);
                    }
                    setTimeout(() => {
                        try {
                            if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
                        } catch (e) {}
                    }, 100);
                }
            };
        }
    },
    
    cueSong(youtubeId) {
        if (this.isReady()) {
            ytPlayer.cueVideoById(youtubeId);
        } else {
            pendingAction = () => {
                if (ytPlayer && ytPlayer.cueVideoById) ytPlayer.cueVideoById(youtubeId);
            };
        }
    },
    
    setVolume(volume) {
        if (this.isReady() && ytPlayer.setVolume) {
            ytPlayer.setVolume(volume);
        }
    },
    
    getCurrentTime() {
        if (this.isReady() && ytPlayer.getCurrentTime) {
            return ytPlayer.getCurrentTime();
        }
        return 0;
    },
    
    seekTo(seconds) {
        if (this.isReady() && ytPlayer.seekTo) {
            ytPlayer.seekTo(seconds, true);
        }
    },
    
    setCallback(cb) {
        onPlayerStateChangeCallback = cb;
    },

    isReady() {
        return ytPlayerReady && ytPlayer && typeof ytPlayer.loadVideoById === 'function';
    }
};

window.YouTubeIntegration = YouTubeIntegration;
