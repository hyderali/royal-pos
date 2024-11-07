import Component from '@glimmer/component';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

interface BarCodeArgs {
  sku: string;
  displayValue?: boolean;
}

declare global {
  interface Window {
    JsBarcode: (element: SVGElement, data: string, options: any) => void;
  }
}

export default class BarCode extends Component<BarCodeArgs> {
  @action
  addBarCode(element: SVGElement): void {
    const { sku, displayValue = true } = this.args;

    schedule('afterRender', this, () => {
      window.JsBarcode(element, sku, {
        width: 1.5,
        height: 22.5,
        fontSize: 13,
        margin: 0,
        displayValue,
      });
    });
  }
}