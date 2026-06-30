import { Navbar, Footer } from "@/components/layout";
import { CrisisBanner } from "@/components/layout/crisis-banner";
import { ChatWidget } from "@/components/layout/chat-widget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CrisisBanner />
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
