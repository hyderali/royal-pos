import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import todayDate from '../../utils/today-date';
import SessionService from '../../services/session';
import StoreService from '../../services/store';
import RouterService from '@ember/routing/router-service';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  balance: number;
  discount?: number;
  credits_applied?: number;
  autofocus?: boolean;
}

interface PaymentParams {
  invoiceids: string[];
}

interface PaymentBody {
  customer_id: string;
  date: string;
  amount?: number;
  invoices?: Array<{
    invoice_id: string;
    amount_applied: number;
    discount_amount: number;
  }>;
}

interface PaymentResponse {
  message: string;
  error?: string;
}

interface PaymentController {
  model: Invoice[];
  credits: number;
  isSaving: boolean;
  canShowPrint: boolean;
  setProperties: (props: Record<string, any>) => void;
}

export default class NewRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare router: RouterService;

  queryParams = ['invoiceids'];

  serializeQueryParam(value: any, urlKey: string, defaultValueType: string): string {
    if (urlKey === 'invoiceids' && Array.isArray(value)) {
      return value.join(',');
    }
    return super.serializeQueryParam(value, urlKey, defaultValueType);
  }

  deserializeQueryParam(value: string, urlKey: string, defaultValueType: string): string[] {
    if (urlKey === 'invoiceids') {
      return value.split(',');
    }
    return super.deserializeQueryParam(value, urlKey, defaultValueType);
  }

  model(params: PaymentParams): Invoice[] {
    const parentModel = this.modelFor('payment') as Invoice[];
    let index = 0;
    return parentModel.filter((invoice) => {
      if (params.invoiceids.includes(invoice.invoice_id)) {
        invoice.discount = 0;
        invoice.credits_applied = 0;
        if (index === 0) {
          invoice.autofocus = true;
        }
        index++;
        return true;
      }
      return false;
    });
  }

  setupController(controller: PaymentController): void {
    super.setupController(...arguments);
    controller.credits = 0;
  }

  @action
  async saveAndRecordPayment(): Promise<void> {
    const controller = this.controllerFor('payment/new') as PaymentController;
    const invoices = controller.model;
    const credits = controller.credits;
    const customer_id = this.session.customer_id;
    const date = todayDate();
    
    const body: PaymentBody = {
      customer_id: `${customer_id}`,
      date,
    };

    let amount = 0;
    const serializedInvoices = [];

    for (const invoice of invoices) {
      const balance = invoice.balance;
      const credits_applied = invoice.credits_applied || 0;
      
      if (balance - credits_applied === 0) {
        continue;
      }
      
      const discount_amount = invoice.discount || 0;
      const amount_applied = balance - discount_amount - credits_applied;
      amount += amount_applied;
      
      serializedInvoices.push({
        invoice_id: invoice.invoice_id,
        amount_applied,
        discount_amount,
      });
    }

    if (credits && !amount) {
      controller.canShowPrint = true;
      schedule('afterRender', this, () => {
        this.send('printReceipt');
        this.send('goToList');
      });
      return;
    }

    body.invoices = serializedInvoices;
    body.amount = amount;
    controller.isSaving = true;

    const json = await this.store.ajax('/payments', {
      method: 'POST',
      body,
    }) as PaymentResponse;

    if (json.message === 'success') {
      controller.setProperties({ 
        isSaving: false, 
        canShowPrint: true 
      });
      schedule('afterRender', this, () => {
        this.send('printReceipt');
        this.send('goToList');
      });
    }
  }

  @action
  printReceipt(): void {
    window.print();
  }

  @action
  goToList(): void {
    this.router.transitionTo('payment');
    this.send('reload');
    this.controllerFor('payment/new').canShowPrint = false;
  }
}