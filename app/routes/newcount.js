import Route from "@ember/routing/route";
import getItemName from "../utils/get-item-name";
import Count from "../models/count";
import CountItem from "../models/countitem";
import { inject as service } from "@ember/service";
export default Route.extend({
  session: service(),
  store: service(),
  postUrl: "/newcount",
  countText: "New Counting",
  model() {
    return this.store.ajax("/allcount").then((json) => {
      let count_id = getItemName(`${json.count.next_count_id}`);
      return Count.create({
        countText: this.countText,
        count_id: `Count-${count_id}`,
        items: [],
      });
    });
  },
  actions: {
    itemChanged(itemName) {
      itemName = getItemName(itemName);
      let {
        controller,
        controller: {
          model: { items },
        },
      } = this;
      let existingItem = items.findBy("sku", itemName);
      if (existingItem) {
        existingItem.set("qty", Number(existingItem.get("qty") + 1));
        controller.set("id", "");
        return;
      }
      let itemslist = this.get("session.itemslist");
      let newItem = itemslist.findBy("SKU", itemName);
      if (newItem) {
        let newLineItem = CountItem.create({
          qty: 1,
          sku: newItem.SKU,
          cost_price: Number(newItem["Purchase Rate"].split(" ")[1]),
          sales_price: Number(newItem.Rate.split(" ")[1]),
          description: newItem.Description,
        });
        items.pushObject(newLineItem);
      }
      controller.set("id", "");
    },
    save() {
      let {
        controller: {
          model,
          model: { items },
        },
      } = this;
      let body = {
        count_id: model.count_id,
        items: items.map((item) => {
          return {
            qty: item.qty,
            sku: item.sku,
            cost_price: item.cost_price,
            cost_value: item.cost_value,
            sales_price: item.sales_price,
            sales_value: item.sales_value,
            description: item.description,
          };
        }),
        total: {
          qty: model.totalQty,
          cost_value: model.totalCV,
          sales_value: model.totalSV,
        },
      };
      this.store.ajax(this.postUrl, { method: "POST", body }).then(() => {
        this.transitionTo("counting");
      });
    },
    cancel() {
      this.transitionTo("counting");
    },
  },
});
