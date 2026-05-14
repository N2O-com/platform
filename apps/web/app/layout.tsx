import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { DesignSystemProvider } from "@repo/design";
import { fonts } from "@repo/design/lib/fonts";
import { cn } from "@repo/design/lib/utils";
import type { ReactNode } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Providers } from "./providers";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    className={cn(fonts, "scroll-smooth")}
    lang="en"
    suppressHydrationWarning
  >
    <body>
      <AnalyticsProvider>
        <DesignSystemProvider>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </DesignSystemProvider>
      </AnalyticsProvider>
    </body>
  </html>
);

export default RootLayout;
