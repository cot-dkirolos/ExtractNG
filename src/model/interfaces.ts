// import { BreadcrumbItem } from './BreadcrumbItem';

export interface BreadcrumbItem {
  name: string;
  link?: string;
}
export interface Breadcrumb {
  breadcrumbItems: BreadcrumbItem[];
}
export interface ConfigurationListObj {
  acl: string;
  description: string;
  division: string;
  group: string;
  id: string;
  name: string;
}

export interface IAceEditorOption {
  readonly: boolean;
  theme: string;
  fontSize: number;
  tabSize: number;
  enableEmmet: boolean;
  enableSnippets: boolean;
  showPrintMargin: boolean;
  onLoaded: Function;
  onChange: Function;
}
export interface Configuration {
  division: string;
  query: string;
  name: string;
  description: string;
  connection: string;
  id: string;
  acl: string;
  group: string;
  connectionType: string;
  connectionHost: string;
  connectionPort: string;
  connectionDB: string;
  connectionUsername: string;
  connectionPassword: string;
}
export interface ODataConfiguration {
  id?: string;
  name?: string;
  description?: string;
  division?: string;
  status?: string;
  acl?: string;
  group?: string;
  dataset?: string;
  url?: string;
  type?: string;
  interval?: number;
  expiryTime?: string;
}

export interface Schedule {
  id?: string;
  name?: string;
  division?: string;
  interval?: number;
  expiryTime?: Date;
  status?: string;
  type?: string;
  url?: string;
  group?: string;
};




export interface Connection {
        type?:  string;
        hostName?: string;
        port?: number;
        serviceName?:  string;
        user?:  string;
        password?:  string;
        huser?:  string;
        hpassword?:  string;
}

export interface Query {
    sql: string;
    timePeriod?:  string;
    baseTimePoint?: string;
    level?: string;
    folder?: string;
    saveAs?: string;
    batches?: string;
    fromTime?:  string;
    toTime?:  string;
}

// export interface Schedule {
//   interval: number;
//   expiryTime: Date;
//   status: string;
//   type: string;
//   configGroup?: string;
//   configId?: string;
//   configName?: string;
//   configDivision?: string;
//   configUrl?: string;
// };

export interface ConfigContent {
  id: string;
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
}
