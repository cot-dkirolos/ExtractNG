import { Configuration } from './../../model/config';
import { SharedService } from './../../providers/shared/shared.service';
import { Router } from '@angular/router';
import { ConfigurationListObj, Schedule } from './../../model/interfaces';
import { ExtractService } from './../../providers/extract/extract.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import * as moment from 'moment';
declare var jQuery: any;
declare var Pikaday: any;

@Component({
  // moduleId: module.id,
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  divisions: ConfigurationListObj[];
  divisionsOData: ConfigurationListObj[];

  scheduledList: Schedule[];
  selectedSchedule: Schedule;
  schedule: ScheduleObj = new ScheduleObj();
  displayDialog: boolean;
  isNewSchedule: boolean;

  // divisionsList: SelectItem[];



  constructor(private extractService: ExtractService, private router: Router, public sharedService: SharedService) {
    console.log(moment().calendar());
    this.divisions = [];
    this.scheduledList = [];
    this.scheduledList.push({
      id: '2210001',
      name: '# vehicle response runs',
      division: 'Fire Service - EPM',
      interval: 60,
      expiryTime: new Date(),
      status: 'Active',
      type: 'JSON',
      url: 'http://validLink.com',
    });
    // this.divisionsList = [];
    // this.divisionsList.push({ label: 'All Divisions', value: null });
    // this.divisionsList.push({ label: 'Court Service', value: 'Court Service' });
    // this.divisionsList.push({ label: 'Fire Service', value: 'Fire Service' });
  }
  ngOnInit() {

    this.sharedService.setBreadcurmb([{ name: 'Confirgurations List', link: '/#/home' }], true);
    this.getConfigList();


  }

  ngAfterViewInit() {

  }

  getConfigList() {

    this.extractService.getConfigurations().subscribe(result => {
      let divs: ConfigurationListObj[] = [];
      if (result && result.length > 0) {
        for (let index = 0; index < result.length; index++) {
          let element: ConfigurationListObj = <ConfigurationListObj>result[index];
          if (element.acl.toLowerCase().includes(jQuery.cookie('extract.cot_uname').toLowerCase())) {
            this.saveOdata(index, element, 'epm');
            divs.push(element);
          }
        }
      }
      // this.divisions = Object.create(divs);
      this.divisions = JSON.parse(JSON.stringify(divs));
      for (let index = 0; index < this.divisions.length; index++) {
        this.divisions[index].division = this.divisions[index].division + ' - EPM';
      }

      // this.divisionsOData = Object.create(divs);
      this.divisionsOData = JSON.parse(JSON.stringify(divs));;
      for (let index = 0; index < this.divisionsOData.length; index++) {
        this.divisionsOData[index].division = this.divisionsOData[index].division + ' - OData';
      }
      this.sharedService.block = false;
    });
  }

  saveOdata(index, element, type) {
    let c = new Configuration(this.sharedService.getGUUID());
    this.extractService.getConfiguration(element.group, element.id).subscribe(data => {
      c.pmID =  element.id;
      c.name = data.name;
      c.description = data.description;
      c.group = data.division == 'Court Service' ? 'court' : 'fire';
      c.division = data.division;
      c.acl = data.acl;
      c.query.sql = data.query;
      c.query.timePeriod = data.timePeriod ? data.timePeriod : 'M';
      c.query.fromTime = data.fromTime ? data.fromTime : '20010101';
      c.query.toTime = data.toTime ? data.toTime : '20170131';


      // this.conf = data;
      const connDetails = this.sharedService.parseConnection(data.connection);
      if (connDetails) {
        c.connection = {
          type: connDetails.connectionType,
          hostName: connDetails.connectionHost,
          port: connDetails.connectionPort,
          serviceName: connDetails.connectionDB,
          user: connDetails.connectionUsername,
          password: connDetails.connectionPassword
        };
      }

      const body = btoa(JSON.stringify(c));
      let d;
      if (type === 'epm') {
        d = {
          QualifiedName: 'Extract/EPM_' + c.group + '/' + c.id + '.json',
          ConfigContent: body,
          ContentType: 'application/json'
        }
      } else if (type === 'odata') {
        d = {
          QualifiedName: 'Extract/OData_' + c.group + '/aggregator/' + c.dataset + '.json',
          ConfigContent: body,
          ContentType: 'application/json',
          APIName: 'aggregator'
        }
      }
      this.extractService.saveExtractConf(d).subscribe(result => {
        console.log(result);
      },
        err => {
          console.log(err);
        });

      if (index % 2 == 0) {
        c.id = this.sharedService.getGUUID();
        c.dataset = 'dataset_' + index;
        c.url = 'http://shelby.corp.toronto.ca:9080/extract/data/' + c.dataset;
        c.interval = 3600;
        c.expiryTime = '20171212 12:00:00';
        const bodyx = btoa(JSON.stringify(c));
        let odata = {
          QualifiedName: 'Extract/OData_' + c.group + '/aggregator/' + c.dataset + '.json',
          ConfigContent: bodyx,
          ContentType: 'application/json',
          APIName: 'aggregator'
        };

      console.log(c);
      console.log(odata);

      this.extractService.saveExtractConf(odata).subscribe(result => {
        // console.log(result);
      },
        err => {
          // console.log(err);
        });

      }
    });
  }

  navigateToModify(group: string, id: string) {
    this.router.navigate(['/modifyConf'], { queryParams: { group: group, id: id } });
  }

  navigateToNew(type: string) {
    this.router.navigate(['/newConf'], { queryParams: { type: type } });
  }

  newScheduleExtract(val) {
    this.isNewSchedule = true;
    this.schedule = new ScheduleObj(val.id, val.name, val.division);

    // this.schedule = {
    //   id: '',
    //   name: '',
    //   division: '',
    //   interval: 60,
    //   expiryTime: new Date(),
    //   status: 'Active',
    //   type: 'JSON',
    //   url: 'http://jhdsjkghsdfkjghkjfhgkjfdh',
    // };

    // this.schedule.id = val.id;
    // this.schedule.name = val.name;
    // this.schedule.division = val.division;
    // let indx = this.findSelectedScheduleIndex();
    // if (indx > -1) {
    //   this.isNewSchedule = false;
    // } else {
    //   this.isNewSchedule = true;
    // }

    this.displayDialog = true;
  }

  save() {
    let scheduledList = [...this.scheduledList];
    if (this.isNewSchedule) {
      scheduledList.push(this.schedule);
    }
    else {
      scheduledList[this.findSelectedScheduleIndex()] = this.schedule;
    }
    this.scheduledList = scheduledList;
    this.schedule = null;
    this.displayDialog = false;
    // this.scheduledList.push(this.selectedExtractForSchedule);
    // this.displayDialog = false;
  }

  findSelectedScheduleIndex(): number {
    for (var index = 0; index < this.scheduledList.length; index++) {
      var element = this.scheduledList[index];
      if (element.id === this.selectedSchedule.id) {
        return index;
      }

    }
    return -1;
    // return this.scheduledList.indexOf(this.selectedSchedule);
  }

  isConfigSchedulled(configId): boolean {
    for (var index = 0; index < this.scheduledList.length; index++) {
      var element = this.scheduledList[index];
      if (element.id === configId) {
        return true;
      }

    }
    return false;
    // return this.scheduledList.indexOf(this.selectedSchedule);
  }

  configureSchedule(val) {
    this.isNewSchedule = false;
    this.selectedSchedule = val;
    this.schedule = this.cloneSchedule(val);
    this.displayDialog = true;
  }

  cloneSchedule(s: Schedule): Schedule {
    let sch = new ScheduleObj();
    for (const prop in s) {
      sch[prop] = s[prop];
    }
    return sch;
  }

  onShow(event) {

    const schexpiryTime = new Pikaday({
      field: jQuery('#schexpiryTime')[0],
      format: 'YYYYMMDD hh:mm:ss',
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

}

class ScheduleObj implements Schedule {
  constructor(public id?, public name?, public division?, public interval?, public expiryTime?, public status?, public type?, public url?) {
    this.id = id;
    this.name = name;
    this.division = division;
    this.interval = 60;
    this.expiryTime = new Date();
    this.status = 'Active';
    this.type = 'JSON';
    this.url = 'http://ValidURL.com/';
  }
}
