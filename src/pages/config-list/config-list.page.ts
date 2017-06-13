import { AppConfig } from './../../providers/app-config/app-config.service';
import { Configuration } from './../../model/config';
import { SharedService } from './../../providers/shared/shared.service';
import { Router } from '@angular/router';
import { ConfigurationListObj, Schedule } from './../../model/interfaces';
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

  // user: any;

  constructor(private extractService: ExtractService, private router: Router, public sharedService: SharedService, public appConfig: AppConfig) {
    this.items = [
      {
        label: 'Configure', icon: 'fa-tasks', command: (event) => {
          this.navigateToModify(event);
        }
      },
      {
        label: 'Delete', icon: 'fa-close', command: () => {
          // this.delete();
        }
      },
      { label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io' },
      { label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming'] }
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
    if (!this.configurationList) {
      this.loading = true;
      this.getExtractList(this.sharedService.user.dataSources, this.sharedService.user.divisions);

    }


  }

  ngAfterViewInit() {
  }

  getExtractList(sources, division) {
    this.configurationList = [];
    const cs = [];
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

    },
      err => {
        this.loading = false;
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
     let target = conf.target || conf.srcElement || conf.currentTarget;
    let idAttr = target.attributes.id;
    let ids = idAttr.nodeValue;
    console.log(ids);

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

  navigateToUpdateUser(user) {
    this.sharedService.data = { user: JSON.parse(JSON.stringify(this.getUserIgnoreCase(user.userID))) };
    console.log(this.sharedService.data);

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
