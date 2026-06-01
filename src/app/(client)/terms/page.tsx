

const TermsPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-gray-500">Last Updated: June 1, 2026</p>
      </div>

      <div className="space-y-8">
        <p className="text-gray-700">
          Welcome to Monsoon Books. By accessing our website or purchasing from
          us, you agree to comply with and be bound by these Terms &
          Conditions.
        </p>

        {/* Accounts */}
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Accounts</h2>

          <p className="text-gray-700">
            You may create an account using Google, Facebook, or any other
            sign-in methods made available by Monsoon Books. You are
            responsible for maintaining the security of your account and for
            all activities conducted through it.
          </p>

          <p className="text-gray-700 mt-2">
            We reserve the right to suspend or terminate accounts that violate
            these Terms or engage in fraudulent or abusive activity.
          </p>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            2. Products & Availability
          </h2>

          <p className="text-gray-700">
            Monsoon Books sells physical books for delivery within Nepal.
            Product descriptions, images, pricing, and availability are
            provided in good faith but may occasionally contain errors.
          </p>

          <p className="text-gray-700 mt-2">
            We reserve the right to correct errors, update information, or
            cancel orders if a product is unavailable or incorrectly listed.
          </p>
        </div>

        {/* Orders & Payments */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            3. Orders & Payments
          </h2>

          <p className="text-gray-700 mb-2">
            All prices displayed on our website are in Nepalese Rupees (NPR).
          </p>

          <p className="text-gray-700 mb-2">
            We currently accept:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>eSewa</li>
            <li>Khalti</li>
            <li>Cash on Delivery (COD)</li>
          </ul>

          <p className="text-gray-700 mt-2">
            We may refuse or cancel an order due to stock shortages, pricing
            errors, payment issues, suspected fraud, or any violation of these
            Terms.
          </p>
        </div>

        {/* Shipping */}
        <div>
          <h2 className="text-xl font-semibold mb-3">4. Shipping & Delivery</h2>

          <p className="text-gray-700">
            We currently deliver only within Nepal. Delivery times are
            estimates and may vary due to courier delays, weather conditions,
            public holidays, or other factors outside our control.
          </p>

          <p className="text-gray-700 mt-2">
            Customers are responsible for providing accurate delivery details.
            Monsoon Books is not responsible for delays or failed deliveries
            caused by incorrect information provided by the customer.
          </p>
        </div>

        {/* Returns */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            5. Returns & Refunds
          </h2>

          <p className="text-gray-700 mb-2">
            If you receive a damaged, defective, or incorrect book, please
            contact us within 7 days of delivery and provide photos of the
            issue.
          </p>

          <p className="text-gray-700 mb-2">
            Depending on the circumstances, we may offer:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Replacement of the item</li>
            <li>Store credit</li>
            <li>Refund</li>
          </ul>

          <p className="text-gray-700 mt-2">
            Books cannot generally be returned due to a change of mind after
            delivery unless otherwise approved by Monsoon Books.
          </p>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            6. Reviews & User Content
          </h2>

          <p className="text-gray-700 mb-2">
            Users may post reviews, ratings, and comments on books available on
            our website.
          </p>

          <p className="text-gray-700 mb-2">
            You agree not to submit content that:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Is false or misleading</li>
            <li>Is abusive, offensive, or defamatory</li>
            <li>Contains hate speech or discrimination</li>
            <li>Violates intellectual property rights</li>
            <li>Contains spam or promotional material</li>
          </ul>

          <p className="text-gray-700 mt-2">
            We reserve the right to remove any content that violates these
            guidelines or is otherwise inappropriate.
          </p>
        </div>

        {/* Intellectual Property */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            7. Intellectual Property
          </h2>

          <p className="text-gray-700">
            All content on Monsoon Books, including logos, graphics, website
            design, text, and software, is owned by or licensed to Monsoon
            Books and is protected by applicable intellectual property laws.
          </p>

          <p className="text-gray-700 mt-2">
            You may not reproduce, distribute, modify, or use our content
            without prior written permission.
          </p>
        </div>

        {/* Prohibited Activities */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            8. Prohibited Activities
          </h2>

          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Using the website for unlawful purposes</li>
            <li>Attempting unauthorized access to our systems</li>
            <li>Interfering with website operations</li>
            <li>Uploading malicious software or code</li>
            <li>Engaging in fraudulent transactions</li>
          </ul>
        </div>

        {/* Liability */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            9. Limitation of Liability
          </h2>

          <p className="text-gray-700">
            To the maximum extent permitted by law, Monsoon Books shall not be
            liable for indirect, incidental, or consequential damages arising
            from the use of our website or products.
          </p>

          <p className="text-gray-700 mt-2">
            Our total liability for any claim related to an order shall not
            exceed the amount paid for that order.
          </p>
        </div>

        {/* Updates */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            10. Changes to These Terms
          </h2>

          <p className="text-gray-700">
            We may update these Terms & Conditions from time to time. Any
            changes will be posted on this page with a revised update date.
            Continued use of the website after such changes constitutes your
            acceptance of the updated Terms.
          </p>
        </div>

        {/* Governing Law */}
        <div>
          <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>

          <p className="text-gray-700">
            These Terms & Conditions shall be governed by and interpreted in
            accordance with the laws of Nepal. Any disputes shall be subject to
            the jurisdiction of the courts of Nepal.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>

          <p className="text-gray-700">
            If you have any questions regarding these Terms & Conditions,
            please contact Monsoon Books through the contact information
            provided on our website.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;

