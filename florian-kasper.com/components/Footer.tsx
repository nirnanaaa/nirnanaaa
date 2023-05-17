import Link from 'next/link'

import { Container } from '@/components/Container'
import Image from 'next/image'

function NavLink({ href, children, ...extraProps }) {
  return (
    <Link
      href={href}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
      {...extraProps}
    >
      {children}
    </Link>
  )
}
const navigation = {
    platforms: [
      { name: 'Freelancermap.de', href: 'https://www.freelancermap.de/freelancer-verzeichnis/profile/entwicklung/119789-profil-florian-kasper-software-development-professional-with-expertise-in-site-reliability-engineering.html' },
      { name: 'Freelance.de', href: 'https://www.freelance.de/Freelancer/103994-Site-Reliability-Engineer' },
      { name: 'Xing', href: 'https://www.xing.com/profile/Florian_Kasper8/cv' },
      { name: 'LinkedIn', href: 'https://linkedin.com/in/fkconsultin' },
    ],
    support: [
      { name: 'Pricing', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'API Status', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Articles', href: '/articles' },
      { name: 'Projects', href: '/projects' },
      { name: 'Uses', href: '/uses' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
    social: [
      {
        name: 'Strava',
        href: 'https://www.strava.com/athletes/114815860',
        icon: (props) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 64 64"><path d="M41.03 47.852l-5.572-10.976h-8.172L41.03 64l13.736-27.124h-8.18" /><path d="M27.898 21.944l7.564 14.928h11.124L27.898 0 9.234 36.876H20.35" /></svg>
        ),
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/flow_teX_',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
      {
        name: 'GitHub',
        href: 'https://github.com/nirnanaaa',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  }

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
    <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
      <div className="xl:grid xl:grid-cols-3 xl:gap-8">
        <div className="space-y-8">
          <Image
            src="/logo.png"
            width="48"
            height="48"
            alt="Florian Kasper"
          />
          <p className="text-sm leading-6 text-gray-300">
            Building elegant, usable and developer-focused computing infrastructure experiences.
          </p>
          <div className="flex space-x-6">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-500 hover:text-gray-400">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Platforms</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.platforms.map((item) => (
                  <li key={item.name}>
                    <NavLink href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Partners</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <NavLink href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <NavLink href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <NavLink href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
        <p className="text-xs leading-5 text-gray-400">
                &copy; {new Date().getFullYear()} Florian Kasper. All rights
                reserved.</p>
      </div>
    </div>
  </footer>
  )
}
