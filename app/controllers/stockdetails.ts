import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import SessionService from '../services/session';

interface SearchModel {
  group?: string;
  size?: string;
  design?: string;
  brand?: string;
}

interface Result {
  stock_on_hand: number;
  purchase_rate: number;
  [key: string]: any;
}

export default class StockdetailsController extends Controller {
  @service declare session: SessionService;

  declare model: any[];
  declare results: Result[];
  declare page: number;
  declare isLoading: boolean;
  declare hasMore: boolean;

  searchModel: SearchModel = {};

  @computed('model.[]')
  get groupCFID(): string {
    const model = this.model || [];
    const groupCF = model.find(cf => cf.label === 'Group');
    return groupCF?.customfield_id;
  }

  @computed('groupCFID')
  get groupCFIDLabeL(): string {
    return `cf_${this.groupCFID}`;
  }

  @computed('model.[]')
  get sizeCFID(): string {
    const model = this.model || [];
    const groupCF = model.find(cf => cf.label === 'Size');
    return groupCF?.customfield_id;
  }

  @computed('sizeCFID')
  get sizeCFIDLabeL(): string {
    return `cf_${this.sizeCFID}`;
  }

  @computed('model.[]')
  get designCFID(): string {
    const model = this.model || [];
    const groupCF = model.find(cf => cf.label === 'Design');
    return groupCF?.customfield_id;
  }

  @computed('designCFID')
  get designCFIDLabeL(): string {
    return `cf_${this.designCFID}`;
  }

  @computed('model.[]')
  get brandCFID(): string {
    const model = this.model || [];
    const groupCF = model.find(cf => cf.label === 'Brand');
    return groupCF?.customfield_id;
  }

  @computed('brandCFID')
  get brandCFIDLabeL(): string {
    return `cf_${this.brandCFID}`;
  }

  @computed('results.[]')
  get totalQty(): number {
    const results = this.results || [];
    return results.reduce((sum, next) => sum + next.stock_on_hand, 0);
  }

  @computed('results.[]')
  get totalAmount(): number {
    const results = this.results || [];
    return results.reduce((sum, next) => sum + (next.purchase_rate * next.stock_on_hand), 0);
  }

  @action
  selectGroup(group: string): void {
    this.set('searchModel.group', group);
  }

  @action
  selectSize(size: string): void {
    this.set('searchModel.size', size);
  }

  @action
  selectDesign(design: string): void {
    this.set('searchModel.design', design);
  }

  @action
  selectBrand(brand: string): void {
    this.set('searchModel.brand', brand);
  }

  @action
  loadMore(): void {
    this.send('searchItems', this.page + 1);
  }

  @action
  searchItemsC(): void {
    this.send('searchItems');
  }

  @action
  clearAll(): void {
    this.setProperties({ searchModel: {}, results: [] });
  }
}