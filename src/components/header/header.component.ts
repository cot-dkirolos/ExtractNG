import { Router } from '@angular/router';
import { AuthenticationService } from './../../providers/auth/authentication.service';
import { AfterViewInit, Component, OnChanges, SimpleChange } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../../model/interfaces';

import { SharedService } from '../../providers/index';

declare var my_app: any;
declare var jQuery: any;
@Component({
  // moduleId: module.id,
  selector: 'app-header-component',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  constructor(public sharedService: SharedService, public authService: AuthenticationService, private router: Router) {


  }

  ngAfterViewInit() {
    this.sharedService.extract_app.setTitle('Extract Tool');

    if (!jQuery.cookie('fontsize')) {
      jQuery.cookie('fontsize', '1em');
      this.sharedService.setFontSize('1em', true);
    } else {
      this.sharedService.setFontSize(jQuery.cookie('fontsize'), false);
    }
  }

  get fullName() {
    if (this.authService.isLoggedIn()) {
      this.authService.loadUserInfo();
      return this.authService.firstName + ' ' + this.authService.lastName;
    }
  }

}
