import { MapPin, DollarSign, Truck, Headphones } from "lucide-react"

export default function KeyFeatures() {
  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your delivery progress live on the map",
    },
    {
      icon: DollarSign,
      title: "Price Negotiation",
      description: "Negotiate prices directly with moving agents",
    },
    {
      icon: Truck,
      title: "Various Vehicles",
      description: "Choose from different vehicle types for your needs",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help anytime through our support team",
    },
  ]

  return (
    <section id="key-features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
