import Ember from 'ember';
const { inject: { service }, computed, Controller, isBlank } = Ember;
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
  totalAmount: computed('results.[]', function() {
    let results = this.get('results') || [];
    let totalQty = results.reduce((first, next) => {
      return first + (next.purchase_rate * next.stock_on_hand);
    }, 0);
    return totalQty;
  }),
  actions: {
    selectGroup(group) {
      this.set('searchModel.group', group);
    },
    createGroupOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('searchModel.group') || '';
        if (!selected.includes(select.searchText)) {
          this.get('session.groups').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectSize(size) {
      this.set('searchModel.size', size);
    },
    createSizeOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('searchModel.size') || '';
        if (!selected.includes(select.searchText)) {
          this.get('session.sizes').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectDesign(design) {
      this.set('searchModel.design', design);
    },
    createDesignOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('searchModel.design') || '';
        if (!selected.includes(select.searchText)) {
          this.get('session.designs').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectBrand(brand) {
      this.set('searchModel.brand', brand);
    },
    createBrandOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('searchModel.brand') || '';
        if (!selected.includes(select.searchText)) {
          this.get('session.brands').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    loadMore() {
      this.send('searchItems', this.get('page') + 1);
    },
    clearAll() {
      this.setProperties({ searchModel: {}, results: [] });
    }
  }
});
