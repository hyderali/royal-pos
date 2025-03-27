import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  quantity() {
    return faker.number.int({ min: 1, max: 10 });
  },

  rate() {
    return faker.number.int({ min: 50, max: 5000 });
  },

  discount() {
    return faker.number.int({ min: 0, max: 20 });
  },

  sku() {
    return faker.string.alphanumeric(7).toUpperCase();
  },

  name() {
    return faker.commerce.productName();
  },

  item_id() {
    return faker.string.numeric(4);
  },

  description() {
    return faker.commerce.productDescription();
  },

  isCustom: false,
  
  canFocus: false,

  item_custom_fields() {
    return Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      label: faker.commerce.productAdjective(),
      value: faker.commerce.productMaterial()
    }));
  }
});
