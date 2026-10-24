import Footer from "@/components/page/Footer";
import Header from "@/components/page/Header";
import TopBar from "@/components/page/TopBar";


export default function SharedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>  <TopBar />
            <Header />
            {children}
            <Footer />
        </>
    )
}