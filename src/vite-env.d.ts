/// <reference types="vite/client" />

import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    tronLink: any;
    tronWeb: any;
  }
}
