import { helper } from '@ember/component/helper';

function not([value]) {
  return !value;
}

export default helper(not);