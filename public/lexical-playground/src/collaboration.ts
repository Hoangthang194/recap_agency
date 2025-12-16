/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * STUB VERSION: Collaboration features are not available in this environment.
 * This file provides stub implementations to prevent module resolution errors.
 */

// Stub types for Provider and Doc
export type Provider = {
  connect: () => void;
  disconnect: () => void;
  awareness: any;
  [key: string]: any;
};

export type Doc = {
  load: () => void;
  [key: string]: any;
};

// Stub implementation: returns a no-op provider
function createStubProvider(): Provider {
  return {
    connect: () => {},
    disconnect: () => {},
    awareness: {},
  };
}

// parent dom -> child doc
export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Doc>,
): Provider {
  // Stub: return a no-op provider
  return createStubProvider();
}

export function createWebsocketProviderWithDoc(id: string, doc: Doc): Provider {
  // Stub: return a no-op provider
  return createStubProvider();
}
