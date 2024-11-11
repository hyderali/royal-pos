import { helper } from '@ember/helper';

function product([value1, value2]) {
  return (Number(value1) || 0) * (Number(value2) || 0);
}

export default helper(product);