import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  days: any;
  mySidenav: any;
  showBackToTop: boolean = false;
  isMenuOpen: boolean = false;
  
  // Profile data from service
  profileData: any;
  about: any;
  expertise: any[] = [];
  experience: any[] = [];
  education: any[] = [];
  hobbies: any[] = [];
  statistics: any[] = [];
  technologies: any[] = [];
  portfolio: any[] = [];
  contact: any;
  footer: any;
 
  constructor(private profileDataService: ProfileDataService) {
    this.setGreeting();
  }

  Skill: any[] = [
    {
      "name": 'HTML',
      "datapre": '90%'
    }, {
      "name": 'CSS',
      "datapre": '78%'
    },
    {
      "name": 'JS',
      "datapre": '75%'
    },
    {
      "name": 'JQuery',
      "datapre": '66%'
    },
    {
      "name": 'AJAX',
      "datapre": '66%'
    },
    {
      "name": 'Wordpress',
      "datapre": '60%'
    },
    {
      "name": 'PHP',
      "datapre": '82%'
    },
    {
      "name": 'Python',
      "datapre": '60%'
    },
    {
      "name": 'MySQL',
      "datapre": '80%'
    },
    {
      "name": 'MongoDB',
      "datapre": '55%'
    },
    {
      "name": 'Docker',
      "datapre": '55%'
    },
  ];

  ngOnInit(): void {
    this.loadProfileData();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = window.pageYOffset > 500;
  }

  /**
   * Set greeting based on time of day
   */
  private setGreeting(): void {
    var day = new Date();
    var hr = day.getHours();
    if (hr >= 0 && hr < 12) {
      this.days = "Good Morning!";
    } else if (hr == 12) {
      this.days = "Good Noon!";
    } else if (hr >= 12 && hr <= 17) {
      this.days = "Good Afternoon!";
    } else {
      this.days = "Good Evening!";
    }
  }

  /**
   * Load all profile data from service
   */
  private loadProfileData(): void {
    this.profileDataService.getProfileData().subscribe(data => {
      if (data) {
        this.profileData = data;
        this.about = data.about;
        this.expertise = data.expertise;
        this.experience = data.experience;
        this.education = data.education;
        this.hobbies = data.hobbies;
        this.statistics = data.statistics;
        this.technologies = data.technologies;
        this.portfolio = data.portfolio || [];
        this.contact = data.contact;
        this.footer = data.footer;
      }
    });
  }

  // Toggle mobile menu
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Navigation scroll method
  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.isMenuOpen = false; // Close mobile menu if open
    }
  }

  // Form submission handler
  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form submitted:', form.value);
      // Add your form submission logic here
      alert('Thank you for your message! I will get back to you soon.');
      form.resetForm();
    }
  }
}