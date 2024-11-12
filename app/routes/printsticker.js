import Route from '@ember/routing/route';

export default class PrintStickerRoute extends Route {
  model() {
    return [
      { SKU: 'print' },
      { SKU: 'print' },
      { SKU: 'print' }
    ];
  }
}