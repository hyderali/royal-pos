import EmberObject, { computed } from '@ember/object';

interface CustomField {
  label: string;
  value: string | number;
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
    return Number(this.rate) * Number(this.quantity);
  }

  @computed('total', 'discount')
  get discount_amount(): number {
    return Math.round(Number(this.total) * Number(this.discount / 100));
  }
}