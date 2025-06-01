"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, Check, Star, Zap, Shield, Users, Clock, ChevronDown } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('automation');
  const [autoflowTab, setAutoflowTab] = useState('features');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pricingPlans = [
    {
      name: "AutoFlow Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started with automation",
      features: [
        "Up to 100 invoices/month",
        "Basic email automation",
        "5 client profiles",
        "Standard support",
        "Core integrations"
      ],
      popular: false,
      service: "automation"
    },
    {
      name: "AutoFlow Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses with advanced automation needs",
      features: [
        "Unlimited invoices",
        "Advanced AI workflows",
        "Unlimited clients",
        "Priority support",
        "All integrations",
        "Custom branding",
        "Analytics dashboard"
      ],
      popular: true,
      service: "automation"
    },
    {
      name: "Website Package",
      price: "$2,500",
      period: "",
      description: "Professional website design and development package",
      features: [
        "Custom design & development",
        "Up to 8 pages",
        "Mobile responsive",
        "SEO optimization",
        "Contact forms",
        "3 months support",
        "Training included"
      ],
      popular: false,
      service: "web"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white text-white dark:text-white text-gray-900 transition-colors duration-300">
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-950/95 dark:bg-gray-950/95 bg-white/95 backdrop-blur-md border-b border-gray-800 dark:border-gray-800 border-gray-200' 
          : 'bg-transparent'
      }`}>
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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white dark:text-white text-gray-900 font-semibold">Home</Link>
              <Link href="/services" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Services</Link>
              <Link href="/autoflow" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">AutoFlow</Link>
              <Link href="/pricing" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Pricing</Link>
              <Link href="/about" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">About</Link>
              <Link href="/contact" className="text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition">Contact</Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/autoflow" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/25">
                Try AutoFlow
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button 
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 dark:bg-gray-900 bg-gray-100 rounded-lg mb-4">
                <Link href="/" className="block px-3 py-2 text-white dark:text-white text-gray-900 font-semibold">Home</Link>
                <Link href="/services" className="block px-3 py-2 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900">Services</Link>
                <Link href="/autoflow" className="block px-3 py-2 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900">AutoFlow</Link>
                <Link href="/pricing" className="block px-3 py-2 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900">Pricing</Link>
                <Link href="/about" className="block px-3 py-2 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900">About</Link>
                <Link href="/contact" className="block px-3 py-2 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900">Contact</Link>
                <Link href="/autoflow" className="block px-3 py-2 text-blue-400 font-semibold">Try AutoFlow</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 text-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-5 opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Image
              src="/synchronisetech-logo.svg"
              alt="Synchronised Tech Logo"
              width={200}
              height={200}
              className="mx-auto mb-6 hover:scale-110 transition-transform duration-500"
              priority
            />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 dark:from-white dark:via-blue-100 dark:to-blue-300 from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent animate-slide-up">
            Synchronised Tech
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 dark:text-gray-300 text-gray-600 mb-4 max-w-3xl mx-auto animate-slide-up-delay">
            Automation Solutions & Web Development Services
          </p>
          
          <p className="text-lg text-gray-400 dark:text-gray-400 text-gray-500 mb-12 max-w-2xl mx-auto animate-slide-up-delay-2">
            From intelligent automation platforms to stunning websites, we help businesses scale efficiently and establish a powerful digital presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up-delay-3">
            <Link href="/autoflow" className="group px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center">
              Try AutoFlow
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="px-8 py-4 rounded-lg border-2 border-blue-500 text-blue-400 dark:text-blue-400 text-blue-600 hover:bg-blue-900/30 dark:hover:bg-blue-900/30 hover:bg-blue-50 font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              View Services
            </Link>
            <a href="#contact" className="text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 underline underline-offset-4 transition flex items-center">
              Get Quote <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 px-4 bg-gray-900 dark:bg-gray-900 bg-gray-100 border-y border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">500+</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Businesses Automated</div>
              <div className="w-12 h-1 bg-blue-400 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">99.9%</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Uptime Guarantee</div>
              <div className="w-12 h-1 bg-green-400 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">50%</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Time Saved on Average</div>
              <div className="w-12 h-1 bg-purple-400 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">24/7</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Expert Support</div>
              <div className="w-12 h-1 bg-orange-400 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-950 dark:bg-gray-950 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
              We specialize in two core areas: intelligent business automation and custom web development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AutoFlow Automation Service */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-700 dark:border-gray-700 border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600/30 transition-colors">
                  <Zap className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Business Automation</h3>
                <p className="text-lg text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                  Streamline your operations with our flagship AutoFlow platform and custom automation solutions.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>AutoFlow Platform (SaaS)</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Custom Workflow Automation</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Invoice & Payment Processing</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Email Marketing Automation</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>CRM & Client Management</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span>API Integrations & Webhooks</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/autoflow" className="group w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 text-center flex items-center justify-center">
                  Explore AutoFlow
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-center text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  Starting at $29/month • Free trial available
                </div>
              </div>
            </div>

            {/* Web Development Service */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-700 dark:border-gray-700 border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600/30 transition-colors">
                  <svg className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">Web Development</h3>
                <p className="text-lg text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                  Custom websites and web applications built with modern technologies and best practices.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Custom Website Design & Development</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>E-commerce Solutions</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>React, Next.js Applications</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Mobile-Responsive Design</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>SEO Optimization</span>
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Maintenance & Support</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a href="#contact" className="group w-full px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-semibold transition-all duration-300 text-center flex items-center justify-center text-white">
                  Get Custom Quote
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="text-center text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  Project-based pricing • Free consultation
                </div>
              </div>
            </div>
          </div>

          {/* Service Comparison */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Not sure which service you need?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-gray-800/50 dark:bg-gray-800/50 bg-gray-100/50 rounded-xl border border-gray-700/50 dark:border-gray-700/50 border-gray-300/50">
                <h4 className="text-lg font-semibold mb-3 text-blue-400">Choose AutoFlow if:</h4>
                <ul className="text-sm text-gray-300 dark:text-gray-300 text-gray-700 space-y-2 text-left">
                  <li>• You need to automate invoicing and payments</li>
                  <li>• You want to streamline client management</li>
                  <li>• You need email marketing automation</li>
                  <li>• You prefer a ready-to-use SaaS solution</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-800/50 dark:bg-gray-800/50 bg-gray-100/50 rounded-xl border border-gray-700/50 dark:border-gray-700/50 border-gray-300/50">
                <h4 className="text-lg font-semibold mb-3 text-green-400">Choose Web Development if:</h4>
                <ul className="text-sm text-gray-300 dark:text-gray-300 text-gray-700 space-y-2 text-left">
                  <li>• You need a custom website or web app</li>
                  <li>• You want a unique design and branding</li>
                  <li>• You need e-commerce functionality</li>
                  <li>• You require specific integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="py-20 px-4 bg-gray-900 dark:bg-gray-900 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">AutoFlow Platform</h2>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
              Our flagship automation platform designed to streamline your business operations and boost productivity.
            </p>
          </div>

          {/* AutoFlow Highlight with Interactive Demo */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 border border-gray-700 dark:border-gray-700 border-gray-200 shadow-2xl mb-12 hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  FLAGSHIP PRODUCT
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">AutoFlow</h3>
                <p className="text-xl text-gray-300 dark:text-gray-300 text-gray-700 mb-6">
                  Complete business automation platform that handles invoicing, email marketing, client management, and workflow orchestration.
                </p>
                
                {/* Interactive Feature Tabs */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['features', 'benefits', 'integrations'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAutoflowTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          autoflowTab === tab 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700/50 dark:bg-gray-700/50 bg-gray-200/50 text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-600/50 dark:hover:bg-gray-600/50 hover:bg-gray-300/50'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    {autoflowTab === 'features' && (
                      <div className="animate-in fade-in-50 duration-300">
                        {[
                          'Automated Invoice Generation & Payment Processing',
                          'Smart Email Campaigns with AI Optimization',
                          'Advanced Client Relationship Management',
                          'Custom Workflow Builder with Triggers'
                        ].map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700 group">
                            <Check className="w-5 h-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {autoflowTab === 'benefits' && (
                      <div className="animate-in fade-in-50 duration-300">
                        {[
                          'Save 10+ hours per week on manual tasks',
                          'Increase customer satisfaction by 40%',
                          'Reduce invoice processing time by 90%',
                          'Improve cash flow with automated reminders'
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700 group">
                            <Star className="w-5 h-5 text-yellow-400 mr-3 group-hover:scale-110 transition-transform" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {autoflowTab === 'integrations' && (
                      <div className="animate-in fade-in-50 duration-300">
                        {[
                          'Stripe, PayPal, and 50+ payment gateways',
                          'Slack, Teams, Discord for notifications',
                          'QuickBooks, Xero for accounting sync',
                          'Zapier for 1000+ app connections'
                        ].map((integration, idx) => (
                          <div key={idx} className="flex items-center text-gray-300 dark:text-gray-300 text-gray-700 group">
                            <Shield className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                            {integration}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/autoflow" className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 text-center flex items-center justify-center">
                    Explore AutoFlow
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-6 py-3 rounded-lg border border-blue-500 text-blue-400 dark:text-blue-400 text-blue-600 hover:bg-blue-900/30 dark:hover:bg-blue-900/30 hover:bg-blue-50 font-semibold transition-all duration-300">
                    Watch Demo
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="w-full max-w-md h-80 bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-600 dark:border-gray-600 border-gray-300 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/30 transition-colors">
                      <Zap className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="font-semibold text-gray-200 dark:text-gray-200 text-gray-800">AutoFlow Dashboard</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 text-gray-600">Interactive Demo Coming Soon</p>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-900 dark:bg-gray-900 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Transparent Pricing</h2>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. AutoFlow subscriptions or custom web development projects.
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-800/50 dark:bg-gray-800/50 bg-gray-200/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('automation')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'automation' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-gray-900'
                }`}
              >
                AutoFlow Pricing
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'web' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-gray-900'
                }`}
              >
                Web Development
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans
              .filter(plan => activeTab === 'automation' ? plan.service === 'automation' : plan.service === 'web')
              .map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/25'
                    : 'bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-200 hover:border-blue-500/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-400 dark:text-gray-400 text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-lg ml-1 ${plan.popular ? 'text-blue-100' : 'text-gray-400 dark:text-gray-400 text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${plan.popular ? 'text-blue-200' : plan.service === 'automation' ? 'text-blue-400' : 'text-green-400'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-gray-300 dark:text-gray-300 text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : plan.service === 'automation'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                }`}>
                  {plan.service === 'automation' ? 'Start Free Trial' : 'Get Quote'}
                </button>
              </div>
            ))}
            
            {/* Enterprise Option for Web Development */}
            {activeTab === 'web' && (
              <div className="bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-200 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-500 hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Custom Project</h3>
                  <p className="text-sm mb-6 text-gray-400 dark:text-gray-400 text-gray-600">
                    Large-scale applications and complex integrations
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">Custom</span>
                    <span className="text-lg ml-1 text-gray-400 dark:text-gray-400 text-gray-600">Quote</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Complex web applications",
                    "E-commerce platforms",
                    "Custom integrations",
                    "Database design",
                    "API development",
                    "Ongoing maintenance",
                    "Dedicated project manager"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-5 h-5 mr-3 text-green-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300 text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white">
                  Discuss Project
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            {activeTab === 'automation' ? (
              <>
                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">
                  All AutoFlow plans include a 14-day free trial. No credit card required.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 text-gray-700">
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    SSL Encrypted
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    Unlimited Users
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    24/7 Support
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">
                  All web development projects include free consultation and detailed project planning.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 text-gray-700">
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Mobile Responsive
                  </span>
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    SEO Optimized
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    3 Months Support
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 bg-gray-900 dark:bg-gray-900 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">Why Choose Synchronised Tech?</h3>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with deep business expertise to deliver solutions that actually work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                <Zap className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Automation-First Design</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">Built from the ground up to eliminate manual work and automate your most time-consuming business processes.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Scalable Infrastructure</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">From startups to enterprises, our cloud-native architecture grows with your business needs seamlessly.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600/30 transition-colors">
                <Shield className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Enterprise Security</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">Bank-level encryption, SOC 2 compliance, and 99.9% uptime SLA to keep your business running securely.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-600/30 transition-colors">
                <svg className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">AI-Powered Intelligence</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">Machine learning algorithms optimize your workflows and provide actionable insights to grow your business.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-colors">
                <Clock className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-semibold mb-3">24/7 Expert Support</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">Our dedicated support team and comprehensive documentation ensure you're never stuck or alone.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-700 from-white to-gray-50 rounded-xl p-8 border border-gray-600 dark:border-gray-600 border-gray-200 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-600/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Seamless Integrations</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600">Connect with 1000+ apps and services through our API-first approach and pre-built integrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 px-4 bg-gray-950 dark:bg-gray-950 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">What Our Clients Say</h3>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600">Real results from real businesses using Synchronised Tech solutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:scale-105 transition-all duration-300 group">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <p className="text-gray-300 dark:text-gray-300 text-gray-700 mb-6">"AutoFlow saved us 20+ hours per week on manual invoice processing. The ROI was immediate and the support team is outstanding."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah Mitchell</div>
                  <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">CEO, TechStart Solutions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:scale-105 transition-all duration-300 group">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <p className="text-gray-300 dark:text-gray-300 text-gray-700 mb-6">"The automation workflows are incredibly powerful. We've streamlined our entire client onboarding process and improved satisfaction scores."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">DL</span>
                </div>
                <div>
                  <div className="font-semibold">David Liu</div>
                  <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Operations Director, CloudScale Inc</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:scale-105 transition-all duration-300 group">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <p className="text-gray-300 dark:text-gray-300 text-gray-700 mb-6">"Migration was seamless and the platform intuitive. Our email conversion rates increased by 40% in the first month."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">AR</span>
                </div>
                <div>
                  <div className="font-semibold">Anna Rodriguez</div>
                  <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Marketing Manager, GrowthLab</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <section id="about" className="py-20 px-4 bg-gray-900 dark:bg-gray-900 bg-gray-100 border-t border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">About Synchronised Tech</h3>
          <div className="space-y-6 text-lg text-gray-300 dark:text-gray-300 text-gray-700">
            <p>
              Founded with a mission to democratize business automation, Synchronised Tech empowers companies of all sizes to harness the power of intelligent workflows and AI-driven insights.
            </p>
            <p>
              Our team of seasoned engineers, product experts, and automation specialists work tirelessly to create solutions that don't just solve today's problems, but anticipate tomorrow's challenges.
            </p>
            <p>
              From our flagship AutoFlow platform to custom enterprise solutions, we're committed to helping businesses work smarter, scale faster, and achieve sustainable growth through the power of synchronised technology.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">2020</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600">Founded</div>
              <div className="w-16 h-1 bg-blue-400 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">500+</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600">Happy Clients</div>
              <div className="w-16 h-1 bg-green-400 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">15+</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600">Team Members</div>
              <div className="w-16 h-1 bg-purple-400 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-950 dark:bg-gray-950 bg-white border-t border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h3>
            <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
              Get started with a free consultation and see how Synchronised Tech can streamline your operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Contact Form */}
            <div className="bg-gray-900 dark:bg-gray-900 bg-gray-50 rounded-xl p-8 border border-gray-800 dark:border-gray-800 border-gray-200 hover:shadow-2xl transition-all duration-500">
              <h4 className="text-2xl font-bold mb-6">Send us a message</h4>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <input 
                  type="text" 
                  placeholder="Company (Optional)" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <textarea 
                  placeholder="Tell us about your automation needs..." 
                  rows={4} 
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 bg-white border border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                ></textarea>
                <button 
                  type="submit" 
                  className="group w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
            
            {/* Enhanced Contact Info */}
            <div className="space-y-8">
              <div>
                <h4 className="text-2xl font-bold mb-6">Get in touch</h4>
                <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-lg mb-8">
                  Ready to revolutionize your business processes? We're here to help you every step of the way.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors">
                    <svg className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Email</h5>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">hello@synchronisedtech.com</p>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">support@synchronisedtech.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-colors">
                    <Clock className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Response Time</h5>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">&lt; 24 hours for general inquiries</p>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">&lt; 4 hours for support requests</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                    <svg className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Live Chat</h5>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">Available 9 AM - 6 PM PST</p>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600">Monday through Friday</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/autoflow" className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 text-center flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-6 py-3 rounded-lg border border-gray-600 dark:border-gray-600 border-gray-300 text-gray-300 dark:text-gray-300 text-gray-700 hover:border-gray-500 hover:text-white dark:hover:text-white hover:text-gray-900 font-semibold transition-all duration-300">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-950 dark:bg-gray-950 bg-gray-100 border-t border-gray-800 dark:border-gray-800 border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4 group">
                <Image
                  src="/synchronisetech-logo.svg"
                  alt="Synchronised Tech"
                  width={32}
                  height={32}
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-lg font-bold">Synchronised Tech</span>
              </div>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">
                Empowering businesses with intelligent automation and AI-driven insights.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                <li><a href="#services" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">All Services</a></li>
                <li><Link href="/autoflow" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">AutoFlow Platform</Link></li>
                <li><a href="#contact" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Web Development</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Custom Automation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">AutoFlow</h5>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                <li><Link href="/autoflow" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Dashboard</Link></li>
                <li><a href="#products" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Features</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                <li><a href="#about" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">About</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Careers</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Blog</a></li>
                <li><a href="#contact" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Status</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-white hover:text-gray-900 transition">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-800 border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Synchronised Tech. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 text-sm transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 text-sm transition">Terms of Service</a>
              <a href="#" className="text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 text-sm transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
