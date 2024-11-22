import { createServer, Response } from 'miragejs';

export default function() {
  createServer({
    factories: {
      item: {},
      salesperson: {}
    },

    seeds(server) {
      server.loadFactories();
    },

    routes() {
      this.namespace = 'api';

      this.get('/salespersons', (schema) => {
        return {
          message: 'success',
          salespersons: schema.all('salesperson').models.map(model => model.attrs)
        };
      });

      this.get('/itemslist', (schema) => {
        return {
          message: 'success',
          items: schema.all('item').models.map(model => model.attrs)
        };
      });

      this.post('/invoices', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        
        // Validate required fields
        if (!attrs.customer_id || !attrs.line_items?.length) {
          return new Response(400, {}, { 
            message: 'failure',
            error: 'Missing required fields' 
          });
        }

        return {
          message: 'success',
          entity_number: `INV-${faker.string.numeric(3)}`
        };
      });
    }
  });
}