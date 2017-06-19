import { Router } from '@angular/router';
import { ExtractService } from './../../providers/extract/extract.service';
import { SharedService } from './../../providers/shared/shared.service';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService, Message } from 'primeng/primeng';
declare var jQuery: any;
@Component({
  selector: 'app-update-user',
  templateUrl: 'update-user.page.html',
  styleUrls: ['update-user.page.scss']
})

export class UpdateUserPage implements OnInit {

  user: any;

  msgs: Message[] = [];

  userGroups: SelectItem[];
  constructor(
    public sharedService: SharedService
    , private appConfig: AppConfig
    , private extratService: ExtractService
    , private router: Router
    , private confirmationService: ConfirmationService) {
    if (sharedService.paramsToPass && sharedService.paramsToPass.user) {
      this.user = this.sharedService.newObject(sharedService.paramsToPass.user);
      console.log(this.user);


      this.setBreadCrumb();
      this.userGroups = [];
      this.userGroups = appConfig.getUserGroupsList(false);
      console.log(this.user);

    } else {
      router.navigate(['/home']);
    }

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
        name: 'Update User'
      }
    ], true);
  }

  saveUser(isValid, value) {
    console.log(value);


    this.sharedService.block = true;

    jQuery('#savedMsg').html('');
    if (isValid) {
      if (!this.isUserExist(value.userID)) {
        this.sharedService.block = false;
        jQuery('#savedMsg').html('<span class="badResultCode">User not exist.</span>');
      } else {
        jQuery('#savedMsg').show();
        jQuery('#savedMsg').html('Saving...');
        const users = this.sharedService.newObject(this.appConfig.users);
        users[value.userID] = {
          userID: value.userID.toLowerCase(),
          name: value.name,
          groupID: value.groupID
        };


        const body = btoa(JSON.stringify(users));
        let data;
        const qualifiedName = 'Extract/AppConfig_users/users.json';
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

  deleteUser() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        jQuery('#savedMsg').show();
        jQuery('#savedMsg').html('Deleting...');
        this.sharedService.block = true;
        this.msgs = [];

        let users = this.sharedService.newObject(this.appConfig.users);
        this.user.userID = (this.user.userID + '').toLowerCase();
        for (let u in users) {
          if (users.hasOwnProperty(u) && this.user.userID == (u + "").toLowerCase()) {
            delete users[u];
          }
        }


        const body = btoa(JSON.stringify(users));
        let data;
        const qualifiedName = 'Extract/AppConfig_users/users.json';
        data = {
          QualifiedName: qualifiedName,
          ConfigContent: body,
          ContentType: 'application/json',
        }


        this.extratService.updateUsers(data).subscribe(result => {
          this.sharedService.block = false;
          this.appConfig.users = users;
          this.msgs.push({ severity: 'success', summary: 'Deleted', detail: 'User deleted' });
          this.sharedService.msgs = this.msgs;
          this.sharedService.block = false;
          this.router.navigate(['/home']);

        },
          err => {
            this.sharedService.block = false;
            console.error(err.json());
            jQuery('#savedMsg').html('<span class="badResultCode">' + err.json().error.message + '</span>');
          });

      }
    });
  }


}
