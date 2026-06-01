

const PrivacyPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500">Last Updated: June 1, 2026</p>
      </div>

      <div className="space-y-8">
        <p className="text-gray-700">
          At Monsoon Books, we respect your privacy and are committed to
          protecting your personal information. This Privacy Policy explains
          what information we collect, how we use it, and your rights regarding
          that information.
        </p>

        {/* Information We Collect */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            1. Information We Collect
          </h2>

          <p className="text-gray-700 mb-2">
            We may collect the following information:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Name and email address</li>
            <li>Phone number</li>
            <li>Delivery address</li>
            <li>Profile information from Google or Facebook login</li>
            <li>Book reviews and comments you submit</li>
            <li>Technical information such as IP address and browser type</li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>

          <p className="text-gray-700 mb-2">
            We use your information to:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Create and manage your account</li>
            <li>Process and deliver orders</li>
            <li>Provide customer support</li>
            <li>Display reviews and comments</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and unauthorized activity</li>
            <li>Send order updates and service notifications</li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h2 className="text-xl font-semibold mb-3">3. Payments</h2>

          <p className="text-gray-700">
            Payments may be processed through eSewa, Khalti, or Cash on
            Delivery. We do not store your payment passwords, PINs, or sensitive
            financial information.
          </p>
        </div>

        {/* Sharing Information */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            4. Sharing Information
          </h2>

          <p className="text-gray-700 mb-2">
            We do not sell your personal information. We may share information
            with:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Delivery and logistics partners</li>
            <li>Payment service providers</li>
            <li>Authentication providers (Google and Facebook)</li>
            <li>Government or legal authorities when required by law</li>
          </ul>
        </div>

        {/* Reviews & Comments */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            5. Reviews & Comments
          </h2>

          <p className="text-gray-700">
            Reviews, ratings, and comments you post may be publicly visible on
            the website. Please avoid sharing sensitive personal information in
            public content.
          </p>
        </div>

        {/* Cookies */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            6. Cookies & Analytics
          </h2>

          <p className="text-gray-700">
            We may use cookies and analytics tools to improve website
            functionality, maintain login sessions, and understand how visitors
            use our website.
          </p>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-xl font-semibold mb-3">7. Data Security</h2>

          <p className="text-gray-700">
            We take reasonable measures to protect your information from
            unauthorized access, misuse, or disclosure. However, no method of
            internet transmission is completely secure.
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>

          <p className="text-gray-700 mb-2">
            You may request to:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account</li>
            <li>Request information about how your data is used</li>
          </ul>
        </div>

        {/* Policy Updates */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            9. Changes to This Policy
          </h2>

          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>

          <p className="text-gray-700">
            If you have questions about this Privacy Policy or how your data is
            handled, please contact Monsoon Books through our website.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;