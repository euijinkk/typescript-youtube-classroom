import { setCurrentObserver } from '../store/rootStore.js';
import { $, $$ } from '../utils/DOM.js';

export default abstract class Component {
  // @any
  state: any;

  constructor(protected target: HTMLElement, protected props?: any) {
    this.target = target;
    this.props = props;
    this.setup();
    this.setEvent();
    this.render();
  }

  setup() {}

  beforeMounted() {}

  afterMounted() {}

  template() {
    return '';
  }

  render() {
    setCurrentObserver(this);
    this.beforeMounted();
    this.target.innerHTML = this.template();
    this.afterMounted();
    setCurrentObserver(null);
  }

  setState<T>(newState: T) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  setEvent() {}

  addEvent(eventType: string, selector: string, callback: addEventCallBack) {
    const isTarget = (target: HTMLElement) => target.closest(selector);

    this.target.addEventListener(eventType, event => {
      if (!(event.target instanceof HTMLElement)) return;

      if (!isTarget(event.target)) return;

      event.preventDefault();
      callback(event);
    });
  }

  $(selector: string) {
    return $(selector, this.target);
  }

  $$(selector: string) {
    return $$(selector, this.target);
  }
}

type addEventCallBack = (event: Event) => any;
