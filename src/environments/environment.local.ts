// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  envName: 'local',
  apiUrl: 'https://was-intra-sit.toronto.ca:9080',
  extractAPIUrl: 'http://shelby.corp.toronto.ca:9180',
  configAPIUrl: 'http://shelby.corp.toronto.ca:9080',
  schedulerAPIUrl: 'http://shelby.corp.toronto.ca:9180'
};
