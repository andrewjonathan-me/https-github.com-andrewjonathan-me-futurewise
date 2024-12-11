import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col" id="privacy">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-600 dark:text-gray-300">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
              <p className="dark:text-gray-300">
                FutureWise ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
              <p>We collect several different types of information for various purposes to provide and improve our service to you:</p>
              <ul className="list-disc pl-6">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Educational information (Academic records, test scores)</li>
                <li>Usage data (How you interact with our platform)</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p>We use the collected data for various purposes:</p>
              <ul className="list-disc pl-6">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
              <p>
                The security of your data is important to us. We implement appropriate security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@futurewise.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
