import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './home/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PortfolioModalComponent } from './shared/portfolio-modal/portfolio-modal.component';
import { PortfolioDetailComponent } from './pages/portfolio-detail/portfolio-detail.component';
import { ScrollAnimateDirective } from './shared/scroll-animate.directive';
import { FabComponent } from './shared/fab/fab.component';
// import { ScrollAnimateDirective } from './shared/scroll-animate.directive';




@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    AboutComponent,
    ResumeComponent,
    PortfolioComponent,
    ContactComponent,
    PortfolioDetailComponent,
    NavbarComponent,
    FooterComponent,
    PortfolioModalComponent,
    FabComponent,
    ScrollAnimateDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
