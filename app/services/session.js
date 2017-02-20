import Ember from 'ember';
const { computed: { equal } } = Ember;
export default Ember.Service.extend({
  isLoggedIn: true,
  user: {
    "username": "admin",
    "password": "admin",
    "authtoken": "38d7b247270149d2b6f7747823e5afc2",
    "is_admin": true
  },
  itemslist: null,
  organization_id: "639052220",
  customer_id: "512244000000052446",
  vendors: [],
  inventory_account_id: "512244000000034001",
  cogs_id: "512244000000034003",
  isAdmin: equal('user.is_admin', true)
});
