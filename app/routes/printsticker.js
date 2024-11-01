import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class PrintstickerRoute extends Route {
  model() {
    return [{ SKU: 'print' }, { SKU: 'print' }, { SKU: 'print' }];
  }

  @action
  print() {
    window.print();
  }
}
