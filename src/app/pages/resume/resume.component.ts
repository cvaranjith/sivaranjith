import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  experience: any[] = [];
  education: any[] = [];
  skills: any[] = [];
  about: any = {};

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        this.about = data.about || {};
        this.experience = data.experience || [];
        this.education = data.education || [];
        this.skills = data.skills || [];
      }
    });
  }

  downloadResume(): void {
    const url = this.about?.resumeUrl;
    if (url) {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.download = url.split('/').pop() || 'resume.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return;
    }

    const expText = this.experience.map(e => `${e.position} at ${e.company} (${e.duration})`).join('\n');
    const eduText = this.education.map(ed => `${ed.degree} ${ed.qualification} — ${ed.institution} (${ed.duration})`).join('\n');
    const skillText = this.skills.map(s => `${s.name} (${s.proficiency}%)`).join(', ');

    const resumeContent = `SIVARANJITH S - FULL STACK ENGINEER\n\n` +
      `Phone: ${this.about.phone || ''} | Email: ${this.about.email || ''}\n` +
      `Location: ${this.about.city || ''}, ${this.about.residency || ''}\n\n` +
      `PROFESSIONAL EXPERIENCE:\n${expText}\n\n` +
      `EDUCATION:\n${eduText}\n\n` +
      `SKILLS:\n${skillText}\n\n` +
      `Years Experience: ${this.about.yearsOfExperience || ''}`;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Sivaranjith_Resume.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
