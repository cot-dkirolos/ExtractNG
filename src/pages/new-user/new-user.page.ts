import { environment } from './../../environments/environment.bugatti';
import { ExtractService } from './../../providers/extract/extract.service';
import { SharedService } from './../../providers/shared/shared.service';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
declare var jQuery: any;
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
    , private appConfig: AppConfig
    , private extratService: ExtractService) {
    this.newUser = new Object();
    this.setBreadCrumb();
    this.userGroups = [];
    this.userGroups = sharedService.newObject(appConfig.getUserGroupsList(false));
    this.newUser.groupID = this.userGroups[0].value;

  }


  ngOnInit() { }
  ngAfterViewInit() {
    this.sharedService.block = false;

  }
  setBreadCrumb() {
    this.sharedService.setBreadcurmb([
      {
        name: 'Configurations List',
        // link: this.sharedService.contextPath + '/#/home'
        link: './#/home'
      },
      {
        name: 'New User'
      }
    ], true);
  }

  saveUser(isValid, value) {
    // console.log(value);


    this.sharedService.block = true;

    jQuery('#savedMsg').html('');
    if (isValid) {
      if (this.isUserExist(value.userID)) {
        this.sharedService.block = false;
        jQuery('#savedMsg').html('<span class="badResultCode">User ID already exist</span>');
      } else {
        jQuery('#savedMsg').show();
        jQuery('#savedMsg').html('Saving...');
        const users = this.sharedService.newObject(this.appConfig.users);
        users[value.userID.toLowerCase()] = {
          userID: value.userID.toLowerCase(),
          name: value.name,
          groupID: value.groupID
        };


        const body = btoa(JSON.stringify(users));
        let data;
        const qualifiedName = '' + environment.configAPIAppName + '/AppConfig_users/users.json';
        data = {
          QualifiedName: qualifiedName,
          ConfigContent: body,
          ContentType: 'application/json',
        }


        this.extratService.updateUsers(data).subscribe(result => {
          this.sharedService.block = false;
          this.appConfig.users = users;
          jQuery('#savedMsg').html('<span class="goodResultCode">Saved</span>');
          jQuery('#savedMsg').fadeOut(3000);

        },
          err => {
            this.sharedService.block = false;
            console.error(err.json());
            jQuery('#savedMsg').html('<span class="badResultCode">' + err.json().error.message + '</span>');
          });
      }

    } else {
      this.sharedService.block = false;
    }

  }

  isUserExist(userID) {
    userID = (userID + '').toLowerCase();
    for (var u in this.appConfig.users) {
      if (this.appConfig.users.hasOwnProperty(u) && userID == (u + "").toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}
