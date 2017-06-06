import { SharedService } from './../../providers/shared/shared.service';
import { AuthenticationService } from './../../providers/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtractService } from './../../providers/extract/extract.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  // moduleId: module.id,
  selector: 'app-login-page',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy {
  sub: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
    ,private sharedService:SharedService) {
    this.sub = this.route.url.subscribe(urls => {
      if (this.authService.isLoggedIn()) {
        let load = !urls[0].path || urls[0].path == 'login' || urls[0].path == '' ? this.router.navigate(['/home']) : null;
      }

    }
    );

  }

  ngOnInit() {
    this.sharedService.setBreadcurmb([{name: 'Extract Tool'}],true);
    this.sub = this.route.url.subscribe(urls => {
      if (this.authService.isLoggedIn()) {
        let load = !urls[0].path || urls[0].path == 'login' || urls[0].path == '' ? this.router.navigate(['/home']) : null;
      }

    }
    );

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
