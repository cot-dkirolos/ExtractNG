import { SharedService } from './../../providers/shared/shared.service';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-new-user',
  templateUrl: 'new-user.page.html',
  styleUrls: ['new-user.page.scss']
})

export class NewUserPage implements OnInit {

  newUser: any;

  userGroups: SelectItem[];
  constructor(
    public sharedService: SharedService
    , private appConfig: AppConfig) {
    this.newUser = new Object();
    this.setBreadCrumb();
    this.userGroups = [];
    this.userGroups = appConfig.getUserGroupsList(false);

  }


  ngOnInit() { }
  ngAfterViewInit() {
    this.sharedService.block = false;

  }
  setBreadCrumb() {
    this.sharedService.setBreadcurmb([
      {
        name: 'Home',
        link: this.sharedService.contextPath + '/#/home'
      },
      {
        name: 'New User'
      }
    ], true);
  }

  saveUser(isValid, value) {

  }
}
