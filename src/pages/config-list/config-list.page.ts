import { AppConfig } from './../../providers/app-config/app-config.service';
import { Configuration } from './../../model/config';
import { SharedService } from './../../providers/shared/shared.service';
import { Router } from '@angular/router';
import { ConfigurationListObj, Schedule, ConfigContent } from './../../model/interfaces';
import { ExtractService } from './../../providers/extract/extract.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SelectItem, MenuItem, TabView } from 'primeng/primeng';
import * as moment from 'moment';
declare var jQuery: any;
declare var Pikaday: any;

@Component({
  selector: 'config-list',
  templateUrl: 'config-list.page.html',
  styleUrls: ['config-list.page.scss']
})
export class ConfigListPage implements OnInit, AfterViewInit {

  @ViewChild('tabView') tv: TabView;

  loading: boolean;

  activeIndex: number;

  configurationList: any;
  usersList: any;

  items: MenuItem[];

  selectedConf: any;

  // user: any;

  constructor(private extractService: ExtractService, private router: Router, public sharedService: SharedService, public appConfig: AppConfig) {
    this.items = [
      {
        label: 'Configure', icon: 'fa-tasks', command: () => {
          this.navigateToModify(this.selectedConf);
        }
      },
      {
        label: 'Clone', icon: 'fa-files-o', command: () => {
          this.navigateToClone(this.selectedConf);
        }
      }
    ];
    this.activeIndex = 0;
    this.sharedService.user = this.appConfig.getCurrentUser();
    this.usersList = this.appConfig.getUsersList();
    if (this.usersList && this.usersList.length > 0) {
      for (let index = 0; index < this.usersList.length; index++) {
        let u = this.usersList[index];
        if (u.divisions.toLowerCase() === 'all') {
          u.divisions = 'All';
        } else {
          u.divisions = appConfig.getDivisionLabel(u.divisions);
        }
        let categories = [];
        for (let x = 0; x < u.dataSources.length; x++) {
          let ds = u.dataSources[x];
          categories.push(appConfig.getSourceCategoryLabel(ds));
          // if (x = 0) {
          //   u.categories = u.categories + appConfig.getSourceCategoryLabel(ds);
          // } else {
          //   u.categories = u.categories + ', ' + appConfig.getSourceCategoryLabel(ds);
          // }

        }
        u.dataSources = categories;
      }
    }
    console.log(this.sharedService.user);

  }

  ngOnInit() {
    this.sharedService.setBreadcurmb([{ name: 'Confirgurations List', link: '/#/home' }], true);
      this.loading = true;
      this.getExtractList(this.sharedService.user.dataSources, this.sharedService.user.divisions).then(result => {
        
        // let rs = this.configurationList;

        // console.log("result:" + rs + ',length:' + rs.length);
        // let finalList = [];
        // for (var index = 0; index < rs.length; index++) {
        //   let element = rs[index];

        //   if (element.sourceCategory === 'OpenData') {
        //     element.sourceCategory = 'odata';
        //   } else {
        //     element.sourceCategory = 'epm';
        //   }



        //   // console.log(element);
        //   const body = btoa(JSON.stringify(element));
        //   let data = null;
        //   if (element.sourceCategory === 'epm') {
        //     data = {
        //       QualifiedName: 'Extract/EPM_' + element.group + '/id_' + element.pmID + '.json',
        //       ConfigContent: body,
        //       ContentType: 'application/json'
        //     };
        //     finalList.push(data);
        //   }
        // }
        // console.log(finalList.length);

        // for (let index = 0; index < finalList.length; index++) {
        //   const content = finalList[index];
        //   const configContent = JSON.parse(atob(content.ConfigContent));
        //   this.extractService.checkIfpmIDExist('id_'+configContent.pmID).then(result => {
        //     console.log("Config ID : " + configContent.pmID + ", Exist:" + result);
        //     if (!result) {
        //       this.extractService.saveExtractConf(content).subscribe(result => {
        //         this.sharedService.block = false;
        //         console.log(result);
        //       },
        //         err => {
        //           this.sharedService.block = false;
        //           console.error(err.json());
        //         });
        //     }
        //   });
        // }
      });


  }

