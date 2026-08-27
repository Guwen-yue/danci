import './globals.css';
import { MockAuthProvider } from 'app/lib/mock-auth';

export const metadata = {
  title: '单词学习',
  description: '小学英语单词书同步学习，支持学习进度与断点续学。',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <MockAuthProvider>
          <div className="app-shell relative mx-auto min-h-dvh w-full max-w-md">
            {children}
          </div>
        </MockAuthProvider>
      </body>
    </html>
  );
}
