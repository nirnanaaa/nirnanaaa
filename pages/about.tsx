import Head from 'next/head';
import { SimpleLayout } from '@/components/SimpleLayout'

export default function About() {
    return (
        <>
            <Head>
                <title>About - Florian Kasper - Architect - Infrastructure - SRE</title>
                <meta
                    name="description"
                    content="I’m Florian Kasper. Passionate Cloud Architect and SRE, with a focus on computing infrastructure and developer-focused computing experiences."
                />
            </Head>

            <SimpleLayout
                title="Scaleable Computing Infrastructure and Developer-Focused Computing Experiences."
                intro={'I am a Cloud-Native Developer and Dev-Ops Engineer. Freelancing for over 9 years now, I’ve been actively contributing to improve my clients position in their industries. With my expertise not only in software development, but also in the technologies and techniques at an infrastructure and architectural level, I can help to make pragmatic decisions that will deliver measurable results. Software engineering and architecting for me, started out as just a hobby, but quickly evolved into a passion, that lasts until today. I constantly seek for new adventures and challenges that will actually be of value for my customers.'}
            >
            
            If you need any help decluttering your own infrastructure, please contact me at <a href="mailto:info@florian-kasper.com" className="link">info@florian-kasper.com</a>.

            </SimpleLayout>
    </>
    )
}