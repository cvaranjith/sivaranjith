import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  about: any = null;
  objective: any = null;
  technologies: any[] = [];
  expertise: any[] = [];
  statistics: any[] = [];
  experience: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  portfolio: any[] = [];
  selectedPortfolioItem: any | null = null;
  expandedProject: number | null = null;
  socialLinks: any = {};
  showSocialMenu: boolean = false;

  private countersStarted = false;
  private statsAnimationFrameId: number | null = null;
  private expertiseAnimationFrameId: number | null = null;
  private animationFrameId: number | null = null;
  private observer: IntersectionObserver | null = null;

  private aboutData: any = {
    yearsOfExperience: 8,
    name: 'Seraphina Voss',
    title: 'Digital Alchemist'
  };

  // Skills loaded from profile-data.json (used by cosmic UI)
  public skills: any[] = [];

  // Handlers and state for cosmic animation
  private cosmicAnimationFrameId: number | null = null;
  private cosmicResizeHandler: (() => void) | null = null;
  private mouseGlowHandler: ((e: MouseEvent) => void) | null = null;
  public circumference = 2 * Math.PI * 37;

  
  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        this.about = data.about || this.aboutData;
        this.technologies = data.technologies || [];
        this.expertise = data.expertise || [];
        this.statistics = data.statistics || [];
        this.projects = data.projects || [];
        this.portfolio = data.portfolio || [];
        this.socialLinks = data.contact?.socialLinks || {};
        console.log('home page ', this.about, this.technologies, this.expertise, this.statistics, this.portfolio);
        setTimeout(() => {
          this.setupExpertiseEffects();
        }, 200);
      }
    });

    this.profileDataService.getExperience().subscribe(experience => {
      this.experience = experience || [];
    });

    this.profileDataService.getEducation().subscribe(education => {
      this.education = education || [];
    });

    this.profileDataService.getSkills().subscribe(skills => {
      this.skills = skills || [];
      if (this.skills.length) {
        setTimeout(() => {
          this.initCosmicParticles();
          this.initMouseGlow();
          this.addExtraAnimation();
        }, 150);
      }
    });

    // objective data (separate observable exposed by service)
    this.profileDataService.getObjective().subscribe(obj => {
      this.objective = obj || null;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeStats();
      this.setupParticleCanvas();
      this.setupCardTilt();
      this.setupInteractiveElements();
    }, 100);
  }

  // --- MD script port: cosmic skills UI ---
  private renderCosmicSkills() {
    const container = document.getElementById('techGalaxy');
    if (!container || !this.skills) return;

    if (!document.getElementById('cosmic-styles')) {
      const style = document.createElement('style');
      style.id = 'cosmic-styles';
      style.innerHTML = `
        .floating-message { position: absolute; pointer-events: none; transform: translate(-50%,-50%); font-weight:600; }
        .particle { position:absolute; border-radius:50%; pointer-events:none; mix-blend-mode:screen; }
      `;
      document.head.appendChild(style);
    }

    if (!container.querySelector('.cosmic-render')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'cosmic-render';
      wrapper.style.position = 'relative';
      wrapper.style.minHeight = '220px';

      this.skills.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.display = 'inline-block';
        card.style.width = '150px';
        card.style.margin = '12px';
        card.style.textAlign = 'center';
        card.style.padding = '12px';
        card.style.borderRadius = '8px';
        card.style.background = 'rgba(255,255,255,0.04)';
        card.style.color = '#fff';
        card.innerHTML = `
          <div style="font-size:28px;margin-bottom:8px"><i class="${s.icon || 'fas fa-star'}"></i></div>
          <div style="font-weight:600">${s.name}</div>
          <div style="font-size:12px;opacity:0.85">${s.proficiency}%</div>
        `;
        card.addEventListener('mouseenter', (ev) => this.createParticleBurst(ev as MouseEvent, card));
        wrapper.appendChild(card);
      });

      container.appendChild(wrapper);
    }
  }

  private createParticleBurst(e: MouseEvent, host: Element) {
    const rect = host.getBoundingClientRect();
    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;
    const colors = ['#5EE7DF', '#8A5BFF', '#FF7AC6', '#FFD76A'];

    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 6 + Math.random() * 8;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.opacity = '0.95';
      p.style.transform = 'translate(-50%,-50%)';
      p.style.transition = 'transform 700ms cubic-bezier(.17,.67,.34,1), opacity 700ms';

      host.appendChild(p);

      requestAnimationFrame(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 60;
        p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 800);
    }

    this.showFloatingMessage(host as HTMLElement, '+' + Math.floor(1 + Math.random() * 5));
  }

  onSkillMousemove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
  }

  onSkillMouseleave(card: HTMLElement): void {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  }

  onSkillClick(skill: any, event: MouseEvent, card: HTMLElement): void {
    this.createParticleBurst(event, card);
    this.showFloatingMessage(card, `${skill.name} · ${skill.proficiency}% mastery`);
  }

  private showFloatingMessage(host: HTMLElement, text: string) {
    const rect = host.getBoundingClientRect();
    const msg = document.createElement('div');
    msg.className = 'floating-message';
    msg.style.left = `${rect.left + rect.width / 2}px`;
    msg.style.top = `${rect.top + 10}px`;
    msg.style.color = '#fff';
    msg.style.fontSize = '14px';
    msg.innerText = text;
    document.body.appendChild(msg);

    requestAnimationFrame(() => {
      msg.style.transition = 'transform 900ms ease-out, opacity 900ms';
      msg.style.transform = 'translate(-50%,-40px)';
      msg.style.opacity = '0';
    });

    setTimeout(() => msg.remove(), 900);
  }

  private initCosmicParticles() {
    const area = document.getElementById('techGalaxy');
    if (!area) return;

    let canvas = area.querySelector<HTMLCanvasElement>('canvas.cosmic-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'cosmic-bg';
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      (area as HTMLElement).style.position = 'relative';
      area.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    const resize = () => {
      (canvas as HTMLCanvasElement).width = area.clientWidth * devicePixelRatio;
      (canvas as HTMLCanvasElement).height = area.clientHeight * devicePixelRatio;
      ctx && ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resize();
    this.cosmicResizeHandler = resize;
    window.addEventListener('resize', resize);

    const particles: Array<{x:number,y:number,vx:number,vy:number,r:number,c:string,life:number}> = [];
    for (let i = 0; i < 30; i++) {
      particles.push({ x: Math.random() * area.clientWidth, y: Math.random() * area.clientHeight, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2, r: 1+Math.random()*2, c: 'rgba(255,255,255,0.06)', life: 100+Math.random()*200 });
    }

    const frame = () => {
      if (!ctx) return;
      ctx.clearRect(0,0,area.clientWidth, area.clientHeight);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 1;
        if (p.x < 0 || p.x > area.clientWidth) p.vx *= -1;
        if (p.y < 0 || p.y > area.clientHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
      this.cosmicAnimationFrameId = requestAnimationFrame(frame);
    };

    frame();
  }

  private initMouseGlow() {
    const handler = (e: MouseEvent) => {
      const el = document.querySelector('.mouse-glow') as HTMLElement | null;
      if (!el) {
        const glow = document.createElement('div');
        glow.className = 'mouse-glow';
        glow.style.position = 'fixed';
        glow.style.width = glow.style.height = '140px';
        glow.style.borderRadius = '50%';
        glow.style.pointerEvents = 'none';
        glow.style.background = 'radial-gradient(circle at center, rgba(140,90,255,0.18), rgba(0,0,0,0))';
        glow.style.transform = 'translate(-50%,-50%)';
        glow.style.zIndex = '9999';
        document.body.appendChild(glow);
      }
      const glowEl = document.querySelector('.mouse-glow') as HTMLElement;
      glowEl.style.left = e.clientX + 'px';
      glowEl.style.top = e.clientY + 'px';
    };
    this.mouseGlowHandler = handler;
    window.addEventListener('mousemove', handler);
  }

  private addExtraAnimation() {
    const heading = document.querySelector('.expertise-heading') as HTMLElement | null;
    if (!heading) return;
    heading.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 2200, iterations: Infinity });
  }

  private animateCounter(element: HTMLElement | null, start: number, end: number, duration = 1800): void {
    if (!element) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.innerText = currentValue.toString();
      if (progress < 1) {
        this.statsAnimationFrameId = window.requestAnimationFrame(step);
      } else {
        element.innerText = end.toString();
      }
    };
    this.statsAnimationFrameId = window.requestAnimationFrame(step);
  }

  private parseStatisticValue(value: string): { numeric: number | null; suffix: string } {
    const match = value?.toString()?.match(/^(\d+)([+%])?/);
    if (!match) {
      return { numeric: null, suffix: '' };
    }
    return { numeric: Number(match[1]), suffix: match[2] || '' };
  }

  getStatisticSuffix(value?: string): string {
    return this.parseStatisticValue(value || '').suffix;
  }

  private populateTechBadges(): void {
    const techMetaContainer = document.getElementById('techMetaList');
    if (!techMetaContainer) return;
    techMetaContainer.innerHTML = '';
    const displayTechs = this.technologies.slice(0, 5);
    displayTechs.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'tech-badge';
      badge.innerHTML = `<i class="fas fa-code"></i> ${tech.name}`;
      techMetaContainer.appendChild(badge);
    });
    if (this.technologies.length > 5) {
      const moreBadge = document.createElement('span');
      moreBadge.className = 'tech-badge';
      moreBadge.innerHTML = `<i class="fas fa-ellipsis-h"></i> +${this.technologies.length - 5} more`;
      techMetaContainer.appendChild(moreBadge);
    }
    const techCard = document.getElementById('techCard');
    if (techCard) {
      techCard.addEventListener('click', (e: Event) => {
        if ((e.target as HTMLElement).closest('.tech-badge')) return;
        alert(`✨ Full Stack: ${this.technologies.map((t: any) => t.name).join(', ')} ✨`);
      });
    }
  }

  private initializeStats(): void {
    const statsGrid = document.querySelector('.stats-grid');

    if (statsGrid) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.countersStarted) {
            this.countersStarted = true;
            this.statistics.forEach(stat => {
              const card = document.getElementById(`statCard${stat.id}`);
              const counterSpan = card?.querySelector('.counter-value');
              if (counterSpan) {
                const parsed = this.parseStatisticValue(stat.number);
                if (parsed.numeric !== null) {
                  this.animateCounter(counterSpan as HTMLElement, 0, parsed.numeric, 1400);
                } else {
                  (counterSpan as HTMLElement).innerText = stat.number;
                }
              }
            });
            this.populateTechBadges();
            this.setupInteractiveElements();
            if (this.observer) {
              this.observer.unobserve(statsGrid);
            }
          }
        });
      }, { threshold: 0.4 });
      this.observer.observe(statsGrid);
    } else {
      setTimeout(() => {
        this.statistics.forEach(stat => {
          const card = document.getElementById(`statCard${stat.id}`);
          const counterSpan = card?.querySelector('.counter-value');
          if (counterSpan) {
            const parsed = this.parseStatisticValue(stat.number);
            if (parsed.numeric !== null) {
              this.animateCounter(counterSpan as HTMLElement, 0, parsed.numeric, 1400);
            } else {
              (counterSpan as HTMLElement).innerText = stat.number;
            }
          }
        });
        this.populateTechBadges();
      }, 300);
    }
  }

  private setupCardTilt(): void {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        (card as HTMLElement).style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      });
    });
  }

  private setupParticleCanvas(): void {
    const canvas = document.getElementById('statsParticleCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: ParticleStat[] = [];

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = (count = 55) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new ParticleStat(width, height));
      }
    };

    const animateParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });
      this.statsAnimationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles(55);
    });

    resizeCanvas();
    initParticles(55);
    animateParticles();
  }

  private setupInteractiveElements(): void {
    const statMetaDivs = document.querySelectorAll('.stat-meta');
    statMetaDivs.forEach(meta => {
      meta.addEventListener('mouseenter', () => {
        (meta as HTMLElement).style.transition = 'all 0.2s';
        (meta as HTMLElement).style.transform = 'translateY(-2px)';
      });
      meta.addEventListener('mouseleave', () => {
        (meta as HTMLElement).style.transform = 'translateY(0px)';
      });
    });

    const techBadges = document.querySelectorAll('.tech-badge');
    if (techBadges.length) {
      techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
          (badge as HTMLElement).style.transform = 'scale(1.05)';
        });
        badge.addEventListener('mouseleave', () => {
          (badge as HTMLElement).style.transform = 'scale(1)';
        });
      });
    }
  }

  private setupExpertiseEffects(): void {
    this.initializeExpertiseParticles();
    this.initializeExpertiseReveal();
  }

  getExpertiseIcon(title: string): string {
    if (!title) return 'fas fa-code';
    const lower = title.toLowerCase();
    if (lower.includes('web')) return 'fas fa-globe';
    if (lower.includes('application')) return 'fas fa-mobile-alt';
    if (lower.includes('fullstack')) return 'fas fa-layer-group';
    return 'fas fa-code';
  }

  getExpertiseGradient(id: number): string {
    const gradients = [
      'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(6,182,212,0.02))',
      'linear-gradient(135deg, rgba(192,132,252,0.05), rgba(59,130,246,0.02))',
      'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(14,165,233,0.02))'
    ];
    return gradients[(id - 1) % gradients.length];
  }

  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      'Angular': 'fab fa-angular',
      'IONIC': 'fas fa-mobile-alt',
      'React JS': 'fab fa-react',
      'Laravel': 'fab fa-laravel',
      'Python': 'fab fa-python',
      'PHP': 'fab fa-php',
      'HTML': 'fab fa-html5',
      'CSS': 'fab fa-css3-alt',
      'JS': 'fab fa-js',
      'JQUERY': 'fab fa-js',
      'MySQL': 'fas fa-database',
      'postgreSQL': 'fas fa-database',
      'Express JS': 'fab fa-node-js',
      'AWS': 'fab fa-aws'
    };
    return icons[tech] || 'fas fa-code';
  }

  getProfileImageUrl(): string {
    return this.about?.bannerImg1 || 'assets/images/profile.jpg';
  }

  get featuredPortfolio(): any[] {
    return this.portfolio.slice(-3).reverse();
  }

  openPortfolioModal(project: any): void {
    this.selectedPortfolioItem = project;
    document.body.style.overflow = 'hidden';
  }

  closePortfolioModal(): void {
    this.selectedPortfolioItem = null;
    document.body.style.overflow = '';
  }

  copyEmail(): void {
    const email = this.about?.email;
    if (!email) {
      alert('Email is not available.');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        alert(`Email copied: ${email}`);
      }, () => {
        alert(`Email: ${email}`);
      });
    } else {
      alert(`Email: ${email}`);
    }
  }

  copyPhone(): void {
    const phone = this.about?.phone;
    if (!phone) {
      alert('Phone number is not available.');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone).then(() => {
        alert(`Phone copied: ${phone}`);
      }, () => {
        alert(`Phone: ${phone}`);
      });
    } else {
      alert(`Phone: ${phone}`);
    }
  }

  showLocation(): void {
    if (!this.about?.city || !this.about?.residency) {
      alert('Location not available.');
      return;
    }
    alert(`Location: ${this.about.city}, ${this.about.residency}`);
  }

  downloadResume(): void {
    const resumeUrl = this.about?.resumeUrl || 'assets/resume.pdf';
    const anchor = document.createElement('a');
    anchor.href = resumeUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.download = resumeUrl.split('/').pop() || 'resume.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  getStatisticIcon(iconClass: string): string {
    return iconClass ? iconClass : 'fas fa-chart-pie';
  }

  onStatisticClick(stat: any): void {
    const options = stat.options?.map((option: any) => `• ${option.label}`).join('\n') || 'No extra details available.';
    alert(`✨ ${stat.label} ✨\n\n${stat.number}\n\nOptions:\n${options}`);
  }

  onExpertiseCardClick(exp: any): void {
    alert(`✨ ${exp.title} ✨\n\n${exp.description}\n\n👉 Full-stack capability with cutting-edge tools.`);
  }

  onExpertiseCardMouseEnter(event: MouseEvent, card: HTMLElement): void {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${event.offsetX}px`;
    ripple.style.top = `${event.offsetY}px`;
    card.appendChild(ripple);
    window.setTimeout(() => {
      ripple.remove();
    }, 500);
  }

  onExpertiseCardMousemove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  }

  onExpertiseCardMouseleave(card: HTMLElement): void {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  }

  private initializeExpertiseReveal(): void {
    const cards = document.querySelectorAll('.expertise-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(30px)';
      (card as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  private initializeExpertiseParticles(): void {
    const canvas = document.getElementById('expertiseParticleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: ExpertiseParticle[] = [];

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = (count = 65) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new ExpertiseParticle(width, height));
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });
      this.expertiseAnimationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles(65);
    });

    resizeCanvas();
    initParticles(65);
    animate();
  }

  // Project card interactions
  toggleProjectExpand(projectId: number): void {
    this.expandedProject = this.expandedProject === projectId ? null : projectId;
  }

  showProjectToast(projectName: string): void {
    const toast = document.createElement('div');
    toast.innerText = `✨ ${projectName} — Opening...`;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'linear-gradient(135deg, #1e1b4b, #2e1065)';
    toast.style.color = '#a78bfa';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '60px';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '0.85rem';
    (toast.style as any).backdropFilter = 'blur(12px)';
    toast.style.border = '1px solid #a78bfa';
    toast.style.zIndex = '10000';
    toast.style.fontFamily = 'monospace';
    toast.style.boxShadow = '0 0 20px #a78bfacc';
    toast.style.animation = 'fadeUpOutProject 1.8s ease forwards';
    document.body.appendChild(toast);
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fadeUpOutProject {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(styleSheet);
    setTimeout(() => toast.remove(), 1800);
  }

  onProjectCardMouseEnter(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'translateY(-12px) scale(1.02)';
    }
  }

  onProjectCardMouseMove(event: MouseEvent, card: HTMLElement): void {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
  }

  onProjectCardMouseLeave(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    }
  }

  // Stat Card Interactions
  onStatCardMouseEnter(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'translateY(-8px) scale(1.01)';
    }
  }

  onStatCardMouseMove(event: MouseEvent, card: HTMLElement): void {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 40;
    const rotateY = (centerX - x) / 40;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
  }

  onStatCardMouseLeave(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    }
  }

  // Timeline Card Interactions
  onTimelineCardMouseEnter(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'translateX(8px) translateY(-6px) scale(1.01)';
    }
  }

  onTimelineCardMouseMove(event: MouseEvent, card: HTMLElement): void {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(8px) translateY(-6px) scale(1.01)`;
  }

  onTimelineCardMouseLeave(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0) translateY(0) scale(1)';
    }
  }

  // Profile Card Interactions
  onProfileCardMouseEnter(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'translateY(-10px) scale(1.01)';
    }
  }

  onProfileCardMouseMove(event: MouseEvent, card: HTMLElement): void {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.01)`;
  }

  onProfileCardMouseLeave(event: MouseEvent, card: HTMLElement): void {
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    }
  }

  // FAB Social Menu Methods
  toggleSocialMenu(event: MouseEvent): void {
    this.createFabRipple(event);
    this.showSocialMenu = !this.showSocialMenu;
  }

  closeSocialMenu(): void {
    this.showSocialMenu = false;
  }

  private createFabRipple(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    if (!button) {
      return;
    }

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);

    window.setTimeout(() => {
      ripple.remove();
    }, 500);
  }

  private showFloatingToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'floating-toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 1800);
  }

  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      'linkedin': 'fab fa-linkedin-in',
      'github': 'fab fa-github',
      'gitlab': 'fab fa-gitlab',
      'twitter': 'fab fa-twitter',
      'instagram': 'fab fa-instagram',
      'facebook': 'fab fa-facebook-f',
      'whatsapp': 'fab fa-whatsapp'
    };
    return icons[platform.toLowerCase()] || 'fas fa-link';
  }

  openSocialLink(url: string, platform: string): void {
    if (url && url !== '') {
      this.showFloatingToast(`Opening ${platform}...`);
      window.open(url, '_blank', 'noopener,noreferrer');
      this.closeSocialMenu();
    }
  }

  openWhatsApp(): void {
    const phone = this.about?.phone?.replace(/[^\d+]/g, '') || '+918778136294';
    const message = encodeURIComponent('Hi! I\'m interested in your work.');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    this.showFloatingToast('Opening WhatsApp...');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    this.closeSocialMenu();
  }

  ngOnDestroy(): void {
    if (this.statsAnimationFrameId !== null) {
      cancelAnimationFrame(this.statsAnimationFrameId);
    }
    if (this.expertiseAnimationFrameId !== null) {
      cancelAnimationFrame(this.expertiseAnimationFrameId);
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.cosmicAnimationFrameId !== null) {
      cancelAnimationFrame(this.cosmicAnimationFrameId);
    }
    if (this.cosmicResizeHandler) {
      window.removeEventListener('resize', this.cosmicResizeHandler);
      this.cosmicResizeHandler = null;
    }
    if (this.mouseGlowHandler) {
      window.removeEventListener('mousemove', this.mouseGlowHandler);
      this.mouseGlowHandler = null;
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

class ExpertiseParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.color = `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.05})`;
  }

  update(width: number, height: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class ParticleStat {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.5 + 0.8;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.color = `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1})`;
  }

  update(width: number, height: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
