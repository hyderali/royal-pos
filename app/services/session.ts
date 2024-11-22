import Service from '@ember/service';
import { equal } from '@ember/object/computed';

interface User {
  is_admin: boolean;
  is_sale: boolean;
  username: string;
}

export default class SessionService extends Service {
  isLoggedIn = false;
  user: User | null = null;
  itemslist: any[] | null = null;
  organization_id: string | null = null;
  org_name: string | null = null;
  org_address: string | null = null;
  org_phone: string | null = null;
  customer_id: string | null = null;
  inventory_account_id: string | null = null;
  cogs_id: string | null = null;
  vendors: any[] = [];
  itemCF: any = null;
  salespersons: any[] = [];

  @equal('user.is_admin', true) isAdmin!: boolean;
  @equal('user.is_sale', true) isSale!: boolean;

  constructor() {
    super(...arguments);
    this.setProperties({
      vendors: [],
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'session': SessionService;
  }
}