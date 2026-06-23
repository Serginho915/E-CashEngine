import * as React from 'react';

declare global {
  namespace JSX {
    // Allow any intrinsic element to avoid 'JSX.IntrinsicElements' missing errors
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
