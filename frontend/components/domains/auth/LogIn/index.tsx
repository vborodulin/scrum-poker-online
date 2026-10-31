import dynamic from 'next/dynamic';

const LogIn = dynamic<{}>(
  () => import('./LogIn').then((mod) => mod.LogIn),
  {
    ssr: false,
  }
);

export {
  LogIn,
};
