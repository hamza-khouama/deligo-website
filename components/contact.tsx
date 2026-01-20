import { Phone, MessageCircle, Mail } from "lucide-react"

export default function Contact() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (234) 567-890",
      href: "tel:+1234567890",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "Message us on WhatsApp",
      href: "#",
    },
    {
      icon: Mail,
      title: "Email",
      content: "support@deligo.com",
      href: "mailto:support@deligo.com",
    },
  ]

  return (
    <section id="contact-support" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Contact & Support</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{method.title}</h3>
              <a href={method.href} className="text-primary hover:underline">
                {method.content}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
