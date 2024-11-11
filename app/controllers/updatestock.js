import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
import getItemName from '../utils/get-item-name';

export default class UpdateStockController extends Controller {
  @service store;
  @service session;

  @tracked errorMessage = '';
  @tracked successMessage = '';
  @tracked isSaving = false;
  @tracked printItems = [];
  @tracked nextNumber = '';

  @computed('model.[]')
  get total() {
    const items = this.model;
    let total = 0;
    
    items.forEach((item) => {
      total += Number(item['Incoming Stock']);
    });
    
    return total;
  }

  @action
  async save() {
    const body = {
      items: this.model,
      printItems: this.printItems
    };

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const json = await this.store.ajax('/updatestock', { 
        method: 'POST', 
        body 
      });

      if (json.message === 'success') {
        this.model = [];
        if (isPresent(this.printItems)) {
          this.successMessage = 'Print Items found. Import importitem csv file into Zoho Books and print sticker from Barcode option';
        }
      } else if (json.message === 'failure') {
        this.errorMessage = json.error;
      }
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.isSaving = false;
    }
  }
}