"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check, Star, Zap, Shield, Users, Clock, ChevronDown, Code, Palette, Smartphone, Search, Globe, Wrench } from "lucide-react";

export default function Services() {
  const [activeService, setActiveService] = useState('automation');

  const automationFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AutoFlow Platform",
      description: "Complete SaaS solution for business automation",
      features: ["Invoice automation", "Payment processing", "Client management", "Email campaigns"]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Custom Workflows",
      description: "Tailored automation solutions for your specific needs",
      features: ["Process automation", "Data synchronization", "API integrations", "Trigger-based actions"]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Integration",
      description: "Seamless integration with your existing systems",
      features: ["CRM integration", "Accounting software sync", "Third-party APIs", "Webhook management"]
    }
  ];

  const webDevFeatures = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Custom Development",
      description: "Bespoke websites and web applications",
      features: ["React/Next.js", "Custom functionality", "Database design", "API development"]
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design & UX",
      description: "Beautiful, user-friendly interfaces",
      features: ["Custom design", "Brand identity", "User experience", "Interactive elements"]
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Responsive & Fast",
      description: "Optimized for all devices and search engines",
      features: ["Mobile responsive", "SEO optimization", "Performance tuning", "Analytics setup"]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white text-white dark:text-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/95 dark:bg-gray-950/95 bg-white/95 backdrop-blur-md border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/synchronisetech-logo.svg"
                alt="Synchronised Tech"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold">Synchronised Tech</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Home</Link>
              <Link href="/services" className="text-white dark:text-white text-gray-900 font-semibold">Services</Link>
              <Link href="/autoflow" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">AutoFlow</Link>
              <Link href="/pricing" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Pricing</Link>
              <Link href="/about" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">About</Link>
              <Link href="/contact" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Contact</Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/autoflow" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/25">
                Try AutoFlow
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 from-gray-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 dark:from-white dark:via-blue-100 dark:to-blue-300 from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-300 text-gray-600 mb-8 max-w-2xl mx-auto">
            We specialize in two core areas: intelligent business automation and custom web development. 
            Choose the service that best fits your needs.
          </p>
          
          {/* Service Toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-800/50 dark:bg-gray-800/50 bg-gray-200/50 rounded-lg p-1">
              <button
                onClick={() => setActiveService('automation')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeService === 'automation' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-gray-900'
                }`}
              >
                Business Automation
              </button>
              <button
                onClick={() => setActiveService('webdev')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeService === 'webdev' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-gray-900'
                }`}
              >
                Web Development
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {activeService === 'automation' ? (
            <div>
              {/* Automation Service */}
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business Automation</h2>
                <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
                  Streamline your operations with our flagship AutoFlow platform and custom automation solutions. 
                  Save time, reduce errors, and scale your business efficiently.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {automationFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6 text-blue-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300 dark:text-gray-300 text-gray-700">
                          <Check className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* AutoFlow Highlight */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 border border-gray-700 dark:border-gray-700 border-gray-200 mb-12">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1">
                    <div className="inline-flex items-center bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <Star className="w-4 h-4 mr-2" />
                      FLAGSHIP PRODUCT
                    </div>
                    <h3 className="text-3xl font-bold mb-4">AutoFlow Platform</h3>
                    <p className="text-lg text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                      Our complete SaaS automation platform handles invoicing, email marketing, client management, 
                      and workflow orchestration in one integrated solution.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {[
                        "Automated invoicing & payments",
                        "Email marketing campaigns", 
                        "Client relationship management",
                        "Custom workflow builder",
                        "Real-time analytics",
                        "50+ integrations"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                          <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/autoflow" className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 text-center flex items-center justify-center">
                        Try AutoFlow Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/pricing" className="px-6 py-3 rounded-lg border border-blue-500 text-blue-400 dark:text-blue-400 text-blue-600 hover:bg-blue-900/30 dark:hover:bg-blue-900/30 hover:bg-blue-50 font-semibold transition-all duration-300 text-center">
                        View Pricing
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md h-80 bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-600 dark:border-gray-600 border-gray-300">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="font-semibold text-gray-200 dark:text-gray-200 text-gray-800">AutoFlow Dashboard</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 text-gray-600">Live Demo Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Web Development Service */}
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Web Development</h2>
                <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
                  Custom websites and web applications built with modern technologies and best practices. 
                  From simple websites to complex e-commerce platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {webDevFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 text-green-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300 dark:text-gray-300 text-gray-700">
                          <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Web Development Packages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-700 dark:border-gray-700 border-gray-200">
                  <div className="inline-flex items-center bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <Globe className="w-4 h-4 mr-2" />
                    STANDARD PACKAGE
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Website Package</h3>
                  <p className="text-lg text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                    Perfect for businesses that need a professional online presence with modern design and functionality.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      "Custom design & development",
                      "Up to 8 pages",
                      "Mobile responsive design",
                      "SEO optimization",
                      "Contact forms",
                      "3 months support included"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-4">$2,500</div>
                  <Link href="/contact" className="block w-full px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-semibold transition-all duration-300 text-center text-white">
                    Get Quote
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-700 dark:border-gray-700 border-gray-200">
                  <div className="inline-flex items-center bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <Wrench className="w-4 h-4 mr-2" />
                    CUSTOM PROJECT
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Custom Development</h3>
                  <p className="text-lg text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                    For complex applications, e-commerce platforms, and unique business requirements that need tailored solutions.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      "Complex web applications",
                      "E-commerce platforms",
                      "Custom integrations",
                      "Database design",
                      "API development", 
                      "Dedicated project manager"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                        <Check className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-4">Custom Quote</div>
                  <Link href="/contact" className="block w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold transition-all duration-300 text-center text-white">
                    Discuss Project
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center bg-gray-900/50 dark:bg-gray-900/50 bg-gray-100/50 rounded-2xl p-12 border border-gray-800/50 dark:border-gray-800/50 border-gray-200/50">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-gray-400 dark:text-gray-400 text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you need automation solutions or a new website, we're here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="group px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-white">
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 rounded-lg border-2 border-blue-500 text-blue-400 dark:text-blue-400 text-blue-600 hover:bg-blue-900/30 dark:hover:bg-blue-900/30 hover:bg-blue-50 font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                View All Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 