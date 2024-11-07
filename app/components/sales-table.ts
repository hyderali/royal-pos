import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import getItemName from '../utils/get-item-name';
import { set, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SessionService from '../services/session';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';

interface SalesTableArgs {
  model: Invoice;
  isSales?: boolean;
  addNewItem: (itemName: string) => void;
  addTempItem: () => void;
  removeLineItem: (lineItem: LineItem) => void;
  saveAndPrint: (skipPrint: boolean) => void;
  newSale: () => void;
}

export default class SalesTable extends Component<SalesTableArgs> {
  @service declare session: SessionService;

  @tracked id = '';

  customItems: string[];
  discounts: number[];
  isSales: boolean;

  constructor(owner: unknown, args: SalesTableArgs) {
    super(owner, args);
    this.customItems = [
      'Others',
      'China Item',
      'Cotton Pant',
      'Shirt',
      'Boys Pant',
      'Mens Inner',
      'Ladies Inner',
    ];
    this.discounts = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    this.isSales = args.isSales === undefined ? true : args.isSales;
  }

  @action
  itemChanged(itemName: string): void {
    if (itemName === 'print') {
      this.args.saveAndPrint(false);
    }
    if (itemName === 'save') {
      this.args.saveAndPrint(true);
    }
    if (itemName === '0000') {
      this.args.addTempItem();
    }
    this.args.addNewItem(getItemName(itemName));
    this.id = '';
  }

  @action
  discountChanged(lineItem: LineItem, discount: number): void {
    set(lineItem, 'discount', discount);
  }

  @action
  selectCustomItem(lineItem: LineItem, name: string): void {
    set(lineItem, 'description', name);
  }

  @action
  removeLineItem(lineItem: LineItem): void {
    this.args.removeLineItem(lineItem);
  }

  @action
  saveAndPrint(skipPrint: boolean): void {
    this.args.saveAndPrint(skipPrint);
  }

  @action
  newSale(): void {
    this.args.newSale();
  }

  @action
  selectSP(salesperson: any): void {
    set(this.args.model, 'salesperson', salesperson);
  }
}