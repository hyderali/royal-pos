import { action } from '@ember/object';
import Route from '@ember/routing/route';

interface PrintModel {
  SKU: string;
}

export default class PrintstickerRoute extends Route {
  model(): PrintModel[] {
    return [{ SKU: 'print' }, { SKU: 'print' }, { SKU: 'print' }];
  }

  @action
  print(): void {
    window.print();
  }
}