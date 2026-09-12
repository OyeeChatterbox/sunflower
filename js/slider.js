// slider.js -> Scattered Photos Controller for "For You" Section

class ScatteredPhotos {
    constructor() {
        this.container = document.getElementById('scattered-photos-container');
        this.photos = siteConfig.forYouPhotos || [
            { src: "assets/images/placeholder1.jpg", caption: "Little candid moment", tilt: "-4deg" },
            { src: "assets/images/placeholder2.jpg", caption: "Sunflowers & smiles", tilt: "3.5deg" },
            { src: "assets/images/placeholder3.jpg", caption: "Unfiltered laughter", tilt: "-2.5deg" },
            { src: "assets/images/placeholder4.jpg", caption: "Ordinary day, special memory", tilt: "4deg" }
        ];
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.container.innerHTML = '';
        
        const defaultTilts = ['-4deg', '3.5deg', '-2.5deg', '4deg'];
        
        this.photos.slice(0, 4).forEach((photo, idx) => {
            const card = document.createElement('div');
            card.className = 'scattered-photo-card fade-in-up';
            const tilt = photo.tilt || defaultTilts[idx % defaultTilts.length];
            card.style.setProperty('--photo-tilt', tilt);
            
            const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="%23f6f1e8" width="400" height="500"/><circle cx="200" cy="220" r="45" fill="%23e8d7be" opacity="0.6"/><text fill="%238c7148" font-family="Playfair Display, serif" font-size="20" font-style="italic" x="50%" y="300" dominant-baseline="middle" text-anchor="middle">🌻 ${encodeURIComponent(photo.caption || 'Memory')}</text></svg>`;

            card.innerHTML = `
                <div class="photo-inner-frame">
                    <div class="photo-img-wrapper">
                        <img src="${photo.src}" alt="${photo.caption || 'Photograph'}" onerror="this.onerror=null; this.src='${fallbackSvg}'">
                    </div>
                    <div class="photo-caption handwritten">${photo.caption || ''}</div>
                </div>
            `;
            
            // Allow lightbox viewing
            card.addEventListener('click', () => {
                const lightboxImg = document.getElementById('lightbox-img');
                const lightboxCaption = document.getElementById('lightbox-caption');
                const lightbox = document.getElementById('lightbox');
                if (lightbox && lightboxImg) {
                    const imgEl = card.querySelector('img');
                    lightboxImg.src = imgEl ? imgEl.src : photo.src;
                    if (lightboxCaption) lightboxCaption.textContent = photo.caption || '';
                    lightbox.classList.remove('hidden');
                }
            });
            
            this.container.appendChild(card);
        });
    }
}

// Keep PhotoSlider reference for backwards compatibility
const PhotoSlider = ScatteredPhotos;
