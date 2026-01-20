import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <Header />

      <main className="pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">Last updated: January 2025</p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-6">
                  At Déligo, we collect information to provide better services to our users. We collect information in
                  the following ways:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address, phone number, and address when you
                    register
                  </li>
                  <li>
                    <strong>Location Data:</strong> GPS location for pickup and delivery services
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Credit card details and billing information
                  </li>
                  <li>
                    <strong>Usage Data:</strong> How you interact with our platform and services
                  </li>
                  <li>
                    <strong>Device Information:</strong> Device type, operating system, and unique identifiers
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Provide and improve our moving and delivery services</li>
                  <li>Connect you with verified transporters in your area</li>
                  <li>Process payments and send transaction confirmations</li>
                  <li>Send important updates about your bookings</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Analyze usage patterns to improve our services</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-6">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>
                    <strong>With Transporters:</strong> Necessary contact and location information to complete your
                    service
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party companies that help us operate our platform
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular
                  security audits.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Location Data</h2>
                <p className="text-gray-700 mb-6">
                  Our services require location data to connect you with nearby transporters and provide accurate pickup
                  and delivery services. You can control location sharing through your device settings, but this may
                  limit service functionality.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 mb-6">
                  We retain your personal information only as long as necessary to provide our services and comply with
                  legal obligations. You can request deletion of your account and associated data at any time.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-6">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide
                  personalized content. You can manage cookie preferences through your browser settings. See our Cookie
                  Policy for more details.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-6">
                  Our services are not intended for children under 18. We do not knowingly collect personal information
                  from children. If we become aware of such collection, we will delete the information immediately.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on our platform and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:privacy@deligo.com" className="text-primary hover:underline">
                      privacy@deligo.com
                    </a>
                    <br />
                    <strong>Address:</strong> Déligo Privacy Team
                    <br />
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+1234567890" className="text-primary hover:underline">
                      +1 (234) 567-890
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
