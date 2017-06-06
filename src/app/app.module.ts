import { NewUserPage } from './../pages/new-user/new-user.page';
import { UpdateConfigPage } from './../pages/update-config/update-config.page';
import { AppConfig } from './../providers/app-config/app-config.service';
import { ConfigListPage } from './../pages/config-list/config-list.page';
import { CreateConfigPage } from './../pages/create-config/create-config.page';
import { CalendarModule } from './../components/calendar/calendar.component';
import { ObjectUtils } from './../providers/utils/object-utils';
import { DropdownModule } from './../components/dropdown/dropdown.component';
import { AceEditorComponent } from './../components/ace-editor/ace-editor.component';
import { ExtractService } from './../providers/extract/extract.service';
import { AuthenticationService } from './../providers/auth/authentication.service';
import { AuthGuard } from './../providers/auth/auth.guard';
import { ErrorHandlerService } from './../providers/error-handler/error-handler.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from './../providers/http/http.service';
import { CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { FooterComponent, HeaderComponent, LoginComponent } from '../components/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule, RequestOptions, XHRBackend, Http } from '@angular/http';

import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomePage, LoginPage } from '../pages/index';
import { SharedService } from './../providers/index';
// import { LAceEditorModule } from 'angular2-ace';
import {
  InputMaskModule, SpinnerModule, SliderModule, SplitButtonModule, DialogModule, ToolbarModule,
  InputTextModule, ButtonModule, PanelModule, DataTableModule, SharedModule, MultiSelectModule, TabViewModule,
  ConfirmDialogModule,ConfirmationService,GrowlModule,MessagesModule
} from 'primeng/primeng';

export function httpFactory(backend: XHRBackend, options: RequestOptions, router: Router, sharedService: SharedService) {
  return new HttpService(backend, options, router, sharedService);
}

export function initConfig(config: AppConfig, httpService: Http) {
  return () => config.load(httpService);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    LoginPage,
    HomePage,
    AceEditorComponent,
    CreateConfigPage,
    UpdateConfigPage,
    ConfigListPage,
    NewUserPage
  ],
  entryComponents: [
    LoginPage,
    HomePage,
    CreateConfigPage,
    UpdateConfigPage,
    ConfigListPage,
    NewUserPage
  ],
  imports: [
    AceEditorModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule, ButtonModule,
    InputMaskModule, SpinnerModule, SliderModule, SplitButtonModule, DialogModule, ToolbarModule, CalendarModule,
    PanelModule, DataTableModule, SharedModule, MultiSelectModule, DropdownModule, TabViewModule,ConfirmDialogModule,
    GrowlModule,MessagesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthenticationService, ExtractService, ObjectUtils,ConfirmationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HttpService,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Router, SharedService]
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    },
    SharedService, AuthGuard,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig,Http],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
