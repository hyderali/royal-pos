import { action } from '@ember/object';
import SalesRoute from './sales';

export default class ReturnsRoute extends SalesRoute {
  postUrl = '/creditnotes';

  @action
  printReceipt(): void {
    window.print();
  }
}