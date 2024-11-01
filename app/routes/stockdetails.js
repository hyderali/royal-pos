import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class StockdetailsRoute extends Route {
  @service
  session;

  @service
  store;

  model() {
    let itemCF = this.get('session.itemCF');
    if (itemCF) {
      return itemCF;
    }
    return this.store.ajax('/itemcustomfields').then((json) => {
      itemCF = json.custom_fields;
      this.set('session.itemCF', itemCF);
      return itemCF;
    });
  }

  @action
  searchItems(page = 1) {
    let controller = this.controller;
    let cfParams = {};
    let group = controller.get('searchModel.group');
    let size = controller.get('searchModel.size');
    let design = controller.get('searchModel.design');
    let brand = controller.get('searchModel.brand');
    let results = controller.results;
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
    controller.set('isLoading', true);
    this.store
      .ajax('/items', { params: { cf_params: cfParams, page } })
      .then((json) => {
        let items = json.items;
        items = items.filterBy('stock_on_hand');
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
      });
  }
}
