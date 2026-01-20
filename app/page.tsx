import Header from "@/components/header"
import Hero from "@/components/hero"
import HowItWorks from "@/components/how-it-works"
import KeyFeatures from "@/components/key-features"
import BecomeAgent from "@/components/become-agent"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <KeyFeatures />
        <BecomeAgent />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
