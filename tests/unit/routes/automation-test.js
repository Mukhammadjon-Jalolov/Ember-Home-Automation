import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | automation', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:automation');
    assert.ok(route);
  });
});