  ngAfterViewInit() {
  }

  getExtractList(sources, division) {
    this.configurationList = [];
    const cs = [];
    return new Promise((resolve, reject) => {
      this.extractService.getExtractListBySource(sources, division).subscribe(list => {
        for (let index = 0; index < list.value.length; index++) {
          const conf = list.value[index];
          const tempConf = JSON.parse(window.atob(conf.ConfigContent));
          const src = (<string>conf.GroupName).substr(0, (<string>conf.GroupName).indexOf('_')).toLowerCase();

          tempConf.sourceCategory = this.appConfig.getSourceCategoryLabel(src);
          tempConf.division = this.appConfig.getDivisionLabel((<string>conf.GroupName).substr((<string>conf.GroupName).indexOf('_') + 1).toLowerCase());
          cs.push(tempConf);
        }
        this.configurationList = cs;
        this.loading = false;
        // console.log(JSON.stringify(this.configurationList));
        resolve(this.configurationList);
      },
        err => {
          this.loading = false;
          reject(false);
        });
    });
  }


  handleTabChange(e) {
    this.activeIndex = e.index;
  }

  navigateToNew() {
    if (this.tv.tabs[this.activeIndex].header === 'EPM') {
      this.router.navigate(['/newConf'], { queryParams: { type: 'epm' } });
    } else if (this.tv.tabs[this.activeIndex].header === 'OpenData') {
      this.router.navigate(['/newConf'], { queryParams: { type: 'odata' } });
    } else if (this.tv.tabs[this.activeIndex].header === 'SWMS') {
      this.router.navigate(['/newConf'], { queryParams: { type: 'swms' } });
    } else {
      this.router.navigate(['/newConf']);
      console.log('unknown source tab');
    }
  }
  navigateToNewUser() {
    this.router.navigate(['/newUser']);
  }

  navigateToModify(conf) {

    console.log(conf);
    let id = '';
    if (conf.sourceCategory.toLowerCase() == 'odata' || conf.sourceCategory.toLowerCase() == 'opendata') {
      id = conf.dataset;
    } else {
      id = conf.id;
    }
    this.router.navigate(['/modifyConf'],
      {
        queryParams:
        {
          type: (conf.sourceCategory.toLowerCase() == 'odata' || conf.sourceCategory.toLowerCase() == 'opendata' ? 'odata' : conf.sourceCategory) || '',
          div: conf.group,
          id: id || '',
          pmid: conf.pmID
        }
      });
  }

  navigateToClone(conf) {

    let configToClone = this.sharedService.newObject(conf);

    let id = '';
    if (configToClone.sourceCategory && (configToClone.sourceCategory.toLowerCase() == 'odata' || configToClone.sourceCategory.toLowerCase() == 'opendata')) {
      configToClone.sourceCategory = 'odata';
    } else {
      if(configToClone.sourceCategory){
        configToClone.sourceCategory = configToClone.sourceCategory.toLowerCase();

      }
    }
    this.sharedService.paramsToPass = { 'configToClone': configToClone };
    this.router.navigate(['/newConf']);
  }

  navigateToUpdateUser(user) {
    this.sharedService.paramsToPass = { user: JSON.parse(JSON.stringify(this.getUserIgnoreCase(user.userID))) };

    this.router.navigate(['/updateUser']);
  }

  getUserIgnoreCase(userID) {
    userID = (userID + '').toLowerCase();
    for (var u in this.appConfig.users) {
      if (this.appConfig.users.hasOwnProperty(u) && userID == (u + "").toLowerCase()) {
        return this.appConfig.users[u];
      }
    }

  }

}
