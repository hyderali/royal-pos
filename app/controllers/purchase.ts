import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { set, get, setProperties, action, computed } from '@ember/object';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface LineItem {
  PurchaseRate: string;
  quantity?: number;
  Rate: string;
  SKU: string;
  Description: string;
  'Item Name'?: string;
  CF?: {
    Group?: string;
    Discount?: string;
    Brand?: string;
    Design?: string;
    Size?: string;
  };
  item_id?: string;
  printRate?: number;
  sticker?: number;
}

interface NewItemModel {
  sku?: string;
  description?: string;
  group?: string;
  purchase_rate?: string;
  rate?: string;
  discount?: string;
  size?: string;
  design?: string;
  brand?: string;
  colour?: string;
  isSaving?: boolean;
  profit?: number;
}

interface PurchaseModel {
  line_items: LineItem[];
  vendor?: any;
  bill_number?: string;
  isSaving?: boolean;
}

export default class PurchaseController extends Controller {
  @service declare session: SessionService;
  @service declare store: StoreService;

  declare model: PurchaseModel;
  declare isShowingModal: boolean;
  declare newItemModel: NewItemModel | null;
  declare printItems: LineItem[];
  declare nextNumber: string;
  declare errorMessage: string;

  @computed('model.line_items.@each.{PurchaseRate,quantity}')
  get purchaseTotal(): number {
    const lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1);
    });
    return total;
  }

  @computed('model.line_items.@each.Rate')
  get salesTotal(): number {
    const lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.Rate.split(' ')[1]);
    });
    return total;
  }

  @computed('model.line_items.@each.quantity')
  get qtyTotal(): number {
    const lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.quantity) || 0;
    });
    return total;
  }

  @computed('model.line_items.@each.sticker')
  get stickerTotal(): number {
    const lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.sticker) || 0;
    });
    return total;
  }

  @action
  selectVendor(vendor: any): void {
    this.set('model.vendor', vendor);
  }

  @action
  selectName(name: string): void {
    if (this.newItemModel) {
      this.set('newItemModel.description', name);
    }
  }

  @action
  createNameOnEnter(select: any, e: KeyboardEvent): void {
    const searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      const selected = this.get('newItemModel.description') || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'names' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.groups').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  // ... Similar pattern for other select and create methods ...

  @action
  addNewItem(itemName: string): void {
    const lineItems = this.get('model.line_items');
    const existingLineItem = lineItems.findBy('SKU', getItemName(itemName));
    const itemslist = this.get('session.itemslist');
    
    if (existingLineItem) {
      set(existingLineItem, 'quantity', Number(existingLineItem.quantity) + 1);
      return;
    }
    
    const newItem = itemslist?.findBy('SKU', getItemName(itemName));
    if (newItem) {
      const rate = Number(newItem.Rate.split(' ')[1]);
      newItem.rate = rate;
      newItem.printRate = rate;
      newItem.quantity = 1;
      newItem.item_id = newItem['Item ID'];
      newItem.PurchaseRate = newItem['Purchase Rate'];
      lineItems.pushObject(newItem);
    }
  }

  @action
  save(): void {
    const model = this.model;
    const body: any = {};
    const lineItems = model.get('line_items');
    
    body.vendor_id = model.get('vendor.contact_id');
    body.bill_number = model.get('bill_number');
    body.line_items = lineItems.map((lineItem) => {
      return {
        item_id: lineItem.item_id,
        quantity: lineItem.quantity,
        name: lineItem['Item Name'],
        description: lineItem.Description,
        account_id: this.get('session.inventory_account_id'),
      };
    });

    const printItems: LineItem[] = [];
    lineItems.forEach((lineItem) => {
      for (let i = 0; i < Number(lineItem.sticker); i++) {
        printItems.pushObject(lineItem);
      }
    });

    model.set('isSaving', true);
    this.set('errorMessage', '');

    this.store.ajax('/newbill', { method: 'POST', body }).then((json) => {
      if (json.message === 'success') {
        this.set('printItems', printItems);
        next(this, () => {
          schedule('afterRender', this, () => {
            window.print();
            this.send('reload');
          });
        });
      } else if (json.message === 'failure') {
        this.set('errorMessage', json.error);
      }
      model.set('isSaving', false);
    });
  }

  @action
  closeModal(): void {
    this.set('isShowingModal', false);
  }

  @action
  removeLineItem(lineItem: LineItem): void {
    this.get('model.line_items').removeObject(lineItem);
  }

  @action
  purchaseRateChanged(): void {
    if (this.newItemModel) {
      const rate = Number(this.newItemModel.purchase_rate);
      const profit = Number(this.get('newItemModel.profit')) || 1;
      const salesRate = rate + (rate * profit) / 100;
      this.set('newItemModel.rate', salesRate.toString());
    }
  }

  @action
  profitChanged(): void {
    if (this.newItemModel) {
      const profit = Number(this.newItemModel.profit);
      const rate = Number(this.get('newItemModel.purchase_rate')) || 1;
      const salesRate = rate + (rate * profit) / 100;
      this.set('newItemModel.rate', salesRate.toString());
    }
  }

  @action
  reloadC(): void {
    this.send('reload');
  }
}