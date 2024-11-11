import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class Invoice extends EmberObject {
  @tracked line_items = [];
  @tracked entity_number = null;
  @tracked canShowPrint = false;
  @tracked isSaving = false;
  @tracked salesperson = null;
  @tracked phone_number = null;
  @tracked discount = 0;
  @tracked invoice_id = null;

  @computed('line_items.@each.total')
  get subtotal() {
    return this.line_items.reduce((sum, item) => {
      return sum + Number(item.total);
    }, 0);
  }

  @computed('line_items.@each.{discount,total}')
  get discount_amount() {
    return this.line_items.reduce((discount, item) => {
      return discount + (item.discount_amount || 0);
    }, 0);
  }

  @computed('line_items.@each.quantity')
  get qtyTotal() {
    return this.line_items.reduce((sum, item) => {
      return sum + Number(item.quantity);
    }, 0);
  }

  @computed('subtotal', 'discount')
  get total() {
    return this.subtotal - this.discount;
  }

  @computed
  get date() {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  @computed
  get time() {
    const date = new Date();
    let hours = date.getHours();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${meridian}`;
  }
}