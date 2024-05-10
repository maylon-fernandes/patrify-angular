import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

    constructor(private router: Router) { }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) { // Check if token exists
        this.router.navigate(['/login']); // Redirect to login if not found
        return false;
      }
  
      // If you have token validation logic, add it here
      // e.g., check token expiration, validity, etc.
  
      return true; // Allow navigation if token is valid
    }
  }