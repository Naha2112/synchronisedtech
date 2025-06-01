"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started with automation",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        "Up to 5 automated workflows",
        "500 emails per month",
        "Basic client management",
        "Email support",
        "Standard integrations",
        "Monthly usage reports"
      ],
      highlighted: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses that need advanced automation",
      monthlyPrice: 79,
      annualPrice: 65,
      features: [
        "Unlimited automated workflows",
        "5,000 emails per month",
        "Advanced client management",
        "Priority support",
        "Premium integrations",
        "AI-powered optimizations",
        "Custom workflow templates",
        "Advanced analytics",
        "Team collaboration tools"
      ],
      highlighted: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      description: "For large organizations requiring custom solutions",
      monthlyPrice: 199,
      annualPrice: 165,
      features: [
        "Unlimited everything",
        "Unlimited emails",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced AI features",
        "Custom workflow builder",
        "Real-time analytics",
        "SSO & advanced security",
        "API access",
        "Custom training sessions"
      ],
      highlighted: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/synchronisetech-logo.svg"
                alt="Synchronised Tech"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold">Synchronised Tech</span>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <Link href="/products" className="text-gray-300 hover:text-white transition">Products</Link>
              <Link href="/pricing" className="text-white font-semibold">Pricing</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Link href="/autoflow" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold transition">
                Try AutoFlow
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your business. Start with a 14-day free trial, no credit card required.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Annual 
              <span className="text-green-400 text-sm ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-8 border ${
                  plan.highlighted
                    ? 'border-blue-500 bg-gradient-to-b from-blue-900/20 to-gray-900 shadow-2xl shadow-blue-500/20'
                    : 'border-gray-800 bg-gray-900'
                } transition-all duration-300 hover:scale-105`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  
                  {isAnnual && (
                    <p className="text-sm text-green-400">
                      ${(plan.monthlyPrice - plan.annualPrice) * 12} saved annually
                    </p>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Compare All Features</h2>
            <p className="text-xl text-gray-400">See what's included in each plan</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-950 rounded-xl border border-gray-800">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-6 text-gray-400">Feature</th>
                  <th className="text-center p-6">Starter</th>
                  <th className="text-center p-6 bg-blue-900/20">Professional</th>
                  <th className="text-center p-6">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Automated Workflows</td>
                  <td className="text-center p-6 text-gray-400">Up to 5</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">Unlimited</td>
                  <td className="text-center p-6 text-green-400">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Monthly Emails</td>
                  <td className="text-center p-6 text-gray-400">500</td>
                  <td className="text-center p-6 bg-blue-900/20 text-gray-300">5,000</td>
                  <td className="text-center p-6 text-green-400">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Client Management</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓ Advanced</td>
                  <td className="text-center p-6 text-green-400">✓ Advanced</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">AI Optimizations</td>
                  <td className="text-center p-6 text-gray-500">✗</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓</td>
                  <td className="text-center p-6 text-green-400">✓ Advanced</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Priority Support</td>
                  <td className="text-center p-6 text-gray-500">✗</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓</td>
                  <td className="text-center p-6 text-green-400">✓ Dedicated</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">API Access</td>
                  <td className="text-center p-6 text-gray-500">✗</td>
                  <td className="text-center p-6 bg-blue-900/20 text-gray-500">✗</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">White-label Solutions</td>
                  <td className="text-center p-6 text-gray-500">✗</td>
                  <td className="text-center p-6 bg-blue-900/20 text-gray-500">✗</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Everything you need to know about our pricing</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-gray-400">Absolutely! We offer a 14-day free trial for all plans. No credit card required to get started.</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice.</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Do you offer custom pricing for large teams?</h3>
              <p className="text-gray-400">Yes! For teams with 50+ users or special requirements, we offer custom pricing and features. Contact our sales team for details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses already automating their workflows with Synchronised Tech.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/autoflow" className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-900/30 font-semibold text-lg transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/synchronisetech-logo.svg"
                  alt="Synchronised Tech"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-lg font-bold">Synchronised Tech</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering businesses with intelligent automation and AI-driven insights.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/autoflow" className="hover:text-white transition">AutoFlow</Link></li>
                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Synchronised Tech. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 