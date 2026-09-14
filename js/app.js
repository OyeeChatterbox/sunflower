// app.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Inject dynamic config text
    document.getElementById('config-hero-title').innerHTML = siteConfig.hero.title;
    document.getElementById('config-hero-subtitle').innerHTML = siteConfig.hero.subtitle;
    if (document.getElementById('config-final-title')) {
        document.getElementById('config-final-title').innerHTML = siteConfig.finalMessage.title;
    }
    if (document.getElementById('config-final-subtitle')) {
        document.getElementById('config-final-subtitle').innerHTML = siteConfig.finalMessage.subtitle;
    }
    
    // Inject Little Things cards
    const cardsContainer = document.getElementById('cards-container');
    if (siteConfig.littleThings) {
        siteConfig.littleThings.forEach(text => {
            const card = document.createElement('div');
            card.className = 'little-card fade-in';
            card.innerHTML = `<p>${text}</p>`;
            cardsContainer.appendChild(card);
        });
    }

    // Populate Personal Observations
    const obs = siteConfig.personalObservations;
    
    document.getElementById('obs-look-text').innerHTML = obs.look.text;
    document.getElementById('obs-look-caption').innerHTML = obs.look.caption;
    
    document.getElementById('obs-head-text').innerHTML = obs.headMovement.text;
    document.getElementById('obs-head-caption').innerHTML = obs.headMovement.caption;
    
    document.getElementById('obs-fit-title').innerHTML = obs.fitCheck.title;
    document.getElementById('obs-fit-subtitle').innerHTML = obs.fitCheck.subtitle;
    
    document.getElementById('obs-bonny-title').innerHTML = obs.bonny.title;
    document.getElementById('obs-bonny-text').innerHTML = obs.bonny.text;
    document.getElementById('obs-bonny-subtext').innerHTML = obs.bonny.subtext;
    
    const me1 = document.getElementById('obs-dia-me1');
    const her = document.getElementById('obs-dia-her');
    const me2 = document.getElementById('obs-dia-me2');
    
    // We will type these when the card becomes visible
    // Empty them initially
    me1.innerHTML = "";
    her.innerHTML = "";
    me2.innerHTML = "";
    
    document.getElementById('obs-adaptable-title').innerHTML = obs.adaptable.title;
    document.getElementById('obs-adaptable-text1').innerHTML = obs.adaptable.text1;
    document.getElementById('obs-adaptable-text2').innerHTML = obs.adaptable.text2;
    document.getElementById('obs-adaptable-outro').innerHTML = obs.adaptable.outro;
    
    document.getElementById('obs-lawyer-title').innerHTML = obs.lawyer.title;
    document.getElementById('obs-lawyer-intro').innerHTML = obs.lawyer.text1;
    document.getElementById('obs-lawyer-text').innerHTML = obs.lawyer.text2;
    document.getElementById('obs-lawyer-outro').innerHTML = obs.lawyer.outro;
    
    document.getElementById('obs-admire-title').innerHTML = obs.admire.title;
    document.getElementById('obs-admire-text1').innerHTML = obs.admire.text1;
    document.getElementById('obs-admire-text2').innerHTML = obs.admire.text2;
    document.getElementById('obs-admire-text3').innerHTML = obs.admire.outro;
    
    document.getElementById('obs-green-title').innerHTML = obs.greenSaree.title;
    const greenImg = document.getElementById('obs-green-img');
    greenImg.src = obs.greenSaree.image;
    greenImg.onerror = () => {
        greenImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect fill="%23243123" width="800" height="1000"/><circle cx="400" cy="460" r="110" fill="%2330412e" opacity="0.8"/><text fill="%23e8d7be" font-family="Playfair Display, serif" font-size="28" font-style="italic" x="50%" y="620" dominant-baseline="middle" text-anchor="middle">💚 That One Picture</text><text fill="%23a89f91" font-family="Inter, sans-serif" font-size="16" x="50%" y="665" dominant-baseline="middle" text-anchor="middle">(Green saree &amp; glasses)</text></svg>`;
    };
    document.getElementById('obs-green-caption').innerHTML = obs.greenSaree.caption;

    // Initialize Components
    const animController = new AnimationController();
    const slider = new PhotoSlider();
    const gallery = new Gallery();
    const musicPlayer = new MusicPlayer();
    
    // Intro Screen Logic
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');
    
    // Ensure enter button is ready and active
    enterBtn.textContent = "Open this little surprise";
    enterBtn.style.opacity = "1";
    enterBtn.style.pointerEvents = "auto";

    enterBtn.addEventListener('click', () => {
        // Hide intro, show main
        introScreen.classList.add('inactive');
        
        // Start Khat playback on user interaction
        musicPlayer.startInitialPlayback();
        
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Reveal music player only now
            musicPlayer.show();
            
            // Reveal music guide tooltip pointing to the player
            const guide = document.getElementById('music-guide-tooltip');
            if (guide) {
                setTimeout(() => {
                    guide.classList.remove('hidden');
                }, 500);
            }
            
            // Trigger observe on main content elements
            animController.init();
        }, 1200);
    });
    
    // Music Guide Tooltip dismiss logic
    const guideTooltip = document.getElementById('music-guide-tooltip');
    const guideClose = document.getElementById('guide-close');
    if (guideTooltip) {
        if (guideClose) {
            guideClose.addEventListener('click', (e) => {
                e.stopPropagation();
                guideTooltip.classList.add('hidden');
            });
        }
        guideTooltip.addEventListener('click', () => {
            guideTooltip.classList.add('hidden');
            const expandBtn = document.getElementById('player-expand-btn');
            if (expandBtn) expandBtn.click();
        });
        const expandBtn = document.getElementById('player-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                guideTooltip.classList.add('hidden');
            });
        }
    }
    
    // Fit Check Gallery Logic
    const fitCheckTrigger = document.getElementById('fit-check-trigger');
    const fitGallery = document.getElementById('fit-check-gallery');
    const fitClose = document.getElementById('fit-close');
    const fitTrack = document.getElementById('fit-gallery-track');
    const fitPrev = document.getElementById('fit-prev');
    const fitNext = document.getElementById('fit-next');
    
    let fitIndex = 0;
    
    // Populate fit check images
    obs.fitCheck.photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption;
        img.className = index === 0 ? 'fit-img active' : 'fit-img';
        fitTrack.appendChild(img);
    });
    
    function updateFitGallery() {
        const images = fitTrack.querySelectorAll('.fit-img');
        images.forEach((img, index) => {
            if (index === fitIndex) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }
    
    fitCheckTrigger.addEventListener('click', () => {
        fitGallery.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    fitClose.addEventListener('click', () => {
        fitGallery.classList.add('hidden');
        document.body.style.overflow = '';
    });
    
    fitPrev.addEventListener('click', () => {
        fitIndex = (fitIndex - 1 + obs.fitCheck.photos.length) % obs.fitCheck.photos.length;
        updateFitGallery();
    });
    
    fitNext.addEventListener('click', () => {
        fitIndex = (fitIndex + 1) % obs.fitCheck.photos.length;
        updateFitGallery();
    });
    
    // Keyboard support for gallery
    document.addEventListener('keydown', (e) => {
        if (!fitGallery.classList.contains('hidden')) {
            if (e.key === 'Escape') fitClose.click();
            if (e.key === 'ArrowLeft') fitPrev.click();
            if (e.key === 'ArrowRight') fitNext.click();
        }
    });
    
    // Custom Typewriter Logic for Dialogue Card
    const typeWriter = (element, htmlStr, speed, callback) => {
        element.innerHTML = "";
        element.classList.add('typing-cursor');
        
        let i = 0;
        let isTag = false;
        let text = "";

        function type() {
            if (i < htmlStr.length) {
                const char = htmlStr.charAt(i);
                if (char === '<') isTag = true;
                text += char;
                if (char === '>') isTag = false;
                
                element.innerHTML = text;
                i++;
                
                if (isTag) {
                    type(); // skip delay for tags like <br>
                } else {
                    setTimeout(type, speed);
                }
            } else {
                element.classList.remove('typing-cursor');
                if (callback) callback();
            }
        }
        type();
    };

    const dialogueSection = document.getElementById('dialogue-section');
    const line1 = me1.parentElement;
    const line2 = her.parentElement;
    const line3 = me2.parentElement;
    
    let typingStarted = false;

    const dialogueObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !typingStarted) {
            typingStarted = true;
            
            // Show first line and type
            line1.classList.add('visible');
            typeWriter(me1, obs.dialogue.me1, 40, () => {
                
                setTimeout(() => {
                    line2.classList.add('visible');
                    typeWriter(her, obs.dialogue.her, 50, () => {
                        
                        setTimeout(() => {
                            line3.classList.add('visible');
                            typeWriter(me2, obs.dialogue.me2, 40);
                        }, 500); // Wait before 3rd line
                        
                    });
                }, 600); // Wait before 2nd line
                
            });
        }
    }, { threshold: 0.5 });
    
    if (dialogueSection) {
        dialogueObserver.observe(dialogueSection);
    }

    // Setup Personal Voice Note PIN Lock System
    const lockScreen = document.getElementById('voice-lock-screen');
    const unlockedPlayer = document.getElementById('voice-player-unlocked');
    const pinDots = document.querySelectorAll('.pin-dot');
    const pinDotsContainer = document.getElementById('pin-dots-container');
    const hiddenPinInput = document.getElementById('voice-pin-input');
    const pinFeedback = document.getElementById('pin-feedback-msg');
    const keypad = document.getElementById('pin-keypad');
    const lockIconWrap = document.getElementById('lock-icon-wrap');
    const lockStatusText = document.getElementById('lock-status-text');
    const lockHintText = document.getElementById('lock-hint-text');

    const CORRECT_PIN = (typeof siteConfig !== 'undefined' && siteConfig.voiceNote && siteConfig.voiceNote.pin) ? String(siteConfig.voiceNote.pin) : "1209";
    const PIN_HINT = (typeof siteConfig !== 'undefined' && siteConfig.voiceNote && siteConfig.voiceNote.hint) ? siteConfig.voiceNote.hint : "Your birth day and month";

    if (lockHintText) {
        lockHintText.textContent = `Hint: ${PIN_HINT}`;
    }

    let currentEnteredPin = "";
    let isPinVerifying = false;

    function updatePinDots() {
        pinDots.forEach((dot, idx) => {
            if (idx < currentEnteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
            dot.classList.remove('error', 'success');
        });
    }

    function unlockVoiceNote() {
        isPinVerifying = true;
        pinDots.forEach(dot => dot.classList.add('success'));
        if (lockIconWrap) lockIconWrap.classList.add('unlocked');
        if (lockStatusText) lockStatusText.textContent = "UNLOCKED • ACCESS GRANTED";
        if (pinFeedback) {
            pinFeedback.className = "pin-feedback-msg success";
            pinFeedback.textContent = "Passcode matched! Unlocking... 🌻";
        }

        try {
            sessionStorage.setItem('voice_note_unlocked', 'true');
        } catch (e) {}

        setTimeout(() => {
            if (lockScreen) lockScreen.classList.add('unlocking');
            setTimeout(() => {
                if (lockScreen) lockScreen.classList.add('hidden');
                if (unlockedPlayer) {
                    unlockedPlayer.classList.remove('hidden');
                }
            }, 380);
        }, 650);
    }

    function rejectPin() {
        isPinVerifying = true;
        pinDots.forEach(dot => dot.classList.add('error'));
        if (pinDotsContainer) pinDotsContainer.classList.add('shake');
        if (pinFeedback) {
            pinFeedback.className = "pin-feedback-msg";
            pinFeedback.textContent = "Galat PIN hai, dobara try karo.";
        }

        setTimeout(() => {
            currentEnteredPin = "";
            updatePinDots();
            if (pinDotsContainer) pinDotsContainer.classList.remove('shake');
            if (hiddenPinInput) hiddenPinInput.value = "";
            isPinVerifying = false;
        }, 850);
    }

    function handleDigit(digit) {
        if (isPinVerifying) return;
        if (currentEnteredPin.length < 4) {
            currentEnteredPin += digit;
            updatePinDots();
            if (pinFeedback) pinFeedback.textContent = "";

            if (currentEnteredPin.length === 4) {
                if (currentEnteredPin === CORRECT_PIN) {
                    unlockVoiceNote();
                } else {
                    rejectPin();
                }
            }
        }
    }

    function handleBackspace() {
        if (isPinVerifying) return;
        if (currentEnteredPin.length > 0) {
            currentEnteredPin = currentEnteredPin.slice(0, -1);
            updatePinDots();
            if (pinFeedback) pinFeedback.textContent = "";
            if (hiddenPinInput) hiddenPinInput.value = currentEnteredPin;
        }
    }

    function handleClear() {
        if (isPinVerifying) return;
        currentEnteredPin = "";
        updatePinDots();
        if (pinFeedback) pinFeedback.textContent = "";
        if (hiddenPinInput) hiddenPinInput.value = "";
    }

    // Check if previously unlocked in this session
    try {
        if (sessionStorage.getItem('voice_note_unlocked') === 'true') {
            if (lockScreen) lockScreen.classList.add('hidden');
            if (unlockedPlayer) unlockedPlayer.classList.remove('hidden');
        }
    } catch (e) {}

    // On-screen tactile keypad clicks
    if (keypad) {
        keypad.addEventListener('click', (e) => {
            const btn = e.target.closest('.keypad-btn');
            if (!btn) return;
            const key = btn.dataset.key;
            if (key >= '0' && key <= '9') {
                handleDigit(key);
            } else if (key === 'backspace') {
                handleBackspace();
            } else if (key === 'clear') {
                handleClear();
            }
        });
    }

    // Focus hidden input when tapping dots container
    if (pinDotsContainer && hiddenPinInput) {
        pinDotsContainer.addEventListener('click', () => {
            hiddenPinInput.focus();
        });
    }

    // Direct input typing support
    if (hiddenPinInput) {
        hiddenPinInput.addEventListener('input', (e) => {
            const val = hiddenPinInput.value.replace(/[^0-9]/g, '');
            if (val.length <= 4) {
                currentEnteredPin = val;
                updatePinDots();
                if (currentEnteredPin.length === 4) {
                    if (currentEnteredPin === CORRECT_PIN) {
                        unlockVoiceNote();
                    } else {
                        rejectPin();
                    }
                }
            }
        });
    }

    // Keyboard support when scrolling to lock section
    document.addEventListener('keydown', (e) => {
        if (!lockScreen || lockScreen.classList.contains('hidden')) return;
        if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;

        if (e.key >= '0' && e.key <= '9') {
            handleDigit(e.key);
        } else if (e.key === 'Backspace') {
            handleBackspace();
        } else if (e.key === 'Escape' || e.key === 'Delete') {
            handleClear();
        }
    });

    // Setup Personal Voice Note Player Controls
    const noteAudio = document.getElementById('note-audio');
    const voicePlayBtn = document.getElementById('voice-play-btn');
    const voiceWaveform = document.getElementById('voice-waveform');
    const voiceProgress = document.getElementById('voice-progress');
    const voiceCurrentTime = document.getElementById('voice-current-time');
    const voiceTotalTime = document.getElementById('voice-total-time');

    if (noteAudio && voicePlayBtn) {
        const playIcon = voicePlayBtn.querySelector('.voice-icon-play');
        const pauseIcon = voicePlayBtn.querySelector('.voice-icon-pause');

        function formatVoiceTime(seconds) {
            if (!seconds || isNaN(seconds)) return "0:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' + s : s}`;
        }

        noteAudio.addEventListener('loadedmetadata', () => {
            if (voiceTotalTime && noteAudio.duration) {
                voiceTotalTime.textContent = formatVoiceTime(noteAudio.duration);
            }
        });

        noteAudio.addEventListener('timeupdate', () => {
            if (!noteAudio.duration) return;
            const progress = (noteAudio.currentTime / noteAudio.duration) * 100;
            if (voiceProgress) voiceProgress.value = progress;
            if (voiceCurrentTime) voiceCurrentTime.textContent = formatVoiceTime(noteAudio.currentTime);
            if (voiceTotalTime && (voiceTotalTime.textContent === "0:00" || voiceTotalTime.textContent === "")) {
                voiceTotalTime.textContent = formatVoiceTime(noteAudio.duration);
            }
        });

        if (voiceProgress) {
            voiceProgress.addEventListener('input', (e) => {
                if (noteAudio.duration) {
                    noteAudio.currentTime = (e.target.value / 100) * noteAudio.duration;
                }
            });
        }

        voicePlayBtn.addEventListener('click', () => {
            if (noteAudio.paused) {
                // Pause background cassette music so her voice note is crystal clear
                if (window.YouTubeIntegration && YouTubeIntegration.isReady()) {
                    YouTubeIntegration.pause();
                }

                noteAudio.play().then(() => {
                    if (playIcon) playIcon.classList.add('hidden');
                    if (pauseIcon) pauseIcon.classList.remove('hidden');
                    if (voiceWaveform) voiceWaveform.classList.add('playing');
                }).catch(err => {
                    console.error("Audio playback error:", err);
                });
            } else {
                noteAudio.pause();
                if (playIcon) playIcon.classList.remove('hidden');
                if (pauseIcon) pauseIcon.classList.add('hidden');
                if (voiceWaveform) voiceWaveform.classList.remove('playing');
            }
        });

        noteAudio.addEventListener('ended', () => {
            if (playIcon) playIcon.classList.remove('hidden');
            if (pauseIcon) pauseIcon.classList.add('hidden');
            if (voiceWaveform) voiceWaveform.classList.remove('playing');
            if (voiceProgress) voiceProgress.value = 0;
            if (voiceCurrentTime) voiceCurrentTime.textContent = "0:00";
        });

        const voiceRewindBtn = document.getElementById('voice-rewind-btn');
        const voiceForwardBtn = document.getElementById('voice-forward-btn');

        if (voiceRewindBtn) {
            voiceRewindBtn.addEventListener('click', () => {
                if (noteAudio) {
                    noteAudio.currentTime = Math.max(0, noteAudio.currentTime - 10);
                }
            });
        }

        if (voiceForwardBtn) {
            voiceForwardBtn.addEventListener('click', () => {
                if (noteAudio) {
                    noteAudio.currentTime = Math.min(noteAudio.duration || 0, noteAudio.currentTime + 10);
                }
            });
        }
    }

    // Setup WhatsApp Reply Box
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const replyTextarea = document.getElementById('her-reply-text');
    
    if (sendWhatsappBtn && replyTextarea) {
        sendWhatsappBtn.addEventListener('click', () => {
            const userMsg = replyTextarea.value.trim();
            const phoneNumber = "919452451655";
            
            let finalMsg = userMsg;
            if (!finalMsg) {
                finalMsg = "Hey, I saw your little surprise website... 🌻";
            }
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMsg)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});
