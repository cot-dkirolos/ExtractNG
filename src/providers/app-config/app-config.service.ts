
import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare const jQuery: any;

@Injectable()
export class AppConfig {

  private appConfigUsersGroupsURL = `http://shelby.corp.toronto.ca:9080/c3api_config/v2/ConfigService.svc/ConfigSet('Extract/AppConfig_usersGroups/usersGroups.json')/ConfigContent`;
  private appConfigUsersURL = `http://shelby.corp.toronto.ca:9080/c3api_config/v2/ConfigService.svc/ConfigSet('Extract/AppConfig_users/users.json')/ConfigContent`;
  private appConfigDataURL = `http://shelby.corp.toronto.ca:9080/c3api_config/v2/ConfigService.svc/ConfigSet('Extract/AppConfig_data/app_data.json')/ConfigContent`;

  config: any = null;
  private userRoles: any = null;
  public usersGroups: any = null;
  private users: any = null;

  constructor() {
  }

  /**
    * Use to get the data found in AppConfig file
    */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * Get User role
   */
  public getUserRole(key: any) {
    return this.userRoles[key];
  }
  /**
   * Get user group
   */
  public getUserGroup(key: any) {
    return this.usersGroups[key];
  }
  /**
   * Get user configuration
   */
  public getUser(key: any) {
    const user = JSON.parse(JSON.stringify(this.users[key]));
    if (user) {

      const group = this.newObject(this.getUserGroup(user.groupID));
      const roles = this.newObject(this.getUserRole(group.roleKey));
      const divisions = this.newObject(group.divisions[0]);
      //  7. configure user object
      user.role = roles;
      user.group = group;
      user.dataSources = roles.extractCategory;
      user.divisions = divisions;
      delete user.group['divisions'];
      delete user['groupID'];
      delete user.role['extractCategory'];
      return user;

    } else {
      return null;
    }

    // return this.users[key];
  }
  public getCurrentUser() {
    const user = JSON.parse(JSON.stringify(this.users[jQuery.cookie('extract.cot_uname')]));
    if (user) {

      const group = this.newObject(this.getUserGroup(user.groupID));
      const roles = this.newObject(this.getUserRole(group.roleKey));
      const divisions = this.newObject(group.divisions[0]);
      //  7. configure user object
      user.role = roles;
      user.group = group;
      user.dataSources = roles.extractCategory;
      user.divisions = divisions;
      delete user.group['divisions'];
      delete user['groupID'];
      delete user.role['extractCategory'];
      return user;

    } else {
      return null;
    }
  }

  public getUsersList() {
    let currentUser = this.getCurrentUser();
    if (currentUser) {
      let group = currentUser.group;
      let role = currentUser.role;
      let divisions = currentUser.divisions;
      const dataSources = currentUser.dataSources;
      const users = JSON.parse(JSON.stringify(this.users));
      let us = [];
      for (const key in users) {
        const u = this.getUser(key);
        if (divisions && divisions == 'all') {
          for (let index = 0; index < dataSources.length; index++) {
            let dataSource = dataSources[index];
            if (this.isSameSourceCategory(u, dataSource) && u.userID !== currentUser.userID) {
              us.push(u);
              break;
            }

          }
        } else {
          for (let index = 0; index < dataSources.length; index++) {
            let dataSource = dataSources[index];

            if (this.isSameDataSourceAndDivision(u, dataSource, currentUser.divisions) && u.userID !== currentUser.userID) {
              us.push(u);
              break;
            }
          }
        }
      }
      return us.length == 0 ? null : us;
    }
  }

  private isSameDataSourceAndDivision(user, source, division) {
    if (user) {
      for (let index = 0; index < user.dataSources.length; index++) {
        const dataSource = user.dataSources[index];
        if (dataSource === source && user.divisions === division) {
          return true;
        }

      }
    }
    return false;
  }

  private isSameSourceCategory(user, source) {
    if (user) {
      for (let index = 0; index < user.dataSources.length; index++) {
        const dataSource = user.dataSources[index];
        if (dataSource === source) {
          return true;
        }

      }
    }
    return false;
  }

  public getSourceCategoryLabel(key) {
    for (let index = 0; index < this.config.categoryList.length; index++) {
      const element = this.config.categoryList[index];
      if (element.value === key) {
        return element.label;
      }
    }
    return null;
  }
  public getDivisionLabel(key) {
    for (let index = 0; index < this.config.divisionsList.length; index++) {
      const element = this.config.divisionsList[index];
      if (element.value === key) {
        return element.label;
      }
    }
    return null;
  }

