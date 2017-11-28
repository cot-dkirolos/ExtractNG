import { environment } from './../../environments/environment.sit';
import { DataTable } from './../../components/datatable/datatable.component';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { Configuration } from './../../model/config';
import { SharedService } from './../../providers/shared/shared.service';
import { Router } from '@angular/router';
import { ConfigurationListObj, Schedule, ConfigContent } from './../../model/interfaces';
import { ExtractService } from './../../providers/extract/extract.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SelectItem, MenuItem, TabView, Message } from 'primeng/primeng';
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
  @ViewChild('mdt') mdt: DataTable;

  msg: Message[] = [];

  loading: boolean;

  activeIndex: number;

  configurationList: any;
  enabledConfigurationList: any;
  usersList: any;

  items: MenuItem[];
  metaDataMenu: MenuItem[];

  selectedConf: any;

  metaDataList: any;

  updatedMetadatList = [];

  msgs: Message[] = [];

  // user: any;

  constructor(private extractService: ExtractService, private router: Router, public sharedService: SharedService, public appConfig: AppConfig) {

    this.items = [
      // {
      //   label: 'Configure', icon: 'fa-tasks', command: () => {
      //     this.navigateToModify(this.selectedConf);
      //   }
      // },
      {
        label: 'Clone', icon: 'fa-files-o', command: () => {
          this.navigateToClone(this.selectedConf);
        }
      }
    ];

    this.metaDataMenu = [];
    this.metaDataMenu.push( {
      label: 'Export CSV', icon: 'fa-list', command: () => {
        this.exportCSV();
      }
    })
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
    // console.log(this.sharedService.user);



  }

  ngOnInit() {

    this.sharedService.setBreadcurmb([{ name: 'Configurations List', link: './#/home' }], true);
    this.loading = true;
    this.getExtractList(this.sharedService.user.dataSources, this.sharedService.user.divisions).then(result => {
      this.sharedService.block = false;
    });

  }

  ngAfterViewInit() {
  }

  getExtractList(sources, division) {
    this.configurationList = [];
    this.enabledConfigurationList = [];
    this.metaDataList = [];
    const cs = [];
    const mcs = [];
    return new Promise((resolve, reject) => {
      this.extractService.getMetaDataListBySource(sources, division).subscribe(list => {
        console.log('====================================');
        console.log(list.metaData);
        console.log('====================================');
        for (let index = 0; index < list.metaData.length; index++) {
          const conf = list.metaData[index];
          conf.col_isPrivate = JSON.parse(conf.col_isPrivate);
          // const src = (<string>conf.sourceCategory.toLowerCase());

          // conf.sourceCategoryL = this.appConfig.getSourceCategoryLabel(src);
          // conf.divisionL = this.appConfig.getDivisionLabel(conf.division.toLowerCase());
          mcs.push(conf);
        }
        this.metaDataList = mcs;
        console.log('====================================');
        console.log(this.metaDataList);
        console.log('====================================');
      },
        err => {
          this.loading = false;
        });

      this.extractService.getExtractListBySource(sources, division).subscribe(list => {
        for (let index = 0; index < list.value.length; index++) {
          const conf = list.value[index];
          const tempConf = JSON.parse(window.atob(conf.ConfigContent));
          const src = (<string>tempConf.sourceCategory.toLowerCase());

          tempConf.sourceCategory = this.appConfig.getSourceCategoryLabel(src);
          tempConf.division = this.appConfig.getDivisionLabel(tempConf.group.toLowerCase());
          cs.push(tempConf);
        }
        this.configurationList = cs;
        // this.hasMetadataList = cs;

        this.enabledConfigurationList = cs;
        this.mdt.expandedRows = this.enabledConfigurationList;
        this.loading = false;
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

    // console.log(conf);
    let id = '';
    if (conf.sourceCategory.toLowerCase() === 'odata' || conf.sourceCategory.toLowerCase() == 'opendata') {
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
      if (configToClone.sourceCategory) {
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
    for (let u in this.appConfig.users) {
      if (this.appConfig.users.hasOwnProperty(u) && userID == (u + '').toLowerCase()) {
        return this.appConfig.users[u];
      }
    }

  }

  toggleEnable(e, conf) {
    this.sharedService.block = true;
    const body = btoa(JSON.stringify(conf));
    let data;
    let qualifiedName;
    // if (conf.sourceCategory === 'odata' ) {
    if (conf.sourceCategory === 'odata' || conf.sourceCategory === 'OpenData') {
      qualifiedName = '' + environment.configAPIAppName + '/OData_' + conf.group + '/aggregator/' + conf.dataset + '.json';
      data = {
        QualifiedName: qualifiedName,
        ConfigContent: body,
        ContentType: 'application/json',
        APIName: 'aggregator'
      };
    } else {
      conf.dataset = null;
      qualifiedName = '' + environment.configAPIAppName + '/EPM_' + conf.group + '/id_' + conf.pmID + '.json';

      data = {
        QualifiedName: qualifiedName,
        ConfigContent: body,
        ContentType: 'application/json'
      };

    }
    if (data) {
      jQuery('#savedMsg').show();
      jQuery('#savedMsg').html('Saving...');
      // console.log(data);
      this.extractService.updateExtractConf(qualifiedName, data).subscribe(result => {
        this.sharedService.block = false;

        this.msg.push({
          severity: 'success', summary: 'Saved', detail: 'Extract configuration ' +
          (conf.enabled ? 'enabled' : 'disabled') + ' successfully'
        });
        this.sharedService.msgs = this.msg;
        // console.log(result);
        jQuery('#savedMsg').html('<span class="goodResultCode">Saved</span>');
        jQuery('#savedMsg').fadeOut(3000);
        this.msg = [];

      },
        err => {
          this.sharedService.block = false;
          console.log(err.json());
          this.msg.push({
            severity: 'error', summary: 'Failed', detail: 'Failed to ' +
            (conf.enabled ? 'enable' : 'disable') + ' the Extract configuration, ' + err.json().error.message
          });
          this.sharedService.msgs = this.msg;
          jQuery('#savedMsg').html('<span class="badResultCode">' + err.json().error.message + '</span>');
          // jQuery('#savedMsg').html('<span class="badResultCode">Could not save, please try again later.</span>');

          // jQuery('#savedMsg').fadeOut(3000);
          this.msg = [];
          conf.enabled = !conf.enabled;
        });
    } else {
      this.sharedService.block = false;
    }

  }


  public exportCSV() {
    let data = this.metaDataList;
    let csv = '\ufeff';


    //headers
    const columnsHeaders = [
      'sourceCategoryLabel',
      'divisionLabel',
      'pmID',
      'name',
      'col_name',
      'col_type',
      'col_description',
      'col_isPrivate'
    ];

    csv += [
      'Source Category',
      'Division',
      'Extract ID',
      'Extract Name',
      'Column Name',
      'Column Type',
      'Column Description',
      'Column is Private'
    ] + ',';

    //body
    data.forEach((record, i) => {
      csv += '\n';
      for (let i = 0; i < columnsHeaders.length; i++) {
        if (columnsHeaders[i]) {
          csv += '"' + this.resolveFieldData(record, columnsHeaders[i]) + '"';

          if (i < (columnsHeaders.length - 1)) {
            csv += ',';
          }
        }
      }
    });

    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, 'MetaData.csv');
    }
    else {
      let link = document.createElement("a");
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'MetaData.csv');
        link.click();
      }
      else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  resolveFieldData(data: any, field: string): any {
    if (data && field) {
      if (field.indexOf('.') == -1) {
        return data[field];
      }
      else {
        let fields: string[] = field.split('.');
        let value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    }
    else {
      return null;
    }
  }

  metaDataChanged(data, event) {

    let confIndx = -1;
    for (let index = 0; index < this.updatedMetadatList.length; index++) {
      const element = this.updatedMetadatList[index];
      if(element.pmID == data.pmID && element.col_name == data.col_name){
        confIndx = index;
      }
    }
    if(confIndx > -1){
      this.updatedMetadatList[confIndx] = data;
    }else{
      this.updatedMetadatList.push(data);
    }

  }

  updateMetaData(){

    const data = {
      metaData: this.updatedMetadatList,
      sourceCategory :  typeof this.sharedService.user.dataSources === 'string' ? this.sharedService.user.dataSources.toUpperCase() : this.sharedService.user.dataSources.join().toUpperCase() ,
      division : typeof this.sharedService.user.divisions === 'string' ? this.sharedService.user.divisions.toUpperCase() : this.sharedService.user.divisions.join().toUpperCase(),
    }

    this.extractService.updateMetaData(data).subscribe( result => {
      // console.log(result);
      if(result.code == 200 ){
      this.msgs.push({ severity: 'success', summary: 'Updated', detail: result.message });
      this.metaDataList = result.metaData;
      } else if(result.code == 0 ){
        this.msgs.push({ severity: 'warn', summary: 'Warning', detail: result.message });
        this.metaDataList = result.metaData;
      }else{
        this.msgs.push({ severity: 'error', summary: 'Failed', detail: result.message });
      }

      this.sharedService.block = true;
      this.sharedService.msgs = this.msgs;
      this.sharedService.block = false;
      // this.router.navigate(['/home']);
    },
      err => {
        this.msgs.push({ severity: 'error', summary: 'Failed', detail: 'Failed to update Metadata' });
        this.sharedService.msgs = this.msgs;
        this.sharedService.block = false;
      });
  }
}
