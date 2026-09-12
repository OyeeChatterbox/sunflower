// gallery.js

class Gallery {
    constructor() {
        this.container = document.getElementById('masonry-gallery');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxCaption = document.getElementById('lightbox-caption');
        
        this.closeBtn = document.getElementById('lightbox-close');
        this.prevBtn = document.getElementById('lightbox-prev');
        this.nextBtn = document.getElementById('lightbox-next');
        
        this.photos = siteConfig.galleryPhotos;
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        if (!this.photos || this.photos.length === 0) return;
        
        this.photos.forEach((photo, idx) => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in';
            item.setAttribute('data-index', idx);
            
            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.caption || "Gallery image";
            img.loading = "lazy";
            img.onerror = () => {
                img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="%23f6f1e8" width="400" height="500"/><text fill="%238c7148" font-family="Playfair Display, serif" font-size="18" font-style="italic" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">🌻 ${encodeURIComponent(photo.caption || 'Memory')}</text></svg>`;
            };
            
            item.appendChild(img);
            
            if (photo.caption) {
                const overlay = document.createElement('div');
                overlay.className = 'gallery-overlay';
                const span = document.createElement('span');
                span.textContent = photo.caption;
                overlay.appendChild(span);
                item.appendChild(overlay);
            }
            
            item.addEventListener('click', () => this.openLightbox(idx));
            this.container.appendChild(item);
        });
        
        // Lightbox Listeners
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-bg')) {
                this.closeLightbox();
            }
        });
        
        // Keyboard nav
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Swipe support
        let touchStartX = 0;
        this.lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
        this.lightbox.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) this.next();
            if (touchEndX > touchStartX + 50) this.prev();
        }, {passive: true});
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightbox();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateLightbox() {
        const photo = this.photos[this.currentIndex];
        this.lightboxImg.src = photo.src;
        this.lightboxCaption.textContent = photo.caption || '';
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.updateLightbox();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.updateLightbox();
    }
}