  getDivionsList(withEmpty?: boolean) {
    const user = this.getCurrentUser();
    const divisions = [];
    if (withEmpty) {
      divisions.push({ value: null, label: 'All' });
    }
    this.getConfig('divisionsList').forEach(element => {
      divisions.push(element);
    });
    // divisions = this.getConfig('divisionsList');
    if (user && user.divisions === 'all') {
      return divisions;
    } else if (user && user.divisions) {
      const divs = [];
      for (let index = 0; index < divisions.length; index++) {
        const element = divisions[index];
        if (element.value === user.divisions) {
          divs.push(element);
          return divs;
        }
      }
      return null;
    } else {
      return null;
    }
  }

  getSourceCategoryList(withEmpty?: boolean) {
    const user = this.getCurrentUser();
    // const cats = this.getConfig('categoryList');
    const cats = [];
    this.getConfig('categoryList').forEach(element => {
      cats.push(element);
    });
    if (user && user.dataSources && user.dataSources.length > 0) {
      const catsList = [];
      if (withEmpty) {
        catsList.push({ value: null, label: 'All' });
      }
      for (let index = 0; index < user.dataSources.length; index++) {
        const userCat = user.dataSources[index];
        for (let x = 0; x < cats.length; x++) {
          const cat = cats[x];
          if (userCat === cat.value) {
            catsList.push(cat);
          }
        }
      }
      return catsList;
    } else {
      return null;
    }
  }

   getUserGroupsList(withEmpty?: boolean) {
    const user = this.getCurrentUser();
    let groups = [];
    if (withEmpty) {
      groups.push({ value: null, label: '' });
    }

    for (var key in this.usersGroups) {
      if (this.usersGroups.hasOwnProperty(key)) {
        var element = this.usersGroups[key];
        groups.push({value: element.groupID, label: element.name});
      }
    }
    // this.usersGroups.forEach(element => {
    //   groups.push({value: element.groupID, label: element.name});
    // });

    if(user.role.key === 'super_admin'){
      return groups;
    }

    if(user.role.key === 'emp_admin' ){
      for (var index = 0; index < groups.length; index++) {
        var group = groups[index];
        if(group.value.startsWith('odata') || group.value.startsWith('swms') ){
          delete groups[index];
        }
      }
      return groups;
    }
    if(user.role.key === 'odata_admin' ){
      for (var index = 0; index < groups.length; index++) {
        var group = groups[index];
        if(group.value.startsWith('emp') || group.value.startsWith('swms') ){
          delete groups[index];
        }
      }
      return groups;
    }
    if(user.role.key === 'swms_admin' ){
      for (var index = 0; index < groups.length; index++) {
        var group = groups[index];
        if(group.value.startsWith('emp') || group.value.startsWith('odata') ){
          delete groups[index];
        }
      }
      return groups;
    }

    if(user.role.key === 'division_admin' ){
      for (var index = 0; index < groups.length; index++) {
        var group = groups[index];
        if(!group.value.contains(user.divisions) ){
          delete groups[index];
        }
      }
      return groups;
    }

    return null;

  }

  public load(http: Http) {
    return new Promise((resolve, reject) => {

      http.get(this.appConfigDataURL).map(res => res.json()).catch((error: any): any => {
        console.log('Configuration file "Extract/AppConfig_data/app_data.json" could not be read');
        resolve(true);
        return Observable.throw(error.json().error || 'Server error');
      }).subscribe((configResponse) => {
        this.config = (typeof configResponse === 'string') ? JSON.parse(configResponse) : configResponse;
        this.userRoles = this.config.userRoles;
        console.log(this.config);
        console.log(this.userRoles);

        let userGroupsRequest: any = null;
        userGroupsRequest = http.get(this.appConfigUsersGroupsURL);
        if (userGroupsRequest) {
          userGroupsRequest
            .map(res => res.json())
            .catch((error: any) => {
              console.error('Error reading "Extract/AppConfig_usersGroups/usersGroups.json" configuration file');
              resolve(error);
              return Observable.throw(error.json().error || 'Server error');
            })
            .subscribe((userGroupsResponseData) => {
              this.usersGroups = userGroupsResponseData;

              console.log(this.usersGroups);

              let usersRequest: any = null;
              usersRequest = http.get(this.appConfigUsersURL);
              if (usersRequest) {
                usersRequest
                  .map(res => res.json())
                  .catch((error: any) => {
                    console.error('Error reading "Extract/AppConfig_usersGroups/usersGroups.json" configuration file');
                    resolve(error);
                    return Observable.throw(error.json().error || 'Server error');
                  })
                  .subscribe((usersResponseData) => {
                    this.users = usersResponseData;
                    console.log(this.users);
                    resolve(true);
                  });
              } else {
                console.error('Config file is not valid');
                resolve(true);
              }
              // resolve(true);
            });
        } else {
          console.error('Config file is not valid');
          resolve(true);
        }
      });

    });
  }

  newObject(object: any) {

    return object ? JSON.parse(JSON.stringify(object)) : null;
  }
}
