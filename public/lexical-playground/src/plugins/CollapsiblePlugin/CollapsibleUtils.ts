export function setDomHiddenUntilFound(dom: HTMLElement): void {
  // HTML spec mới – TS chưa có type
  dom.setAttribute('hidden', 'until-found');
}

export function domOnBeforeMatch(
  dom: HTMLElement,
  callback: () => void,
): void {
  dom.addEventListener('beforematch', callback);
}
