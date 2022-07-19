import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Header />
      <main role="main">{children}</main>
      <Footer />
    </div>
  );
}
