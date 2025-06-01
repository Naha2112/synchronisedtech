"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Mail, Zap, Users, TrendingUp, Clock, Sparkles, Star } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-950/90 backdrop-blur-xl border-b border-gray-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="relative">
                <Image
                  src="/synchronisetech-logo.svg"
                  alt="Synchronised Tech"
                  width={40}
                  height={40}
                  className="mr-3 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold group-hover:text-blue-300 transition-colors">AutoFlow</span>
              <span className="ml-2 px-3 py-1 text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm">
                by Synchronised Tech
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Synchronised Tech
              </Link>
              <Link href="/autoflow" className="text-white font-semibold hover:text-blue-300 transition-colors">AutoFlow</Link>
              <Link href="/autoflow/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Support</Link>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Link href="/autoflow/dashboard" className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/80 backdrop-blur-xl rounded-2xl mb-4 border border-gray-700/50">
                <Link href="/" className="block px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-gray-700/50 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Synchronised Tech
                </Link>
                <Link href="/autoflow" className="block px-4 py-3 text-white font-semibold rounded-xl hover:bg-gray-700/50 transition-colors">AutoFlow</Link>
                <Link href="/autoflow/dashboard" className="block px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-gray-700/50 transition-colors">Dashboard</Link>
                <Link href="/pricing" className="block px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-gray-700/50 transition-colors">Pricing</Link>
                <Link href="/contact" className="block px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-gray-700/50 transition-colors">Support</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 text-center relative">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-8 group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-blue-500/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-10 h-10 text-blue-400" />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent animate-slide-up leading-tight">
                Automate Your Business
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-6 animate-slide-up-delay">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-300 font-medium">Trusted by 100+ businesses</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto animate-slide-up-delay font-medium">
            Streamline invoicing, email campaigns, and client management with 
            <span className="text-blue-400 font-semibold"> intelligent automation</span>
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up-delay-2">
            Save hours every week with automated workflows, smart email templates, and professional invoice generation. 
            Focus on growing your business while AutoFlow handles the rest.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up-delay-3">
            <Link href="/autoflow/dashboard" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <button className="px-8 py-4 rounded-xl border-2 border-blue-500/50 text-blue-300 hover:bg-blue-900/30 hover:border-blue-400 font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-gray-500 text-sm mb-4">No credit card required • 14-day free trial • Cancel anytime</p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-400 text-sm font-medium">Invoices Generated</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-gray-400 text-sm font-medium">Time Saved</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-gray-400 text-sm font-medium">Automation Running</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
              <div className="text-gray-400 text-sm font-medium">Happy Businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to automate your business operations and boost productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature Cards with enhanced styling */}
            {[
              {
                icon: FileText,
                title: "Smart Invoicing",
                description: "Create professional invoices with automated calculations, tax handling, and payment tracking.",
                features: ["Auto-generated invoice numbers", "Recurring invoice scheduling", "Payment status tracking"],
                gradient: "from-blue-600/20 to-cyan-600/20",
                borderGradient: "from-blue-500/50 to-cyan-500/50",
                iconBg: "from-blue-500/30 to-cyan-500/30"
              },
              {
                icon: Mail,
                title: "Email Campaigns",
                description: "Design beautiful email templates and automate your marketing campaigns with smart triggers.",
                features: ["Custom email templates", "Scheduled email sequences", "Performance analytics"],
                gradient: "from-purple-600/20 to-pink-600/20",
                borderGradient: "from-purple-500/50 to-pink-500/50",
                iconBg: "from-purple-500/30 to-pink-500/30"
              },
              {
                icon: Users,
                title: "Client Management",
                description: "Organize your clients, track interactions, and manage bookings all in one place.",
                features: ["Client database & profiles", "Booking management", "Communication history"],
                gradient: "from-green-600/20 to-emerald-600/20",
                borderGradient: "from-green-500/50 to-emerald-500/50",
                iconBg: "from-green-500/30 to-emerald-500/30"
              },
              {
                icon: Zap,
                title: "Workflow Builder",
                description: "Create custom automation workflows with triggers, conditions, and actions.",
                features: ["Drag & drop workflow builder", "Smart triggers & conditions", "Real-time monitoring"],
                gradient: "from-yellow-600/20 to-orange-600/20",
                borderGradient: "from-yellow-500/50 to-orange-500/50",
                iconBg: "from-yellow-500/30 to-orange-500/30"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Reports",
                description: "Get insights into your business performance with detailed analytics and reports.",
                features: ["Revenue tracking", "Email performance metrics", "Custom dashboard widgets"],
                gradient: "from-indigo-600/20 to-blue-600/20",
                borderGradient: "from-indigo-500/50 to-blue-500/50",
                iconBg: "from-indigo-500/30 to-blue-500/30"
              },
              {
                icon: Clock,
                title: "Time Optimization",
                description: "Eliminate repetitive tasks and focus on what matters most for your business growth.",
                features: ["Automated task scheduling", "Smart reminders & alerts", "Bulk operations support"],
                gradient: "from-red-600/20 to-pink-600/20",
                borderGradient: "from-red-500/50 to-pink-500/50",
                iconBg: "from-red-500/30 to-pink-500/30"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className={`relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gradient-to-r hover:${feature.borderGradient} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 border border-gray-600/30 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-300">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Join hundreds of businesses already using AutoFlow to save time, reduce errors, and scale efficiently.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link href="/autoflow/dashboard" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center backdrop-blur-sm">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/contact" className="px-10 py-4 rounded-xl border-2 border-blue-500/50 text-blue-300 hover:bg-blue-900/30 hover:border-blue-400 font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20">
              Contact Sales
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">No credit card required • 14-day free trial • Cancel anytime</p>
            <div className="flex items-center justify-center gap-8 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-t border-gray-700/50 py-16 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0 group">
              <div className="relative">
                <Image
                  src="/synchronisetech-logo.svg"
                  alt="Synchronised Tech"
                  width={40}
                  height={40}
                  className="mr-3 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-xl font-bold group-hover:text-blue-300 transition-colors">AutoFlow</span>
                <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">by Synchronised Tech</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 text-gray-400 text-sm">
              <Link href="/" className="hover:text-white transition-colors hover:underline flex items-center gap-1 font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Synchronised Tech
              </Link>
              <Link href="/autoflow" className="hover:text-white transition-colors hover:underline">AutoFlow</Link>
              <Link href="/pricing" className="hover:text-white transition-colors hover:underline">Pricing</Link>
              <Link href="/about" className="hover:text-white transition-colors hover:underline">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors hover:underline">Contact</Link>
              <Link href="/autoflow/dashboard" className="hover:text-white transition-colors hover:underline">Dashboard</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Synchronised Technology. All rights reserved. Made with ❤️ for growing businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
