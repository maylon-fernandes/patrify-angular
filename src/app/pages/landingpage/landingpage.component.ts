import { Component, HostListener, ElementRef, Directive, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements AfterViewInit {
  private currentSectionIndex = 0;
  private sections: HTMLElement[] = [];
  private isScrolling = false; // Flag to prevent rapid scrolling

  constructor(private router: Router) { }


  ngAfterViewInit() {
    this.sections = Array.from(document.querySelectorAll('.section'));
  }

  login () {
    this.router.navigate (['login']);
  }
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();

    if (this.isScrolling) return; // If already scrolling, do nothing

    this.isScrolling = true;

    const direction = event.deltaY > 0 ? 1 : -1;

    this.currentSectionIndex += direction;
    if (this.currentSectionIndex < 0) {
      this.currentSectionIndex = 0;
    } else if (this.currentSectionIndex >= this.sections.length) {
      this.currentSectionIndex = this.sections.length - 1;
    }

    this.scrollToSectionWithDelay(this.currentSectionIndex);
  }

  private scrollToSectionWithDelay(index: number) {
    this.sections[index].scrollIntoView({ behavior: 'smooth' });
    
    // Set a timeout to allow scrolling after a delay
    setTimeout(() => {
      this.isScrolling = false;
    }, 750); // Adjust the delay time as needed (in milliseconds)
  }
}
