import Controller from '@ember/controller';
export default Controller.extend({
  actions: {
    computeTotal() {
      let items = this.items;
      let total = 0;
      items.forEach((item) => {
        total += Number(item['Initial Stock']);
      });
      this.set('total', total);
    }
  }
});
