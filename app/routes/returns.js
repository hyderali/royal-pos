import SalesRoute from './sales';
export default SalesRoute.extend({
  postUrl: '/creditnotes',
  actions: {
    printReceipt() {
      window.print();
    }
  }
});
