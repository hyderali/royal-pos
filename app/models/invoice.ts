import EmberObject, { computed } from '@ember/object';
import LineItem from './lineitem';

interface Salesperson {
  salesperson_id: string;
  salesperson_name: string;
}

export default class Invoice extends EmberObject {
  declare line_items: LineItem[];
  declare entity_number?: string;
  declare canShowPrint?: boolean;
  declare isSaving?: boolean;
  declare invoice_id?: string;
  declare salesperson?: Salesperson;
  declare phone_number?: string;

  @computed('line_items.@each.total')
  get subtotal(): number {
    const lineItems = this.line_items;
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('total'));
    }, 0);
    return subtotal;
  }

  @computed('line_items.@each.{discount,total}')
  get discount(): number {
    const lineItems = this.line_items;
    let lineItemDiscount;
    const discount = lineItems.reduce((discount, item) => {
      lineItemDiscount = item.discount_amount;
      return discount + lineItemDiscount;
    }, 0);
    return Math.round(discount);
  }

  @computed('line_items.@each.quantity')
  get qtyTotal(): number {
    const lineItems = this.line_items;
    const qtyTotal = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('quantity'));
    }, 0);
    return qtyTotal;
  }

  @computed('subtotal', 'discount')
  get total(): number {
    const subtotal = this.subtotal;
    const discount = this.discount;
    return subtotal - discount;
  }

  @computed
  get date(): string {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  @computed
  get time(): string {
    const date = new Date();
    let hours = date.getHours();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) {
      hours -= 12;
    }
    
    let minutes = date.getMinutes();
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
    return `${hours}:${minutesStr} ${meridian}`;
  }
}