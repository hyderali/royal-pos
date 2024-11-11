import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EditSalesController extends Controller {
  @service session;
  
  @tracked canShowDetails = false;
  @tracked msg = '';
  @tracked isSearching = false;
  @tracked invoiceNumber = '';
  @tracked errorMessage = '';
}