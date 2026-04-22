"use client";

import LegalLayout from "@/components/layout/LegalLayout";
import { useState } from "react";

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Cannot toggle essential cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <LegalLayout title="Cookie Settings">
      <div className="space-y-12">
        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Cookie Preferences</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed mb-10">
            <p>
              We use cookies to enhance your browsing experience, serve personalized ads or content, 
              and analyze our traffic. By clicking "Save Preferences", you consent to our use of cookies.
            </p>
          </div>

          <div className="space-y-6">
            <CookieItem 
              title="Essential Cookies" 
              description="These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services."
              enabled={preferences.essential}
              locked={true}
              onToggle={() => togglePreference('essential')}
            />
            <CookieItem 
              title="Functional Cookies" 
              description="These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages."
              enabled={preferences.functional}
              onToggle={() => togglePreference('functional')}
            />
            <CookieItem 
              title="Analytics Cookies" 
              description="These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular."
              enabled={preferences.analytics}
              onToggle={() => togglePreference('analytics')}
            />
            <CookieItem 
              title="Marketing Cookies" 
              description="These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites."
              enabled={preferences.marketing}
              onToggle={() => togglePreference('marketing')}
            />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button className="btn-primary">
              Save Preferences
            </button>
            <button className="btn-ghost" onClick={() => setPreferences({ essential: true, functional: true, analytics: true, marketing: true })}>
              Accept All
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">What are cookies?</h2>
          <div className="space-y-4 text-hp-gray font-light leading-relaxed">
            <p>
              Cookies are small text files that are used to store small pieces of information. They 
              are stored on your device when the website is loaded on your browser. These cookies 
              help us make the website function properly, make it more secure, provide better 
              user experience, and understand how the website performs.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}

function CookieItem({ 
  title, 
  description, 
  enabled, 
  onToggle, 
  locked = false 
}: { 
  title: string; 
  description: string; 
  enabled: boolean; 
  onToggle: () => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 p-6 border border-hp-light bg-hp-cream/30">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-hp-black">{title}</h3>
        <p className="text-xs text-hp-gray leading-relaxed max-w-xl">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        disabled={locked}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-hp-blue' : 'bg-hp-light'} ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
