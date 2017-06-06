import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      // logged in so return true
      return true;
    } else {
      if (route.url[0].path && route.url[0].path != "login") {
        this.router.navigate(['/login']);
        return true;
      }
      // not logged in so redirect to login page
      // this.router.navigate(['/login']);
      return false;
    }
  }
}


