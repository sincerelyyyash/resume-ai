import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Resume AI',
  description: 'Terms of Service for Resume AI - Your AI-powered resume builder',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">Effective Date: June 6, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome to Resume AI ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, `resume-ai.in`, and all related tools, features, and services (collectively, the "Service").
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              By creating an account, accessing, or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">2. Description of Service</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              The Service is an online platform that uses artificial intelligence to help users create, edit, and optimize resumes. The Service provides AI-generated content suggestions, formatting tools, and analysis to assist in the resume-building process.
            </p>
            <div className="bg-blue-900 p-4 rounded-lg mt-4">
              <p className="text-white dark:text-white font-medium">Important Disclaimer:</p>
              <p className="text-white dark:text-white mt-2">
                The Service is a tool designed to assist you. We do not guarantee employment, job interviews, job offers, or any specific career outcome. The AI-generated content is provided as a suggestion and a starting point. You are solely responsible for reviewing, editing, and verifying all information on your final resume for accuracy, completeness, and professionalism.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">3. Account Registration and Security</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">To use most features of the Service, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Provide true, accurate, current, and complete information about yourself as prompted by the registration form.</li>
              <li>Maintain and promptly update your account information to keep it accurate.</li>
              <li>Be responsible for all activities that occur under your account.</li>
              <li>Keep your password confidential and secure. You must notify us immediately of any unauthorized use of your account or any other breach of security.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">4. User Content and Intellectual Property</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Your Ownership:</h3>
                <p>You retain full ownership of the personal and professional information you provide to the Service ("User Content"). You also retain full ownership and copyright of the final resume documents you create using the Service.</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Our License to Your Content:</h3>
                <p>To provide the Service, you grant us a limited, non-exclusive, royalty-free, worldwide license to use, process, store, and display your User Content solely for the purpose of operating, providing, and improving the Service for you. This license ends when you delete your User Content or your account.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">5. Subscriptions, Payments, and Refunds</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Paid Services:</h3>
                <p>Certain features of the Service may be subject to payments now or in the future ("Paid Services").</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Billing:</h3>
                <p>We use a third-party payment processor to bill you through a payment account linked to your account. The processing of payments will be subject to the terms, conditions, and privacy policies of the payment processor in addition to these Terms.</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Refund Policy:</h3>
                <p>All payments for subscriptions are non-refundable, and we do not provide refunds or credits for any partial subscription periods or unused services. We encourage you to use any free trial or free version of the service to determine if it is right for you before purchasing a subscription.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">6. Prohibited Conduct</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Upload or generate any content that is unlawful, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.</li>
              <li>Violate any applicable local, state, national, or international law.</li>
              <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
              <li>Upload any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware.</li>
              <li>Attempt to decompile, reverse engineer, or otherwise attempt to obtain the source code of the Service.</li>
              <li>Use the Service to create false, misleading, or fraudulent documents or information.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">7. Termination</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              You may terminate your account at any time by using the account deletion feature within the Service. Upon termination, your right to use the Service will immediately cease, and we will delete your data in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no warranty that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">9. Limitation of Liability</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              To the fullest extent permitted by applicable law, in no event shall Resume AI, its affiliates, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              Our total liability to you for any and all claims arising out of your use of the Service shall not exceed the amount you have paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">10. Indemnification</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              You agree to defend, indemnify, and hold harmless Resume AI and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service, or a breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">11. Governing Law</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">12. Changes to Terms</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">13. Contact Us</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              If you have any questions about these Terms, please contact at{' '}
              <a href="mailto:yashthakur0526@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                yashthakur0526@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 