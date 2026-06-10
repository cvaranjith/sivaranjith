import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contact: any = null;

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        this.contact = data.contact;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    const name = form.value.name || '';
    const email = form.value.email || '';
    const message = form.value.message || '';
    this.sendToWhatsApp(name, email, message);
    setTimeout(() => form.resetForm(), 500);
  }

  sendToWhatsApp(name: string, email: string, message: string): void {
    if (!this.contact || !this.contact.phone) {
      this.showToast('WhatsApp number not configured');
      return;
    }
    let phone = (this.contact.phone || '').replace(/\s/g, '');
    let clean = phone.replace('+', '').trim();
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    const formattedMsg = `*New Contact Message*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Message:* ${encodeURIComponent(message)}`;
    const waUrl = `https://wa.me/${clean}?text=${formattedMsg}`;
    window.open(waUrl, '_blank');
    this.showToast('Opening WhatsApp...');
  }

  showToast(msg: string): void {
    const existing = document.querySelector('.toast-notify');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notify';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
  }
}
