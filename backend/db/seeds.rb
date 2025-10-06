puts '****************************** Creating Application Module ************************'
application_module = Cats::Core::ApplicationModule.where(prefix: 'CATS-WH', name: 'CATS Warehouse').first_or_create
puts '****************************** Creating Roles *************************************'
hub_manager = Cats::Core::Role.where(name: 'hub_manager', application_module: application_module).first_or_create
warehouse_manager = Cats::Core::Role.where(name: 'warehouse_manager', application_module: application_module).first_or_create
store_keeper = Cats::Core::Role.where(name: 'store_keeper', application_module: application_module).first_or_create
admin = Cats::Core::Role.where(name: 'admin', application_module: application_module).first_or_create
fdp_store_keeper = Cats::Core::Role.where(name: 'fdp_store_keeper', application_module: application_module).first_or_create
dispatch_planner = Cats::Core::Role.where(name: 'dispatch_planner', application_module: application_module).first_or_create
psnp_officer = Cats::Core::Role.where(name: 'psnp_manager', application_module: application_module).first_or_create
storage_and_reserve = Cats::Core::Role.where(name: 'storage_and_reserve_officer', application_module: application_module).first_or_create
logistics_officer = Cats::Core::Role.where(name: 'logistics_officer', application_module: application_module).first_or_create
hub_and_dispatch = Cats::Core::Role.where(name: 'hub_and_dispatch_officer', application_module: application_module).first_or_create
hub_and_dispatch_approver = Cats::Core::Role.where(name: 'hub_and_dispatch_approver',
                                                   application_module: application_module).first_or_create
puts '**************************** Remove the previous menus *****************************'
roles = Cats::Core::Role.where(application_module: application_module)
Cats::Core::RoleMenu.where(role: roles).delete_all
menus = Cats::Core::Menu.where(application_module: application_module)
Cats::Core::MenuItem.where(menu: menus).delete_all
menus.delete_all
puts '****************************** Creating Menus **************************************'
setup_menu = Cats::Core::Menu.where(label: 'Setup', icon: 'pi pi-fw pi-cog', application_module: application_module).first_or_create
stack_management_menu = Cats::Core::Menu.where(label: 'Stack Management', icon: 'pi pi-map',
                                               application_module: application_module).first_or_create
psnp_officer_menu = Cats::Core::Menu.where(label: 'Dispatch Planning', icon: 'pi pi-map',
                                           application_module: application_module).first_or_create
storage_officer_menu = Cats::Core::Menu.where(label: 'Dispatch Planning', icon: 'pi pi-book',
                                              application_module: application_module).first_or_create
hub_officer_menu = Cats::Core::Menu.where(label: 'Hub Opertaion', icon: 'pi fa-plane',
                                          application_module: application_module).first_or_create
receipt_management_menu = Cats::Core::Menu.where(label: 'Receipt Management', icon: 'pi pi-book',
                                                 application_module: application_module).first_or_create
dispatch_management_menu = Cats::Core::Menu.where(label: 'Dispatch Management', icon: 'fa fa-plane',
                                                  application_module: application_module).first_or_create
user_mgmt_menu = Cats::Core::Menu.where(label: 'User Management', icon: 'pi pi-users',
                                        application_module: application_module).first_or_create
hub_operation_menu = Cats::Core::Menu.where(label: 'Hub Operation', icon: 'pi pi-globe',
                                            application_module: application_module).first_or_create
report_menu = Cats::Core::Menu.where(label: 'Reports', icon: 'pi pi-wallet',
                                     application_module: application_module).first_or_create
distribution_mgmt_menu = Cats::Core::Menu.where(label: 'Distribution Management', icon: 'pi pi-telegram',
                                                application_module: application_module).first_or_create
dispatch_planning_menu = Cats::Core::Menu.where(label: 'Dispatch Planning', icon: 'fa fa-plane',
                                                application_module: application_module).first_or_create
password_mgt_menu = Cats::Core::Menu.where(label: 'Manage Password', icon: 'fa fa-paypal',
                                           application_module: application_module).first_or_create

puts '***************************** Creating Menu Items **********************************'
Cats::Core::MenuItem.where(label: 'Locations', icon: 'pi pi-map-marker', route: '/main/setups/location',
                           menu: setup_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Stores', icon: 'pi pi-home', route: '/main/setups/store',
                           menu: setup_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Reservation', icon: 'pi pi-th-large', route: '/main/floor-plan',
                           menu: stack_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Stack Transaction', icon: 'pi pi-th-large', route: '/main/stacking/stack-transaction',
                           menu: stack_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Free Space Report', icon: 'pi pi-percentage',
                           route: '/main/space-availability/freespace-report', menu: stack_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Receipt', icon: 'pi pi-tags', route: '/main/receipts',
                           menu: receipt_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Stacking', icon: 'fa fa-database', route: '/main/stacking',
                           menu: receipt_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Download GRN', icon: 'pi pi-download', route: '/main/receipts/goods-receipt-note',
                           menu: receipt_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch Transactions', icon: 'fa fa-tasks', route: '/main/dispatches/dispatch-transactions',
                           menu: dispatch_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Download GIN', icon: 'pi pi-download', route: '/main/dispatches/goods-issue-note',
                           menu: dispatch_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Bin Card Report', icon: 'fa fa-clipboard-list', route: '/main/reports/stack-card-report',
                           menu: report_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Users', icon: 'pi pi-users',
                           route: '/main/users', menu: user_mgmt_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Store Assignment', icon: 'pi pi-arrow-right',
                           route: '/main/receipts/hub-authorization', menu: hub_operation_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Change Password', icon: 'pi pi-user-edit',
                           route: '/main/users/change-password', menu: password_mgt_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch Authorization', icon: 'pi pi-thumbs-up',
                           route: '/main/dispatches/dispatch-authorization', menu: hub_operation_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Receipt Authorization', icon: 'pi pi-book',
                           route: '/main/receipts/receipt-authorization', menu: hub_operation_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch', icon: 'fa fa-truck', route: '/main/dispatches',
                           menu: hub_operation_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Start Dispatch', icon: 'fa fa-truck', route: '/main/dispatches',
                           menu: dispatch_management_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Round Beneficiary', icon: 'pi pi-sign-out',
                           route: '/main/distribution', menu: distribution_mgmt_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch Plan', icon: 'fa fa-route', route: '/main/dispatches/dispatch-plan',
                           menu: dispatch_planning_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Round Plan Completion', icon: 'fa fa-check', route: '/main/dispatches/round-plan-completion',
                           menu: dispatch_planning_menu).first_or_create

