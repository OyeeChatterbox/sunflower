class MusicPlayer {
    constructor() {
        this.container = document.getElementById('music-player');
        if (!this.container) return;

        this.songs = siteConfig.music;
        this.currentIndex = 0; // Khat is track 0
        this.isShuffle = Storage.getShuffle();
        this.isRepeat = Storage.getRepeat();
        this.isPlaying = false;
        this.duration = 0;
        this.shuffleQueue = [];
        this.progressInterval = null;
        this.isExpanded = false;
        this.isTransitioning = false;

        // UI Elements - Mini
        this.titleMini = document.getElementById('player-title');
        this.progressMini = document.getElementById('player-progress');
        this.timeCurrentMini = document.getElementById('player-time-current');
        this.timeTotalMini = document.getElementById('player-time-total');
        this.reelContainer = document.getElementById('cassette-reel');
        
        // Buttons - Mini
        this.playPauseBtnMini = document.getElementById('player-play-pause');
        this.expandBtn = document.getElementById('player-expand-btn');
        
        // UI Elements - Expanded
        this.expandedView = document.getElementById('cassette-expanded');
        this.collapseBtn = document.getElementById('player-collapse-btn');
        this.playlistContainer = document.getElementById('playlist-container');
        this.volumeSlider = document.getElementById('player-volume');
        
        // Buttons - Expanded
        this.playPauseBtnExpanded = document.getElementById('player-play-pause-expanded');
        this.prevBtn = document.getElementById('player-prev');
        this.nextBtn = document.getElementById('player-next');
        this.shuffleBtn = document.getElementById('player-shuffle');
        this.repeatBtn = document.getElementById('player-repeat');
        
        this.init();
    }

    init() {
        if (this.isShuffle) this.generateShuffleQueue();
        
        this.renderPlaylist();
        
        // Initial UI state (Khat)
        this.updateUI();
        if (this.volumeSlider) {
            this.volumeSlider.value = Storage.getVolume();
        }
        
        this.updateShuffleUI();
        this.updateRepeatUI();
        
        this.bindEvents();
    }
    
    renderPlaylist() {
        if (!this.playlistContainer) return;
        
        const existingItems = this.playlistContainer.querySelectorAll('.playlist-item');
        if (existingItems.length === this.songs.length) {
            existingItems.forEach((li, index) => {
                if (index === this.currentIndex) {
                    li.classList.add('active');
                    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    li.classList.remove('active');
                }
            });
            return;
        }

        this.playlistContainer.innerHTML = '';
        
        this.songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item' + (index === this.currentIndex ? ' active' : '');
            li.innerHTML = `<span class="playlist-item-num">${index + 1}.</span> <span>${song.title}</span>`;
            
            li.addEventListener('click', () => {
                if (this.currentIndex === index && this.isPlaying) return;
                this.loadTrack(index, true);
            });
            
            this.playlistContainer.appendChild(li);
        });
    }

    bindEvents() {
        const togglePlayHandler = () => this.togglePlay();
        if (this.playPauseBtnMini) this.playPauseBtnMini.addEventListener('click', togglePlayHandler);
        if (this.playPauseBtnExpanded) this.playPauseBtnExpanded.addEventListener('click', togglePlayHandler);
        
        if (this.expandBtn) this.expandBtn.addEventListener('click', () => this.toggleExpand());
        if (this.collapseBtn) this.collapseBtn.addEventListener('click', () => this.toggleExpand());
        
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.playPrevious());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.playNext(true));
        
        if (this.shuffleBtn) this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        if (this.repeatBtn) this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                const vol = e.target.value;
                Storage.saveVolume(vol);
                if (YouTubeIntegration.isReady()) {
                    YouTubeIntegration.setVolume(vol);
                }
            });
        }
        
        if (this.progressMini) {
            this.progressMini.addEventListener('input', (e) => {
                this.stopProgressTracking();
                const seekTo = (e.target.value / 100) * this.duration;
                if (this.timeCurrentMini) this.timeCurrentMini.textContent = this.formatTime(seekTo);
            });
            this.progressMini.addEventListener('change', (e) => {
                if (YouTubeIntegration.isReady()) {
                    const seekTo = (e.target.value / 100) * this.duration;
                    YouTubeIntegration.seekTo(seekTo);
                }
                if (this.isPlaying) this.startProgressTracking();
            });
        }
        
        YouTubeIntegration.setCallback((state, duration) => {
            if (duration) this.duration = duration;
            this.onStateChange(state);
        });
        
        document.addEventListener('ytPlayerError', () => {
            console.error("Music Player: Track failed to load.");
            this.showError("Couldn't play this track.");
            setTimeout(() => this.playNext(false), 2000);
        });
    }
    
    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.expandedView.classList.remove('hidden');
        } else {
            this.expandedView.classList.add('hidden');
        }
    }
    
    showError(msg) {
        if (this.titleMini) {
            const originalTitle = this.titleMini.textContent;
            this.titleMini.textContent = msg;
            this.titleMini.style.color = 'red';
            setTimeout(() => {
                this.titleMini.textContent = originalTitle;
                this.titleMini.style.color = '';
            }, 2000);
        }
    }

    show() {
        if (this.container) this.container.classList.remove('hidden');
    }

    hide() {
        if (this.container) this.container.classList.add('hidden');
    }

    startInitialPlayback() {
        this.show();
        
        // If Khat is already the current track and it is playing, do nothing
        if (this.currentIndex === 0 && this.isPlaying) {
            return;
        }
        
        // Force track 0 unconditionally
        this.loadTrack(0, true);
    }

    loadTrack(index, shouldPlay = false) {
        if (index < 0 || index >= this.songs.length) index = 0;
        this.currentIndex = index;
        
        const song = this.songs[this.currentIndex];
        
        this.duration = 0;
        if (this.progressMini) this.progressMini.value = 0;
        if (this.timeCurrentMini) this.timeCurrentMini.textContent = "0:00";
        if (this.timeTotalMini) this.timeTotalMini.textContent = "0:00";
        
        if (shouldPlay) {
            this.isPlaying = true;
            if (this.reelContainer) this.reelContainer.classList.add('playing');
        }
        
        this.updateUI();
        this.renderPlaylist(); // Update active class
        
        if (shouldPlay) {
            YouTubeIntegration.loadSong(song.youtubeId);
            this.startProgressTracking();
        } else {
            YouTubeIntegration.cueSong(song.youtubeId);
        }
        YouTubeIntegration.setVolume(Storage.getVolume());
    }

    togglePlay() {
        if (!YouTubeIntegration.isReady()) return;
        
        if (this.isPlaying) {
            YouTubeIntegration.pause();
        } else {
            YouTubeIntegration.play();
        }
    }

    playNext(isManual = false) {
        if (this.isRepeat && !isManual) {
            this.loadTrack(this.currentIndex, true);
            return;
        }
        
        let nextIdx = (this.currentIndex + 1) % this.songs.length;
        
        if (this.isShuffle) {
            if (this.shuffleQueue.length === 0) {
                this.generateShuffleQueue();
            }
            if (this.shuffleQueue.length > 0) {
                nextIdx = this.shuffleQueue.shift();
            }
        }
        
        this.loadTrack(nextIdx, true);
    }

    playPrevious() {
        let prevIdx = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        this.loadTrack(prevIdx, true);
    }

    generateShuffleQueue() {
        const pool = this.songs.map((_, i) => i).filter(i => i !== this.currentIndex);
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        this.shuffleQueue = pool;
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        Storage.saveShuffle(this.isShuffle);
        this.updateShuffleUI();
        if (this.isShuffle) {
            this.generateShuffleQueue();
        } else {
            this.shuffleQueue = [];
        }
    }

    updateShuffleUI() {
        if (!this.shuffleBtn) return;
        if (this.isShuffle) this.shuffleBtn.classList.add('active');
        else this.shuffleBtn.classList.remove('active');
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        Storage.saveRepeat(this.isRepeat);
        this.updateRepeatUI();
    }

    updateRepeatUI() {
        if (!this.repeatBtn) return;
        if (this.isRepeat) this.repeatBtn.classList.add('active');
        else this.repeatBtn.classList.remove('active');
    }

    onStateChange(state) {
        // 1 = playing, 0 = ended, 2 = paused
        if (state === 1) {
            this.isPlaying = true;
            this.isTransitioning = false;
            this.startProgressTracking();
            if (this.reelContainer) this.reelContainer.classList.add('playing');
        } else if (state === 2) {
            this.isPlaying = false;
            this.stopProgressTracking();
            if (this.reelContainer) this.reelContainer.classList.remove('playing');
        } else if (state === 0) {
            // Track finished completely!
            this.isPlaying = false;
            this.stopProgressTracking();
            if (this.reelContainer) this.reelContainer.classList.remove('playing');
            
            // Advance automatically to next track
            if (!this.isTransitioning) {
                this.isTransitioning = true;
                setTimeout(() => {
                    this.playNext(false);
                    setTimeout(() => { this.isTransitioning = false; }, 1200);
                }, 150);
            }
        }
        
        this.updatePlayPauseUI();
    }

    updateUI() {
        const song = this.songs[this.currentIndex];
        
        if (this.titleMini) this.titleMini.textContent = song.title;
        
        this.updatePlayPauseUI();
        
        // Reset progress visually
        if (!this.isPlaying) {
            if (this.progressMini) this.progressMini.value = 0;
            if (this.timeCurrentMini) this.timeCurrentMini.textContent = "0:00";
            if (this.timeTotalMini) this.timeTotalMini.textContent = "0:00";
        }
    }

    updatePlayPauseUI() {
        const setIconState = (btn) => {
            if (!btn) return;
            const playIcon = btn.querySelector('.music-play-icon');
            const pauseIcon = btn.querySelector('.music-pause-icon');
            if (this.isPlaying) {
                if (playIcon) playIcon.classList.add('hidden');
                if (pauseIcon) pauseIcon.classList.remove('hidden');
            } else {
                if (playIcon) playIcon.classList.remove('hidden');
                if (pauseIcon) pauseIcon.classList.add('hidden');
            }
        };
        
        setIconState(this.playPauseBtnMini);
        setIconState(this.playPauseBtnExpanded);
    }

    startProgressTracking() {
        this.stopProgressTracking();
        this.progressInterval = setInterval(() => {
            if (YouTubeIntegration.isReady()) {
                const current = YouTubeIntegration.getCurrentTime();
                const dur = (ytPlayer && ytPlayer.getDuration) ? ytPlayer.getDuration() : this.duration;
                if (dur > 0) this.duration = dur;
                
                const progressPct = this.duration > 0 ? (current / this.duration) * 100 : 0;
                
                if (this.progressMini) this.progressMini.value = progressPct;
                if (this.timeCurrentMini) this.timeCurrentMini.textContent = this.formatTime(current);
                if (this.timeTotalMini) this.timeTotalMini.textContent = this.formatTime(this.duration);

                // Auto-advance safeguard: if current playback reaches within 0.5s of the end of the song
                if (this.duration > 5 && current >= (this.duration - 0.5) && !this.isTransitioning) {
                    this.isTransitioning = true;
                    setTimeout(() => {
                        this.playNext(false);
                        setTimeout(() => { this.isTransitioning = false; }, 1200);
                    }, 200);
                }
            }
        }, 500);
    }

    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' + s : s}`;
    }
}
