import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {
  @tracked isLoggedIn = false;
  @tracked user = null;
  @tracked itemslist = null;
  @tracked organization_id = null;
  @tracked org_name = null;
  @tracked org_address = null;
  @tracked org_phone = null;
  @tracked customer_id = null;
  @tracked vendors = [];
  @tracked inventory_account_id = null;
  @tracked cogs_id = null;
  @tracked itemCF = null;

  get isAdmin() {
    return this.user?.is_admin ?? false;
  }

  get isSale() {
    return this.user?.is_sale ?? false;
  }
}