import EmberObject, { computed } from '@ember/object';

interface CustomField {
  label: string;
  value: string;
}

export default class LineItem extends EmberObject {
  declare quantity: number;
  declare rate: number;
  declare discount: number;
  declare sku?: string;
  declare name?: string;
  declare item_id?: string;
  declare description?: string;
  declare isCustom?: boolean;
  declare canFocus?: boolean;
  declare item_custom_fields?: CustomField[];

  @computed('quantity', 'rate')
  get total(): number {
    const quantity = Number(this.quantity);
    const rate = Number(this.rate);
    return rate * quantity;
  }

  @computed('total', 'discount')
  get discount_amount(): number {
    const total = Number(this.total);
    const discount = Number(this.discount);
    return Math.round(Number(total) * Number(discount / 100));
  }
}