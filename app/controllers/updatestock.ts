import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { action } from '@ember/object';

interface StockItem {
  'Incoming Stock': number;
}

export default class UpdatestockController extends Controller {
  declare model: StockItem[];
  declare isSaving: boolean;
  declare errorMessage: string;
  declare successMessage: string;

  @computed('model.[]')
  get total(): number {
    const items = this.model;
    let total = 0;
    items.forEach(item => {
      total += Number(item['Incoming Stock']);
    });
    return total;
  }

  @action
  saveC(): void {
    this.send('save');
  }
}