"use client";

import LegalLayout from "@/components/layout/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-12">
        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Introduction</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              At DSK, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when 
              you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Information We Collect</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which 
              we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Identity Data includes first name, last name, username or similar identifier.</li>
              <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
              <li>Financial Data includes payment card details.</li>
              <li>Transaction Data includes details about payments to and from you and other details of products you have purchased from us.</li>
              <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">How We Use Your Data</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will 
              use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Data Security</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              We have put in place appropriate security measures to prevent your personal data from 
              being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
              In addition, we limit access to your personal data to those employees, agents, contractors 
              and other third parties who have a business need to know.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Contact Us</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              If you have any questions about this privacy policy or our privacy practices, please 
              contact our concierge team at DSK5576@GMAIL.COM.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