Cats::Core::MenuItem.where(label: 'Dispatch Plan', icon: 'fa fa-route', route: '/main/dispatches/dispatch-plan',
                           menu: psnp_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Round Plan Completion', icon: 'fa fa-check', route: '/main/dispatches/round-plan-completion',
                           menu: psnp_officer_menu).first_or_create

Cats::Core::MenuItem.where(label: 'Free Space Report', icon: 'pi pi-percentage',
                           route: '/main/space-availability/freespace-report', menu: storage_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch Plan', icon: 'fa fa-route', route: '/main/dispatches/dispatch-plan',
                           menu: storage_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Round Plan Completion', icon: 'fa fa-check', route: '/main/dispatches/round-plan-completion',
                           menu: storage_officer_menu).first_or_create

Cats::Core::MenuItem.where(label: 'Dispatch Authorization', icon: 'pi pi-thumbs-up',
                           route: '/main/dispatches/dispatch-authorization', menu: hub_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Receipt Authorization', icon: 'pi pi-book',
                           route: '/main/receipts/receipt-authorization', menu: hub_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Dispatch', icon: 'fa fa-truck', route: '/main/dispatches',
                           menu: hub_officer_menu).first_or_create
Cats::Core::MenuItem.where(label: 'Inventory Adjustment', icon: 'fa pi-book', route: '/main/stacking/inventory-adjustment',
                           menu: hub_officer_menu).first_or_create
puts '**************************** Assigning Menu For Role *****************************'
Cats::Core::RoleMenu.where(role: warehouse_manager, menu: setup_menu).first_or_create
Cats::Core::RoleMenu.where(role: warehouse_manager, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: store_keeper, menu: stack_management_menu).first_or_create
Cats::Core::RoleMenu.where(role: store_keeper, menu: receipt_management_menu).first_or_create
Cats::Core::RoleMenu.where(role: store_keeper, menu: dispatch_management_menu).first_or_create
Cats::Core::RoleMenu.where(role: store_keeper, menu: report_menu).first_or_create
Cats::Core::RoleMenu.where(role: store_keeper, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: admin, menu: user_mgmt_menu).first_or_create
Cats::Core::RoleMenu.where(role: admin, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: hub_manager, menu: hub_operation_menu).first_or_create
Cats::Core::RoleMenu.where(role: hub_manager, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: fdp_store_keeper, menu: receipt_management_menu).first_or_create
Cats::Core::RoleMenu.where(role: fdp_store_keeper, menu: distribution_mgmt_menu).first_or_create
Cats::Core::RoleMenu.where(role: fdp_store_keeper, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: dispatch_planner, menu: dispatch_planning_menu).first_or_create
Cats::Core::RoleMenu.where(role: dispatch_planner, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: psnp_officer, menu: psnp_officer_menu).first_or_create
Cats::Core::RoleMenu.where(role: psnp_officer, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: storage_and_reserve, menu: storage_officer_menu).first_or_create
Cats::Core::RoleMenu.where(role: storage_and_reserve, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: logistics_officer, menu: psnp_officer_menu).first_or_create
Cats::Core::RoleMenu.where(role: logistics_officer, menu: password_mgt_menu).first_or_create
Cats::Core::RoleMenu.where(role: hub_and_dispatch, menu: hub_officer_menu).first_or_create
Cats::Core::RoleMenu.where(role: hub_and_dispatch_approver, menu: hub_officer_menu).first_or_create
Cats::Core::RoleMenu.where(role: hub_and_dispatch, menu: password_mgt_menu).first_or_create
puts '*************************** Creating Stacking Rules *******************************'
Cats::Core::StackingRule.delete_all
Cats::Core::StackingRule.where(distance_from_wall: 1, space_between_stack: 1, distance_from_ceiling: 1, maximum_height: 5,
                               maximum_length: 16, maximum_width: 13, distance_from_gangway: 2).first_or_create
puts '*************************** Creating Notification Rules ***************************'
Cats::Core::NotificationRule.where(code: 'allocation', roles: %w[warehouse_manager store_keeper]).first_or_create
Cats::Core::NotificationRule.where(code: 'dispatch', roles: %w[warehouse_manager store_keeper]).first_or_create
