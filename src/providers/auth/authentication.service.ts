
import { SharedService } from './../shared/shared.service';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '../http/http.service';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var jQuery: any;
@Injectable()
export class AuthenticationService {

  private loginUrl: string = 'https://insideto-secure.toronto.ca/cc_sr_admin_v1/session';
  // private loginUrl: string = 'https://was-intra-sit.toronto.ca/c3api_auth/auth';
  // private loginUrl: string = "https://was-intra-sit.toronto.ca/cc_sr_admin_v1/session";
  // private loginUrl: string = "https://was-intra-qa.toronto.ca/cc_sr_admin_v1/session";
  //user=[USERNAME]&pwd=[PASSWORD]&app=[APPNAME]";
  public appName: string = 'extract';

  sid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  groups: string;

  constructor(private http: Http
    , private router: Router
    , private sharedService: SharedService) {
  }

  login(username: string, password: string): Observable<any> {
    this.sharedService.block = true;
    const body = 'user=' + username + '&pwd=' + password + '&app=' + this.appName;
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;');
    return this.http.post(this.loginUrl, body, { headers: headers })
      // this.loginUrl = this.loginUrl + "app=" + this.appName;
      // return this.http.post(this.loginUrl, { user: username, pwd: password, app: this.appName })
      // let url = this.loginUrl + "app=" + this.appName +"&user="+username+"&pwd="+password;
      // console.log(url);

      // return this.http.get(url)


      .map((res: Response) => {

        this.sharedService.block = false;
        return res.json();
      })
      .catch((error: any) => {
        this.displayLoginError('Unable to log in. Please try again.',5000);
        console.log(error);
        this.sharedService.block = false;
        return Observable.throw(error);
      }); // ...and calling .json() on the response to return data
  }

  processLogin(data) {
    // console.log(data);

    let date = new Date();
    // Cookie session timeout to password expiry time from AuthSession API otherwise set to 1 hour
    // if (data.passwordExpiryDate) {
    //   date.setTime(data.passwordExpiryDate);
    // } else {
    //   date.setTime(date.getTime() + (60 * 60 * 1000));
    // }

    // set Timeout to 30 minuets
    date.setTime(date.getTime() + (30 * 60 * 1000));
    jQuery.cookie(this.appName + '.sid', data.sid, { expires: date });
    jQuery.cookie(this.appName + '.cot_uname', data.userID, { expires: date });
    jQuery.cookie(this.appName + '.email', (data.email || '').toLowerCase(), { expires: date });
    if (data.cotUser) {
      jQuery.cookie(this.appName + '.firstName', data.cotUser.firstName, { expires: date });
      jQuery.cookie(this.appName + '.lastName', data.cotUser.lastName, { expires: date });
      jQuery.cookie(this.appName + '.groups', data.cotUser.groupMemberships, { expires: date });
    }

    this.setUserName();
  }

  setUserName() {

    if (this.isLoggedIn()) {
      this.loadUserInfo();

    }
  };

  loadUserInfo() {
    this.sid = jQuery.cookie(this.appName + '.sid');
    this.username = jQuery.cookie(this.appName + '.cot_uname');
    this.email = jQuery.cookie(this.appName + '.email');
    this.firstName = jQuery.cookie(this.appName + '.firstName');
    this.lastName = jQuery.cookie(this.appName + '.lastName');
    this.groups = jQuery.cookie(this.appName + '.groups');
  };

  logout(): void {
    this.sharedService.block = true;
    // console.log('Service LogOut');
    this.clearClientStorage();
    this.sharedService.block = false;
    this.router.navigate(['/login']);

  }

  clearClientStorage() {
    // clear local storage
    // localStorage.clear();
    // localStorage.removeItem('currentUser');
    // clear local storage
    sessionStorage.clear();
    const cookies = jQuery.cookie();
    for (const cookie in cookies) {
      jQuery.removeCookie(cookie);
    }
  }

  isLoggedIn() {
    return !!jQuery.cookie(this.appName + '.sid');
  }

  displayLoginError(s, fadeOutTime) {
    jQuery('<div class="alert alert-danger" role="alert">' + s + '</div>')
      .prependTo(jQuery('#loginSection').find('#loginModalBody'))
      .fadeOut(fadeOutTime || 5000, function () {
        jQuery(this).remove();
      });
  }
}
