import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "danieldcs.com",
  description: "Personal website of Daniel Castro",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
