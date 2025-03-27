import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import SessionService from '../services/session';
import Invoice from '../models/invoice';

interface SalesReceiptArgs {
  model: Invoice;
  numberLabel?: string;
  isSales?: boolean;
}

export default class SalesReceipt extends Component<SalesReceiptArgs> {
  @service declare session: SessionService;

  numberLabel: string;
  isSales: boolean;

  constructor(owner: unknown, args: SalesReceiptArgs) {
    super(owner, args);
    this.numberLabel = args.numberLabel || 'Bill No';
    this.isSales = args.isSales === undefined ? true : args.isSales;
  }
}