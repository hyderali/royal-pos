import Ember from 'ember';
const { inject: { service } } = Ember;
export default Ember.Route.extend({
  session: service(),
  beforeModel() {
    if(!this.get('session.isLoggedIn')) {
      this.transitionTo('login');
    }
  }
});
