# Sunflower 🌻

A cinematic, personal, and responsive gift website.

## 📁 Repository Structure

This folder (`sunflower`) is completely self-contained and ready to push directly to GitHub:

```
sunflower/
├── index.html              # Main experience (Hero, Little Things, Observations, Letter, Cassette Player)
├── about.html              # "Developer Babu" personal bio & profile page
├── .gitignore              # Ignores OS & temporary files
├── README.md               # Project documentation
├── assets/
│   ├── images/             # All curated photos & avatars
│   └── music-artwork/      # Cassette player icons & artwork
├── config/
│   └── config.js           # Central configuration (44 songs, texts, observation captions)
├── css/
│   ├── style.css           # Core typography, palette & layout
│   ├── glass.css           # Glassmorphism cassette player, nav bar & guide tooltip
│   ├── animations.css      # Floating petals & gentle reveal effects
│   ├── observations.css    # Polaroids, photo cards & filmstrip frames
│   └── responsive.css      # Mobile, tablet & desktop layout rules
└── js/
    ├── app.js              # Main interaction logic & DOM controller
    ├── music-player.js     # Cassette music player (shuffle, repeat, auto-advance)
    ├── youtube.js          # YouTube IFrame API audio bridge & reload cache handler
    ├── storage.js          # Client-side volume & playback preference storage
    ├── slider.js           # Interactive photo stacks & lightboxes
    └── animations.js       # IntersectionObserver triggers & petal generator
```

---

## 🚀 How to Push to GitHub

From inside this `sunflower` folder in your terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Create your initial commit
git commit -m "feat: complete sunflower gift website"

# 4. Rename default branch to main
git branch -M main

# 5. Add your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/OyeeChatterbox/sunflower.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Deploy to GitHub Pages (Free Live URL)

1. Go to your repository on GitHub (`https://github.com/OyeeChatterbox/sunflower`).
2. Click **Settings** &rarr; **Pages** (on the left sidebar).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `root`
4. Click **Save**.
5. Within 1–2 minutes, your website will be live at:  
   `https://oyeechatterbox.github.io/sunflower/`
