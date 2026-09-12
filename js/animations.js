// animations.js

class AnimationController {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        
        this.petalContainer = document.getElementById('petal-container');
    }
    
    init() {
        // Observe elements
        document.querySelectorAll('.fade-in, .fade-in-up, .observe-target').forEach(el => {
            this.observer.observe(el);
        });
        
        // Start petals if not reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            this.createPetals();
        }
    }
    
    createPetals() {
        // Create a few subtle falling petals
        const petalCount = 15;
        
        for (let i = 0; i < petalCount; i++) {
            this.spawnPetal();
        }
    }
    
    spawnPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Randomize
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10; // 10-25s fall
        const delay = Math.random() * 15;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}vw`;
        petal.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        this.petalContainer.appendChild(petal);
    }
}
