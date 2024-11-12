import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { computed } from '@ember/object';

export default class StockDetailsController extends Controller {
  @service session;
  @service store;
  
  @tracked searchModel = {};
  @tracked results = [];
  @tracked hasMore = false;
  @tracked isLoading = false;
  @tracked page = 1;

  @computed('model.[]')
  get groupCFID() {
    return this.model?.findBy('label', 'Group')?.customfield_id;
  }

  @computed('groupCFID')
  get groupCFIDLabel() {
    return `cf_${this.groupCFID}`;
  }

  @computed('model.[]')
  get sizeCFID() {
    return this.model?.findBy('label', 'Size')?.customfield_id;
  }

  @computed('sizeCFID')
  get sizeCFIDLabel() {
    return `cf_${this.sizeCFID}`;
  }

  @computed('model.[]')
  get designCFID() {
    return this.model?.findBy('label', 'Design')?.customfield_id;
  }

  @computed('designCFID')
  get designCFIDLabel() {
    return `cf_${this.designCFID}`;
  }

  @computed('model.[]')
  get brandCFID() {
    return this.model?.findBy('label', 'Brand')?.customfield_id;
  }

  @computed('brandCFID')
  get brandCFIDLabel() {
    return `cf_${this.brandCFID}`;
  }

  @computed('results.[]')
  get totalQty() {
    return this.results?.reduce((sum, item) => sum + item.stock_on_hand, 0) || 0;
  }

  @computed('results.[]')
  get totalAmount() {
    return this.results?.reduce((sum, item) => {
      return sum + (item.purchase_rate * item.stock_on_hand);
    }, 0) || 0;
  }

  @action
  selectGroup(group) {
    this.searchModel.group = group;
  }

  @action
  selectSize(size) {
    this.searchModel.size = size;
  }

  @action
  selectDesign(design) {
    this.searchModel.design = design;
  }

  @action
  selectBrand(brand) {
    this.searchModel.brand = brand;
  }

  @action
  async searchItems(page = 1) {
    const cfParams = {};
    const { group, size, design, brand } = this.searchModel;

    if (group) {
      cfParams[`custom_field_${this.groupCFID}`] = group;
    }
    if (size) {
      cfParams[`custom_field_${this.sizeCFID}`] = size;
    }
    if (design) {
      cfParams[`custom_field_${this.designCFID}`] = design;
    }
    if (brand) {
      cfParams[`custom_field_${this.brandCFID}`] = brand;
    }

    this.isLoading = true;

    try {
      const json = await this.store.ajax('/items', { 
        params: { cf_params: cfParams, page } 
      });

      const items = json.items.filter(item => item.stock_on_hand);

      if (page === 1) {
        this.results = items;
      } else {
        this.results = [...this.results, ...items];
      }

      this.hasMore = json.has_more_page;
      this.page = page;
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  loadMore() {
    this.searchItems(this.page + 1);
  }

  @action
  clearAll() {
    this.searchModel = {};
    this.results = [];
  }
}