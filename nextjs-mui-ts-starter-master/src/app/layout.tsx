import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import { TrackContextProvider } from '@/components/track/track.wrapper';
import NextAuthWrapper from '@/lib/next.auth.provider';
import { ToastProvider } from '@/utils/toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>
            <ToastProvider>
              <TrackContextProvider>
                {children}
              </TrackContextProvider>
            </ToastProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
