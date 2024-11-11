import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import LineItem from '../models/line-item';
import Invoice from '../models/invoice';
import SalesRoute from './sales';

export default class EditSalesRoute extends SalesRoute {
  @service session;
  @service store;

  setupController(controller) {
    controller.setProperties({ 
      canShowDetails: false, 
      model: null,
      msg: '',
      isSearching: false
    });
  }

  @action
  async searchInvoice(invoice_number) {
    const params = { invoice_number };
    const controller = this.controller;
    
    controller.setProperties({ 
      msg: '', 
      isSearching: true 
    });

    try {
      const json = await this.store.ajax('/searchinvoice', { params });

      if (json.message === 'success') {
        const salespersons = this.session.salespersons || [];
        const salesperson = salespersons.findBy('salesperson_id', json.invoice.salesperson_id);
        const phoneNumber = json.invoice.custom_fields.findBy('label', 'Phone Number')?.value;

        const model = Invoice.create({ 
          invoice_id: json.invoice.invoice_id, 
          line_items: [] 
        });

        model.salesperson = salesperson;
        model.phone_number = phoneNumber;

        json.invoice.line_items.forEach((lineItem) => {
          if (!lineItem.item_id) {
            lineItem.isCustom = true;
            lineItem.canFocus = false;
          }

          const newLineItem = LineItem.create(lineItem);
          const discountObj = newLineItem.item_custom_fields.findBy('label', 'Discount');
          
          if (discountObj) {
            newLineItem.discount = discountObj.value;
          }

          model.line_items.pushObject(newLineItem);
        });

        controller.setProperties({ 
          model, 
          canShowDetails: true, 
          isSearching: false 
        });
      } else {
        controller.setProperties({ 
          msg: json.error, 
          model: null, 
          canShowDetails: false, 
          isSearching: false 
        });
      }
    } catch (error) {
      controller.setProperties({
        msg: error.message,
        model: null,
        canShowDetails: false,
        isSearching: false
      });
    }
  }

  @action
  async saveAndPrint(skipPrint) {
    const body = this.processedBody();
    body.reason = 'Update';
    body.due_date = body.date;

    const invoice_id = this.controller.model.invoice_id;
    const params = { invoice_id };

    try {
      const json = await this.store.ajax('/updateinvoice', { 
        method: 'POST', 
        body, 
        params 
      });
      this.postResponse(json, skipPrint);
    } catch (error) {
      this.controller.errorMessage = error.message;
      this.controller.model.isSaving = false;
    }
  }

  @action
  newSale() {
    this.transitionTo('sales');
  }
}