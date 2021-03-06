import { environment } from './../../environments/environment.java';

import { AppConfig } from './../../providers/app-config/app-config.service';
import { Configuration } from './../../model/config';

import { AceEditorDirective } from 'ng2-ace-editor';
import { SelectItem, ConfirmationService, Message } from 'primeng/primeng';
import { AceEditorComponent } from './../../components/ace-editor/ace-editor.component';
import { ConfigurationListObj, ODataConfiguration } from './../../model/interfaces';
import { SharedService } from './../../providers/shared/shared.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ExtractService } from './../../providers/extract/extract.service';
import { Component, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';


declare var jQuery: any;
declare var ace: any;
declare var Pikaday: any;
declare var Handsontable: any;



@Component({
  selector: 'app-update-config',
  templateUrl: 'update-config.page.html',
  styleUrls: ['update-config.page.scss']
})

export class UpdateConfigPage implements OnInit, OnDestroy, AfterViewInit {

  // in Params
  division: string;
  guid: string;
  // Configuration type can be epm or odata
  sourceCategory: string;
  pmID: string;

  conf: Configuration;

  periods: SelectItem[];
  divisions: SelectItem[];
  sourceCategories: SelectItem[];
  selectedDivision: string;
  divisionLabel: string;
  categoryLabel: string;

  timePeriod = 'M';

  // connection Types
  connectionTypes: SelectItem[];

  // URL listener
  sub: any;


  statuses: SelectItem[];
  types: SelectItem[];
  enabledList: SelectItem[];
  dbDefaultes: any;
  msgs: Message[] = [];

  lastUpdateUser = '';
  lastUpdateTime = '';

  oldConfig: any;

  isEditDisabled: Boolean = false;



  constructor(private extractService: ExtractService,
    private route: ActivatedRoute,
    private router: Router, public sharedService: SharedService,
    private element: ElementRef,
    private appConfig: AppConfig,
    private confirmationService: ConfirmationService) {

    // get parameters from URL
    this.getURLParams();

    this.sourceCategories = appConfig.getSourceCategoryList();
    // this.sourceCategories = appConfig.getConfig('categoryList');

    this.divisions = appConfig.getDivionsList();
    // this.divisions.push(this.extractService.getAppData().divisionsList);
    // this.divisions.push({ label: 'Court Division', value: 'court' });
    // this.divisions.push({ label: 'Fire Division', value: 'fire' });


    this.connectionTypes = [];
    this.connectionTypes.push({ label: '', value: null });
    this.appConfig.config.dbConnectionTypes.forEach(element => {
      this.connectionTypes.push(element);
    });
    // this.connectionTypes.push({ label: 'Excel-sheets on NetShare', value: 'excelsheet' });
    // this.connectionTypes.push({ label: 'Oracle', value: 'oracle' });
    // this.connectionTypes.push({ label: 'SQL Server', value: 'sqlserver' });
    this.periods = [];
    this.periods = this.appConfig.config.queryTimePeriods;
    // this.periods.push({ label: 'Days', value: 'D' });
    // this.periods.push({ label: 'Months', value: 'M' });
    // this.periods.push({ label: 'Quarters', value: 'Q' });


    this.statuses = [];
    this.statuses = this.appConfig.config.configStatus;
    // this.statuses.push({ label: 'Active', value: 'active' });
    // this.statuses.push({ label: 'Inactive', value: 'inactive' });

    this.types = [];
    this.types = this.appConfig.config.extractFiletypes;
    // this.types.push({ label: 'CSV', value: 'csv' });
    // this.types.push({ label: 'JSON', value: 'json' });
    // this.types.push({ label: 'XML', value: 'xml' });

    this.enabledList = [];

    this.enabledList.push({ label: 'Disabled', value: false });
    this.enabledList.push({ label: 'Enabled', value: true });


    this.dbDefaultes = this.appConfig.config.dbConnectionDefaults;

  }

  numbersOnly(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }


  ngAfterViewInit() {
    const st = new Pikaday({
      field: jQuery('#fromTime')[0],
      format: 'YYYY-MM-DDTHH:mm:ss',
      showTime: true,
      showMinutes: true,
      showSeconds: true,
      use24hour: true,
      incrementHourBy: 1,
      incrementMinuteBy: 1,
      incrementSecondBy: 1,
      autoClose: true,
      timeLabel: 'Time', // optional string added to left of time select

    });


    const et = new Pikaday({
      field: jQuery('#toTime')[0],
      format: 'YYYY-MM-DDTHH:mm:ss',
      showTime: true,
      showMinutes: true,
      showSeconds: true,
      use24hour: true,
      incrementHourBy: 1,
      incrementMinuteBy: 1,
      incrementSecondBy: 1,
      autoClose: true,
      timeLabel: 'Time', // optional string added to left of time select

    });


    const expiryTime = new Pikaday({
      field: jQuery('#expiryTime')[0],
      format: 'YYYY-MM-DDTHH:mm:ss',
      showTime: true,
      showMinutes: true,
      showSeconds: true,
      use24hour: true,
      incrementHourBy: 1,
      incrementMinuteBy: 1,
      incrementSecondBy: 1,
      autoClose: true,
      timeLabel: 'Time', // optional string added to left of time select
    });
  }

  ngOnInit() {
  }

  setBreadCrumb() {
    this.sharedService.setBreadcurmb([
      {
        name: 'Configurations List',
        // link: this.sharedService.contextPath + '/#/home'
        link: './#/home'
      },
      {
        name: 'Update Configuration'
      }
    ], true);
  }

  getURLParams() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {

        this.division = params['div'] || '0';
        this.guid = params['id'] || '0';
        this.sourceCategory = params['type'] || '0';
        this.pmID = params['pmid'] || '0';

        if (this.sourceCategory === '0') {
          this.router.navigate(['/home']);
        }

        // if(this.sourceCategory.toLowerCase() === 'odata'){

        // }


        if (this.pmID != '0') {

          this.conf = new Configuration(this.guid);
          this.extractService.getExtractByGUID('id_' + this.pmID).subscribe(result => {
            this.sharedService.block = false;
            // console.log('result: ' + result);
            // console.log('ConfigContent: ' + JSON.parse(window.atob(result.value[0].ConfigContent)));

            this.oldConfig = result.value[0].ConfigContent;
            const configContent = JSON.parse(window.atob(result.value[0].ConfigContent));
            this.initConfiguration(configContent);
            this.lastUpdateTime = result.value[0].UpdateTime.replace('T', ' ');
            this.lastUpdateUser = result.value[0].User;

          });
        }
        // Set Breadcrumb
        this.setBreadCrumb();

      });
  }
  getCurrentConfig() {
    return btoa(JSON.stringify(this.conf));
  }

  initConfiguration(config: Configuration) {
    this.conf = config;
    if (!this.conf.sourceCategory) {
      this.conf.sourceCategory = this.sourceCategory;
    }
    if (!this.conf.id) {
      this.conf.id = this.sharedService.getGUUID();
    }
    this.divisionLabel = this.appConfig.getDivisionLabel(this.conf.group);
    this.categoryLabel = this.appConfig.getSourceCategoryLabel(this.conf.sourceCategory.toLocaleLowerCase());
    this.isEditDisabled = this.conf.enabled;

    // if(!this.conf.query.metadata){
    //   this.conf.query.metadata = [];
    // }
    // this.conf = new Configuration(config.id);
    // this.conf.name = config.name;
    // this.conf.pmID = config.pmID;
    // this.conf.division = config.division;
    // this.conf.group = config.group;
    // this.conf.description = config.description;
    // this.conf.sourceCategory = config.sourceCategory;
    // this.conf.status = config.status;
    // this.conf.type = config.type;
    // this.conf.connection = config.connection;
    // this.conf.query = config.query;

  }

  onQueryChange(e) {
    // console.log(e);
  }

  // stop listening to url changes when leave the page
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  isSourceAllowed(sourceCategory) {
    if (this.sourceCategories && this.sourceCategories.length > 0) {
      for (var index = 0; index < this.sourceCategories.length; index++) {
        var src = this.sourceCategories[index];
        if (src.value === sourceCategory) {
          return true;
        }
      }
    }
    return false;
  }


  conTypeChange(event, value) {
    // console.log(JSON.stringify(event) + '-' + value);
    let found = false;
    if (this.dbDefaultes) {
      for (let index = 0; index < this.dbDefaultes.length; index++) {
        const element = this.dbDefaultes[index];
        if (element.value === value) {
          found = true;
          this.conf.connection.hostName = element.hostName;
          this.conf.connection.port = element.port;
          this.conf.connection.serviceName = element.serviceName;
          break;
        }
      }
    }
    if (!found) {
      this.conf.connection.hostName = null;
      this.conf.connection.port = null;
      this.conf.connection.serviceName = null;
    }

    if (value == 'access') {
      this.conf.connection.huser = '';
      this.conf.connection.hpassword = '';
    }

  }

  validateURL() {
    this.sharedService.block = true;
    this.refreshConStr();
    let url = this.sharedService.getFullURL(this.conf.connection, this.conf.connection.password);
    if (this.conf.connection.type == 'access') {
      url = url + ';huser=' + this.conf.connection.huser + ';hpassword=' + this.conf.connection.hpassword;
    }
    this.extractService.validateURL(url).subscribe(result => {
      if (result.error) {
        jQuery('#connTestResult').html('<span class="badResultCode">' + result.error + '</span>');
        this.sharedService.block = false;
      } else {
        jQuery('#connTestResult').html('<span class="goodResultCode">Valid ' + result.type + ' connection URL.</span>');
        this.sharedService.block = false;
      }
    },
      err => {
        jQuery('#connTestResult').html('<span class="badResultCode">Error: ' + err.error + '</span>');
        this.sharedService.block = false;
      });
  }

  refreshConStr() {
    jQuery('#conTitle').html(' - ' + this.sharedService.getFullURL(this.conf.connection, '******'));
  }

  query() {
    this.sharedService.block = true;

    jQuery('#resultTitle').html('');
    jQuery('#result').html('<img src="assets/img/ajax_loader.gif">');
    // const timePeriod = jQuery('#timePeriod').val();
    const timePeriod = this.conf.query.timePeriod;
    let url = this.sharedService.getFullURL(this.conf.connection, this.conf.connection.password);
    if (this.conf.connection.type == 'access') {
      url = url + ';huser=' + this.conf.connection.huser + ';hpassword=' + this.conf.connection.hpassword;
    }
    let startTime = this.conf.query.fromTime;
    let endTime = this.conf.query.toTime;
    const pmID = this.conf.pmID;
    // const query = this.editor.getValue();
    const query = this.conf.query.sql;

    // if(this.conf.connection.type && this.conf.connection.type == 'excelsheet' && timePeriod == '' ){
    //   startTime = null;
    //   endTime = null;
    // }
    const data = {
      id: 'id_' + pmID,
      url: url,
      query: query,
      timePeriod: timePeriod,
      fromTime: startTime,
      toTime: endTime
    };

    this.extractService.executeExtractQuery(data, this.conf.sourceCategory).subscribe(result => {
      if (result) {
        jQuery('#result').html('');
        this.showResults(result);
      }

      this.sharedService.block = false;
    },
      err => {
        this.sharedService.block = false;
        if (err['_body'] && typeof err['_body'] == 'string') {

          jQuery('#result').html('<span class="badResultCode">' + err['_body'] + '</span>');
        } else {
          jQuery('#result').html('<span class="badResultCode">Unknown error, please try again later</span>');
        }
        // this.showResults(err);
      });

  }

  showResults(result) {
    // jQuery('#resultTitle').html('<a target="_blank" href="/extract/try2htmlTable/' + result.id + '">HTML table link</a>');

    if (result.metaData) {
      this.conf.query.metadata = result.metaData;
    }

    if (result.sampleurls) {
      let links = '';

      links += '<ul class="list-unstyled">';
      let host = JSON.parse(sessionStorage.getItem('extract.config')).baseUrl + '/extract';
      for (var link in result.sampleurls[0]) {
        links += '<li>' + link + ' <br> ' + '<a target="_blank" style="font-size:small" href="' + host + result.sampleurls[0][link] + '">' + host + result.sampleurls[0][link] + '</a> </li>';
      }
      // jQuery('#resultTitle').html('<a target="_blank" href="' + JSON.parse(sessionStorage.getItem('extract.config')).baseUrl +'/extract'+ result.sampleurl + '">' + JSON.parse(sessionStorage.getItem('extract.config')).baseUrl +'/extract'+ result.sampleurl + '</a>');
      links += '</ul>';


      jQuery('#resultTitle').html(links);
    }

    if (result.sql) {
      const preStyle = `border-style: solid !important;
      border-color: gray;
      margin-bottom: 0;
      overflow: auto;
      max-width: 1334px;
      white-space: pre-wrap;
      white-space: -moz-pre-wrap;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      word-wrap: break-word;
      word-break: keep-all;` ;
      const resultSQL = `<pre style="${preStyle}">${result.sql}</pre>`
      jQuery('#resultSQL').html(resultSQL);
    }

    let count = 0;
    let countStr = '';
    if (result.count) {
      count = result.count;
    }
    countStr = '<span>This query has <strong>' + count + '</strong> record(s) </span><br>';
    jQuery('#recordsNumber').html(countStr);

    if (result.data && result.data.length > 0) {
      const resp = result.data;
      const cols = [];
      const colHeads = [];
      let colsCnt = 0;
      for (const p in resp[0]) {
        if (resp[0].hasOwnProperty(p)) {
          colHeads[colsCnt] = p;
          cols[colsCnt] = {
            data: p,
            readOnly: true
          };
          colsCnt++;
        }
      }
      const HOT = new Handsontable(document.getElementById('result'), {
        data: resp,
        manualColumnResize: true,
        colHeaders: colHeads,
        columns: cols,
        renderAllRows: true,
        height: 500
      });
    }

  }

  saveExtract(isValid: boolean, value: any) {
    // block all buttons
    this.sharedService.block = true;
    // console.log(value);
    if (isValid) {
      const metadata = this.sharedService.newObject(this.conf.query.metadata);
      // this.conf = value;
      if (metadata) {
        this.conf.query.metadata = metadata;
      }
      // if(this.conf.connection.type && this.conf.connection.type == 'excelsheet' && this.conf.query.timePeriod == '' ){
      //   this.conf.query.fromTime = null;
      //   this.conf.query.toTime = null;
      // }
      const body = btoa(JSON.stringify(this.conf));
      // let data;
      // let qualifiedName;
      // if (this.conf.sourceCategory === 'odata') {
      //   qualifiedName = '' + environment.configAPIAppName + '/OData_' + this.conf.group + '/aggregator/' + this.conf.dataset + '.json';
      //   data = {
      //     QualifiedName: qualifiedName,
      //     ConfigContent: body,
      //     ContentType: 'application/json',
      //     APIName: 'aggregator'
      //   }
      // } else {
      //   if (this.conf.sourceCategory.toUpperCase() == 'EPM') {
      //     qualifiedName = '' + environment.configAPIAppName + '/EPM_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
      //   } else {
      //     qualifiedName = '' + environment.configAPIAppName + '/' + this.conf.sourceCategory.toUpperCase() + '_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
      //   }
      //   this.conf.dataset = null;

      //   data = {
      //     QualifiedName: qualifiedName,
      //     ConfigContent: body,
      //     ContentType: 'application/json'
      //   }

      // }


      const qualifiedName = '' + environment.configAPIAppName + '/' + this.conf.sourceCategory.toUpperCase() + '_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
      this.conf.dataset = null;
      const data = {
        QualifiedName: qualifiedName,
        ConfigContent: body,
        ContentType: 'application/json'
      };

      if (data) {
        jQuery('#savedMsg').show();
        jQuery('#savedMsg').html('Saving...');
        // console.log(data);
        this.extractService.updateExtractConf(qualifiedName, data).subscribe(result => {
          this.sharedService.block = false;
          // console.log(result);
          jQuery('#savedMsg').html('<span class="goodResultCode">Saved</span>');
          jQuery('#savedMsg').fadeOut(3000);
          this.isEditDisabled = this.conf.enabled;

          this.oldConfig = btoa(JSON.stringify(this.conf));

        },
          err => {
            this.sharedService.block = false;
            console.log(err.json());
            jQuery('#savedMsg').html('<span class="badResultCode">' + err.json().error.message + '</span>');
            // jQuery('#savedMsg').html('<span class="badResultCode">Could not save, please try again later.</span>');
          });
      } else {
        this.sharedService.block = false;
      }

    }
  }


  saveExtractConf() {
    this.sharedService.block = true;
    // console.log(this.conf);
    const d = {
      group: 'this.group',
      id: 'this.id',
      name: this.conf.name,
      description: this.conf.description,
      // query: this.conf.query,
      connection: this.sharedService.getFullURL(this.conf.connection, this.conf.connection.password),
      query: this.conf.query.sql
    };
    jQuery('#savedMsg').show();
    jQuery('#savedMsg').html('Saving...');
    // jQuery.ajax(host+'/extract/extracts/' + group + '/' + id, {
    this.extractService.saveExtract(d).subscribe(result => {
      this.sharedService.block = false;
      jQuery('#savedMsg').html('Saved');
      jQuery('#savedMsg').fadeOut(3000);

    },
      err => {
        this.sharedService.block = false;
        jQuery('#savedMsg').html('Could not save, please try again later.');
      });
  }

  deleteConfiguration() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this configuration?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.sharedService.block = true;
        this.msgs = [];

        // let qualifiedName;
        // if (this.conf.sourceCategory === 'odata') {
        //   qualifiedName = '' + environment.configAPIAppName + '/OData_' + this.conf.group + '/aggregator/' + this.conf.dataset + '.json';
        // } else {
        //   qualifiedName = '' + environment.configAPIAppName + '/EPM_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
        // }

        const qualifiedName = '' + environment.configAPIAppName + '/' + this.conf.sourceCategory.toUpperCase() + '_' + this.conf.group + '/id_' + this.conf.pmID + '.json';

        this.extractService.deleteExtractConf(qualifiedName).subscribe(result => {
          // console.log(result);
          this.msgs.push({ severity: 'success', summary: 'Deleted', detail: 'Configuration deleted' });
          this.sharedService.msgs = this.msgs;
          this.sharedService.block = false;
          this.router.navigate(['/home']);
        },
          err => {
            this.msgs.push({ severity: 'error', summary: 'Failed', detail: 'Failed to delete configuration' });
            this.sharedService.msgs = this.msgs;
            this.sharedService.block = false;
          });

      }
    });
  }

}
