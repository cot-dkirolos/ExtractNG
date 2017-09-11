import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDisplay'
})
export class MsToTimePipe implements PipeTransform {

  transform(duration: number, args?: any): any {
    let dd = Math.floor(Math.trunc(duration/86400)),
        hh = Math.floor(duration/3600) % 24,
        mm = Math.floor(duration/60) % 60,
        ss = Math.floor(duration) % 60;

    return (dd >= 1 ? (dd < 10 ? '0' : '') + dd + ':' : '00:') + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
    // let milliseconds = (duration % 1000) / 100;
    // let seconds = (duration / 1000) % 60;
    // let minutes = (duration / (1000 * 60)) % 60;
    // let hours = (duration / (1000 * 60 * 60)) % 24;

    // let sHours = (hours < 10) ? 0 +''+ hours : hours;
    // let dMinutes = (minutes < 10) ? 0 +''+ minutes : minutes;
    // let sSeconds = (seconds < 10) ? 0 +''+ seconds : seconds;

    // // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    // return sHours + ":" + dMinutes + ":" + sSeconds;
  }

}
