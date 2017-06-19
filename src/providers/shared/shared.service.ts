import { Configuration, Breadcrumb, BreadcrumbItem } from './../../model/interfaces';

import { Injectable } from '@angular/core';
import {Message} from 'primeng/primeng';

declare var cot_app: any;
declare var jQuery: any;
declare function changeFontSize(value: string, reset: boolean): void;

@Injectable()
export class SharedService {
  public extract_app: any;
  breadcrumbItems: BreadcrumbItem[];
  block: boolean;

  public paramsToPass:any;

  public user;

  msgs: Message[] = [];

  constructor() {
    this.extract_app = new cot_app('Extract Tool');
    this.block = false;
    if (!jQuery.cookie('fontsize')) {
      jQuery.cookie('fontsize', '1em');
    }
    console.log(jQuery.cookie('fontsize'));

  }

  setBreadcurmb(breadcrumb: BreadcrumbItem[], excludeAppName?: boolean) {
    this.breadcrumbItems = breadcrumb;
    this.extract_app.setBreadcrumb(breadcrumb, excludeAppName);
  }
  setFontSize(value: string, reset: boolean) {
    changeFontSize(value, reset);
  }
  get contextPath() {
    return window.location.pathname.substring(0, window.location.pathname.indexOf('/', 2));
  }

  getFullURL(object: any, withPwd: string) {
    let url;
    const user = object.user || '';
    const pwd = withPwd || '';

    switch (object.type) {
      case 'excelsheet':
        url = 'excel:smb://netshare.toronto.ca' + object.hostName;
        if (user.length > 0 && pwd.length > 0) {
          const idx = 'excel:smb://'.length;
          url = url.substring(0, idx) + user + ':' + pwd + '@' + url.substring(idx);
        }
        break;

      case 'sqlserver':
        url = 'jdbc:sqlserver://' + object.hostName + ':' + object.port + ';databaseName=' + object.serviceName;
        if (user.length > 0 && pwd.length > 0) {
          url = url + ';user=' + object.user + ';password=' + pwd;
        }
        break;

      case 'oracle':
        url = 'jdbc:oracle:thin:' + object.hostName + ':' + object.port + '/' + object.serviceName;
        if (user.length > 0 && pwd.length > 0) {
          const idx = 'jdbc:oracle:thin:'.length;
          url = url.substring(0, idx) + object.user + '/' + pwd + '@' + url.substring(idx);
        }
    }
    return url;
  }

  // Parse connection String
  parseConnection(connStr) {
    let s = connStr || '';
    if (s === '') {
      return null;
    }
    let type, userpwd, user, pwd, hostname, port, service;
    if (s.indexOf('excel:smb://') > -1) {
      let idx = 'excel:smb://'.length;
      type = 'excelsheet';
      let endPwd = s.indexOf('@');
      userpwd = s.substring(idx, endPwd);
      s = s.substring(endPwd + 1);
      hostname = s.substring(0, s.indexOf('/'));
      service = s.substring(s.indexOf('/') + 1);
    } else if (s.indexOf('jdbc:sqlserver://') > -1) {
      let idx = 'jdbc:sqlserver://'.length;
      type = 'sqlserver';
      s = s.substring(idx);
      let ar = s.split(';');
      hostname = ar[0];
      let arrayLength = ar.length;
      for (let i = 1; i < arrayLength; i++) {
        let itm = ar[i];
        if (itm.indexOf('databaseName=') > -1) {
          service = itm.substring('databaseName='.length);
        } else if (itm.indexOf('user=') > -1) {
          user = itm.substring('user='.length);
        } else if (itm.indexOf('password=') > -1) {
          pwd = itm.substring('password='.length);
        }
      }
      userpwd = user + ':' + pwd;
    } else if (s.indexOf('jdbc:oracle:thin:') > -1) {
      let idx = 'jdbc:oracle:thin:'.length;
      let endPwd = s.indexOf('@');
      userpwd = s.substring(idx, endPwd).replace('/', ':');
      s = s.substring(endPwd + 1);
      type = 'oracle';
      hostname = s.substring(0, s.indexOf('/'));
      service = s.substring(s.indexOf('/') + 1);
    }
    const portIdx = hostname.indexOf(':');
    if (portIdx > -1) {
      port = hostname.substring(portIdx + 1);
      hostname = hostname.substring(0, portIdx);
    }
    let upAr = userpwd.split(':');
    user = upAr[0];
    pwd = upAr[1];

    const data = {
      connectionType: type,
      connectionHost: hostname,
      connectionPort: port,
      connectionDB: service,
      connectionUsername: user,
      connectionPassword: pwd
    };
    return data;
  }
  getGUUID() {
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    return 'id_xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g,
      (c) => {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return  v.toString(16);
      });
  }

//   b64EncodeUnicode(str) {
//     // first we use encodeURIComponent to get percent-encoded UTF-8,
//     // then we convert the percent encodings into raw bytes which
//     // can be fed into btoa.
//     return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
//         function toSolidBytes(match, p1) {
//             return String.fromCharCode('0x' + p1);
//     }));
// }

// b64DecodeUnicode(str) {
//     // Going backwards: from bytestream, to percent-encoding, to original string.
//     return decodeURIComponent(atob(str).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
// }

newObject(object: any) {
    return object ? JSON.parse(JSON.stringify(object)) : null;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
