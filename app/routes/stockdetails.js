import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StockDetailsRoute extends Route {
  @service session;
  @service store;

  async model() {
    if (this.session.itemCF) {
      return this.session.itemCF;
    }

    const json = await this.store.ajax('/itemcustomfields');
    this.session.itemCF = json.custom_fields;
    return json.custom_fields;
  }

  @action
  async searchItems(page = 1) {
    const controller = this.controller;
    const cfParams = {};
    const { group, size, design, brand } = controller.searchModel;

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
      });

      const items = json.items.filter(item => item.stock_on_hand);

      if (page === 1) {
        controller.results = items;
      } else {
        controller.results = [...controller.results, ...items];
      }

      controller.hasMore = json.has_more_page;
      controller.page = page;
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      controller.isLoading = false;
    }
  }
}