import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  projects: any[] = [];
  port:any[] = [];

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        // sort by id descending (max -> min) so newest/highest id shows first
        this.portfolio = (data.portfolio || []).slice().sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        this.projects = (data.projects || []).slice().sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        this.port = this.portfolio;

        // ensure thumbnails exist or set placeholder
        console.log('portfolio items before thumbnail check:', this.port);
        const ensureThumb = (item: any) => {
          if (!item.thumbnail) {
            item.thumbnail = 'https://placehold.co/600x400/1E293B/3B82F6?text=' + encodeURIComponent(item.name || item.modalTitle || 'Project');
          }
          const img = new Image();
          img.onerror = () => { item.thumbnail = 'https://placehold.co/600x400/1E293B/3B82F6?text=' + encodeURIComponent(item.name || item.modalTitle || 'Project'); };
          img.src = item.thumbnail;
        };

        // only ensure thumbnails for local portfolio items
        this.portfolio.forEach(p => ensureThumb(p));
      }
    });
  }

  // In-template fallback for <img> tags if used elsewhere
  onImgError(event: any, project: any) {
    event.target.src = 'https://placehold.co/600x400/1F2A44/60A5FA?text=Preview+Unavailable';
  }
}
