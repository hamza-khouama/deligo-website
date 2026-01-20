import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { Users, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else.",
    },
    {
      icon: Target,
      title: "Reliability",
      description: "Dependable service you can count on, every time you need us.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every delivery and interaction.",
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology.",
    },
  ]

  return (
    <div className="bg-white">
      <Header />

      <main className="pt-[72px]">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About <span className="font-pacifico text-primary">Déligo</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                We're revolutionizing the way people move their belongings by connecting them with trusted, professional
                transporters in their area.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Founded with the vision of making moving and delivery services accessible to everyone, Déligo was born
                  from the frustration of finding reliable transporters when you need them most.
                </p>
                <p className="text-gray-600 mb-6">
                  Our platform connects customers with verified, professional moving agents who own various types of
                  vehicles - from compact vans to large trucks - ensuring there's always a solution for every moving
                  need.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve thousands of customers and support hundreds of independent transporters,
                  creating a thriving ecosystem that benefits everyone involved.
                </p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/become-agent-image.png"
                  alt="Déligo team and services"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape the experience we deliver to our customers and
                partners.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4 mx-auto">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 mb-8">
                To make moving and delivery services simple, reliable, and accessible for everyone, while empowering
                independent transporters to build successful businesses.
              </p>
              <div className="bg-primary/5 rounded-lg p-8">
                <p className="text-lg text-gray-700">
                  "We believe that everyone deserves access to trustworthy, professional moving services, and every
                  transporter deserves the opportunity to grow their business with the right tools and support."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
