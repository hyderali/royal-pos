import SalesController from './sales';

export default class ReturnsController extends SalesController {
  @service session;
  postUrl = '/creditnotes';

  @action
  printReceipt() {
    window.print();
  }
}