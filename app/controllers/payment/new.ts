import { action, computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import PaymentController from '../payment';

interface CreditNote {
  creditnote_id: string;
  creditnote_number: string;
  date_formatted: string;
  total_formatted: string;
  balance_formatted: string;
  balance: number;
}

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  balance: number;
  discount?: number;
  credits_applied?: number;
}

export default class NewController extends Controller {
  @controller('payment') declare paymentController: PaymentController;

  declare model: Invoice[];
  declare isShowingModal: boolean;
  declare isShowingConfirmModal: boolean;
  declare isApplyingCredits: boolean;
  declare applyCreditsError: string;
  declare selectedCreditNote: CreditNote | null;
  declare credits: number;
  declare received: number;
  declare isSaving: boolean;
  declare canShowPrint: boolean;

  queryParams = ['invoiceids'];

  @computed('model.@each.balance')
  get total(): number {
    return this.model.reduce((sum, item) => sum + Number(item.balance), 0);
  }

  @computed('model.@each.discount')
  get discount(): number {
    return this.model.reduce((sum, item) => sum + Number(item.discount || 0), 0);
  }

  @computed('total', 'discount', 'credits')
  get totalPayable(): number {
    const total = this.total;
    const discount = Number(this.discount || 0);
    const credits = Number(this.credits || 0);
    return Math.round(total - discount - credits);
  }

  @computed('total', 'received', 'discount', 'credits')
  get balance(): string {
    const total = this.total;
    const received = Number(this.received || 0);
    const discount = Number(this.discount || 0);
    const credits = Number(this.credits || 0);
    return (received + discount + credits - total).toFixed(2);
  }

  @action
  showApplyCredits(): void {
    this.isShowingModal = true;
  }

  @action
  goToListC(event: Event): void {
    event.preventDefault();
    this.send('goToList');
  }

  @action
  saveAndRecordPaymentC(event: Event): void {
    event.preventDefault();
    this.send('saveAndRecordPayment');
  }

  @action
  applyCreditsC(): void {
    this.send('applyCredits');
  }

  @action
  closeModal(): void {
    this.isShowingModal = false;
  }

  @action
  closeConfirmModal(): void {
    this.isShowingConfirmModal = false;
    this.selectedCreditNote = null;
  }

  @action
  _applyCredits(creditNote: CreditNote): void {
    this.isShowingConfirmModal = true;
    this.selectedCreditNote = creditNote;
    this.isApplyingCredits = false;
    this.applyCreditsError = '';
  }
}