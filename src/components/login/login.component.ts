import { AuthenticationService } from './../../providers/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SharedService } from './../../providers/shared/shared.service';
declare var jQuery: any;
declare var cot_app: any;
@Component({
  // moduleId: module.id,
  selector: 'app-login-component',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChildren('username') usernameField;
  loginForm: FormGroup;
  path: string;
  public sharedService: SharedService;

  constructor(private fb: FormBuilder
    , private router: Router
    , private activatedRoute: ActivatedRoute
    , private sharedServicew: SharedService
    , private authService: AuthenticationService) {
    this.sharedService = sharedServicew;
    this.activatedRoute.url.subscribe(url => {
      if (url[0]) {
        this.path = url[0].path;
      }
    });

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'username': new FormControl('', Validators.required)
      , 'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
  ngAfterViewInit() {
    this.usernameField.first.nativeElement.focus();
  }
  onSubmit(value) {
    this.sharedService.block = true;
    this.authService.login(value.username, value.password)
      .subscribe((data) => {
        if (data) {
          if (!data.error) {
            this.authService.processLogin(data);
            this.sharedService.block = false;
            this.router.navigate(['/home']).then(result => {
            });

            // that.modal.modal('hide');
          } else if (data.error === 'invalid_user_or_pwd') {
            this.sharedService.block = false;
            this.authService.displayLoginError('Invalid username or password',5000);
          }

          this.sharedService.block = false;
          return true;
        } else {
          // return false to indicate failed login
          this.sharedService.block = false;
          return false;
        }
      });
  }
}
