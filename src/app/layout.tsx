import './globals.css';
import Image from 'next/image';

export const metadata = {
  title: 'nelson deus',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='min-h-[100vh]'>
        <main className='h-full w-full bg-stone-50'>{children}</main>
      </body>
    </html>
  );
}
