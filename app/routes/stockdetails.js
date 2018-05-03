import Ember from 'ember';
const { inject: { service }, Route } = Ember;
export default Route.extend({
  session: service(),
  store: service(),
  model() {
    let itemCF = this.get('session.itemCF');
    if (itemCF) {
      return itemCF;
    }
    return this.get('store').ajax('/itemcustomfields').then((json) => {
      itemCF = json.custom_fields;
      this.set('session.itemCF', itemCF);
      return itemCF;
    });
  },
  actions: {
    searchItems(page = 1) {
      let controller = this.get('controller');
      let cfParams = {};
      let group = controller.get('searchModel.group');
      let size = controller.get('searchModel.size');
      let design = controller.get('searchModel.design');
      let brand = controller.get('searchModel.brand');
      let results = controller.get('results');
      if (group) {
        cfParams[`custom_field_${controller.get('groupCFID')}`] = group;
      }
      if (size) {
        cfParams[`custom_field_${controller.get('sizeCFID')}`] = size;
      }
      if (design) {
        cfParams[`custom_field_${controller.get('designCFID')}`] = design;
      }
      if (brand) {
        cfParams[`custom_field_${controller.get('brandCFID')}`] = brand;
      }
      controller.set('isLoading', true);
      this.get('store').ajax('/items', { params: { 'cf_params': cfParams, page } }).then((json) => {
        if (page === 1) {
          results = json.items;
        } else {
          results = results.concat(json.items);
        }
        controller.setProperties({ results, hasMore: json.has_more_page, isLoading: false, page });
      });
    }
  }
});
