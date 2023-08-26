import { useEffect, useRef } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
export const robotoMono = Roboto_Mono({ subsets: ['latin'] })

import './globals.css'
import 'focus-visible'
import { Container } from '@/components/Container'
import { NextPage, NextPageContext } from 'next'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname)

  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className={`${inter.className} relative`}>
        <Header />
        <main>
          <Container className="mt-16 sm:mt-32">
            <Component previousPathname={previousPathname} {...pageProps} />
          </Container>
        </main>
        <Footer />
      </div>
    </>
  )
}
