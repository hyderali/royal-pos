import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { faker } from '@faker-js/faker';
import setupService from '../helpers/setup-service';
module('Acceptance | sales', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    setupService('session',{
      isLoggedIn: true,
      user: {
        username: 'testuser',
        is_admin: true
      },
      organization_id: '123',
      customer_id: '456'
    });

    // Create test data
    this.server.create('item', {
      'Item ID': '1',
      SKU: '00000001',
      'Item Name': 'Test Item 1',
      Description: 'Test Description 1',
      Rate: 'Rs 100',
      Status: 'Active'
    });

    this.server.create('item', {
      'Item ID': '2',
      SKU: '00000002',
      'Item Name': 'Test Item 2',
      Description: 'Test Description 2',
      Rate: 'Rs 200',
      Status: 'Active'
    });

    this.server.createList('salesperson', 2);
  });

  test('visiting /sales', async function(assert) {
    await visit('/sales');
    assert.dom('[data-test-sales-title]').hasText('Sales');
  });

  test('can add items to sale', async function(assert) {
    await visit('/sales');
    await fillIn('[data-test-item-input]', '00000001');
    assert.dom('[data-test-line-items] tr').exists({ count: 2 });
    assert.dom('[data-test-item-sku]').hasText('00000001');
    assert.dom('[data-test-item-description]').hasText('Test Description 1');
  });

  test('can remove items from sale', async function(assert) {
    await visit('/sales');
    await fillIn('[data-test-item-input]', '00000001');
    assert.dom('[data-test-line-items] tr').exists({ count: 2 });
    
    await click('[data-test-delete-item]');
    assert.dom('[data-test-line-items] tr').exists({ count: 1 });
  });

  test('can complete sale', async function(assert) {
    await visit('/sales');
    await fillIn('[data-test-item-input]', '00000001');
    await click('[data-test-save-print]');
    
    assert.dom('[data-test-receipt]').exists();
    assert.dom('[data-test-invoice-number]').exists();
  });

  test('shows correct totals', async function(assert) {
    await visit('/sales');
    await fillIn('[data-test-item-input]', '00000001');
    await fillIn('[data-test-item-input]', '00000002');
    
    assert.dom('[data-test-subtotal]').hasText('300');
    assert.dom('[data-test-total]').hasText('300');
  });

  test('can select salesperson', async function(assert) {
    const salesperson = this.server.schema.salespersons.first();
    
    await visit('/sales');
    await click('[data-test-salesperson-select]');
    await click(`[data-option-index="0"]`);

    assert.dom('[data-test-salesperson-select]').hasText(salesperson.salesperson_name);
  });

  test('can add phone number', async function(assert) {
    const phoneNumber = faker.phone.number();
    
    await visit('/sales');
    await fillIn('[data-test-phone-number]', phoneNumber);
    
    assert.dom('[data-test-phone-number]').hasValue(phoneNumber);
  });

  test('can apply discount', async function(assert) {
    await visit('/sales');
    await fillIn('[data-test-item-input]', '00000001');
    await click('[data-test-discount-select]');
    await click('[data-option-index="1"]'); // Select 5% discount
    
    assert.dom('[data-test-discount]').exists();
    assert.dom('[data-test-total]').hasText('95'); // 100 - 5%
  });
});