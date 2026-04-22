"use client";

import LegalLayout from "@/components/layout/LegalLayout";

export default function TermsOfUsePage() {
  return (
    <LegalLayout title="Terms of Use">
      <div className="space-y-12">
        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Agreement to Terms</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              By accessing or using the DSK website, you agree to be bound by these Terms of Use and 
              all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Intellectual Property Rights</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              The content on this website, including but not limited to text, graphics, logos, images, 
              and software, is the property of DSK or its content suppliers and is protected by 
              intellectual property laws. You may not reproduce, distribute, or create derivative 
              works from any content without our express written permission.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Use License</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              Permission is granted to temporarily download one copy of the materials on DSK's 
              website for personal, non-commercial transitory viewing only. This is the grant of 
              a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose or public display.</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Disclaimer</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              The materials on DSK's website are provided on an 'as is' basis. DSK makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other 
              warranties including, without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of 
              intellectual property or other violation of rights.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Limitation of Liability</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              In no event shall DSK or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on DSK's website.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Governing Law</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              These terms and conditions are governed by and construed in accordance with the 
              laws of India and you irrevocably submit to the exclusive jurisdiction of the 
              courts in that State or location.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
