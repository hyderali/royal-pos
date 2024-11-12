import { helper } from '@ember/component/helper';

function difference([value1, value2, value3]) {
  return (Number(value1) || 0) - (Number(value2) || 0) - (Number(value3) || 0);
}

export default helper(difference);