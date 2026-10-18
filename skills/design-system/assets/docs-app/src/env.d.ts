/// <reference types="vite/client" />

declare module 'virtual:design-system-docs' {
  const docs: {
    appName: string;
    sections: Array<{ id: string; label: string; file: string; markdown: string }>;
  };
  export default docs;
}
