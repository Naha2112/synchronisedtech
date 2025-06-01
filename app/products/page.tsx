"use client";

import Link from "next/link";
import Image from "next/image";

export default function Products() {
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
              <Link href="/products" className="text-white font-semibold">Products</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
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
            Our Products
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive automation solutions designed to transform your business operations and accelerate growth
          </p>
        </div>
      </section>

      {/* AutoFlow - Main Product */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🚀 FLAGSHIP PRODUCT
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">AutoFlow</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The complete business automation platform that handles everything from client management to invoicing, email marketing, and complex workflow orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6">Automate Your Entire Business</h3>
              <p className="text-lg text-gray-300 mb-8">
                AutoFlow is more than just a tool—it's a complete business transformation platform that eliminates manual work and scales your operations intelligently.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Smart Workflow Engine</h4>
                    <p className="text-gray-400">Build complex automation workflows with our visual drag-and-drop interface. No coding required.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI-Powered Optimization</h4>
                    <p className="text-gray-400">Machine learning algorithms continuously optimize your workflows for maximum efficiency and ROI.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">1000+ Integrations</h4>
                    <p className="text-gray-400">Connect with all your favorite tools and services through our extensive integration ecosystem.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/autoflow" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-300 text-center">
                  Try AutoFlow Free
                </Link>
                <button className="px-6 py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-900/30 font-semibold transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-96 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center border border-gray-600 shadow-2xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-lg">AutoFlow Platform</p>
                  <p className="text-sm text-gray-500">Interactive Demo Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AutoFlow Features */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">AutoFlow Core Features</h2>
            <p className="text-xl text-gray-400">Everything you need to automate and scale your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Invoicing</h3>
              <p className="text-gray-400 mb-4">Generate, send, and track invoices automatically. Integrate with payment processors for seamless collection.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Custom invoice templates</li>
                <li>• Automated payment reminders</li>
                <li>• Multi-currency support</li>
                <li>• Tax calculation</li>
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Email Marketing</h3>
              <p className="text-gray-400 mb-4">Build sophisticated email campaigns with AI optimization and detailed analytics.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Drag-and-drop email builder</li>
                <li>• A/B testing automation</li>
                <li>• Behavioral triggers</li>
                <li>• Advanced segmentation</li>
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Client Management</h3>
              <p className="text-gray-400 mb-4">Comprehensive CRM system to manage relationships, track interactions, and nurture leads.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Contact management</li>
                <li>• Lead scoring</li>
                <li>• Activity tracking</li>
                <li>• Pipeline management</li>
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-7 9l3-3 3 3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Booking System</h3>
              <p className="text-gray-400 mb-4">Automated appointment scheduling with calendar integration and confirmation workflows.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Online booking widget</li>
                <li>• Calendar synchronization</li>
                <li>• Automated confirmations</li>
                <li>• No-show management</li>
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Reports</h3>
              <p className="text-gray-400 mb-4">Real-time insights and customizable reports to track performance and identify opportunities.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Real-time dashboards</li>
                <li>• Custom report builder</li>
                <li>• Performance metrics</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Workflow Builder</h3>
              <p className="text-gray-400 mb-4">Create complex business processes with our visual workflow builder and automation triggers.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Visual workflow designer</li>
                <li>• Custom triggers & actions</li>
                <li>• Conditional logic</li>
                <li>• Multi-step processes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Products */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Coming Soon</h2>
            <p className="text-xl text-gray-400">Exciting new products in development to expand your automation capabilities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                Q2 2024
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">AutoFlow AI Assistant</h3>
              <p className="text-gray-300 mb-6">
                An intelligent AI companion that suggests optimizations, automates content creation, and provides strategic business insights based on your data.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li>• Natural language workflow creation</li>
                <li>• Automated content generation</li>
                <li>• Predictive analytics</li>
                <li>• Smart recommendations</li>
              </ul>
              <button className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg cursor-not-allowed">
                Join Waitlist
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                Q3 2024
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">SyncMobile</h3>
              <p className="text-gray-300 mb-6">
                Native mobile apps for iOS and Android that bring the full power of AutoFlow to your smartphone and tablet with offline capabilities.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li>• Full mobile workflow management</li>
                <li>• Offline synchronization</li>
                <li>• Push notifications</li>
                <li>• Mobile-optimized interface</li>
              </ul>
              <button className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How AutoFlow Compares</h2>
            <p className="text-xl text-gray-400">See how we stack up against other solutions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-950 rounded-xl border border-gray-800">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-6 text-gray-400">Feature</th>
                  <th className="text-center p-6 bg-blue-900/20">AutoFlow</th>
                  <th className="text-center p-6">Zapier</th>
                  <th className="text-center p-6">HubSpot</th>
                  <th className="text-center p-6">Salesforce</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Visual Workflow Builder</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓ Advanced</td>
                  <td className="text-center p-6 text-green-400">✓ Basic</td>
                  <td className="text-center p-6 text-yellow-400">✓ Limited</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Built-in CRM</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Email Marketing</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓ AI-Powered</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                  <td className="text-center p-6 text-green-400">✓</td>
                  <td className="text-center p-6 text-yellow-400">Add-on</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">Invoicing & Billing</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                  <td className="text-center p-6 text-yellow-400">Add-on</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 font-semibold">AI Optimization</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">✓</td>
                  <td className="text-center p-6 text-red-400">✗</td>
                  <td className="text-center p-6 text-yellow-400">Limited</td>
                  <td className="text-center p-6 text-yellow-400">Einstein AI</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Ease of Setup</td>
                  <td className="text-center p-6 bg-blue-900/20 text-green-400">10 min</td>
                  <td className="text-center p-6 text-yellow-400">30 min</td>
                  <td className="text-center p-6 text-yellow-400">2-4 hours</td>
                  <td className="text-center p-6 text-red-400">Weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-950 to-blue-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the power of AutoFlow with our 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/autoflow" className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-900/30 font-semibold text-lg transition-all duration-300">
              View Pricing
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