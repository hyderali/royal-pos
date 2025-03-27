import { modifier } from 'ember-modifier';

interface AutofocusSignature {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: {};
  };
}

export default modifier<AutofocusSignature>((element) => {
  element.focus();
});