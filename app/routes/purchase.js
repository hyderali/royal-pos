import Ember from 'ember';
const { inject: { service }, isBlank } = Ember;
export default Ember.Route.extend({
  store: service(),
  session: service(),
  beforeModel() {
    if (isBlank(this.get('session.vendors'))) {
      return this.get('store').ajax('/vendors').then((json) => {
        this.set('session.vendors', json.contacts);
      });
    }
  },
  model() {
    return Ember.Object.create({line_items: []});
  }
});
