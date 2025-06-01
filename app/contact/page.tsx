"use client";

import Link from "next/link";
import Image from "next/image";

export default function Contact() {
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
              <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-white font-semibold">Contact</Link>
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
            Get in Touch
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ready to transform your business? We'd love to hear from you. Let's discuss how we can help automate your workflows.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
              <p className="text-gray-400 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Company</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">How can we help you? *</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required>
                    <option value="">Select an option</option>
                    <option value="demo">Schedule a Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Tell us about your automation needs, current challenges, or any questions you have..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
                
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Let's Start a Conversation</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Whether you're ready to get started or just have questions, we're here to help. Choose the best way to reach us.
                </p>
              </div>
              
              {/* Contact Methods */}
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-400 mb-3">Get in touch via email for detailed discussions</p>
                    <div className="space-y-1">
                      <p className="text-blue-400">hello@synchronisedtech.com</p>
                      <p className="text-gray-500 text-sm">General inquiries & sales</p>
                    </div>
                    <div className="space-y-1 mt-3">
                      <p className="text-blue-400">support@synchronisedtech.com</p>
                      <p className="text-gray-500 text-sm">Technical support & help</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Response Times</h3>
                    <p className="text-gray-400 mb-3">We're committed to quick response times</p>
                    <div className="space-y-1">
                      <p className="text-gray-300">Sales inquiries: &lt; 4 hours</p>
                      <p className="text-gray-300">Support requests: &lt; 8 hours</p>
                      <p className="text-gray-300">General questions: &lt; 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-400 mb-3">Chat with our team in real-time</p>
                    <p className="text-gray-300">Available Monday - Friday</p>
                    <p className="text-gray-300">9:00 AM - 6:00 PM PST</p>
                    <button className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition">
                      Start Chat
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-7 9l3-3 3 3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Schedule a Demo</h3>
                    <p className="text-gray-400 mb-3">See AutoFlow in action with a personalized demo</p>
                    <Link href="/autoflow" className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-semibold transition">
                      Book Demo
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Office Information */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Office Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-gray-400 text-sm">San Francisco, California</p>
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-400 text-sm">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p className="text-gray-400 text-sm">Weekend: Emergency support only</p>
                  </div>
                  <div>
                    <p className="font-medium">Time Zone</p>
                    <p className="text-gray-400 text-sm">Pacific Standard Time (PST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">How quickly can I get started with AutoFlow?</h3>
              <p className="text-gray-400">You can start your free trial immediately after signing up. Our onboarding process takes less than 10 minutes, and you can have your first workflow running within an hour.</p>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">Do you offer implementation support?</h3>
              <p className="text-gray-400">Yes! All Professional and Enterprise plans include dedicated onboarding support. We'll help you set up your workflows, integrate with existing tools, and train your team.</p>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">Can you integrate with our existing systems?</h3>
              <p className="text-gray-400">We support 1000+ integrations including popular CRMs, email platforms, accounting software, and more. For custom integrations, our Enterprise plan includes API access and custom development.</p>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">What kind of training do you provide?</h3>
              <p className="text-gray-400">We offer comprehensive documentation, video tutorials, webinars, and for Enterprise customers, personalized training sessions with your team.</p>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">Is my data secure with Synchronised Tech?</h3>
              <p className="text-gray-400">Absolutely. We use bank-level encryption, SOC 2 compliance, and follow industry best practices for data security. Your data is encrypted both in transit and at rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-950 to-blue-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait to start automating. Join hundreds of businesses already saving time with AutoFlow.
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