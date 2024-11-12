import { helper } from '@ember/component/helper';

function getIndex([index]) {
  return Number(index) + 1;
}

export default helper(getIndex);