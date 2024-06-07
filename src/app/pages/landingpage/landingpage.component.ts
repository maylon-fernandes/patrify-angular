import { Component, HostListener, ElementRef, Directive, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})


export class LandingpageComponent implements AfterViewInit {


  
  constructor(private router: Router) { }

  login () {
    this.router.navigate (['login']);
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from("#contentOne-title", {
      y: -100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.contentOne',
        start: "top 60%",
        end: "bottom bottom",
      }
    })

    gsap.from("#contentOne-subtitle", {
      x: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.contentOne',
        start: "top 60%",
        end: "bottom bottom",
      }
    })

    gsap.from("#outtext", {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.contentTwo',
        start: "top 60%",
        end: "bottom bottom",
      }
    })


    gsap.from('#card1', {
      y: -100,
      duration: 2,
      opacity: 0,
      ease: "Power3.out",
      scrollTrigger: {
        trigger: ".contentTwo",
        start: "25% 60%",
        end: "bottom 75%",
        
      }
    })
    gsap.from('#card2', {
      y: -100,
      duration: 2,
      opacity: 0,
      delay: 0.2,
      ease: "Power3.out",
      scrollTrigger: {
        trigger: ".contentTwo",
        start: "25% 60%",
        end: "bottom 75%",
        
      }
    })
    gsap.from('#card3', {
      y: -100,
      duration: 2,
      opacity: 0,
      delay: 0.4,
      ease: "Power3.out",
      scrollTrigger: {
        trigger: ".contentTwo",
        start: "25% 60%",
        end: "bottom 75%",
      }
    })
    gsap.from('#card4', {
      y: -100,
      duration: 2,
      opacity: 0,
      delay: 0.6,
      ease: "Power3.out",
      scrollTrigger: {
        trigger: ".contentTwo",
        start: "25% 60%",
        end: "bottom 75%",
        
      }
    })

    gsap.from('#contentThree-title', {
      x: -100,
      duration: 0.5,
      opacity: 0,
      ease: "Power3.out",
      scrollTrigger: {
        trigger: ".contentThree ",
        start: "25% 60%",
        end: "bottom 75%",
      }
    })
    
  }
  

  

}
