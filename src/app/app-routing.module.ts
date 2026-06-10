import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfolioDetailComponent } from './pages/portfolio-detail/portfolio-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './home/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home | Sivaranjith' } },
  { path: 'about', component: AboutComponent, data: { title: 'About | Sivaranjith' } },
  { path: 'portfolio/:id', component: PortfolioDetailComponent, data: { title: 'Project | Sivaranjith' } },
  { path: 'portfolio', component: PortfolioComponent, data: { title: 'Portfolio | Sivaranjith' } },
  { path: 'resume', component: ResumeComponent, data: { title: 'Resume | Sivaranjith' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact | Sivaranjith' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile | Sivaranjith' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
