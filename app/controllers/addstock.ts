import { action } from '@ember/object';
import Controller from '@ember/controller';

interface StockItem {
  'Initial Stock': number;
  SKU: string;
  'Item Name': string;
  Rate: string;
  'Purchase Rate': string;
}

export default class AddstockController extends Controller {
  declare items: StockItem[];
  declare total: number;
  declare isSaving: boolean;
  declare errorMessage: string;

  @action
  computeTotal(): void {
    const items = this.items;
    let total = 0;
    items.forEach((item) => {
      total += Number(item['Initial Stock']);
    });
    this.set('total', total);
  }

  @action
  itemChangedC(itemName: string): void {
    this.send('itemChanged', itemName);
  }

  @action
  removeLineItemC(lineItem: StockItem): void {
    this.send('removeLineItem', lineItem);
    this.send('computeTotal');
  }

  @action
  saveC(): void {
    this.send('save');
  }
}