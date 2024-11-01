import { equal } from '@ember/object/computed';

import Service from '@ember/service';

export default class SessionService extends Service {
  constructor() {
    super(...arguments);
    this.setProperties({
      vendors: [],
    });
  }

  isLoggedIn = false;
  user = null;
  itemslist = null;
  organization_id = null;
  org_name = null;
  org_address = null;
  org_phone = null;
  customer_id = null;
  inventory_account_id = null;
  cogs_id = null;

  @equal('user.is_admin', true)
  isAdmin;

  @equal('user.is_sale', true)
  isSale;

  itemCF = null;
}
