import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import StoreService from '../services/store';

interface CountResponse {
  count: {
    counts: Array<{
      count_id: string;
      qty: number;
      cost_value: number;
      sales_value: number;
    }>;
    next_count_id: number;
  };
  message: string;
}

export default class CountingRoute extends Route {
  @service declare store: StoreService;

  async model(): Promise<CountResponse> {
    return await this.store.ajax('/allcount');
  }
}