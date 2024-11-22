import { typeOf } from '@ember/utils';
import { get } from '@ember/object';
import { getApplication } from '@ember/test-helpers';

interface Service {
    get(key: string): any;
    set(key: string, value: any): void;
}

interface Properties {
    [key: string]: any;
}

function updateProperties(service: Service, obj: Properties, keyPath: string = ''): void {
    let keys: string[] = Object.keys(obj);

    keys.forEach((key: string) => {
        let value: any = get(obj, key);
        key = keyPath ? `${keyPath}.${key}` : key;

        if (typeOf(value) === 'object') {
            let keyValue: any = service.get(key) || {};
            service.set(key, keyValue);
            updateProperties(service, value, key);
        } else {
            service.set(key, value);
        }
    });
}
/*
  This helper will update the service with the properties passed to it.

  Usage:

  1. To change the org version to US.

  setupService('currentOrg', { isUKVersion: false, isUSVersion: true });

  2. To disable edit and delete permission for expense and bill.

  setupService('session', {
    isLoggedIn: true,
      user: {
        username: 'testuser',
        is_admin: true
      },
      organization_id: '123',
      customer_id: '456'
  });
*/

interface Service {
    get(key: string): any;
    set(key: string, value: any): void;
}

interface Properties {
    [key: string]: any;
}

export default function(serviceName: string, properties: Properties): void {
    let context = getApplication();
    let service: Service = context.owner.lookup(`service:${serviceName}`);
    updateProperties(service, properties);
}
