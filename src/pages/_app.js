import Header from '@/components/Header/Header';
import { DM_Sans } from 'next/font/google';
import '@/styles/globals.css';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <main className={dmSans.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  );
}
