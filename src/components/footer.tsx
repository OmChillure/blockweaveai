import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]

export function Footer() {
  return (
    <footer className="w-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Blockweave.ai</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h3>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">Documentation</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Tutorials</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h3>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Terms &amp; Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-7" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023 Blockweave.ai. All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-4 sm:justify-center sm:mt-0">
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <link.icon className="w-5 h-5" />
                <span className="sr-only">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}