import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';
import Object, { action } from '@ember/object';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface PurchaseModel {
  line_items: any[];
}

export default class PurchaseRoute extends Route {
  @service declare store: StoreService;
  @service declare session: SessionService;

  async beforeModel(): Promise<void> {
    if (isBlank(this.session.vendors)) {
      const json = await this.store.ajax('/vendors');
      this.session.vendors = json.contacts;
    }
  }

  model(): PurchaseModel {
    return Object.create({ line_items: [] });
  }

  @action
  reload(): void {
    this.set('controller.printItems', []);
    this.refresh();
  }
}