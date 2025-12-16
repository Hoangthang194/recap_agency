/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Stub for lodash-es debounce (not available)
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { maxWait?: number }
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = lastCallTime ? now - lastCallTime : wait;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (options?.maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastCallTime = Date.now();
        func(...args);
        maxTimeoutId = null;
      }, options.maxWait);
    }
    
    timeoutId = setTimeout(() => {
      lastCallTime = Date.now();
      func(...args);
      timeoutId = null;
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = null;
      }
    }, wait);
  }) as T & { cancel: () => void; flush: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (maxTimeoutId) clearTimeout(maxTimeoutId);
    timeoutId = null;
    maxTimeoutId = null;
  };
  
  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}
import {useMemo, useRef} from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounce(
        (...args: Parameters<T>) => {
          if (funcRef.current) {
            funcRef.current(...args);
          }
        },
        ms,
        {maxWait},
      ),
    [ms, maxWait],
  );
}
