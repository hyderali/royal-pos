import Route from '@ember/routing/route';

export default class PaymentNewRoute extends Route {
  queryParams = {
    invoiceids: {
      refreshModel: true
    }
  };

  serializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids' && value) {
      return value.join(',');
    }
    return super.serializeQueryParam(value, urlKey, defaultValueType);
  }

  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids') {
      return value.split(',');
    }
    return super.deserializeQueryParam(value, urlKey, defaultValueType);
  }

  model(params) {
    const parentModel = this.modelFor('payment');
    let index = 0;
    return parentModel.filter((invoice) => {
      if (params.invoiceids.includes(invoice.invoice_id)) {
        invoice.discount = 0;
        invoice.credits_applied = 0;
        if (index === 0) {
          invoice.autofocus = true;
        }
        index++;
        return true;
      }
      return false;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.credits = 0;
  }
}