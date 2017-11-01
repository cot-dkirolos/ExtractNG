import {ElementRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration } from './../../model/config';
import { Component, Input, OnInit } from '@angular/core';
import { ExtractService } from './../../providers/extract/extract.service';
import { environment } from './../../environments/environment';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { SharedService } from './../../providers/shared/shared.service';

declare var jQuery:any;

@Component({
  selector: 'div-meta-data',
  templateUrl: 'div-meta-data.component.html',
  styleUrls: ['div-meta-data.component.scss']
})
export class DivMetaDataComponent implements OnInit {

  @Input('conf') conf;
  @ViewChild('savedMsg') savedMsg: ElementRef;

  selectedConfig: any;
  oldConfig: any;
  divisionLabel: string;
  categoryLabel: string;
  isEditDisabled: Boolean;
  sourceCategory: string;
  isError: boolean = false;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private appConfig: AppConfig,
    private extractService: ExtractService) {

  }

  ngOnInit() {
    this.divisionLabel = this.conf.division;
    this.extractService.getExtractByGUID('id_' + this.conf.pmID).subscribe(result => {
      this.sharedService.block = false;
      this.oldConfig = result.value[0].ConfigContent;
      const configContent = JSON.parse(window.atob(result.value[0].ConfigContent));
      this.initConfiguration(configContent);
    });
  }

  initConfiguration(config: Configuration) {
    this.selectedConfig = config;

    this.divisionLabel = this.appConfig.getDivisionLabel(config.group);
    this.categoryLabel = this.appConfig.getSourceCategoryLabel(config.sourceCategory.toLocaleLowerCase());
    this.isEditDisabled = config.enabled;
    this.query();
  }


  query() {
    this.sharedService.block = true;

    // jQuery('#resultTitle').html('');
    // jQuery('#result').html('<img src="assets/img/ajax_loader.gif">');

    const timePeriod = this.selectedConfig.query.timePeriod;
    let url = this.sharedService.getFullURL(this.selectedConfig.connection, this.selectedConfig.connection.password);
    if (this.selectedConfig.connection.type == 'access') {
      url = url + ';huser=' + this.selectedConfig.connection.huser + ';hpassword=' + this.selectedConfig.connection.hpassword;
    }
    const startTime = this.selectedConfig.query.fromTime;
    const endTime = this.selectedConfig.query.toTime;
    const pmID = this.selectedConfig.pmID;
    const query = this.selectedConfig.query.sql;

    const data = {
      id: 'id_' + pmID,
      url: url,
      query: query,
      timePeriod: timePeriod,
      fromTime: startTime,
      toTime: endTime
    };

    this.extractService.executeExtractQuery(data, this.selectedConfig.sourceCategory).subscribe(result => {
      if (result && result.metaData) {
          this.selectedConfig.query.metadata = result.metaData;
      }
      this.isError= false;

      this.sharedService.block = false;
    },
      err => {
        this.sharedService.block = false;
        this.isError = true;
        if (err['_body'] && typeof err['_body'] == 'string') {

          // jQuery('#result').html('<span class="badResultCode">' + err['_body'] + '</span>');
          // jQuery('#result').html('<span class="badResultCode">An error occurred during loading metadata, Please check extract configuration</span> <button type="button" pButton class="ui-button-secondary" icon="fa fa-list" label="Configure" (click)="navigateToModify(conf)"></button>');
        } else {
          jQuery('#result').html('<span class="badResultCode">Unknown error, please try again later</span>');
        }
        // this.showResults(err);
      });

  }

  saveConfig(){

    // block all buttons
    this.sharedService.block = true;
    // console.log(value);

      const body = btoa(JSON.stringify(this.selectedConfig));
      let data;
      let qualifiedName;
      if (this.selectedConfig.sourceCategory === 'odata') {
        qualifiedName = 'Extract/OData_' + this.selectedConfig.group + '/aggregator/' + this.selectedConfig.dataset + '.json';
        data = {
          QualifiedName: qualifiedName,
          ConfigContent: body,
          ContentType: 'application/json',
          APIName: 'aggregator'
        }
      } else {
        if (this.selectedConfig.sourceCategory.toUpperCase() == 'EPM') {
          qualifiedName = 'Extract/EPM_' + this.selectedConfig.group + '/id_' + this.selectedConfig.pmID + '.json';
        } else {
          qualifiedName = 'Extract/' + this.selectedConfig.sourceCategory.toLocaleUpperCase() + '_' + this.selectedConfig.group + '/id_' + this.selectedConfig.pmID + '.json';
        }
        this.selectedConfig.dataset = null;

        data = {
          QualifiedName: qualifiedName,
          ConfigContent: body,
          ContentType: 'application/json'
        }

      }
      if (data) {
        // jQuery('#savedMsg').show();
        this.savedMsg.nativeElement.innerHTML = "Saving...";
        // jQuery('#savedMsg').html('Saving...');
        console.log(data);
        this.extractService.updateExtractConf(qualifiedName, data).subscribe(result => {
          this.sharedService.block = false;
          // console.log(result);

        this.savedMsg.nativeElement.innerHTML = `<span class="goodResultCode">Saved</span>`;
          // jQuery('#savedMsg').html('<span class="goodResultCode">Saved</span>');
          // jQuery('#savedMsg').fadeOut(3000);
          setTimeout(() => {
            this.savedMsg.nativeElement.innerHTML = "";
          },3000);
          this.isEditDisabled = this.selectedConfig.enabled;

          this.oldConfig = btoa(JSON.stringify(this.selectedConfig));

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
