import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class LineItem extends EmberObject {
  @tracked quantity = 1;
  @tracked rate = 0;
  @tracked discount = 0;
  @tracked name = '';
  @tracked sku = '';
  @tracked item_id = '';
  @tracked description = '';
  @tracked isCustom = false;
  @tracked canFocus = false;
  @tracked item_custom_fields = [];

  @computed('quantity', 'rate')
  get total() {
    return Number(this.quantity) * Number(this.rate);
  }

  @computed('total', 'discount')
  get discount_amount() {
    return Math.round(Number(this.total) * (Number(this.discount) / 100));
  }
}