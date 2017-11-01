
import { AppConfig } from './../../providers/app-config/app-config.service';
import { Configuration } from './../../model/config';

import { AceEditorDirective } from 'ng2-ace-editor';
import { SelectItem } from 'primeng/primeng';
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
  selector: 'app-create-config',
  templateUrl: 'create-config.page.html',
  styleUrls: ['create-config.page.scss']
})

export class CreateConfigPage implements OnInit, OnDestroy, AfterViewInit {

  periods: SelectItem[];
  divisions: SelectItem[];
  sourceCategories: SelectItem[];
  selectedDivision: string;

  conf: Configuration;
  timePeriod = 'M';

  // connection Types
  connectionTypes: SelectItem[];

  // URL listener
  sub: any;
  // Configuration type can be epm or odata
  configurationType: string;


  statuses: SelectItem[];
  types: SelectItem[];
  enabledList: SelectItem[];
  dbDefaultes: any;


  constructor(private extractService: ExtractService,
    private route: ActivatedRoute,
    private router: Router, public sharedService: SharedService,
    private element: ElementRef,
    private appConfig: AppConfig) {
    // get data source category List
    this.sourceCategories = appConfig.getSourceCategoryList();
    // get divisions listt
    this.divisions = appConfig.getDivionsList();
    // get Db connection types
    this.connectionTypes = [];
    this.connectionTypes.push({ label: '', value: null });
    this.appConfig.config.dbConnectionTypes.forEach(element => {
      this.connectionTypes.push(element);
    });
    // get db connection defaultes
    this.dbDefaultes = this.appConfig.config.dbConnectionDefaults;
    // get periods list
    this.periods = [];
    this.periods = this.appConfig.config.queryTimePeriods;
    // get configuration status list
    this.statuses = [];
    this.statuses = this.appConfig.config.configStatus;
    // get output file type list
    this.types = [];
    this.types = this.appConfig.config.extractFiletypes;


    this.enabledList = [];

    this.enabledList.push({ label: 'Disable', value: false });
    this.enabledList.push({ label: 'Enable', value: true });
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
      format: 'YYYY-MM-DDThh:mm:ss',
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
    this.sharedService.block = false;
  }

  ngOnInit() {
    // get parameters from URL
    this.getURLParams();
  }

  setBreadCrumb() {
    this.sharedService.setBreadcurmb([
      {
        name: 'Configurations List',
        // link: this.sharedService.contextPath + './#/home'
        link: './#/home'
      },
      {
        name: 'New Configuration'
      }
    ], true);
  }

