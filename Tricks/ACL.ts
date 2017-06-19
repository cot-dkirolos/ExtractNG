export const appACL = {

  userGroups: [
    {
      groupID: 'epm_admin_all_group',
      name: 'EPM Admin Group',
      roleKey: 'epm_admin',
      divisions: ['All'],
    },
    {
      groupID: 'odata_admin_all_group',
      name: 'Open Data Admin Group',
      roleKey: 'odata_admin',
      divisions: ['All']
    },
    {
      groupID: 'swms_admin_all_Group',
      name: 'SWMS Admin Group',
      roleKey: 'wsms_admin',
      divisions: ['All']
    },
    {
      groupID: 'swms_analyst_all_group',
      name: 'SWMS Analyst Group',
      roleKey: 'wsms_analyst',
      divisions: ['All']
    },
    {
      groupID: 'division_admin_fire_group',
      name: 'Fire Division Admin Group',
      roleKey: 'division_admin',
      divisions: ['fire']
    },
    {
      groupID: 'division_analyst_fire_group',
      name: 'Open Data Admin',
      roleKey: 'division_analyst',
      divisions: ['fire']
    }
  ],
  users: [
    {
      userID: 'dkirolo',
      name: 'David Kirolos',
      groupID: 'epm_admin_all_group'
    },
    {
      userID: 'dkirolos',
      name: 'David Kirolos',
      groupID: 'epm_admin_all_group'
    }
  ]

};
