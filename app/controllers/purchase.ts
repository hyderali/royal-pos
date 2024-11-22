import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
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
  rate?: number;
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
  vendor?: {
    contact_id: string;
  };
  bill_number?: string;
  isSaving?: boolean;
}

interface SaveResponse {
  message: string;
  error?: string;
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
    const lineItems = this.model.line_items || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1);
    });
    return total;
  }

  @computed('model.line_items.@each.Rate')
  get salesTotal(): number {
    const lineItems = this.model.line_items || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.Rate.split(' ')[1]);
    });
    return total;
  }

  @computed('model.line_items.@each.quantity')
  get qtyTotal(): number {
    const lineItems = this.model.line_items || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.quantity) || 0;
    });
    return total;
  }

  @computed('model.line_items.@each.sticker')
  get stickerTotal(): number {
    const lineItems = this.model.line_items || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.sticker) || 0;
    });
    return total;
  }

  @action
  selectVendor(vendor: any): void {
    this.model.vendor = vendor;
  }

  @action
  selectName(name: string): void {
    if (this.newItemModel) {
      this.newItemModel.description = name;
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
      const selected = this.newItemModel?.description || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'names' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.groups.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  addNewItem(itemName: string): void {
    const lineItems = this.model.line_items;
    const existingLineItem = lineItems.find(item => item.SKU === getItemName(itemName));
    const itemslist = this.session.itemslist;
    
    if (existingLineItem) {
      existingLineItem.quantity = (existingLineItem.quantity || 0) + 1;
      return;
    }
    
    const newItem = itemslist?.find(item => item.SKU === getItemName(itemName));
    if (newItem) {
      const rate = Number(newItem.Rate.split(' ')[1]);
      const lineItem: LineItem = {
        ...newItem,
        rate,
        printRate: rate,
        quantity: 1,
        item_id: newItem['Item ID'],
        PurchaseRate: newItem['Purchase Rate'],
        SKU: newItem.SKU,
        Description: newItem.Description
      };
      lineItems.pushObject(lineItem);
    }
  }

  @action
  async save(): Promise<void> {
    const model = this.model;
    const body: any = {};
    const lineItems = model.line_items;
    
    body.vendor_id = model.vendor?.contact_id;
    body.bill_number = model.bill_number;
    body.line_items = lineItems.map((lineItem) => ({
      item_id: lineItem.item_id,
      quantity: lineItem.quantity,
      name: lineItem['Item Name'],
      description: lineItem.Description,
      account_id: this.session.inventory_account_id,
    }));

    const printItems: LineItem[] = [];
    lineItems.forEach((lineItem) => {
      for (let i = 0; i < Number(lineItem.sticker); i++) {
        printItems.pushObject(lineItem);
      }
    });

    model.isSaving = true;
    this.errorMessage = '';

    try {
      const json = await this.store.ajax('/newbill', { 
        method: 'POST', 
        body 
      }) as SaveResponse;

      if (json.message === 'success') {
        this.printItems = printItems;
        next(this, () => {
          schedule('afterRender', this, () => {
            window.print();
            this.send('reload');
          });
        });
      } else if (json.message === 'failure') {
        this.errorMessage = json.error || 'Unknown error';
      }
    } finally {
      model.isSaving = false;
    }
  }

  @action
  closeModal(): void {
    this.isShowingModal = false;
  }

  @action
  removeLineItem(lineItem: LineItem): void {
    this.model.line_items.removeObject(lineItem);
  }

  @action
  purchaseRateChanged(): void {
    if (this.newItemModel) {
      const rate = Number(this.newItemModel.purchase_rate);
      const profit = Number(this.newItemModel.profit) || 1;
      const salesRate = rate + (rate * profit) / 100;
      this.newItemModel.rate = salesRate.toString();
    }
  }

  @action
  profitChanged(): void {
    if (this.newItemModel) {
      const profit = Number(this.newItemModel.profit);
      const rate = Number(this.newItemModel.purchase_rate) || 1;
      const salesRate = rate + (rate * profit) / 100;
      this.newItemModel.rate = salesRate.toString();
    }
  }

  @action
  reloadC(): void {
    this.send('reload');
  }
}