  getURLParams() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.configurationType = params['type'] || 0;
        if (this.configurationType != '0') {
          // Load configuration data
          this.initConfiguration();

          // Set Breadcrumb
          this.setBreadCrumb();
        } else {
          this.initConfiguration();

          // Set Breadcrumb
          this.setBreadCrumb();
          // this.router.navigate(['/home']);
        }
      });
  }

  initConfiguration() {
    if (this.sharedService.paramsToPass && this.sharedService.paramsToPass.configToClone) {
      this.conf = this.sharedService.newObject(this.sharedService.paramsToPass.configToClone);
      this.sharedService.paramsToPass = null;
      this.conf.id = this.sharedService.getGUUID();
      this.conf.pmID = null;
      if (this.conf.sourceCategory && this.conf.sourceCategory === 'odata') {
        this.conf.dataset = null;
      }
    } else {
      this.conf = new Configuration(this.sharedService.getGUUID());
      this.conf.group = this.divisions[0].value;
      this.conf.sourceCategory = this.configurationType ? this.isSourceAllowed(this.configurationType) ? this.configurationType : this.sourceCategories[0].value : this.sourceCategories[0].value;
      if (this.conf.sourceCategory && this.conf.sourceCategory !== 'odata') {
        this.conf.connection.type = this.connectionTypes[1].value;
      }
    }
  }

  onQueryChange(e) {
    // console.log(e);
  }

  // stop listening to url changes when leave the page
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  isSourceAllowed(configurationType) {
    if (this.sourceCategories && this.sourceCategories.length > 0) {
      for (let index = 0; index < this.sourceCategories.length; index++) {
        let src = this.sourceCategories[index];
        if (src.value === configurationType) {
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

    if(value == 'access'){
      this.conf.connection.huser = '';
      this.conf.connection.hpassword = '';
    }

  }

  validateURL() {
    this.sharedService.block = true;
    this.refreshConStr();
    let url = this.sharedService.getFullURL(this.conf.connection, this.conf.connection.password);
    if(this.conf.connection.type == 'access'){
      url = url + ';huser='+this.conf.connection.huser + ';hpassword='+this.conf.connection.hpassword;
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
    if(this.conf.connection.type == 'access'){
      url = url + ';huser='+this.conf.connection.huser + ';hpassword='+this.conf.connection.hpassword;
    }
    let startTime = this.conf.query.fromTime;
    let endTime = this.conf.query.toTime;
    const pmID = this.conf.pmID;
    // const endTime = jQuery('#endTime').val();
    // const startTime = jQuery('#startTime').val();
    // const query = this.editor.getValue();
    const query = this.conf.query.sql;

    // if (this.conf.connection.type && this.conf.connection.type == 'excelsheet' && timePeriod == '') {
    //   startTime = null;
    //   endTime = null;
    // }
    const data = {
      id: pmID ? 'id_' + pmID : null,
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
      });

  }

  showResults(result) {

    if(result.metaData){
      this.conf.query.metadata = result.metaData;
    }

    if (result.sampleurls) {
      let links = '';

      links += '<ul class="list-unstyled">';
      let host = JSON.parse(sessionStorage.getItem('extract.config')).baseUrl + '/extract';
      for (var link in result.sampleurls[0]) {
        links += '<li>' + link + ' <br> ' + '<a target="_blank" style="font-size:small" href="' + host + result.sampleurls[0][link] + '">' + host + result.sampleurls[0][link] + '</a> </li>';
      }
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
    // console.log(value);

    if (isValid) {
      this.sharedService.block = true;
      const metadata = this.sharedService.newObject(this.conf.query.metadata);
      this.conf = value;
      if(metadata){
        this.conf.query.metadata = metadata;
      }
      // if (this.conf.connection.type && this.conf.connection.type == 'excelsheet' && this.conf.query.timePeriod == '') {
      //   this.conf.query.fromTime = null;
      //   this.conf.query.toTime = null;
      // }
      this.extractService.checkIfpmIDExist('id_' + this.conf.pmID).then(isExist => {

        if (!isExist) {

          const body = btoa(JSON.stringify(this.conf));
          let data;
          if (this.conf.sourceCategory === 'odata') {
            data = {
              QualifiedName: 'Extract/OData_' + this.conf.group + '/aggregator/' + this.conf.dataset + '.json',
              ConfigContent: body,
              ContentType: 'application/json',
              APIName: 'aggregator'
            };
          } else {

            let qualifiedName = '';

            if (this.conf.sourceCategory.toUpperCase() == 'EPM') {
              qualifiedName = 'Extract/EPM_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
            } else {
              qualifiedName = 'Extract/' + this.conf.sourceCategory.toLocaleUpperCase() + '_' + this.conf.group + '/id_' + this.conf.pmID + '.json';
            }
            this.conf.dataset = null;

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
            this.extractService.saveExtractConf(data).subscribe(result => {
              this.sharedService.block = false;
              // console.log(result);
              jQuery('#savedMsg').html('<span class="goodResultCode">Saved</span>');
              jQuery('#savedMsg').fadeOut(3000);
              this.navigateToModify(this.conf);

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
        } else {
          this.sharedService.block = false;
          jQuery('#savedMsg').html('<span class="badResultCode">Extact ID already exist</span>');
        }
      },
        err => {
          this.sharedService.block = false;
          console.log(err.json());
          jQuery('#savedMsg').html('<span class="badResultCode">' + err.json().error.message + '</span>');
          // jQuery('#savedMsg').html('<span class="badResultCode">Could not save, please try again later.</span>');
        });
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

}
