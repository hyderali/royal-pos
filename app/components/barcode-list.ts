import Component from '@glimmer/component';

interface Item {
  SKU: string;
  CF: {
    Design: string;
    Brand: string;
    Size: string;
  };
  Description: string;
  printRate?: number;
}

interface BarcodeListArgs {
  items: Item[];
}

export default class BarcodeList extends Component<BarcodeListArgs> {}