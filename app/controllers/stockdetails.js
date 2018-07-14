import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
export default Controller.extend({
  session: service(),
  searchModel: null,
  init() {
    this._super(...arguments);
    this.set('searchModel', {});
  },
  groupCFID: computed('model.[]', function() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Group');
    return groupCF.customfield_id;
  }),
  groupCFIDLabeL: computed('groupCFID', function() {
    let groupCFID = this.groupCFID;
    return `cf_${groupCFID}`;
  }),
  sizeCFID: computed('model.[]', function() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Size');
    return groupCF.customfield_id;
  }),
  sizeCFIDLabeL: computed('sizeCFID', function() {
    let groupCFID = this.sizeCFID;
    return `cf_${groupCFID}`;
  }),
  designCFID: computed('model.[]', function() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Design');
    return groupCF.customfield_id;
  }),
  designCFIDLabeL: computed('designCFID', function() {
    let groupCFID = this.designCFID;
    return `cf_${groupCFID}`;
  }),
  brandCFID: computed('model.[]', function() {
    let model = this.model || [];
    let groupCF = model.findBy('label', 'Brand');
    return groupCF.customfield_id;
  }),
  brandCFIDLabeL: computed('brandCFID', function() {
    let groupCFID = this.brandCFID;
    return `cf_${groupCFID}`;
  }),
  totalQty: computed('results.[]', function() {
    let results = this.results || [];
    let totalQty = results.reduce((first, next) => {
      return first + next.stock_on_hand;
    }, 0);
    return totalQty;
  }),
  actions: {
    selectGroup(group) {
      this.set('searchModel.group', group);
    },
    selectSize(size) {
      this.set('searchModel.size', size);
    },
    selectDesign(design) {
      this.set('searchModel.design', design);
    },
    selectBrand(brand) {
      this.set('searchModel.brand', brand);
    },
    loadMore() {
      this.send('searchItems', this.page + 1);
    },
    clearAll() {
      this.setProperties({ searchModel: {}, results: [] });
    }
  }
});
