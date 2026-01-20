import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CookiesPage() {
  return (
    <div className="bg-white">
      <Header />

      <main className="pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">Last updated: January 2025</p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 mb-6">
                  Cookies are small text files that are stored on your device when you visit our website or use our
                  mobile app. They help us provide you with a better experience by remembering your preferences and
                  analyzing how you use our services.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for our platform to function properly. They enable core functionality such
                  as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>User authentication and login sessions</li>
                  <li>Security and fraud prevention</li>
                  <li>Shopping cart and booking functionality</li>
                  <li>Load balancing and performance optimization</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors interact with our platform by collecting anonymous
                  information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Number of visitors and page views</li>
                  <li>Time spent on different pages</li>
                  <li>User journey and navigation patterns</li>
                  <li>Device and browser information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies enhance your experience by remembering your choices and preferences:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Language and region preferences</li>
                  <li>Recently viewed services and locations</li>
                  <li>Customized content and recommendations</li>
                  <li>Accessibility settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are used to deliver relevant advertisements and track campaign effectiveness:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Personalized advertising based on your interests</li>
                  <li>Retargeting campaigns on other websites</li>
                  <li>Social media integration and sharing</li>
                  <li>Campaign performance measurement</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-6">
                  We work with trusted third-party services that may also set cookies on your device. These include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> For website analytics and performance monitoring
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> For secure payment processing
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> For social sharing and login functionality
                  </li>
                  <li>
                    <strong>Customer Support:</strong> For chat and support services
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 mb-6">You have several options to control and manage cookies:</p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Block all cookies</li>
                  <li>Allow only first-party cookies</li>
                  <li>Delete existing cookies</li>
                  <li>Set up notifications when cookies are being set</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Consent Banner</h3>
                <p className="text-gray-700 mb-6">
                  When you first visit our website, you'll see a cookie consent banner where you can choose which types
                  of cookies to accept. You can change your preferences at any time by clicking the "Cookie Settings"
                  link in our footer.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-6">
                  While you can disable cookies, please note that this may affect your experience on our platform:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>You may need to re-enter information more frequently</li>
                  <li>Some features may not work properly</li>
                  <li>Personalized content and recommendations may not be available</li>
                  <li>We may not be able to remember your preferences</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Mobile App Data</h2>
                <p className="text-gray-700 mb-6">
                  Our mobile app may use similar technologies to cookies, such as local storage and device identifiers,
                  to provide functionality and improve your experience. You can manage these through your device
                  settings.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                <p className="text-gray-700 mb-6">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal
                  and regulatory reasons. We will notify you of any significant changes.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:privacy@deligo.com" className="text-primary hover:underline">
                      privacy@deligo.com
                    </a>
                    <br />
                    <strong>Subject:</strong> Cookie Policy Inquiry
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
