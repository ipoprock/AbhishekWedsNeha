// Force page to load at the top on every reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// 1. Countdown Timer Logic
const ceremonyDate = new Date("July 05, 2026 19:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = ceremonyDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    if (elements.days) elements.days.innerText = days.toString().padStart(2, '0');
    if (elements.hours) elements.hours.innerText = hours.toString().padStart(2, '0');
    if (elements.minutes) elements.minutes.innerText = minutes.toString().padStart(2, '0');
    if (elements.seconds) elements.seconds.innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval);
        const timerContainer = document.getElementById("timer");
        if (timerContainer) timerContainer.innerHTML = "<h3 style='color: var(--gold);'>Ceremony Started!</h3>";
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// 2. GSAP Premium Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Sequence
let heroAnimationPlayed = false;
function playHeroAnimation() {
    if (heroAnimationPlayed) return;
    heroAnimationPlayed = true;
    
    const heroTl = gsap.timeline();
    heroTl.from(".ganesha-icon", { opacity: 0, y: -30, duration: 1.2, ease: "power2.out" })
          .from(".groom-side", { opacity: 0, x: -50, duration: 1, ease: "power2.out" }, "-=0.5")
          .from(".bride-side", { opacity: 0, x: 50, duration: 1, ease: "power2.out" }, "-=1")
          .from(".heart-container", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(2)" }, "-=0.5")
          .from(".hero-text h1", { opacity: 0, y: 20, duration: 1 }, "-=0.3")
          .from(".hero-text .invite-msg, .hero-text h3", { opacity: 0, duration: 1, stagger: 0.2 }, "-=0.5");
}

// Scroll Reveal Configuration
const revealUp = { y: 40, opacity: 0, duration: 1, ease: "power2.out" };
const revealScale = { scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" };

gsap.utils.toArray(".reveal-up").forEach(el => {
    gsap.from(el, { ...revealUp, scrollTrigger: { trigger: el, start: "top 90%" } });
});

gsap.utils.toArray(".reveal-scale").forEach(el => {
    gsap.from(el, { ...revealScale, scrollTrigger: { trigger: el, start: "top 90%" } });
});

gsap.utils.toArray(".reveal-left").forEach(el => {
    gsap.from(el, { x: -40, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: "top 90%" } });
});

gsap.utils.toArray(".reveal-right").forEach(el => {
    gsap.from(el, { x: 40, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: "top 90%" } });
});

// 3. Optimized Particle System (Flower Petals & Gold Dust)
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 15 : 30;
// Navy, Gold, Champagne, Pearl White, Antique Gold
const colors = ['#0B1B3D', '#C5A059', '#F3E5AB', '#FFFDF9', '#D4AF37'];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Petal {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20 - Math.random() * 100;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotSpeed = Math.random() * 1.5 - 0.75;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.isGlitter = Math.random() > 0.6; // 40% are gold dust glitter
        if (this.isGlitter) {
            this.color = '#E5C158';
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 2 + 1; // falls faster
        }
    }
    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y / 30) * (this.isGlitter ? 0.2 : 0.5) + this.speedX;
        if (!this.isGlitter) {
            this.rotation += this.rotSpeed;
        }
        if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.isGlitter) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

class HeartParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 10;
        this.speedY = -(Math.random() * 3 + 2); // rises up
        this.speedX = Math.random() * 4 - 2;
        this.opacity = 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() > 0.4) this.color = '#ff3e3e'; // make hearts red/pink mostly
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.015;
    }
    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, -d / 4);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, -d / 4, -d, d / 4);
        ctx.bezierCurveTo(-d, d * 0.7, -d / 4, d * 0.8, 0, d);
        ctx.bezierCurveTo(d / 4, d * 0.8, d, d * 0.7, d, d / 4);
        ctx.bezierCurveTo(d, -d / 4, d / 2, -d / 2, 0, -d / 4);
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    particles = Array.from({ length: particleCount }, () => new Petal());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.opacity === undefined || p.opacity > 0;
    });
    requestAnimationFrame(animate);
}
init();
animate();

