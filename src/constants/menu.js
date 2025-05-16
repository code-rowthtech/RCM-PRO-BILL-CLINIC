const MENU_ITEMS = [
    // { key: 'navigation', label: 'Navigation', isTitle: true },
    {
        key: 'dashboards',
        label: 'Dashboard',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/dashboard/project',
    },

    {
        key: 'appointments',
        label: 'Appointments',
        icon: 'uil-schedule',
        url: '/apps/appointments/list',
    },
    // {
    //     key: 'transaction',
    //     label: 'Transaction',
    //     icon: 'uil-money-withdrawal',
    //     url: '/apps/transaction/transaction-list',
    // },

    // {
    //     key: 'Practice',
    //     label: 'Sub  Practice',
    //     icon: 'bi bi-heart-pulse',
    //     url: '/apps/Practice/list',
    // },
    {
        key: 'doctors',
        label: 'Provider',
        icon: 'dripicons-medical',
        url: '/apps/doctors/list',
    },
    {
        key: 'schedule',
        label: 'Provider Schedule',
        icon: 'uil-clock',
        url: '/apps/schedule/list',
    },
    {
        key: 'patients',
        label: 'Patients',
        icon: 'uil uil-user',
        url: '/apps/patients/list',
    },
    // {
    //     key: 'diagnosis',
    //     label: 'Diagnosis',
    //     url: '/apps/crm/orders',
    //     icon: 'uil uil-medical',
    // },
    {
        key: 'roleManagement',
        label: 'User Management',
        url: '/apps/role-management/list',
        icon: 'uil uil-users-alt',
    },

    {
        key: 'apps-crm',
        label: 'Practice',
        url: '/apps/crm/addclinic',
        isTitle: false,
        // badge: { variant: 'danger', text: 'New' },
        icon: 'uil-user',
    },
    {
        key: 'notesandtemplates',
        label: 'Notes and Templates',
        icon: 'bi bi-journal-plus',
        url: '/apps/notesandtemplates/list',
        children: [
            {
                key: 'notescategories',
                label: 'Note Categories',
                icon: 'uil uil-note',
                url: '/apps/notesandtemplates/notecategories',
            },
            {
                key: 'notestemplates',
                label: 'Clinical Templates',
                icon: 'uil uil-note',
                url: '/apps/notesandtemplates/notetemplates',
            },
        ],
    },
    {
        key: 'setting',
        label: 'Setting',
        icon: 'uil-lock-open-alt',
        url: '/apps/settings/list',
        children: [
            {
                key: 'department',
                label: 'Department',
                url: '/apps/settings/department',
                parentKey: 'setting',
            },
            {
                key: 'designation',
                label: 'Designation',
                url: '/apps/settings/desigination',
                parentKey: 'setting',
            },
            {
                key: 'purposeofvisit',
                label: 'Purpose of Visit',
                url: '/apps/settings/purposeofvisit',
                parentKey: 'setting',
            },
            {
                key: 'consultationroom',
                label: 'Consultation Room',
                url: '/apps/settings/consultationroom',
                parentKey: 'setting',
            },
            {
                key: 'office',
                label: 'Office',
                url: '/apps/settings/office',
                parentKey: 'setting',
            },
            {
                key: 'rolesetting',
                label: 'Role',
                url: '/apps/settings/role',
                parentKey: 'setting',
            },
            // {
            //     key: 'notesType',
            //     label: 'Notes Type',
            //     url: '/apps/settings/notesType',
            //     parentKey: 'setting',
            // },
            // {
            //     key: 'templates',
            //     label: 'Templates',
            //     url: '/apps/settings/templates',
            //     parentKey: 'setting',
            // },
        ],
    },
    // {
    //     key: 'logout',
    //     label: 'Logout',
    //     icon: 'uil uil-sign-out-alt',
    //     // url: '/apps/logout/logout-model',
    // },
];

export default MENU_ITEMS;
