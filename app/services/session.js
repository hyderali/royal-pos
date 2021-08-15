/* eslint camelcase: "off" */
import { equal } from '@ember/object/computed';

import Service from '@ember/service';
export default Service.extend({
  isLoggedIn: false,
  user: null,
  itemslist: null,
  organization_id: null,
  org_name: null,
  org_address: null,
  org_phone: null,
  customer_id: null,
  vendors: [],
  inventory_account_id: null,
  cogs_id: null,
  isAdmin: equal('user.is_admin', true),
  isSale: equal('user.is_sale', true),
  itemCF: null
});