// SVGs for Controls
const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 16px; height: 16px; fill: currentColor;"><path d="M223.5 32C100 32 0 132.3 0 256s100 224 223.5 224c60.7 0 115.5-24.2 155.8-63.4 5-4.9 1.3-13.5-5.5-13-113.7 8.7-210.6-80.9-210.6-193.6c0-90.8 61.4-167.3 145.4-190.5 6.7-1.9 8.2-10.6 2.2-14.6C280.3 39.8 253.2 32 223.5 32z"/></svg>`;
const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 16px; height: 16px; fill: currentColor;"><path d="M256 128a128 128 0 1 0 128 128 128 128 0 0 0-128-128zm0 224a96 96 0 1 1 96-96 96 96 0 0 1-96 96zm0-240a16 16 0 0 0 16-16V48a16 16 0 0 0-32 0v48a16 16 0 0 0 16 16zm0 288a16 16 0 0 0-16 16v48a16 16 0 0 0 32 0v-48a16 16 0 0 0-16-16zm-176-144a16 16 0 0 0-16-16H16a16 16 0 0 0 0 32h48a16 16 0 0 0 16-16zm388 0a16 16 0 0 0-16-16h-48a16 16 0 0 0 0 32h48a16 16 0 0 0 16-16zm-298.8-90.8a16 16 0 0 0 22.6 0l34-34a16 16 0 1 0-22.6-22.6l-34 34a16 16 0 0 0 0 22.6zm204.6 204.6a16 16 0 0 0-22.6 0l-34 34a16 16 0 1 0 22.6 22.6l34-34a16 16 0 0 0 0-22.6zm-204.6 0a16 16 0 0 0 0-22.6l-34-34a16 16 0 0 0-22.6 22.6l34 34a16 16 0 0 0 22.6 0zm204.6-204.6a16 16 0 0 0 0-22.6l-34-34a16 16 0 0 0-22.6 22.6l34 34a16 16 0 0 0 22.6 0z"/></svg>`;
const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 14px; height: 14px; fill: currentColor;"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.7 32.7 24.5 41.9s33.7 8.2 48.5-.9L357 297c14.3-8.8 23-24.3 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
const pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width: 14px; height: 14px; fill: currentColor;"><path d="M48 64C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h48c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm176 0c-26.5 0-48 21.5-48 48v288c0 26.5 21.5 48 48 48h48c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48h-48z"/></svg>`;

// 4. Envelope Opening Intro Logic
const envelopeWrapper = document.getElementById('envelope-intro');
const waxSealBtn = document.getElementById('wax-seal-btn');
const envelopeBox = document.getElementById('envelope-box');

if (waxSealBtn && envelopeWrapper && envelopeBox) {
    waxSealBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Step 1: Break the seal
        waxSealBtn.classList.add('broken');
        
        const instruction = document.getElementById('envelope-instruction');
        if (instruction) {
            instruction.innerText = "Opening Invitation...";
        }
        
        // Trigger background music play on open
        if (music && musicBtn) {
            music.play().then(() => {
                isMusicPlaying = true;
                musicBtn.innerHTML = pauseSvg;
            }).catch((e) => {
                console.log("Audio autoplay prevented on envelope click: ", e);
            });
        }
        
        // Step 2: Open top flap in 3D (300ms delay)
        setTimeout(() => {
            envelopeBox.classList.add('flap-open');
        }, 300);
        
        // Step 3: Slide out letter card (1000ms delay)
        setTimeout(() => {
            envelopeBox.classList.add('card-out');
        }, 1000);
        
        // Step 4: Fade & slide out the entire envelope (3800ms delay)
        setTimeout(() => {
            envelopeWrapper.classList.add('opened');
            playHeroAnimation();
            
            // Delay scroll trigger refresh so opening is smooth
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 800);
        }, 3800);
    });
}

// 5. Music & Theme Controls
const music = document.getElementById('wedding-music');
const musicBtn = document.getElementById('music-toggle');
const themeBtn = document.getElementById('theme-toggle');
let isMusicPlaying = false;

if (musicBtn && music) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent event bubble
        if (isMusicPlaying) {
            music.pause();
            musicBtn.innerHTML = playSvg;
        } else {
            music.play().then(() => {
                // Success
            }).catch(() => console.log("User interaction required for audio"));
            musicBtn.innerHTML = pauseSvg;
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        const isNight = document.body.classList.contains('night-mode');
        themeBtn.innerHTML = isNight ? sunSvg : moonSvg;
    });
}

// 6. Send Blessings Counter & Floating Hearts
const blessBtn = document.getElementById('bless-btn');
const blessCountNum = document.getElementById('blessings-count-num');
let blessingsCount = parseInt(localStorage.getItem('wedding_blessings_count')) || 128; // default seed blessings

if (blessCountNum) {
    blessCountNum.innerText = blessingsCount.toLocaleString();
}

if (blessBtn) {
    blessBtn.addEventListener('click', () => {
        blessingsCount++;
        localStorage.setItem('wedding_blessings_count', blessingsCount);
        if (blessCountNum) blessCountNum.innerText = blessingsCount.toLocaleString();
        
        // Button bounce animation
        gsap.fromTo(blessBtn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
        
        // Spawn hearts on canvas
        const rect = blessBtn.getBoundingClientRect();
        const spawnX = rect.left + rect.width / 2;
        const spawnY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 25; i++) {
            particles.push(new HeartParticle(spawnX, spawnY));
        }
    });
}



// 8. Calendar Integration
function addToCalendar(title, startStr, location) {
    const startDate = new Date(startStr);
    const endDate = new Date(startDate.getTime() + 120 * 60000); // +2 hours

    const isoDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, "");
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title + ' - Ring Ceremony')}&dates=${isoDate(startDate)}/${isoDate(endDate)}&details=${encodeURIComponent('Join us for the celebration!')}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
}