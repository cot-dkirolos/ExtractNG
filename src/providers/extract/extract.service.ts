import { AppConfig } from './../app-config/app-config.service';
import { HttpService } from './../http/http.service';
import { Injectable, Inject } from '@angular/core';
import { Http, Request, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var jQuery: any;
@Injectable()
export class ExtractService {

  appConfig: any;
  appAcl: any;

  // $.base64.encode("this is a test");
  // $.base64.decode("dGhpcyBpcyBhIHRlc3Q=");

  private confingsUrl = '/extract/fire/';
  private confingUrl = '/extract/';
  private validateConnectionUrl = '/extract/source/try/';
  private queryURL = '/extract/try';
  private setConfUrl = '/c3api_config/v2/ConfigService.svc/ConfigSet';
  private apiConfigExtractsURL = `/c3api_config/v2/ConfigService.svc/ConfigSet?$filter={SOURCES}ApplicationName eq 'Extract' and Status eq 'active'&$orderby=QualifiedName`;

  constructor(private httpService: HttpService, private http: Http) {
  }

  getExtractByGUID(GUID: string) {
    let url = `/c3api_config/v2/ConfigService.svc/ConfigSet?$select=QualifiedName,ConfigContent&$filter=endswith(QualifiedName,'{GUID}') and ApplicationName eq 'Extract' and Status eq 'active'&$orderby=QualifiedName`;
    let link = url.replace('{GUID}', GUID + '.json');
    console.log(link);
    return this.httpService.get(link)
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  saveExtractConf(data) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    headers.append('Authorization', `AuthSession ${jQuery.cookie('extract.sid')}`);

    return this.httpService.post(this.setConfUrl, data, { headers: headers })
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  updateExtractConf(qualifiedName, data) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    headers.append('Authorization', `AuthSession ${jQuery.cookie('extract.sid')}`);

    return this.httpService.put(this.setConfUrl + `('${qualifiedName}')`, data, { headers: headers })
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  deleteExtractConf(qualifiedName) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    headers.append('Authorization', `AuthSession ${jQuery.cookie('extract.sid')}`);

    return this.httpService.delete(this.setConfUrl + `('${qualifiedName}')`, { headers: headers })
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }


  updateUsers(users) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    headers.append('Authorization', `AuthSession ${jQuery.cookie('extract.sid')}`);

    return this.httpService.put(this.setConfUrl + `('Extract/AppConfig_users/users.json')`, users, { headers: headers })
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  saveExtract(data) {

    return this.httpService.post('/extract/' + data.group + '/' + data.id, data)
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  executeExtractQuery(data: any, sourceCategory: any) {
    if (sourceCategory && sourceCategory === 'xxx') { //should be if (sourceCategory && sourceCategory === 'xxx') {
      const link = "http://j2xn0137211.wkstn.toronto.ca:9080/CC_API/Odata_extract/result";
      return this.http.post(link, data)
        .map((res: Response) => {
          return res.json().value[0];
        }) // ...and calling .json() on the response to return data
        .catch((error: any) => Observable.throw(error)); // ...errors if any

    } else {

      return this.httpService.post(this.queryURL, data)
        .map((res: Response) => {
          return res.json();
        }) // ...and calling .json() on the response to return data
        .catch((error: any) => Observable.throw(error)); // ...errors if any
    }
  }

  validateURL(connectionUrl) {
    const body = { 'url': connectionUrl };
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return this.httpService.post(this.validateConnectionUrl, body, { headers: headers })
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }


  getExtractListBySource(sources, divisions) {
    let link: string;
    let division: string;
    if (divisions) {
      division = divisions;
    }
    if (sources) {
      let src = '(';
      for (let index = 0; index < sources.length; index++) {
        const element: string = sources[index];
        if (index === 0) {
          src = src + `startswith(GroupName,'${element.toUpperCase() === 'ODATA' ? 'OData' : element.toUpperCase() +
            '_' + (division ? (division.toLowerCase() === 'all' ? '' : division.toLowerCase()) : '')}')`;

          // src = src + `startswith(GroupName,'${element.toUpperCase() === 'ODATA' ? 'OData' : element.toUpperCase() + '_'}` ;
          // if(division){

          //   src = src + (division.toLowerCase() === 'all' ? '' : division.toLowerCase());
          // } else{
          //   src = src + `'`;
          // }
          // src = src + `')`;
          // division ? (division.toLowerCase() === 'all' ? '' : division.toLowerCase()) : '' + ')';
          // src = src + `startswith(toupper(GroupName),'${element.toUpperCase()}')`;
        } else {
          src = src + ` or startswith(GroupName,'${(element.toUpperCase() === 'ODATA' ? 'OData' : element.toUpperCase()) + '_' + (division ? (division.toLowerCase() === 'all' ? '' : division.toLowerCase()) : '')}')`;
          // src = src + ` or startswith(toupper(GroupName),'${element.toUpperCase()}')`;
        }
      }
      src = src + ') and ';
      link = this.apiConfigExtractsURL.replace('{SOURCES}', src);
    } else {
      link = this.apiConfigExtractsURL.replace('{SOURCES}', '');
    }
    console.log(link);
    return this.httpService.get(link)
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  getConfigurations() {
    return this.httpService.get(this.confingsUrl)
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }

  getConfiguration(group, id) {
    return this.httpService.get(this.confingUrl + group + '/' + id + '/')
      .map((res: Response) => {
        return res.json();
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); // ...errors if any
  }


  // // get all users for spicific group
  // getAllUsersByGroupID(groupID) {
  //   const users: any = [];
  //   return this.getAppAcl().then(appAcl => {
  //     for (let index = 0; index < appAcl.users.length; index++) {
  //       const user = appAcl.users[index];
  //       if (user.groupID === groupID) {
  //         this.buildUserForUi(user.userID).then(u => {
  //           users.push(JSON.parse(JSON.stringify(u)));
  //         });
  //       }
  //     }
  //   }).then(() => {
  //     return users;
  //   }
  //     );
  // }
}
