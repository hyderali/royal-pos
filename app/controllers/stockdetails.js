import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class StockdetailsController extends Controller {
  @service
  session;

  searchModel = null;

  constructor() {
    super(...arguments);
    this.set('searchModel', {});
  }

  @computed('model.[]')
  get groupCFID() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Group');
    return groupCF.customfield_id;
  }

  @computed('groupCFID')
  get groupCFIDLabeL() {
    let groupCFID = this.groupCFID;
    return `cf_${groupCFID}`;
  }

  @computed('model.[]')
  get sizeCFID() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Size');
    return groupCF.customfield_id;
  }

  @computed('sizeCFID')
  get sizeCFIDLabeL() {
    let groupCFID = this.sizeCFID;
    return `cf_${groupCFID}`;
  }

  @computed('model.[]')
  get designCFID() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Design');
    return groupCF.customfield_id;
  }

  @computed('designCFID')
  get designCFIDLabeL() {
    let groupCFID = this.designCFID;
    return `cf_${groupCFID}`;
  }

  @computed('model.[]')
  get brandCFID() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Brand');
    return groupCF.customfield_id;
  }

  @computed('brandCFID')
  get brandCFIDLabeL() {
    let groupCFID = this.brandCFID;
    return `cf_${groupCFID}`;
  }

  @computed('results.[]')
  get totalQty() {
    let results = this.results || [];
    let totalQty = results.reduce((first, next) => {
      return first + next.stock_on_hand;
    }, 0);
    return totalQty;
  }

  @computed('results.[]')
  get totalAmount() {
    let results = this.results || [];
    let totalQty = results.reduce((first, next) => {
      return first + next.purchase_rate * next.stock_on_hand;
    }, 0);
    return totalQty;
  }

  @action
  selectGroup(group) {
    this.set('searchModel.group', group);
  }

  @action
  selectSize(size) {
    this.set('searchModel.size', size);
  }

  @action
  selectDesign(design) {
    this.set('searchModel.design', design);
  }

  @action
  selectBrand(brand) {
    this.set('searchModel.brand', brand);
  }

  @action
  loadMore() {
    this.send('searchItems', this.page + 1);
  }

  @action
  searchItemsC() {
    this.send('searchItems');
  }

  @action
  clearAll() {
    this.setProperties({ searchModel: {}, results: [] });
  }
}
