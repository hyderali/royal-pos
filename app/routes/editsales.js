import SalesRoute from './sales';

export default class EditSalesRoute extends SalesRoute {
  setupController(controller) {
    controller.setProperties({ 
      canShowDetails: false, 
      model: null,
      msg: '',
      isSearching: false
    });
  }
}