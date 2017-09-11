import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { SharedService } from './../shared/shared.service';
import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var jQuery: any;

@Injectable()
export class HttpService extends Http {

  private baseUrl: string;
  public sid: string;
  systemConfiguration: any;

  constructor(backend: XHRBackend
    , options: RequestOptions
    , private router: Router
    , public sharedService: SharedService) {
    super(backend, options);
    // let token = localStorage.getItem('auth_token'); // your custom token getter function here
    // options.headers.set('Authorization', `Bearer ${token}`);
    this.systemConfiguration = {
      // baseUrl: 'http://shelby.corp.toronto.ca:9080'
      // baseUrl: 'https://was-intra-sit.toronto.ca'
      baseUrl: environment.apiUrl
    };
    if (window.location.hostname !== 'localhost') {
      // this.systemConfiguration.baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
      this.systemConfiguration.baseUrl = '';
    }
    sessionStorage.setItem('extract.config', JSON.stringify(this.systemConfiguration));
    this.baseUrl = this.systemConfiguration.baseUrl;
    // this.baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    // set token if saved in local storage
    this.sid = jQuery.cookie('extract.sid');
  }





  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    this.sharedService.block = true;
    // set token if saved in local storage
    this.sid = jQuery.cookie('extract.sid');
    let config = sessionStorage.getItem("extract.config");
    let baseURI = null;
    if(config){
      baseURI = JSON.parse(config).baseUrl;
    }

    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      // if(url.startsWith('/extract/')){
      //   url = 'http://localhost:8080'+url;
      // }else{
      // url = this.baseUrl + url;
      // }

      url = (baseURI ? baseURI : this.baseUrl) + url;
      if (!options) {
        // let's make option object
        options = { headers: new Headers() };
      }
      // options.headers.set('Content-Type', 'application/json');
      options.headers.set('Accept', 'application/json');
      // options.headers.set('Authorization', `AuthSession ${this.sid}`);
    } else {

      // if(url.url.startsWith('/extract/')){
      //   (<Request>url).url  = 'http://localhost:8080'+url.url;
      // }else{
      //   (<Request>url).url = this.baseUrl + url.url;
      // }
      (<Request>url).url = (baseURI ? baseURI : this.baseUrl) + url.url;
      // we have to add the token to the url object
      url.headers.set('Accept', 'application/json');
      // url.headers.set('Content-Type', 'application/json');
      // url.headers.set('Authorization', `AuthSession ${this.sid}`);
    }

    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError(self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      // console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        console.log(res.json());
        this.sharedService.block = false;
        this.router.navigate(['/login']);
        setTimeout(() => {
          this.displayLoginError('You are not authorized to use the Application <br> due to invalid authentication or session expired, Please try to login again.');
        }, 500);
      }
      return Observable.throw(res);
    };
  }

  displayLoginError(s) {
    jQuery('<div class="alert alert-danger" role="alert">' + s + '</div>')
      .prependTo(jQuery('#loginSection').find('#loginModalBody'))
      .fadeOut(10000, function () {
        jQuery(this).remove();
      });
  }

}
