import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  isOpen = false;

  private navToggleBtn: HTMLElement | null = null;
  private navList: HTMLElement | null = null;
  private navLinks: HTMLElement[] = [];
  private dynamicHeading: HTMLElement | null = null;
  private activeRouteLabelSpan: HTMLElement | null = null;
  private brandLink: HTMLElement | null = null;
  private creativeNav: HTMLElement | null = null;

  private navLinkHandlers: Array<{ el: Element; handler: EventListenerOrEventListenerObject }> = [];

  skills: any[] = [];
  private skillsSubscription: Subscription | null = null;
  private cosmicAnimationFrameId: number | null = null;
  private cosmicResizeHandler: () => void;
  private mouseGlowHandler: (event: MouseEvent) => void;
  private readonly CIRCUMFERENCE = 2 * Math.PI * 37;

  private documentClickHandler = (event: Event) => {
    const target = event.target as HTMLElement | null;
    const isNavClick = !!(target && target.closest && target.closest('.app-nav'));
    if (!isNavClick && window.innerWidth <= 860) {
      if (this.navList && this.navList.classList.contains('open')) {
        this.closeMenu();
      }
    }
  };

  private windowScrollHandler = () => {
    if (!this.creativeNav) return;
    if (window.scrollY > 20) {
      this.creativeNav.classList.add('scrolled');
    } else {
      this.creativeNav.classList.remove('scrolled');
    }
  };

  private resizeHandler = () => {
    if (window.innerWidth > 860) {
      if (this.navList && this.navList.classList.contains('open')) {
        this.closeMenu();
      }
    }
  };

  constructor(private profileDataService: ProfileDataService, private router: Router) {
    this.cosmicResizeHandler = () => this.resizeCosmicCanvas();
    this.mouseGlowHandler = (event: MouseEvent) => {
      const glow = document.getElementById('mouseGlow');
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };
  }

  toggleMenu(): void {
    if (!this.navList || !this.navToggleBtn) {
      this.isOpen = !this.isOpen;
      return;
    }
    const isCurrentlyOpen = this.navList.classList.contains('open');
    if (isCurrentlyOpen) {
      this.navList.classList.remove('open');
      this.navToggleBtn.classList.remove('open');
      this.navToggleBtn.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
    } else {
      this.navList.classList.add('open');
      this.navToggleBtn.classList.add('open');
      this.navToggleBtn.setAttribute('aria-expanded', 'true');
      this.isOpen = true;
    }
  }

  closeMenu(): void {
    if (this.navList && this.navToggleBtn) {
      this.navList.classList.remove('open');
      this.navToggleBtn.classList.remove('open');
      this.navToggleBtn.setAttribute('aria-expanded', 'false');
    }
    this.isOpen = false;
  }

  setActiveRoute(routeName: string): void {
    this.navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === routeName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    let pageTitle = '';
    let heroText = '';
    switch (routeName) {
      case 'home':
        pageTitle = 'Home';
        heroText = '✨ Home · Cosmic Core ✨';
        break;
      case 'about':
        pageTitle = 'About';
        heroText = '🌌 About · Digital Alchemist 🌌';
        break;
      case 'portfolio':
        pageTitle = 'Portfolio';
        heroText = '⚡ Portfolio · Creative Engineering ⚡';
        break;
      case 'resume':
        pageTitle = 'Resume';
        heroText = '📄 Resume · Experience & Skills 📄';
        break;
      case 'contact':
        pageTitle = 'Contact';
        heroText = '📬 Contact · Let’s Collaborate 📬';
        break;
      default:
        pageTitle = 'Home';
        heroText = '✨ Home · Cosmic Core ✨';
    }

    if (this.dynamicHeading) this.dynamicHeading.innerText = heroText;
    if (this.activeRouteLabelSpan) this.activeRouteLabelSpan.innerText = pageTitle;
  }

  onNavClick(event: Event, route: string): void {
    event.preventDefault();
    const path = route === 'home' ? '/' : route;
    this.router.navigate([path]);
    this.setActiveRoute(route);
    this.closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private renderCosmicSkills(): void {
    const container = document.getElementById('techGalaxy');
    if (!container) return;
    container.innerHTML = '';

    this.skills.forEach(skill => {
      const percent = Number(skill.proficiency || 0);
      const offset = this.CIRCUMFERENCE - (percent / 100) * this.CIRCUMFERENCE;
      const gradientId = `cosmicGrad-${skill.id}`;

      const card = document.createElement('div');
      card.className = 'tech-card';
      card.setAttribute('data-proficiency', `${percent}`);
      card.setAttribute('data-skill', skill.name);
      card.innerHTML = `
        <div class="tech-icon">
          <i class="${skill.icon || 'fas fa-code'}"></i>
        </div>
        <div class="tech-name">${skill.name}</div>
        <div class="proficiency-ring">
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8b5cf6" />
                <stop offset="50%" stop-color="#c084fc" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
            </defs>
            <circle class="bg-ring" cx="50" cy="50" r="37" stroke-width="5" fill="none" />
            <circle class="progress-ring" cx="50" cy="50" r="37" stroke="url(#${gradientId})" stroke-width="5" fill="none"
                    stroke-dasharray="${this.CIRCUMFERENCE}" stroke-dashoffset="${this.CIRCUMFERENCE}" />
          </svg>
          <div class="percent-value">
            ${percent}<small>%</small>
          </div>
        </div>
        <div class="tech-sparkle">
          <i class="fas fa-bolt"></i> <span>expertise</span> <i class="fas fa-charging-station"></i>
        </div>
      `;

      container.appendChild(card);
      card.setAttribute('data-offset', `${offset}`);
    });

    const allCards = Array.from(container.querySelectorAll<HTMLElement>('.tech-card'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target as HTMLElement;
          const offset = card.getAttribute('data-offset');
          const circle = card.querySelector('.progress-ring') as SVGCircleElement | null;
          if (circle && offset && !card.classList.contains('animated-ring')) {
            circle.style.strokeDashoffset = offset;
            card.classList.add('animated-ring');
          }
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.3 });

    allCards.forEach(card => observer.observe(card));
    allCards.forEach(card => {
      card.addEventListener('mousemove', (event: Event) => {
        const e = event as MouseEvent;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.05)`;
        this.createParticleBurst(e.clientX, e.clientY, card.getAttribute('data-skill') || 'skill');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.3s';
        setTimeout(() => { card.style.transition = ''; }, 300);
      });
      card.addEventListener('click', () => {
        const skillName = card.getAttribute('data-skill');
        const percent = card.getAttribute('data-proficiency');
        this.showFloatingMessage(skillName || 'Skill', percent || '0');
      });
    });
  }

  private createParticleBurst(x: number, y: number, skillName: string): void {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.left = `${x}px`;
    particleContainer.style.top = `${y}px`;
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '9999';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.innerHTML = '<i class="fas fa-star"></i>';
      particle.style.position = 'absolute';
      particle.style.left = '0px';
      particle.style.top = '0px';
      particle.style.color = `hsl(${Math.random() * 60 + 260}, 80%, 65%)`;
      particle.style.fontSize = `${Math.random() * 10 + 8}px`;
      particle.style.opacity = '1';
      particle.style.transition = 'all 0.6s ease-out';
      particle.style.pointerEvents = 'none';
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      particleContainer.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(${tx}px, ${ty}px)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => particle.remove(), 600);
    }
    setTimeout(() => particleContainer.remove(), 700);
  }

  private showFloatingMessage(skill: string, percent: string): void {
    const msg = document.createElement('div');
    msg.innerText = `⚡ ${skill} · ${percent}% Mastery ⚡`;
    msg.style.position = 'fixed';
    msg.style.bottom = '30px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = 'linear-gradient(135deg, #1e1b4b, #2e1065)';
    msg.style.color = '#c084fc';
    msg.style.padding = '12px 24px';
    msg.style.borderRadius = '60px';
    msg.style.fontWeight = 'bold';
    msg.style.fontSize = '0.9rem';
    msg.style.setProperty('backdrop-filter', 'blur(12px)');
    msg.style.border = '1px solid #8b5cf6';
    msg.style.zIndex = '10000';
    msg.style.fontFamily = 'monospace';
    msg.style.boxShadow = '0 0 20px rgba(139,92,246,0.5)';
    msg.style.animation = 'fadeUpOut 1.5s ease forwards';
    document.body.appendChild(msg);

    if (!document.getElementById('navbar-floating-message-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'navbar-floating-message-styles';
      styleSheet.textContent = `
        @keyframes fadeUpOut {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          70% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    setTimeout(() => msg.remove(), 1500);
  }

  private initCosmicParticles(): void {
    const canvas = document.getElementById('cosmicCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; alpha: number; color: string; pulse: number }> = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = (count = 110) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          color: '#8b5cf6',
          pulse: Math.random() * Math.PI * 2
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        const glow = Math.sin(p.pulse) * 0.2 + 0.4;
        const alpha = glow * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.fill();
      });
      this.cosmicAnimationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', this.cosmicResizeHandler);
    resize();
    initParticles();
    animate();
  }

  private resizeCosmicCanvas(): void {
    const canvas = document.getElementById('cosmicCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initMouseGlow(): void {
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;
    glow.style.position = 'fixed';
    glow.style.width = '24px';
    glow.style.height = '24px';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.background = 'rgba(139, 92, 246, 0.35)';
    glow.style.boxShadow = '0 0 18px rgba(139, 92, 246, 0.65)';
    glow.style.transform = 'translate(-50%, -50%)';
    glow.style.zIndex = '9999';
  }

  private addExtraAnimation(): void {
    if (document.getElementById('navbar-cosmic-animation-styles')) return;
    const style = document.createElement('style');
    style.id = 'navbar-cosmic-animation-styles';
    style.textContent = `
      .navbar-galaxy {
        position: relative;
        overflow: hidden;
        padding: 30px 0 24px;
      }
      .tech-galaxy {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 18px;
        position: relative;
        z-index: 2;
      }
      .tech-card {
        background: rgba(15, 18, 33, 0.72);
        border: 1px solid rgba(139, 92, 246, 0.25);
        border-radius: 28px;
        padding: 18px;
        min-height: 230px;
        color: #e5e7eb;
        box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        transition: transform 0.28s ease, box-shadow 0.28s ease;
        position: relative;
        overflow: hidden;
      }
      .tech-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 28px 60px rgba(124, 58, 237, 0.35);
      }
      .tech-icon {
        width: 54px;
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        background: rgba(99, 102, 241, 0.16);
        color: #c084fc;
        margin-bottom: 16px;
      }
      .tech-icon i {
        font-size: 1.4rem;
      }
      .tech-name {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 14px;
      }
      .proficiency-ring {
        position: relative;
        width: 100px;
        height: 100px;
        margin-bottom: 16px;
      }
      .proficiency-ring svg {
        width: 100%;
        height: 100%;
      }
      .bg-ring {
        stroke: rgba(255,255,255,0.08);
      }
      .progress-ring {
        stroke-linecap: round;
        transition: stroke-dashoffset 1.2s cubic-bezier(0.2, 0.9, 0.4, 1.2);
      }
      .percent-value {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1.05rem;
        color: #eef2ff;
      }
      .percent-value small {
        font-size: 0.75rem;
        margin-left: 4px;
        color: #a78bfa;
      }
      .tech-sparkle {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        color: #a78bfa;
      }
      .tech-sparkle i {
        color: #8b5cf6;
      }
      .cosmic-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }
      .mouse-glow {
        position: fixed;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        pointer-events: none;
        background: rgba(139, 92, 246, 0.35);
        box-shadow: 0 0 18px rgba(139, 92, 246, 0.65);
        transform: translate(-50%, -50%);
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);
  }

  ngAfterViewInit(): void {
    this.navToggleBtn = document.getElementById('navToggleBtn');
    this.navList = document.getElementById('navList');
    this.navLinks = Array.from(document.querySelectorAll('.nav-link')) as HTMLElement[];
    this.dynamicHeading = document.getElementById('dynamicHeading');
    this.activeRouteLabelSpan = document.getElementById('activeRouteLabel');
    this.brandLink = document.getElementById('brandLink');
    this.creativeNav = document.getElementById('creativeNav');

    this.navLinks.forEach(link => {
      const routeValue = link.getAttribute('data-route');
      if (routeValue) {
        const handler = (e: Event) => {
          e.preventDefault();
          this.onNavClick(e, routeValue);
        };
        link.addEventListener('click', handler);
        this.navLinkHandlers.push({ el: link, handler });
      }
    });

    if (this.navToggleBtn) {
      this.navToggleBtn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    if (this.brandLink) {
      this.brandLink.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.router.navigate(['/']);
        this.setActiveRoute('home');
        this.closeMenu();
      });
    }

    document.addEventListener('click', this.documentClickHandler);
    window.addEventListener('scroll', this.windowScrollHandler);
    window.addEventListener('resize', this.resizeHandler);

    const currentRoute = this.router.url.replace('/', '') || 'home';
    const normalizedRoute = ['home', 'about', 'portfolio', 'resume', 'contact'].includes(currentRoute)
      ? currentRoute
      : 'home';
    this.setActiveRoute(normalizedRoute);

    if (window.innerWidth <= 860) {
      this.closeMenu();
    }

    // Cosmic UI moved to HomeComponent; navbar no longer initializes it.

    console.log('✨ Creative Navbar ready — Angular integrated');
  }

  ngOnDestroy(): void {
    this.navLinkHandlers.forEach(({ el, handler }) => {
      el.removeEventListener('click', handler);
    });
    this.navLinkHandlers = [];

    document.removeEventListener('click', this.documentClickHandler);
    window.removeEventListener('scroll', this.windowScrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    // Navbar no longer manages cosmic animation listeners
  }
}
