import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import * as jQuery from 'jquery';

if (environment.production) {
  enableProdMode();
}
// jQuery(() => platformBrowserDynamic().bootstrapModule(AppModule));
// platformBrowserDynamic().bootstrapModule(AppModule, [{
//   useValue: '/ExtractNG'
// }]);

platformBrowserDynamic().bootstrapModule(AppModule);