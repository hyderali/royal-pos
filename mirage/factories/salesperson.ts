import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  salesperson_id() {
    return faker.string.numeric(3);
  },

  salesperson_name() {
    return faker.person.fullName();
  }
});