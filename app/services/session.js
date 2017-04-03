/* eslint camelcase: "off" */
import Ember from 'ember';
const { computed: { equal }, Service } = Ember;
export default Service.extend({
  isLoggedIn: false,
  user: null,
  itemslist: null,
  organization_id: null,
  customer_id: null,
  vendors: [],
  inventory_account_id: null,
  cogs_id: null,
  isAdmin: equal('user.is_admin', true),
  isSale: equal('user.is_sale', true)
});
