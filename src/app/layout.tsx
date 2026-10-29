import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
import './responsive.css';

export const metadata: Metadata = {
 title: 'nowman',
 description: 'Portfolio of Shaik Mohammad Nowman, a Computer Science graduate building Android and web applications. Explore BillSahi and Cafe Flex.',
 robots: { index: true, follow: true },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body>{children}</body></html>;
}
