import Ember from 'ember';
const { computed: { equal } } = Ember;
export default Ember.Service.extend({
  isLoggedIn: false,
  user: null,
  itemslist: null,
  organization_id: null,
  customer_id: null,
  vendors: [],
  inventory_account_id: null,
  cogs_id: null,
  isAdmin: equal('user.is_admin', true)
});
