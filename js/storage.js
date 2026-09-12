// storage.js
// Handles localStorage for user preferences

const Storage = {
    keys: {
        VOLUME: 'sunflower_volume',
        REPEAT: 'sunflower_repeat',
        SHUFFLE: 'sunflower_shuffle'
    },

    saveVolume(val) {
        localStorage.setItem(this.keys.VOLUME, val);
    },

    getVolume() {
        return parseInt(localStorage.getItem(this.keys.VOLUME) || '50', 10);
    },
    
    saveRepeat(val) {
        localStorage.setItem(this.keys.REPEAT, val ? 'true' : 'false');
    },
    
    getRepeat() {
        // Repeat OFF by default so songs advance naturally to next track
        return localStorage.getItem(this.keys.REPEAT) === 'true';
    },
    
    saveShuffle(val) {
        localStorage.setItem(this.keys.SHUFFLE, val ? '1' : '0');
    },
    
    getShuffle() {
        // Shuffle OFF by default
        return localStorage.getItem(this.keys.SHUFFLE) === '1';
    },

    getSongIndex() {
        return 0; // Always start with 0 on reload
    }
};
