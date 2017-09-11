var appConfig = {
    extractApiUrlTemplate: "{host}/extract/data/?$filter=TimePeriod eq '{TimePeriod}' and DateRange lt '{FromDate}' and DateRange gt '{ToDate}'",
    divisionsList: [
        { value: "311", label: "311 Toronto" },
        { value: "afhusofc", label: "Affordable Housing Office" },
        { value: "accounting", label: "Accounting Services" },
        { value: "children", label: "Children's Services" },
        { value: "citymanagersofc", label: "City Manager's Office" },
        { value: "cityplaning", label: "City Planning" },
        { value: "corporatefinance", label: "Corporate Finance" },
        { value: "court", label: "Court Services" },
        { value: "ecodevndcult", label: "Economic Development & Culture" },
        { value: "engconst", label: "Engineering & Construction Services" },
        { value: "realstate", label: "Facilities, Real Estate, Environment & Energy" },
        { value: "financeadmin", label: "Finance & Administration" },
        { value: "financialplaning", label: "Financial Planning" },
        { value: "fire", label: "Fire Services" },
        { value: "fleet", label: "Fleet Services" },
        { value: "it", label: "Information & Technology" },
        { value: "legal", label: "Legal Services" },
        { value: "lngtrmcarehomes", label: "Long-Term Care Homes & Services" },
        { value: "municipal", label: "Municipal Licensing & Standards" },
        { value: "parks", label: "Parks, Forestry & Recreation" },
        { value: "ppndempbenbnft", label: "Pension, Payroll & Employee Benefits" },
        { value: "ppfadmin", label: "Policy, Planning, Finance & Administration" },
        { value: "ppmngmnt", label: "Purchasing & Materials Mgmt." },
        { value: "revenue", label: "Revenue Services" },
        { value: "shelteradmin", label: "Shelter, Support & Housing Administration" },
        { value: "sdfadmin", label: "Social Development, Finance & Administration" },
        { value: "swmngmnt", label: "Solid Waste Management Services" },
        { value: "tbuilding", label: "Toronto Building" },
        { value: "tempsocial", label: "Toronto Employment & Social Services" },
        { value: "paramedic", label: "Toronto Paramedic Services" },
        { value: "tph", label: "Toronto Public Health" },
        { value: "twater", label: "Toronto Water" },
        { value: "transportation", label: "Transportation Services" }
    ],
    categoryList: [
        { value: 'epm', label: 'EPM' },
        { value: 'odata', label: 'OpenData' },
        { value: 'swms', label: 'SWMS' }
    ],
    configStatus: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ],
    dbConnectionDefaults: [{
        value: 'excelsheet',
        hostName: '/VALID_DATA_DROPS_DIRECTORY_PATH/',
        port: null,
        serviceName: null
    }, {
        value: 'oracle',
        hostName: '',
        port: 1521,
        serviceName: ''
    }, {
        value: 'sqlserver',
        hostName: '',
        port: 1433,
        serviceName: ''
    }],
    dbConnectionTypes: [{
            value: 'excelsheet',
            label: 'Excel-sheets on NetShare'
        },
        {
            value: 'oracle',
            label: 'Oracle'
        },
        {
            value: 'sqlserver',
            label: 'SQL Server'
        }
    ],
    queryTimePeriods: [
        { value: '', label: '-' },
        // { value: 'D', label: 'Days' },
        // { value: 'W', label: 'Weeks' },
        { value: 'M', label: 'Months' },
        { value: 'Q', label: 'Quarters' },
        { value: 'Y', label: 'Yearly' }
    ],
    extractFiletypes: [
        { value: 'csv', label: 'CSV' },
        { value: 'json', label: 'JSON' },
        { value: 'xml', label: 'XML' }
    ],
    userRoles: {
        super_admin: {
            key: 'super_admin',
            name: 'Super Admin',
            extractCategory: ['epm', 'odata', 'swms'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: true,
                    updateConfigView: true,
                    userListView: true,
                    updateUserView: true
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: true,
                },
                userListView: {
                    showNewUserButton: true,
                    showUpdateButton: true,
                },
                updateUserView: {
                    showDeleteUser: true
                },
                updateConfigView: {
                    showDeleteConfig: true
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: true,
                    showDivitionList: true,
                    showNameDescFields: true,
                    showGeneratedPM: true,

                    showDeleteButton: true,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: true,
                    showExecutionHistorySection: true,
                    showExtractResultSection: true
                }
            }
        },
        epm_admin: {
            key: 'epm_admin',
            name: 'EPM Admin',
            extractCategory: ['epm'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: true,
                    updateConfigView: true,
                    userListView: true,
                    updateUserView: true
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: true,
                },
                userListView: {
                    showNewUserButton: true,
                    showUpdateButton: true,
                },
                updateUserView: {
                    showDeleteUser: true
                },
                updateConfigView: {
                    showDeleteConfig: true
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: true,
                    showDivitionList: true,
                    showNameDescFields: true,
                    showGeneratedPM: true,

                    showDeleteButton: true,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: true,
                    showExecutionHistorySection: true,
                    showExtractResultSection: true
                }
            }
        },
        division_admin: {
            key: 'division_admin',
            name: 'Division Admin',
            extractCategory: ['epm', 'odata'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: true,
                    updateConfigView: true,
                    userListView: true,
                    updateUserView: true
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: true,
                },
                userListView: {
                    showNewUserButton: true,
                    showUpdateButton: true,
                },
                updateUserView: {
                    showDeleteUser: true
                },
                updateConfigView: {
                    showDeleteConfig: true
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: true,
                    showDivitionList: true,
                    showNameDescFields: true,
                    showGeneratedPM: true,

                    showDeleteButton: true,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: false,
                    showExecutionHistorySection: false,
                    showExtractResultSection: true
                }
            }
        },
        division_analyst: {
            key: 'division_analyst',
            name: 'Division Analyst',
            extractCategory: ['epm', 'odata'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: false,
                    updateConfigView: true,
                    userListView: false,
                    updateUserView: false
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: false,
                },
                userListView: {
                    showNewUserButton: false,
                    showUpdateButton: false,
                },
                updateUserView: {
                    showDeleteUser: false
                },
                updateConfigView: {
                    showDeleteConfig: false
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: false,
                    showDivitionList: false,
                    showNameDescFields: false,
                    showGeneratedPM: false,

                    showDeleteButton: false,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: false,
                    showExecutionHistorySection: false,
                    showExtractResultSection: true
                }
            }
        },
        odata_admin: {
            key: 'odata_admin',
            name: 'OpenData Admin',
            extractCategory: ['odata'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: true,
                    updateConfigView: true,
                    userListView: true,
                    updateUserView: true
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: true,
                },
                userListView: {
                    showNewUserButton: true,
                    showUpdateButton: true,
                },
                updateUserView: {
                    showDeleteUser: true
                },
                updateConfigView: {
                    showDeleteConfig: true
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: true,
                    showDivitionList: true,
                    showNameDescFields: true,
                    showGeneratedPM: true,

                    showDeleteButton: true,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: true,
                    showExecutionHistorySection: true,
                    showExtractResultSection: true
                }
            }
        },
        swms_admin: {
            key: 'swms_admin',
            name: 'SWMS Admin',
            extractCategory: ['swms'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: true,
                    updateConfigView: true,
                    userListView: true,
                    updateUserView: true
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: true,
                },
                userListView: {
                    showNewUserButton: true,
                    showUpdateButton: true,
                },
                updateUserView: {
                    showDeleteUser: true
                },
                updateConfigView: {
                    showDeleteConfig: true
                },
                newConfigView: {
                    // New configuration Page
                    showCategoryList: true,
                    showDivitionList: false,
                    showNameDescFields: true,
                    showGeneratedPM: true,

                    showDeleteButton: true,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: false,
                    showExecutionHistorySection: false,
                    showExtractResultSection: true
                }
            }
        },
        swms_analyst: {
            key: 'swms_analyst',
            name: 'SWMS Analyst',
            extractCategory: ['swms'],
            roles: {
                views: {
                    configListView: true,
                    newConfigView: false,
                    updateConfigView: true,
                    userListView: false,
                    updateUserView: false
                },
                // ConfigurationList
                configListView: {
                    showConfigButton: true,
                    showNewConfigButton: false,
                },
                userListView: {
                    showNewUserButton: false,
                    showUpdateButton: false,
                },
                updateUserView: {
                    showDeleteUser: false
                },
                updateConfigView: {
                    showDeleteConfig: false
                },
                newConfigView: {

                    // New configuration Page
                    showCategoryList: false,
                    showDivitionList: false,
                    showNameDescFields: false,
                    showGeneratedPM: false,

                    showDeleteButton: false,
                    showSaveButton: true,

                    // Configuration sections
                    showDescSection: true,
                    showConnectionSection: true,
                    showQueryStmtSection: true,
                    showScheduleSection: false,
                    showExecutionHistorySection: false,
                    showExtractResultSection: true
                }
            }
        }
    }
};
