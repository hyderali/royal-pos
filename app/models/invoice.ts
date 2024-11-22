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
  declare discount: number;

  @computed('line_items.@each.total')
  get subtotal(): number {
    return this.line_items.reduce((sum, item) => sum + Number(item.total), 0);
  }

  @computed('line_items.@each.{discount,total}')
  get discount_total(): number {
    return Math.round(this.line_items.reduce((sum, item) => sum + item.discount_amount, 0));
  }

  @computed('line_items.@each.quantity')
  get qtyTotal(): number {
    return this.line_items.reduce((sum, item) => sum + Number(item.quantity), 0);
  }

  @computed('subtotal', 'discount_total')
  get total(): number {
    return this.subtotal - this.discount_total;
  }

  get date(): string {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  get time(): string {
    const date = new Date();
    let hours = date.getHours();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) {
      hours -= 12;
    }
    
    const minutes = date.getMinutes();
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
    return `${hours}:${minutesStr} ${meridian}`;
  }
}