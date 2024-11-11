import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class PrintStickerRoute extends Route {
  model() {
    return [
      { SKU: 'print' },
      { SKU: 'print' },
      { SKU: 'print' }
    ];
  }

  @action
  print() {
    window.print();
  }
}