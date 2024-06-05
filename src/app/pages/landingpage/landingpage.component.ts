import { Component, HostListener, ElementRef, Directive, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

  constructor(private router: Router) { }

  login () {
    this.router.navigate (['login']);
  }
}
