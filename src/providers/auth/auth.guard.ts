import { SharedService } from './../shared/shared.service';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService, private sharedService: SharedService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      // logged in so return true
      return true;
    } else {
      if (route.url[0].path && route.url[0].path != "login") {
        this.sharedService.block = false;
        this.router.navigate(['/login']);
         setTimeout(() => {
          this.authService.displayLoginError('You are not authorized to use the Application <br> due to invalid authentication or session expired, Please try to login again',10000);
        }, 500);
        return true;
      }
      // not logged in so redirect to login page
      // this.router.navigate(['/login']);
      return false;
    }
  }
}


