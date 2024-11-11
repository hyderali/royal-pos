import Route from '@ember/routing/route';

export default class AddStockRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.items = [];
    controller.total = 0;
  }
}