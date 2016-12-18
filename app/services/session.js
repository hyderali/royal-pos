import Ember from 'ember';

export default Ember.Service.extend({
  isLoggedIn: false,
  user: null,
  itemslist: null,
  organization_id: null,
  customer_id: null
});
