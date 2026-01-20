import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="bg-white">
      <Header />

      <main className="pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">Last updated: January 2025</p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-6">
                  By accessing and using the Déligo platform, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 mb-6">
                  Déligo is a platform that connects customers who need moving and delivery services with independent
                  transporters who provide such services. We facilitate these connections but are not directly
                  responsible for the actual moving or delivery services.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                <p className="text-gray-700 mb-4">As a user of our platform, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Respect other users and transporters</li>
                  <li>Pay for services as agreed</li>
                  <li>Follow all applicable laws and regulations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Transporter Responsibilities</h2>
                <p className="text-gray-700 mb-4">Transporters using our platform agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Maintain valid licenses and insurance</li>
                  <li>Provide professional and reliable service</li>
                  <li>Handle customer property with care</li>
                  <li>Communicate clearly with customers</li>
                  <li>Follow all traffic and safety regulations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
                <p className="text-gray-700 mb-6">
                  Payment for services is handled through our platform. We may charge service fees for facilitating
                  transactions. All prices are subject to applicable taxes and fees.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 mb-6">
                  Déligo acts as an intermediary platform. We are not liable for damages, losses, or issues arising from
                  the actual moving or delivery services provided by independent transporters.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy</h2>
                <p className="text-gray-700 mb-6">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
                  and protect your information.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                <p className="text-gray-700 mb-6">
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes,
                  and continued use of the service constitutes acceptance of the new terms.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about these Terms of Service, please contact us at
                  <a href="mailto:legal@deligo.com" className="text-primary hover:underline ml-1">
                    legal@deligo.com
                  </a>
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
