'use client'

import { useState } from 'react'
import { Send, Phone, Mail, MapPin } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format message for WhatsApp
    const message = `
*New Inquiry from Mashini Fine Motors*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}

*Message:*
${formData.message}
    `.trim()

    // WhatsApp number (replace with actual number)
    const whatsappNumber = '17135550198'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    // Open WhatsApp
    window.open(whatsappUrl, '_blank')

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Contact Info */}
      <div className="space-y-6">
        <div>
          <h2
            className="text-2xl font-black uppercase mb-2"
            style={{ color: 'var(--brand-dark)' }}
          >
            Get in touch
          </h2>
          <p className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--brand-dark)' }}>
                Phone
              </p>
              <a
                href="tel:+17135550198"
                className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}
              >
                (713) 555-0198
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--brand-dark)' }}>
                Email
              </p>
              <a
                href="mailto:info@mashinifinemotors.com"
                className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}
              >
                info@mashinifinemotors.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--brand-dark)' }}>
                Location
              </p>
              <p className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                2500 West Loop South<br />
                Houston, TX 77027
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: 'var(--brand-dark)' }}
        >
          <p className="text-sm font-bold text-white mb-2">
            Business Hours
          </p>
          <p className="text-xs text-white/70">
            Monday - Saturday: 9am - 7pm<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--brand-primary)]"
                style={{ borderColor: 'var(--brand-light-bg-secondary)', color: 'var(--brand-text-dark)' }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--brand-primary)]"
                style={{ borderColor: 'var(--brand-light-bg-secondary)', color: 'var(--brand-text-dark)' }}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--brand-primary)]"
                style={{ borderColor: 'var(--brand-light-bg-secondary)', color: 'var(--brand-text-dark)' }}
                placeholder="(123) 456-7890"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Subject
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--brand-primary)]"
                style={{ borderColor: 'var(--brand-light-bg-secondary)', color: 'var(--brand-text-dark)' }}
              >
                <option value="">Select a subject</option>
                <option value="Vehicle Inquiry">Vehicle Inquiry</option>
                <option value="Sell My Car">Sell My Car</option>
                <option value="Insurance Quote">Insurance Quote</option>
                <option value="Financing">Financing</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
              Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--brand-primary)] resize-none"
              style={{ borderColor: 'var(--brand-light-bg-secondary)', color: 'var(--brand-text-dark)' }}
              placeholder="Tell us about your inquiry..."
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            <Send className="h-4 w-4" />
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
