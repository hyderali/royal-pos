import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';
import SalesRoute from './sales';
import SessionService from '../services/session';
import StoreService from '../services/store';
import RouterService from '@ember/routing/router-service';

interface InvoiceResponse {
  message: string;
  invoice?: {
    invoice_id: string;
    salesperson_id: string;
    custom_fields: Array<{
      label: string;
      value?: string;
    }>;
    line_items: Array<{
      item_id?: string;
      isCustom?: boolean;
      canFocus?: boolean;
      rate: number;
      quantity: number;
      item_custom_fields: Array<{
        label: string;
        value: string | number;
      }>;
      description: string;
    }>;
  };
  error?: string;
}

export default class EditsalesRoute extends SalesRoute {
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare router: RouterService;

  setupController(controller: any): void {
    controller.setProperties({
      canShowDetails: false,
      model: null
    });
  }

  @action
  async searchInvoice(invoice_number: string): Promise<void> {
    const params = { invoice_number };
    const controller = this.controller;
    
    controller.setProperties({
      msg: '',
      isSearching: true
    });

    try {
      const json = await this.store.ajax('/searchinvoice', { params }) as InvoiceResponse;

      if (json.message === 'success' && json.invoice) {
        const salespersons = this.session.salespersons || [];
        const salesperson = salespersons.find(sp => sp.salesperson_id === json.invoice.salesperson_id);
        const phoneNumber = json.invoice.custom_fields.find(cf => cf.label === 'Phone Number')?.value;

        const model = Invoice.create({
          invoice_id: json.invoice.invoice_id,
          line_items: [],
        });

        model.salesperson = salesperson;
        model.phone_number = phoneNumber;

        json.invoice.line_items.forEach(lineItem => {
          if (!lineItem.item_id) {
            lineItem.isCustom = true;
            lineItem.canFocus = false;
          }

          const newLineItem = LineItem.create(lineItem);
          const discountObj = newLineItem.item_custom_fields?.find(cf => cf.label === 'Discount');
          
          if (discountObj) {
            newLineItem.discount = discountObj.value;
          }
          
          model.line_items.pushObject(newLineItem);
        });

        controller.setProperties({
          model,
          canShowDetails: true,
          isSearching: false,
        });
      } else {
        controller.setProperties({
          msg: json.error,
          model: null,
          canShowDetails: false,
          isSearching: false,
        });
      }
    } catch (error) {
      controller.setProperties({
        msg: 'An error occurred while searching',
        model: null,
        canShowDetails: false,
        isSearching: false,
      });
    }
  }

  @action
  async saveAndPrint(skipPrint: boolean): Promise<void> {
    const body = this.processedBody();
    body.reason = 'Update';
    body.due_date = body.date;
    
    const invoice_id = this.controller.model.invoice_id;
    const params = { invoice_id };
    
    const json = await this.store.ajax('/updateinvoice', { method: 'POST', body, params });
    this.postResponse(json, skipPrint);
  }

  @action
  newSale(): void {
    this.router.transitionTo('sales');
  }
}