import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface CustomField {
  label: string;
  value: string;
  data_type: string;
  customfield_id: string;
}

interface SearchParams {
  cf_params: Record<string, string>;
  page: number;
}

interface SearchResponse {
  message: string;
  items: any[];
  has_more_page: boolean;
}

interface StockDetailsController {
  searchModel: {
    group?: string;
    size?: string;
    design?: string;
    brand?: string;
  };
  results: any[];
  groupCFID: string;
  sizeCFID: string;
  designCFID: string;
  brandCFID: string;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  setProperties: (props: Record<string, any>) => void;
  set: (key: string, value: any) => void;
}

export default class StockdetailsRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;

  async model(): Promise<CustomField[]> {
    const itemCF = this.session.itemCF;
    if (itemCF) {
      return itemCF;
    }

    const json = await this.store.ajax('/itemcustomfields');
    const customFields = json.custom_fields;
    this.session.itemCF = customFields;
    return customFields;
  }

  @action
  async searchItems(page = 1): Promise<void> {
    const controller = this.controller as StockDetailsController;
    const cfParams: Record<string, string> = {};
    const { group, size, design, brand } = controller.searchModel;
    let results = controller.results || [];

    if (group) {
      cfParams[`custom_field_${controller.groupCFID}`] = group;
    }
    if (size) {
      cfParams[`custom_field_${controller.sizeCFID}`] = size;
    }
    if (design) {
      cfParams[`custom_field_${controller.designCFID}`] = design;
    }
    if (brand) {
      cfParams[`custom_field_${controller.brandCFID}`] = brand;
    }

    controller.isLoading = true;

    try {
      const json = await this.store.ajax('/items', { 
        params: { cf_params: cfParams, page } 
      }) as SearchResponse;

      if (json.message === 'success') {
        let items = json.items;
        items = items.filter(item => item.stock_on_hand);

        if (page === 1) {
          results = items;
        } else {
          results = results.concat(items);
        }

        controller.setProperties({
          results,
          hasMore: json.has_more_page,
          isLoading: false,
          page,
        });
      }
    } catch (error) {
      controller.isLoading = false;
      // Handle error
    }
  }
}