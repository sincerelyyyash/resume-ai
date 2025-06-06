import { Metadata } from "next";
import MotionDiv from "@/components/motion-div";

export const metadata: Metadata = {
  title: 'Privacy Policy | Resume AI',
  description: 'Privacy Policy for Resume AI - Learn how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, personal information, resume data security',
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <MotionDiv
        >
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
            Privacy Policy for resume-ai.in
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Effective Date: June 6, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Introduction</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome to Resume AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website, resume-ai.in, and its related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">1. Information We Collect</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              We collect different types of information to provide and improve our Service to you.
            </p>

            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">A. Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Account Information:</strong> When you create an account, we collect information such as your name, email address, and a hashed password.
              </li>
              <li>
                <strong>Resume Content:</strong> To use our AI resume builder, you will provide detailed personal and professional information. This is highly sensitive data and may include, but is not limited to:
                <ul className="list-disc pl-6 mt-2">
                  <li>Contact Details (name, phone number, address, LinkedIn profile)</li>
                  <li>Work Experience (job titles, employers, dates, responsibilities)</li>
                  <li>Education History (degrees, institutions, dates)</li>
                  <li>Skills, Certifications, and Qualifications</li>
                  <li>Any other information you choose to include in your resume</li>
                </ul>
              </li>
              <li>
                <strong>Payment Information:</strong> If you subscribe to a paid plan, our third-party payment processor (e.g., Stripe, Razorpay) will collect your payment card information. We do not store your full credit card details on our servers.
              </li>
              <li>
                <strong>Communications:</strong> If you contact us for support or other inquiries, we will collect the information you provide in your communications.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mt-6 mb-3">B. Information We Collect Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our Service. This may include your IP address, browser type, device information, operating system, pages viewed, the time and date of your visit, and the time spent on those pages.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>To Provide and Maintain the Service: To create, manage, and secure your account, and to enable you to build, edit, and store your resumes.</li>
              <li>To Generate and Optimize Your Resume: Your resume content is processed by our proprietary and third-party AI models to generate text, suggest improvements, and format your resume for ATS (Applicant Tracking System) compatibility.</li>
              <li>To Process Transactions: To process payments for our subscription services.</li>
              <li>To Communicate with You: To send you service-related announcements, updates, security alerts, and provide customer support.</li>
              <li>For Security and Fraud Prevention: To detect and prevent fraudulent activities and protect our users.</li>
              <li>For Analytics and Improvement: To analyze usage patterns and trends to improve our Service and enhance user experience.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">3. How We Share Your Information</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              We do not sell your personal data. We only share your information in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Third-Party AI Providers:</strong> To provide the core AI functionality of our Service, we send the resume content you provide to our third-party AI service providers (such as OpenAI, Google AI, or others) through a secure API.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors and service providers who perform services on our behalf, such as web hosting, payment processing, analytics, and customer support. These providers only have access to the information necessary to perform their functions and are obligated to protect your data.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your personal information may be transferred. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">4. Data Security</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We implement a variety of reasonable security measures to protect the security and integrity of your personal information. Access to personal data is restricted to authorized personnel who need it to perform their job functions.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              Please note that while we strive to use commercially acceptable means to protect your Personal Information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">5. Data Retention</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We will retain your personal information for as long as your account is active or as needed to provide you with the Service. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. You can delete your account and associated data at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">6. Your Rights and Choices</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              You have certain rights regarding the personal information we hold about you.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Access and Correction:</strong> You can access, review, and update your account and resume information at any time by logging into your account.
              </li>
              <li>
                <strong>Deletion:</strong> You can delete your account and all associated resume data directly from your account settings. When you delete your account, your data is permanently removed from our production systems.
              </li>
              <li>
                <strong>Object to Processing:</strong> You have the right to object to our processing of your personal data, such as for marketing purposes. You can opt-out of marketing communications by using the &quot;unsubscribe&quot; link in our emails.
              </li>
              <li>
                <strong>Cookies:</strong> You can manage your cookie preferences through your browser settings.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Our Service is not intended for use by anyone under the age of 16 (&quot;Children&quot;). We do not knowingly collect personally identifiable information from children under 16. If you are a parent or guardian and you are aware that your Child has provided us with Personal Information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot; at the top. We may also notify you via email or through a prominent notice on our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">9. Contact Us</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              If you have any questions about this Privacy Policy, please contact at:{' '}
              <a 
                href="mailto:yashthakur0526@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                yashthakur0526@gmail.com
              </a>
            </p>
          </section>
        </MotionDiv>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 