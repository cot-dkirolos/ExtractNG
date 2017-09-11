import { SharedService } from './../providers/shared/shared.service';
import { ConfigContent, Connection, Query } from './interfaces';

export class Configuration implements ConfigContent {

  pmID: string;
  name: string;
  description: string;
  group: string;
  division?: string;
  sourceCategory: string;
  acl?: string;
  // OData
  dataset?: string;
  url?: string;
  interval?: number;
  status?: string;
  type?: string;
  expiryTime?: string;
  connection?: Connection;
  query?: Query;
  enabled?: boolean;

  constructor(public id: string) {
    this.id = id;
    this.pmID = '';
    this.type = 'json';
    this.status = 'active';
    this.enabled = false;

    this.connection = {};

    this.query = {
      sql: '',
      timePeriod: 'M'
      // ,
      // fromTime: '',
      // toTime: '',
    };
  }
}


