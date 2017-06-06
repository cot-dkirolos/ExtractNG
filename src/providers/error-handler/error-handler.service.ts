import { Router } from '@angular/router';
import { SharedService } from './../shared/shared.service';
import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

  constructor(private sharedService: SharedService) {
    super();
  }


  handleError(error: any): void {
    try {
      this.sharedService.block = false;
      super.handleError(error);
      //  this.router.navigate(['/login']);
    } catch (e) {

    }
  }

}
