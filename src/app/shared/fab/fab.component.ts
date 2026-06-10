import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {
  showSocialMenu = false;
  links: Array<{key:string,name:string,url:string,icon?:string}> = [];
  contact: any = null;

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      const social = data?.contact?.socialLinks || {};
      this.contact = data?.contact || null;
      const map: any = {
        linkedin: { name: 'LinkedIn', icon: 'fab fa-linkedin-in' },
        github: { name: 'GitHub', icon: 'fab fa-github' },
        gitlab: { name: 'GitLab', icon: 'fab fa-gitlab' },
        instagram: { name: 'Instagram', icon: 'fab fa-instagram' },
        twitter: { name: 'Twitter', icon: 'fab fa-twitter' },
        facebook: { name: 'Facebook', icon: 'fab fa-facebook-f' },
        whatsapp: { name: 'WhatsApp', icon: 'fab fa-whatsapp' }
      };
      this.links = Object.keys(map)
        .filter(k => (k === 'whatsapp') ? !!this.contact?.phone : !!social[k])
        .map(k => ({ key: k, name: map[k].name, url: k === 'whatsapp' ? this.contact?.phone : social[k], icon: map[k].icon }));
    });
  }

  toggleSocialMenu(evt?: Event): void {
    if (evt) evt.stopPropagation();
    this.showSocialMenu = !this.showSocialMenu;
  }

  closeSocialMenu(): void { this.showSocialMenu = false; }

  openWhatsApp(): void {
    if (!this.contact?.phone) return;
    let phone = (this.contact.phone || '').replace(/\s/g, '');
    let clean = phone.replace('+', '').trim();
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    const msg = encodeURIComponent('Hello! I found your profile and would like to connect.');
    const url = `https://wa.me/${clean}?text=${msg}`;
    window.open(url, '_blank');
    this.closeSocialMenu();
  }

  openSocialLink(url?: string, key?: string): void {
    if (!url) return;
    const target = url.startsWith('http') ? url : `https://${url}`;
    window.open(target, '_blank');
    this.closeSocialMenu();
  }

  getLinkUrl(key: string): string | undefined {
    const item = this.links.find(l => l.key === key);
    return item?.url;
  }

  hasLink(key: string): boolean {
    return !!this.getLinkUrl(key);
  }
}
