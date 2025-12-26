import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Zerra Blog – Travel & AI",
    template: "%s | Zerra Blog",
  },
  description: "Travel blog, AI, công nghệ và trải nghiệm toàn cầu",
  metadataBase: new URL("https://zerra.blog"),
  openGraph: {
    title: "Zerra Blog",
    description: "Travel & AI Blog",
    url: "https://zerra.blog",
    siteName: "Zerra Blog",
    type: "website",
  },
};

export default function RecapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}

