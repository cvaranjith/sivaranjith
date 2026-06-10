import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  about: any = null;
  objective: any = null;
  expertise: any[] = [];
  hobbies: any[] = [];
  statistics: any[] = [];
  experience: any[] = [];
  education: any[] = [];
  footer: any = null;

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        this.about = data.about || null;
        this.objective = data.objective || null;
        this.expertise = data.expertise || [];
        this.hobbies = data.hobbies || [];
        this.statistics = data.statistics || [];
        console.log('statistics data:', this.statistics);
        this.experience = data.experience || [];
        this.education = data.education || [];
        this.footer = data.footer || null;
      }
    });
  }

  downloadResume(event?: Event): void {
    event?.preventDefault();
    const url = this.about?.resumeUrl || 'assets/resume.pdf';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.download = url.split('/').pop() || 'resume.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}
