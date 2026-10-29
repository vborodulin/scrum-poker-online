type FIXME = any;

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

declare module '*.module.css' {
  const content: Record<string, string>;
  export = content;
}

declare module 'next-offline/runtime';
