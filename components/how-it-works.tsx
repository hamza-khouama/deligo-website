import { MapPin, UserSearch, Route } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Enter Location",
      description: "Set your pickup and drop-off locations to find nearby moving agents",
    },
    {
      icon: UserSearch,
      title: "Choose Agent",
      description: "Select from our verified moving agents based on ratings and vehicle type",
    },
    {
      icon: Route,
      title: "Track Real-time",
      description: "Monitor your delivery progress in real-time through the app",
    },
  ]

  return (
    <section id="how-deligo-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">How Déligo Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
