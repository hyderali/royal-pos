import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  'Item ID'() {
    return faker.string.numeric(5);
  },

  SKU() {
    return faker.string.numeric(8).padStart(8, '0');
  },

  'Item Name'() {
    return faker.commerce.productName();
  },

  Description() {
    return faker.commerce.productDescription();
  },

  Rate() {
    return `Rs ${faker.number.int({ min: 50, max: 1000 })}`;
  },

  Status: 'Active',

  'Purchase Rate'() {
    return `Rs ${faker.number.int({ min: 30, max: 800 })}`;
  },

  CF: {
    Design() {
      return faker.commerce.productMaterial();
    },
    Brand() {
      return faker.company.name();
    },
    Size() {
      return faker.helpers.arrayElement(['S', 'M', 'L', 'XL', 'XXL']);
    },
    Discount() {
      return faker.number.int({ min: 0, max: 50 }).toString();
    }
  }
});