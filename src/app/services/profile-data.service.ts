import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ProfileData {
  about: any;
  objective: any;
  hobbies: any[];
  expertise: any[];
  experience: any[];
  education: any[];
  statistics: any[];
  technologies: any[];
  skills: any[];
  portfolio: any[];
  projects: any[];
  contact: any;
  footer: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  private profileDataSubject = new BehaviorSubject<ProfileData | null>(null);
  public profileData$ = this.profileDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProfileData();
  }

  /**
   * Load profile data from JSON file
   */
  loadProfileData(): void {
    this.http.get<ProfileData>('assets/data/profile-data.json').subscribe(
      (data) => {
        this.profileDataSubject.next(data);
      },
      (error) => {
        console.error('Error loading profile data:', error);
      }
    );
  }

  /**
   * Get all profile data
   */
  getProfileData(): Observable<ProfileData | null> {
    return this.profileData$;
  }

  /**
   * Get about information
   */
  getAbout(): Observable<any> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.about || null);
      });
    });
  }

  /**
   * Get objective information
   */
  getObjective(): Observable<any> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.objective || null);
      });
    });
  }

  /**
   * Get expertise areas
   */
  getExpertise(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.expertise || []);
      });
    });
  }

  /**
   * Get experience data
   */
  getExperience(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.experience || []);
      });
    });
  }

  /**
   * Get education data
   */
  getEducation(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.education || []);
      });
    });
  }

  /**
   * Get hobbies
   */
  getHobbies(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.hobbies || []);
      });
    });
  }

  /**
   * Get statistics
   */
  getStatistics(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.statistics || []);
      });
    });
  }

  /**
   * Get technologies
   */
  getTechnologies(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.technologies || []);
      });
    });
  }

  /**
   * Get skills
   */
  getSkills(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.skills || []);
      });
    });
  }

  /**
   * Get portfolio projects
   */
  getPortfolio(): Observable<any[]> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.portfolio || []);
      });
    });
  }

  /**
   * Get contact information
   */
  getContact(): Observable<any> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.contact || null);
      });
    });
  }

  /**
   * Get footer information
   */
  getFooter(): Observable<any> {
    return new Observable(observer => {
      this.profileData$.subscribe(data => {
        observer.next(data?.footer || null);
      });
    });
  }
}
