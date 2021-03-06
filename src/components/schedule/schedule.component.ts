import { ExtractService } from './../../providers/extract/extract.service';
import { environment } from './../../environments/environment';
import { AppConfig } from './../../providers/app-config/app-config.service';
import { SharedService } from './../../providers/shared/shared.service';
import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';


declare var Pikaday: any;
declare var jQuery: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit, AfterViewInit {

  @Input('conf') conf;
  statuses: SelectItem[];
  scheduleTypes: SelectItem[];
  executionTypes: SelectItem[];
  weekDays: SelectItem[];
  monthDays: SelectItem[];
  targetTypes: SelectItem[];
  outputFormats: SelectItem[];
  recurEvery: SelectItem[];
  periods: SelectItem[];
  rangePeriods: SelectItem[];
  executionEndType: SelectItem[];
  backPeriods: SelectItem[];
  endType: string;
  runTimes: Array<{ time }>;
  schedule: any;
  dates: Date[];

  startTimeRO: Date;
  endTimeRO: Date;

  constructor(public sharedService: SharedService, private appConfig: AppConfig, private extractService: ExtractService) {

    this.startTimeRO = new Date();
    this.endTimeRO = new Date();

    this.endType = 'N';

    this.runTimes = [];
    this.runTimes.push({ time: '00:00' });

    this.schedule = {
      schedule: {
        type: 'once',
        singleExecutionStartTime: '',
        enabled: true,
        endPointUrl: environment.apiUrl + '/extract/schedule'
      },
      ED2: {},
      params: {
        pmID: '',
        deltaParams: {
          aggrPeriod: 'M',
        //   rangeUnits: 1,
        //   rangePeriod: 'months',
        //   executionTime: 1
        },
        // recurrence: {
        //   frequency: 'hours',
        //   interval: 1,
        // runTimes: this.runTimes,
        // weekDays: [],
        // monthDays: []
        // },
        target: {
          // targetType: '',
          // outputFormat: ''
        }
      }
    };

    this.statuses = [];
    this.statuses = this.appConfig.config.configStatus;

    this.scheduleTypes = [];
    // this.scheduleTypes.push({ label: '', value: null });
    this.appConfig.config.scheduleTypes.forEach(element => {
      this.scheduleTypes.push(element);
    });

    this.recurEvery = [];
    // this.recurEvery.push({ label: '', value: '' });
    this.recurEvery.push({ label: 'Minutes(s)', value: 'minutes' });
    this.recurEvery.push({ label: 'Hour(s)', value: 'hours' });
    this.recurEvery.push({ label: 'Day(s)', value: 'days' });
    this.recurEvery.push({ label: 'Week(s)', value: 'weeks' });
    this.recurEvery.push({ label: 'Month(s)', value: 'months' });

    this.rangePeriods = [];
    this.rangePeriods.push({ label: 'Minutes(s)', value: 'minutes' });
    this.rangePeriods.push({ label: 'Hour(s)', value: 'hours' });
    this.rangePeriods.push({ label: 'Day(s)', value: 'days' });
    // this.rangePeriods.push({ label: 'Week(s)', value: 'weeks' });
    this.rangePeriods.push({ label: 'Month(s)', value: 'months' });
    this.rangePeriods.push({ label: 'Quarter(s)', value: 'quarters' });
    this.rangePeriods.push({ label: 'Year(s)', value: 'years' });

    this.executionTypes = [];
    this.executionTypes.push({ label: '', value: '' });
    this.executionTypes.push({ label: 'Daily', value: 'daily' });
    this.executionTypes.push({ label: 'Weekly', value: 'weekly' });
    this.executionTypes.push({ label: 'Biweekly', value: 'biweekly' });
    this.executionTypes.push({ label: 'Monthly', value: 'monthly' });
    this.executionTypes.push({ label: 'Quarterly', value: 'quarterly' });
    this.executionTypes.push({ label: 'Yearly', value: 'yearly' });

    this.weekDays = [];
    // this.weekDays.push({ label: '', value: '' });
    this.weekDays.push({ label: 'Sunday', value: 'sunday' });
    this.weekDays.push({ label: 'Monday', value: 'monday' });
    this.weekDays.push({ label: 'Tuesday', value: 'tuesday' });
    this.weekDays.push({ label: 'Wednesday', value: 'wednesday' });
    this.weekDays.push({ label: 'Thursday', value: 'thursday' });
    this.weekDays.push({ label: 'Friday', value: 'Friday' });
    this.weekDays.push({ label: 'Saturday', value: 'saturday' });


    this.targetTypes = [];
    this.targetTypes.push({ label: '', value: '' });
    this.targetTypes.push({ label: 'AWS S3 & EMR', value: 's3' });
    this.targetTypes.push({ label: 'Net Share', value: 'netshare' });

    this.outputFormats = [];
    this.outputFormats.push({ label: '', value: '' });
    this.outputFormats.push({ label: 'JSON', value: 'json' });
    this.outputFormats.push({ label: 'XML', value: 'XML' });
    this.outputFormats.push({ label: 'CSV', value: 'csv' });

    this.executionEndType = [];
    this.executionEndType.push({ label: 'End By', value: 'E' });
    this.executionEndType.push({ label: 'Never', value: 'N' });
    this.executionEndType.push({ label: 'Occurrences', value: 'O' });


    this.monthDays = [];
    for (let i = 1; i <= 31; i++) {
      this.monthDays.push({ label: String(i), value: String(i) });
    }
    this.monthDays.push({ label: 'Last Day', value: 'last' });

    this.backPeriods = [];
    for (let i = 0; i <= 31; i++) {
      this.backPeriods.push({ label: String(i), value: String(i) });
    }


    this.periods = [];
    this.periods = this.appConfig.config.queryTimePeriods;


  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    const singleExecutionStartTime = new Pikaday({
      field: jQuery('#singleExecutionStartTime')[0],
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
    const schedStartTime = new Pikaday({
      field: jQuery('#schedStartTime')[0],
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
    const schedEndTime = new Pikaday({
      field: jQuery('#schedEndTime')[0],
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


    const paramStartTime = new Pikaday({
      field: jQuery('#paramStartTime')[0],
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


    const paramEndTime = new Pikaday({
      field: jQuery('#paramEndTime')[0],
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

    this.schedule.params.pmID = this.conf.pmID;
  }

  deleteTime(index) {
    this.schedule.schedule.recurrence.runTimes.splice(index, 1);
  }
  addTime() {
    this.schedule.schedule.recurrence.runTimes.push({ time: '' });
  }

  scheduleTypeCange(event) {
    switch (event.value) {
      case 'once':
        delete this.schedule.schedule.recurrence;
        delete this.schedule.params.deltaParams.rangeUnits;
        delete this.schedule.params.deltaParams.rangePeriod;
        delete this.schedule.params.deltaParams.executionTime;

        setTimeout(() => {
          const singleExecutionStartTime = new Pikaday({
            field: jQuery('#singleExecutionStartTime')[0],
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


          const paramStartTime = new Pikaday({
            field: jQuery('#paramStartTime')[0],
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


          const paramEndTime = new Pikaday({
            field: jQuery('#paramEndTime')[0],
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
        }, 500);
        break;
      default:
        delete this.schedule.schedule.singleExecutionStartTime;
        delete this.schedule.params.deltaParams.fromTime;
        delete this.schedule.params.deltaParams.toTime;

        this.schedule.params.deltaParams = {
          aggrPeriod: 'M',
          rangeUnits: 1,
          rangePeriod: 'months',
          deltaEndTime: 1
        }

        this.schedule.schedule.recurrence = {
          frequency: 'hours',
          interval: 1,
          startTime: '',
          endTime: '',
        };


        this.setDateRange();

        setTimeout(() => {
          const schedStartTime = new Pikaday({
            field: jQuery('#schedStartTime')[0],
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

        }, 500);


        break;
    }
  }

  recurrenceFrequencyCange(event) {
    switch (event.value) {
      case 'minutes':
        delete this.schedule.schedule.recurrence.runTimes;
        delete this.schedule.schedule.recurrence.weekDays;
        delete this.schedule.schedule.recurrence.monthDays;
        break;
      case 'hours':
        delete this.schedule.schedule.recurrence.runTimes;
        delete this.schedule.schedule.recurrence.weekDays;
        delete this.schedule.schedule.recurrence.monthDays;
        break;
      case 'days':
        this.schedule.schedule.recurrence.runTimes = [];
        this.schedule.schedule.recurrence.runTimes.push({ time: '00:00' });
        delete this.schedule.schedule.recurrence.weekDays;
        delete this.schedule.schedule.recurrence.monthDays;
        break;
      case 'weeks':
        this.schedule.schedule.recurrence.runTimes = [];
        this.schedule.schedule.recurrence.runTimes.push({ time: '00:00' });
        this.schedule.schedule.recurrence.weekDays = [];
        delete this.schedule.schedule.recurrence.monthDays;
        break;
      default:
        this.schedule.schedule.recurrence.runTimes = [];
        this.schedule.schedule.recurrence.runTimes.push({ time: '00:00' });
        this.schedule.schedule.recurrence.monthDays = [];
        delete this.schedule.schedule.recurrence.weekDays;
        break;
    }
  }

  executionEndTypeCange(event) {
    switch (event.value) {
      case 'E':
        this.schedule.schedule.recurrence.endTime = '';
        setTimeout(() => {
          const schedEndTime = new Pikaday({
            field: jQuery('#schedEndTime')[0],
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
        }, 500);

        break;
      case 'N':
        this.schedule.schedule.recurrence.endTime = '';
        break;
      default:
        this.schedule.schedule.recurrence.endTime = 1;
        break;
    }

  }
  setDateRange() {
    const unit = this.schedule.params.deltaParams.rangeUnits;
    const period = this.schedule.params.deltaParams.rangePeriod;
    const backPeriod = this.schedule.params.deltaParams.deltaEndTime;

    const currentDate = new Date();
    this.startTimeRO = new Date();
    this.endTimeRO = new Date();
    switch (period) {
      case 'minutes':
        this.endTimeRO.setMinutes((currentDate.getMinutes() + 1) - backPeriod);
        this.endTimeRO.setSeconds(0);

        this.startTimeRO.setMinutes(this.endTimeRO.getMinutes() - unit);
        this.startTimeRO.setSeconds(0);
        break;
      case 'hours':
        this.endTimeRO.setHours((currentDate.getHours() + 1) - backPeriod);
        this.endTimeRO.setMinutes(0);
        this.endTimeRO.setSeconds(0);

        this.startTimeRO.setHours(this.endTimeRO.getHours() - unit);
        this.startTimeRO.setMinutes(0);
        this.startTimeRO.setSeconds(0);
        break;
      case 'days':
        this.endTimeRO.setDate((currentDate.getDate() + 1) - backPeriod);
        this.endTimeRO.setHours(0);
        this.endTimeRO.setMinutes(0);
        this.endTimeRO.setSeconds(0);
        this.startTimeRO.setDate(this.endTimeRO.getDate() - unit);
        this.startTimeRO.setHours(0);
        this.startTimeRO.setMinutes(0);
        this.startTimeRO.setSeconds(0);
        break;
      case 'months':
        this.endTimeRO.setMonth((currentDate.getMonth() + 1) - backPeriod);
        this.endTimeRO.setDate(1);
        this.endTimeRO.setHours(0);
        this.endTimeRO.setMinutes(0);
        this.endTimeRO.setSeconds(0);
        this.startTimeRO.setMonth(this.endTimeRO.getMonth() - unit);
        this.startTimeRO.setDate(1);
        this.startTimeRO.setHours(0);
        this.startTimeRO.setMinutes(0);
        this.startTimeRO.setSeconds(0);
        break;
      case 'quarters':
        const currentQ = Math.trunc((currentDate.getMonth()) / 3) + 1;
        const monthidxInQ = (currentDate.getMonth()) - (Math.trunc((currentDate.getMonth()) / 3) * 3);

        this.endTimeRO.setMonth(((currentDate.getMonth()) - monthidxInQ) - ((backPeriod * 3) - 3));
        this.endTimeRO.setDate(1);
        this.endTimeRO.setHours(0);
        this.endTimeRO.setMinutes(0);
        this.endTimeRO.setSeconds(0);

        this.startTimeRO.setMonth(this.endTimeRO.getMonth() - unit * 3);
        this.startTimeRO.setDate(1);
        this.startTimeRO.setHours(0);
        this.startTimeRO.setMinutes(0);
        this.startTimeRO.setSeconds(0);

        break;
      case 'years':
        this.endTimeRO.setFullYear((currentDate.getFullYear() + 1) - backPeriod);
        this.endTimeRO.setMonth(0);
        this.endTimeRO.setDate(1);
        this.endTimeRO.setHours(0);
        this.endTimeRO.setMinutes(0);
        this.endTimeRO.setSeconds(0);
        this.startTimeRO.setFullYear(this.endTimeRO.getFullYear() - unit);
        this.startTimeRO.setMonth(0);
        this.startTimeRO.setDate(1);
        this.startTimeRO.setHours(0);
        this.startTimeRO.setMinutes(0);
        this.startTimeRO.setSeconds(0);
        break;

      default:
        break;
    }

  }

  targetTypeOnChange(event) {

    switch (event.value) {
      case 'netshare':
        this.schedule.params.target.id = '';
        this.schedule.params.target.key = '';
        this.schedule.params.target.directory = '';
        delete this.schedule.params.target.bucketRegion;
        delete this.schedule.params.target.bucketName;
        break;
      case 's3':
        this.schedule.params.target.id = '';
        this.schedule.params.target.key = '';
        this.schedule.params.target.directory = '';
        this.schedule.params.target.bucketRegion = '';
        this.schedule.params.target.bucketName = '';
        break;
      default:

        delete this.schedule.params.target.id;
        delete this.schedule.params.target.key;
        delete this.schedule.params.target.directory;
        delete this.schedule.params.target.bucketRegion;
        delete this.schedule.params.target.bucketName;
        break;
    }

  }

  saveSchedule( event ) {
    this.sharedService.block = true;
    jQuery('#scheduleSavedMsg').show();
    jQuery('#scheduleSavedMsg').html('Saving...');
    this.extractService.saveScheduleConf(this.schedule).subscribe((result) => {
      this.sharedService.block = false;
      // console.log(result);
      jQuery('#scheduleSavedMsg').html('<span class="goodResultCode">Saved</span>');
      jQuery('#scheduleSavedMsg').fadeOut(3000);

    },
      err => {
        this.sharedService.block = false;
        jQuery('#scheduleSavedMsg').html('<span class="badResultCode">' + (err.json().error ? err.json().error.message : 'error') + '</span>');
      });
  }

}
