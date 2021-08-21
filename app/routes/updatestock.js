import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
  store: service(),
  model() {
    return this.store.ajax('/getnewstock').then((json) => {
      return json;
    });
  },
  setupController (controller, json){
    if(json.message === 'success') {
      controller.set('model', json.items);
      controller.set('errorMessage', '');
    } else {
      controller.set('errorMessage', json.error);
    }
  },
  actions: {
    save() {
      let controller = this.controller;
      let body = {
        items: controller.model
      };
      controller.set('isSaving', true);
      controller.set('errorMessage', '');
      this.store.ajax('/updatestock', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          controller.set('model', []);
        } else if (json.message === 'failure') {
          controller.set('errorMessage', json.error);
        }
      }).finally(() => {
        controller.set('isSaving', false);
      });
    },
  }
});
