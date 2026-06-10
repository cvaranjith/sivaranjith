import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit {
  project: any = null;
  loading = true;
  descriptionList: string[] = [];
  // lightbox state
  lightboxOpen = false;
  currentImageIndex = 0;

  private keyHandler = (e: KeyboardEvent) => {
    if (!this.lightboxOpen) return;
    if (e.key === 'ArrowRight') this.nextImage();
    if (e.key === 'ArrowLeft') this.prevImage();
    if (e.key === 'Escape') this.closeLightbox();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileDataService: ProfileDataService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        // try to find in portfolio first, then in projects
        const fromPortfolio = Array.isArray(data.portfolio) ? data.portfolio.find((p: any) => p.id === id) : null;
        const fromProjects = Array.isArray(data.projects) ? data.projects.find((p: any) => p.id === id) : null;
        this.project = fromPortfolio || fromProjects || null;
        // prepare description list for template
        if (this.project && this.project.description) {
          if (typeof this.project.description === 'string') {
            this.descriptionList = [this.project.description];
          } else if (typeof this.project.description === 'object') {
            this.descriptionList = Object.values(this.project.description).filter(v => !!v).map(v => String(v));
          } else {
            this.descriptionList = [];
          }
        } else {
          this.descriptionList = [];
        }
        // normalize project shape for modalImages
        if (this.project && !Array.isArray(this.project.modalImages)) {
          this.project.modalImages = [];
        }
      }
      this.loading = false;
    });

    document.addEventListener('keydown', this.keyHandler);
  }

  goBack() {
    this.router.navigate(['/portfolio']);
  }

  openLightbox(index: number) {
    if (!this.project || !this.project.modalImages) return;
    this.currentImageIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }

  nextImage() {
    if (!this.project || !this.project.modalImages) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.project.modalImages.length;
  }

  prevImage() {
    if (!this.project || !this.project.modalImages) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.project.modalImages.length) % this.project.modalImages.length;
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyHandler);
  }
}
