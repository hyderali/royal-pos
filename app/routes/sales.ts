import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import todayDate from '../utils/today-date';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface InvoiceBody {
  customer_id: string;
  date: string;
  discount: string;
  discount_type: string;
  is_discount_before_tax: boolean;
  salesperson_id?: string;
  custom_fields: Array<{
    label: string;
    value?: string;
  }>;
  line_items: Array<{
    item_id: string;
    rate: number;
    quantity: number;
    item_custom_fields: Array<{
      label: string;
      value: string | number;
    }>;
    description: string;
  }>;
}

interface InvoiceResponse {
  message: string;
  entity_number?: string;
  error?: string;
}

export default class SalesRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;

  postUrl = '/invoices';

  async beforeModel(): Promise<void> {
    if (!this.session.salespersons) {
      const json = await this.store.ajax('/salespersons');
      this.session.salespersons = json.salespersons;
    }

    if (!this.session.itemslist) {
      const json = await this.store.ajax('/itemslist');
      this.session.itemslist = json.items.filter((item: any) => item.Status === 'Active');
      this.session.customer_id = json.customer_id;
      this.session.organization_id = json.organization_id;
    }
  }

  model(): Invoice {
    return Invoice.create({ line_items: [] });
  }

  setupController(controller: any): void {
    super.setupController(...arguments);
    controller.set('errorMessage', '');
  }

  processedBody(): InvoiceBody {
    const model = this.controllerFor('sales').model as Invoice;
    const customer_id = this.session.customer_id;
    const date = todayDate();
    
    const body: InvoiceBody = {
      customer_id: `${customer_id}`,
      date,
      discount: `${model.get('discount')}`,
      discount_type: 'entity_level',
      is_discount_before_tax: false,
      custom_fields: [
        { label: 'Phone Number', value: model.get('phone_number') },
      ],
      line_items: [],
    };

    if (model.get('salesperson')) {
      body.salesperson_id = model.get('salesperson.salesperson_id');
    }

    const lineItems = model.get('line_items');
    body.line_items = lineItems.map((item: LineItem) => {
      return {
        item_id: item.get('item_id'),
        rate: item.get('rate'),
        quantity: item.get('quantity'),
        item_custom_fields: [{ label: 'Discount', value: item.discount }],
        description: item.get('description'),
      };
    });

    model.set('isSaving', true);
    return body;
  }

  postResponse(json: InvoiceResponse, skipPrint: boolean): void {
    const model = this.controllerFor('sales').model as Invoice;
    
    if (json.message === 'success') {
      if (skipPrint) {
        this.send('newSale');
        return;
      }
      
      model.setProperties({
        entity_number: json.entity_number,
        canShowPrint: true,
        isSaving: false,
      });
      
      schedule('afterRender', this, () => {
        this.send('printReceipt');
        this.send('newSale');
      });
    } else {
      this.controllerFor('sales').set('errorMessage', json.error);
      model.set('isSaving', false);
    }
  }

  @action
  addNewItem(itemName: string): void {
    const lineItems = this.controllerFor('sales').model.get('line_items');
    const existingLineItem = lineItems.findBy('sku', itemName);
    const itemslist = this.session.itemslist;

    if (existingLineItem) {
      existingLineItem.set('quantity', existingLineItem.get('quantity') + 1);
      return;
    }

    const newItem = itemslist?.find((item: any) => item.SKU === itemName);
    if (newItem) {
      const newLineItem = LineItem.create({
        discount: 0,
        rate: Number(newItem.Rate.split(' ')[1]),
        quantity: 1,
        name: newItem['Item Name'],
        sku: newItem.SKU,
        item_id: newItem['Item ID'],
        description: newItem.Description,
      });
      lineItems.pushObject(newLineItem);
    }
  }

  @action
  addTempItem(): void {
    const lineItems = this.controllerFor('sales').model.get('line_items');
    const newLineItem = LineItem.create({
      description: 'Others',
      isCustom: true,
      canFocus: true,
      quantity: 1,
      rate: 0,
      discount: 0,
    });
    lineItems.pushObject(newLineItem);
  }

  @action
  removeLineItem(lineItem: LineItem): void {
    const lineItems = this.controllerFor('sales').model.get('line_items');
    lineItems.removeObject(lineItem);
  }

  @action
  async saveAndPrint(skipPrint: boolean): Promise<void> {
    this.controllerFor('sales').set('errorMessage', '');
    const body = this.processedBody();
    const json = await this.store.ajax(this.postUrl, { method: 'POST', body }) as InvoiceResponse;
    this.postResponse(json, skipPrint);
  }

  @action
  printReceipt(): void {
    window.print();
    window.print();
  }

  @action
  newSale(): void {
    this.refresh();
  }
}