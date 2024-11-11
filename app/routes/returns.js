import SalesRoute from './sales';

export default class ReturnsRoute extends SalesRoute {
  postUrl = '/creditnotes';

  @action
  printReceipt() {
    window.print();
  }
}