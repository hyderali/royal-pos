import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  entity_number() {
    return `INV-${faker.string.numeric(6)}`;
  },

  phone_number() {
    return faker.string.numeric(10); // Using string.numeric instead of phone.number for simpler format
  },

  canShowPrint: true,
  
  isSaving: false,

  afterCreate(this: any, invoice: any, server: any) {
    // Create 1-5 line items for this invoice
    const lineItems = server.createList('line-item', faker.number.int({ min: 1, max: 5 }));
    invoice.update({ line_items: lineItems });

    // Create and associate a salesperson if not already set
    if (!invoice.salesperson) {
      const salesperson = server.create('salesperson');
      invoice.update({
        salesperson: {
          salesperson_id: salesperson.salesperson_id,
          salesperson_name: salesperson.name
        }
      });
    }
  }
});
