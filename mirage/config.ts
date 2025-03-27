import { createServer, Factory, Model, Response } from 'miragejs';

export default function () {
  // Models
  this.model('salesperson');
  this.model('item');
  this.model('line-item');
  this.model('invoice');

  this.namespace = '';

  // Routes
  this.get('/salespersons', (schema) => {
    return {
      salespersons: schema.all('salesperson').models.map(model => ({
        salesperson_id: model.salesperson_id,
        name: model.name
      }))
    };
  });

  this.get('/itemslist', (schema) => {
    return {
      customer_id: '123',
      organization_id: '456',
      items: schema.all('item').models.map(model => ({
        'Item ID': model['Item ID'],
        'Item Name': model['Item Name'],
        SKU: model.SKU,
        Rate: model.Rate,
        Status: model.Status,
        Description: model.Description
      }))
    };
  });

  this.post('/invoices', (schema, request) => {
    try {
      const attrs = JSON.parse(request.requestBody);
      const invoice = schema.create('invoice', attrs);
      
      return {
        message: 'success',
        entity_number: invoice.entity_number
      };
    } catch (error) {
      return new Response(400, {}, {
        message: 'error',
        error: 'Failed to save invoice'
      });
    }
  });

  this.get('/invoices/:id', (schema, request) => {
    const invoice = schema.find('invoice', request.params.id);
    return invoice || new Response(404, {}, { error: 'Invoice not found' });
  });
}
