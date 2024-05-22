import { Component, OnInit  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.substring(1).toUpperCase();
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url.substring(1).toUpperCase();
        console.log(this.currentRoute);
      }
    });
  }
}
