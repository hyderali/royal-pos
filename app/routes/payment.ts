import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SessionService from '../services/session';
import StoreService from '../services/store';
import RouterService from '@ember/routing/router-service';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  balance: number;
}

export default class PaymentRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare router: RouterService;

  async model(): Promise<Invoice[]> {
    const json = await this.store.ajax('/invoiceslist');
    return json.invoices;
  }

  async setupController(controller: any): Promise<void> {
    super.setupController(...arguments);
    const json = await this.store.ajax('/creditnoteslist');
    controller.set('creditnotes', json.creditnotes);
  }

  @action
  recordPayment(invoiceId: string): void {
    this.router.transitionTo('payment.new', {
      queryParams: { invoiceids: [invoiceId] },
    });
  }

  @action
  recordPayments(invoiceIds: string[]): void {
    this.router.transitionTo('payment.new', {
      queryParams: { invoiceids: invoiceIds },
    });
  }

  @action
  reload(): void {
    this.refresh();
  }
}