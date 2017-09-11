import { environment } from './../environments/environment';
import { SharedService } from './../providers/shared/shared.service';
import { AuthenticationService } from './../providers/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
declare var cot_app: any;
export var my_app: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  environmentName = environment.envName;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public sharedService: SharedService) {
    my_app = new cot_app('Extract Tool');
    console.log(this.environmentName);


}
  ngOnInit() {

  }
  ngOnDestroy() {
  }
}
