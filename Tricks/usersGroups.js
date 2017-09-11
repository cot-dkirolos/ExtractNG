var usersGroups = {
  super_admin_all_group: {
    groupID: 'super_admin_all_group',
    name: 'Super Admin Group',
    roleKey: 'super_admin',
    divisions: ['all'],
  },
  epm_admin_all_group: {
    groupID: 'epm_admin_all_group',
    name: 'EPM Admin Group',
    roleKey: 'epm_admin',
    divisions: ['all'],
  },
  odata_admin_all_group: {
    groupID: 'odata_admin_all_group',
    name: 'Open Data Admin Group',
    roleKey: 'odata_admin',
    divisions: ['all']
  },
  swms_admin_all_group: {
    groupID: 'swms_admin_all_group',
    name: 'SWMS Admin Group',
    roleKey: 'swms_admin',
    divisions: ['all']
  },
  swms_analyst_all_group: {
    groupID: 'swms_analyst_all_group',
    name: 'SWMS Analyst Group',
    roleKey: 'swms_analyst',
    divisions: ['all']
  },
  division_admin_311_group: {
    groupID: 'division_admin_311_group',
    name: '311 Toronto Admin Group',
    roleKey: 'division_admin',
    divisions: ['311']
  },
  division_analyst_311_group: {
    groupID: 'division_analyst_311_group',
    name: '311 Toronto Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['311']
  },
  division_admin_afhusofc_group: {
    groupID: 'division_admin_afhusofc_group',
    name: 'Affordable Housing Office Admin Group',
    roleKey: 'division_admin',
    divisions: ['afhusofc']
  },
  division_analyst_afhusofc_group: {
    groupID: 'division_analyst_afhusofc_group',
    name: 'Affordable Housing Office Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['afhusofc']
  },
  division_admin_accounting_group: {
    groupID: 'division_admin_accounting_group',
    name: 'Accounting Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['accounting']
  },
  division_analyst_accounting_group: {
    groupID: 'division_analyst_accounting_group',
    name: 'Accounting Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['accounting']
  },
  division_admin_children_group: {
    groupID: 'division_admin_children_group',
    name: "Children's Services Admin Group",
    roleKey: 'division_admin',
    divisions: ['children']
  },
  division_analyst_children_group: {
    groupID: 'division_analyst_children_group',
    name: "Children's Services Analyst Group",
    roleKey: 'division_analyst',
    divisions: ['children']
  },
  division_admin_citymanagersofc_group: {
    groupID: 'division_admin_citymanagersofc_group',
    name: "City Manager's Office Admin Group",
    roleKey: 'division_admin',
    divisions: ['citymanagersofc']
  },
  division_analyst_citymanagersofc_group: {
    groupID: 'division_analyst_citymanagersofc_group',
    name: "City Manager's Office Analyst Group",
    roleKey: 'division_analyst',
    divisions: ['citymanagersofc']
  },
  division_admin_cityplaning_group: {
    groupID: 'division_admin_cityplaning_group',
    name: "City Planning Admin Group",
    roleKey: 'division_admin',
    divisions: ['cityplaning']
  },
  division_analyst_cityplaning_group: {
    groupID: 'division_analyst_cityplaning_group',
    name: "City Planning Analyst Group",
    roleKey: 'division_analyst',
    divisions: ['cityplaning']
  },
  division_admin_corporatefinance_group: {
    groupID: 'division_admin_corporatefinance_group',
    name: "Corporate Finance Admin Group",
    roleKey: 'division_admin',
    divisions: ['corporatefinance']
  },
  division_analyst_corporatefinance_group: {
    groupID: 'division_analyst_corporatefinance_group',
    name: "Corporate Finance Analyst Group",
    roleKey: 'division_analyst',
    divisions: ['corporatefinance']
  },
  division_admin_court_group: {
    groupID: 'division_admin_court_group',
    name: 'Court Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['court']
  },
  division_analyst_court_group: {
    groupID: 'division_analyst_court_group',
    name: 'Court Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['court']
  },
  division_admin_ecodevndcult_group: {
    groupID: 'division_admin_ecodevndcult_group',
    name: 'Economic Development & Culture Admin Group',
    roleKey: 'division_admin',
    divisions: ['ecodevndcult']
  },
  division_analyst_ecodevndcult_group: {
    groupID: 'division_analyst_ecodevndcult_group',
    name: 'Economic Development & Culture Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['ecodevndcult']
  },
  division_admin_engconst_group: {
    groupID: 'division_admin_engconst_group',
    name: 'Engineering & Construction Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['engconst']
  },
  division_analyst_engconst_group: {
    groupID: 'division_analyst_engconst_group',
    name: 'Engineering & Construction Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['engconst']
  },
  division_admin_realstate_group: {
    groupID: 'division_admin_realstate_group',
    name: 'Facilities, Real Estate, Environment & Energy Admin Group',
    roleKey: 'division_admin',
    divisions: ['realstate']
  },
  division_analyst_realstate_group: {
    groupID: 'division_analyst_realstate_group',
    name: 'Facilities, Real Estate, Environment & Energy Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['realstate']
  },
  division_admin_financeadmin_group: {
    groupID: 'division_admin_financeadmin_group',
    name: 'Finance & Administration Admin Group',
    roleKey: 'division_admin',
    divisions: ['financeadmin']
  },
  division_analyst_financeadmin_group: {
    groupID: 'division_analyst_financeadmin_group',
    name: 'Finance & Administration Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['financeadmin']
  },
  division_admin_financialplaning_group: {
    groupID: 'division_admin_financialplaning_group',
    name: 'Financial Planning Admin Group',
    roleKey: 'division_admin',
    divisions: ['financialplaning']
  },
  division_analyst_financialplaning_group: {
    groupID: 'division_analyst_financialplaning_group',
    name: 'Financial Planning Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['financialplaning']
  },
  division_admin_fire_group: {
    groupID: 'division_admin_fire_group',
    name: 'Fire Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['fire']
  },
  division_analyst_fire_group: {
    groupID: 'division_analyst_fire_group',
    name: 'Fire Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['fire']
  },
  division_admin_fleet_group: {
    groupID: 'division_admin_fleet_group',
    name: 'Fleet Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['fleet']
  },
  division_analyst_fleet_group: {
    groupID: 'division_analyst_fleet_group',
    name: 'Fleet Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['fleet']
  },
  division_admin_it_group: {
    groupID: 'division_admin_it_group',
    name: 'Information & Technology Admin Group',
    roleKey: 'division_admin',
    divisions: ['it']
  },
  division_analyst_it_group: {
    groupID: 'division_analyst_it_group',
    name: 'Information & Technology Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['it']
  },
  division_admin_legal_group: {
    groupID: 'division_admin_legal_group',
    name: 'Legal Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['legal']
  },
  division_analyst_legal_group: {
    groupID: 'division_analyst_legal_group',
    name: 'Legal Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['legal']
  },
  division_admin_lngtrmcarehomes_group: {
    groupID: 'division_admin_lngtrmcarehomes_group',
    name: 'Long-Term Care Homes & Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['lngtrmcarehomes']
  },
  division_analyst_lngtrmcarehomes_group: {
    groupID: 'division_analyst_lngtrmcarehomes_group',
    name: 'Long-Term Care Homes & Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['lngtrmcarehomes']
  },
  division_admin_municipal_group: {
    groupID: 'division_admin_municipal_group',
    name: 'Municipal Licensing Admin Group',
    roleKey: 'division_admin',
    divisions: ['municipal']
  },
  division_analyst_municipal_group: {
    groupID: 'division_analyst_municipal_group',
    name: 'Municipal Licensing Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['municipal']
  },
  division_admin_parks_group: {
    groupID: 'division_admin_parks_group',
    name: 'Parks, Forestry & Recreation Admin Group',
    roleKey: 'division_admin',
    divisions: ['parks']
  },
  division_analyst_parks_group: {
    groupID: 'division_analyst_parks_group',
    name: 'Parks, Forestry & Recreation Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['parks']
  },
  division_admin_ppndempbenbnft_group: {
    groupID: 'division_admin_ppndempbenbnft_group',
    name: 'Pension, Payroll & Employee Benefits Admin Group',
    roleKey: 'division_admin',
    divisions: ['ppndempbenbnft']
  },
  division_analyst_ppndempbenbnft_group: {
    groupID: 'division_analyst_ppndempbenbnft_group',
    name: 'Pension, Payroll & Employee Benefits Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['ppndempbenbnft']
  },
  division_admin_ppfadmin_group: {
    groupID: 'division_admin_ppfadmin_group',
    name: 'Policy, Planning, Finance & Administration Admin Group',
    roleKey: 'division_admin',
    divisions: ['ppfadmin']
  },
  division_analyst_ppfadmin_group: {
    groupID: 'division_analyst_ppfadmin_group',
    name: 'Policy, Planning, Finance & Administration Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['ppfadmin']
  },
  division_admin_ppmngmnt_group: {
    groupID: 'division_admin_ppmngmnt_group',
    name: 'Purchasing & Materials Mgmt. Admin Group',
    roleKey: 'division_admin',
    divisions: ['ppmngmnt']
  },
  division_analyst_ppmngmnt_group: {
    groupID: 'division_analyst_ppmngmnt_group',
    name: 'Purchasing & Materials Mgmt. Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['ppmngmnt']
  },
  division_admin_revenue_group: {
    groupID: 'division_admin_revenue_group',
    name: 'Revenue Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['revenue']
  },
  division_analyst_revenue_group: {
    groupID: 'division_analyst_revenue_group',
    name: 'Revenue Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['revenue']
  },
  division_admin_shelteradmin_group: {
    groupID: 'division_admin_shelteradmin_group',
    name: 'Shelter, Support & Housing Administration Admin Group',
    roleKey: 'division_admin',
    divisions: ['shelteradmin']
  },
  division_analyst_shelteradmin_group: {
    groupID: 'division_analyst_shelteradmin_group',
    name: 'Shelter, Support & Housing Administration Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['shelteradmin']
  },
  division_admin_sdfadmin_group: {
    groupID: 'division_admin_sdfadmin_group',
    name: 'Social Development, Finance & Administration Admin Group',
    roleKey: 'division_admin',
    divisions: ['sdfadmin']
  },
  division_analyst_sdfadmin_group: {
    groupID: 'division_analyst_sdfadmin_group',
    name: 'Social Development, Finance & Administration Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['sdfadmin']
  },
  division_admin_swmngmnt_group: {
    groupID: 'division_admin_swmngmnt_group',
    name: 'Solid Waste Management Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['swmngmnt']
  },
  division_analyst_swmngmnt_group: {
    groupID: 'division_analyst_swmngmnt_group',
    name: 'Solid Waste Management Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['swmngmnt']
  },
  division_admin_tbuilding_group: {
    groupID: 'division_admin_tbuilding_group',
    name: 'Toronto Building Admin Group',
    roleKey: 'division_admin',
    divisions: ['tbuilding']
  },
  division_analyst_tbuilding_group: {
    groupID: 'division_analyst_tbuilding_group',
    name: 'Toronto Building Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['tbuilding']
  },
  division_admin_tempsocial_group: {
    groupID: 'division_admin_tempsocial_group',
    name: 'Toronto Employment & Social Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['tempsocial']
  },
  division_analyst_tempsocial_group: {
    groupID: 'division_analyst_tempsocial_group',
    name: 'Toronto Employment & Social Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['tempsocial']
  },
  division_admin_paramedic_group: {
    groupID: 'division_admin_paramedic_group',
    name: 'Toronto Paramedic Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['paramedic']
  },
  division_analyst_paramedic_group: {
    groupID: 'division_analyst_paramedic_group',
    name: 'Toronto Paramedic Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['paramedic']
  },
  division_admin_tph_group: {
    groupID: 'division_admin_tph_group',
    name: 'Toronto Public Health Admin Group',
    roleKey: 'division_admin',
    divisions: ['tph']
  },
  division_analyst_tph_group: {
    groupID: 'division_analyst_tph_group',
    name: 'Toronto Public Health Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['tph']
  },
  division_admin_twater_group: {
    groupID: 'division_admin_twater_group',
    name: 'Toronto Water Admin Group',
    roleKey: 'division_admin',
    divisions: ['twater']
  },
  division_analyst_twater_group: {
    groupID: 'division_analyst_twater_group',
    name: 'Toronto Water Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['twater']
  },
  division_admin_transportation_group: {
    groupID: 'division_admin_transportation_group',
    name: 'Transportation Services Admin Group',
    roleKey: 'division_admin',
    divisions: ['transportation']
  },
  division_analyst_transportation_group: {
    groupID: 'division_analyst_transportation_group',
    name: 'Transportation Services Analyst Group',
    roleKey: 'division_analyst',
    divisions: ['transportation']
  }
};
