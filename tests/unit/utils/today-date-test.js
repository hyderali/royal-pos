import todayDate from 'royal-pos/utils/today-date';
import { module, test } from 'qunit';

module('Unit | Utility | today date', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = todayDate();
    assert.ok(result);
  });
});
