export const $ = (
  selector: string,
  target: HTMLElement | Document = document
): HTMLElement => {
  const $el = target.querySelector(selector);
  if (!($el instanceof HTMLElement)) {
    throw new Error('not HTMLElement');
  }
  return $el;
};

export const $$ = (
  selector: string,
  target: HTMLElement | Document = document
): NodeListOf<Element> => {
  return target.querySelectorAll(selector);
};
