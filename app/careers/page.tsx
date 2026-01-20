import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Zap } from "lucide-react"

export default function CareersPage() {
  const benefits = [
    {
      icon: MapPin,
      title: "Remote Friendly",
      description: "Work from anywhere with flexible remote options.",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Maintain work-life balance with flexible scheduling.",
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Join a passionate team that values collaboration.",
    },
    {
      icon: Zap,
      title: "Growth Opportunities",
      description: "Advance your career with learning and development programs.",
    },
  ]

  const openings = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / Hybrid",
      type: "Full-time",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote / Hybrid",
      type: "Full-time",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Hybrid",
      type: "Full-time",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote / Hybrid",
      type: "Full-time",
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
                Join the <span className="font-pacifico text-primary">Déligo</span> Team
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Help us revolutionize the moving and delivery industry while building your career with a passionate,
                innovative team.
              </p>
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3">View Open Positions</Button>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Join Déligo?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're building the future of logistics and delivery services. Join us in creating solutions that make a
                real difference in people's lives.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4 mx-auto">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-gray-600">Explore our current job openings and find your next career opportunity.</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {openings.map((job, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
              <p className="text-xl text-gray-700 mb-8">
                Don't see a position that fits? We're always looking for talented individuals who share our passion for
                innovation and customer service.
              </p>
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3">Send Us Your Resume</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
