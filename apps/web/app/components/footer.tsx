import { config } from "../config";

export const Footer = () => {
  const { appName } = config;

  return (
    <footer className="border-border/50 border-t bg-background py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-muted-foreground text-sm">
        <span className="font-semibold text-foreground tracking-tight">
          {appName}
        </span>
        <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};
