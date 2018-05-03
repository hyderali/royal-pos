import Ember from 'ember';
const { inject: { service }, computed, Controller } = Ember;
export default Controller.extend({
  session: service(),
  searchModel: null,
  init() {
    this._super(...arguments);
    this.set('searchModel', {});
  },
  groupCFID: computed('model.[]', function() {
    let model = this.get('model') || [];
    let groupCF = model.findBy('label', 'Group');
    return groupCF.customfield_id;
  }),
  groupCFIDLabeL: computed('groupCFID', function() {
    let groupCFID = this.get('groupCFID');
    return `cf_${groupCFID}`;
  }),
  sizeCFID: computed('model.[]', function() {
    let model = this.get('model') || [];
    let groupCF = model.findBy('label', 'Size');
    return groupCF.customfield_id;
  }),
  sizeCFIDLabeL: computed('sizeCFID', function() {
    let groupCFID = this.get('sizeCFID');
    return `cf_${groupCFID}`;
  }),
  designCFID: computed('model.[]', function() {
    let model = this.get('model') || [];
    let groupCF = model.findBy('label', 'Design');
    return groupCF.customfield_id;
  }),
  designCFIDLabeL: computed('designCFID', function() {
    let groupCFID = this.get('designCFID');
    return `cf_${groupCFID}`;
  }),
  brandCFID: computed('model.[]', function() {
    let model = this.get('model') || [];
    let groupCF = model.findBy('label', 'Brand');
    return groupCF.customfield_id;
  }),
  brandCFIDLabeL: computed('brandCFID', function() {
    let groupCFID = this.get('brandCFID');
    return `cf_${groupCFID}`;
  }),
  totalQty: computed('results.[]', function() {
    let results = this.get('results') || [];
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
      this.send('searchItems', this.get('page') + 1);
    },
    clearAll() {
      this.set('searchModel', {});
    }
  }
});
