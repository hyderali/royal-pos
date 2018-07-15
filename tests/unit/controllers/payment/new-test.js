import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | payment/new', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:payment/new');
    assert.ok(controller);
  });
});
