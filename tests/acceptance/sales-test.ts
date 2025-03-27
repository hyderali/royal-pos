import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { Response } from 'miragejs';

module('Acceptance | sales', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    // Create test data using factories
    const server = (this as any).server;
    
    // Create salespeople
    server.createList('salesperson', 2);
    
    // Create test items
    server.createList('item', 3);
    
    // Create a sample invoice with line items
    server.create('invoice', {
      phone_number: '1234567890'
    });
  });

  test('can add new item by SKU', async function(assert) {
    const server = (this as any).server;
    const item = server.create('item', {
      'Item ID': '1',
      'Item Name': 'Test Item 1',
      SKU: 'TEST001',
      Rate: 'Rs 100',
      Status: 'Active'
    });
    
    await visit('/sales');
    
    await fillIn('[data-test-barcode-input]', 'TEST001');
    await click('[data-test-add-item-button]');

    assert.dom('[data-test-line-item]').exists({ count: 1 }, 'One line item is added');
    assert.dom('[data-test-item-name]').hasText('Test Item 1', 'Correct item name is displayed');
    assert.dom('[data-test-item-quantity]').hasValue('1', 'Quantity is set to 1');
    assert.dom('[data-test-item-rate]').hasText('100', 'Rate is set correctly');
  });

  test('can add temporary item', async function(assert) {
    await visit('/sales');
    
    await click('[data-test-add-temp-item]');

    assert.dom('[data-test-line-item]').exists({ count: 1 }, 'One line item is added');
    assert.dom('[data-test-item-description]').hasValue('Others', 'Description is set to Others');
    assert.dom('[data-test-item-quantity]').hasValue('1', 'Quantity is set to 1');
    assert.dom('[data-test-item-rate]').hasValue('0', 'Rate is set to 0');
  });

  test('can remove line item', async function(assert) {
    const server = (this as any).server;
    const item = server.create('item', {
      SKU: 'TEST001',
      'Item Name': 'Test Item 1',
      Rate: 'Rs 100'
    });
    
    await visit('/sales');
    await fillIn('[data-test-barcode-input]', 'TEST001');
    await click('[data-test-add-item-button]');
    
    assert.dom('[data-test-line-item]').exists({ count: 1 }, 'One line item exists');
    
    await click('[data-test-remove-item]');
    
    assert.dom('[data-test-line-item]').doesNotExist('Line item is removed');
  });

  test('can save invoice with multiple items', async function(assert) {
    const server = (this as any).server;
    const items = server.createList('item', 3);
    
    await visit('/sales');
    
    // Add multiple items
    for (let item of items) {
      await fillIn('[data-test-barcode-input]', item.SKU);
      await click('[data-test-add-item-button]');
    }
    
    assert.dom('[data-test-line-item]').exists({ count: 3 }, 'Three line items exist');
    
    await fillIn('[data-test-phone-number]', '1234567890');
    await click('[data-test-save-button]');
    
    assert.dom('[data-test-error-message]').doesNotExist('No error message is shown');
    assert.dom('[data-test-line-item]').doesNotExist('Line items are cleared after save');
  });

  test('shows error message on save failure', async function(assert) {
    const server = (this as any).server;
    server.post('/invoices', () => {
      return new Response(400, undefined, {
        message: 'error',
        error: 'Failed to save invoice'
      });
    });

    await visit('/sales');
    await fillIn('[data-test-barcode-input]', 'TEST001');
    await click('[data-test-add-item-button]');
    await click('[data-test-save-button]');
    
    assert.dom('[data-test-error-message]').hasText('Failed to save invoice', 'Error message is shown');
  });

  test('calculates total correctly with multiple items', async function(assert) {
    const server = (this as any).server;
    const items = [
      server.create('item', { SKU: 'ITEM1', Rate: 'Rs 100' }),
      server.create('item', { SKU: 'ITEM2', Rate: 'Rs 200' })
    ];
    
    await visit('/sales');
    
    // Add items with different quantities
    await fillIn('[data-test-barcode-input]', 'ITEM1');
    await click('[data-test-add-item-button]');
    await fillIn('[data-test-quantity-input]', '2');
    
    await fillIn('[data-test-barcode-input]', 'ITEM2');
    await click('[data-test-add-item-button]');
    await fillIn('[data-test-quantity-input]', '3');
    
    assert.dom('[data-test-total-amount]').hasText('800', 'Total is calculated correctly (2*100 + 3*200)');
  });
});
