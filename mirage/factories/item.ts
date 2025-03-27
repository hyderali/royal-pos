import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  'Item ID'() {
    return faker.string.numeric(4);
  },

  'Item Name'() {
    return faker.commerce.productName();
  },

  SKU() {
    return faker.string.alphanumeric(7).toUpperCase();
  },

  Rate() {
    return `Rs ${faker.number.int({ min: 50, max: 5000 })}`;
  },

  Status: 'Active',

  Description() {
    return faker.commerce.productDescription();
  }
});
