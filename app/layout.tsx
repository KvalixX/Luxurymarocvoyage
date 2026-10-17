import '@/app/globals.css';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if Next.js template would default to this.
export default function RootLayout({ children }: Props) {
  return children;
}
