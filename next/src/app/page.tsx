import { ThemeToggle } from '@/components/theme/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { Users, FileEdit, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function page() {
    return (
        <div className='flex min-h-screen flex-col'>
            <header className='container flex items-center justify-between py-4'>
                <Link className='flex items-center justify-center' href='/'>
                    <FileEdit className='mr-2 h-6 w-6' />
                    <span className='text-lg font-bold'>Basedbin</span>
                </Link>
                <nav className='flex items-center gap-2 sm:gap-4'>
                    <Link
                        className={buttonVariants({
                            variant: 'default',
                        })}
                        href='/login'
                    >
                        <span className='font-bold'>Get Started</span>
                    </Link>
                    <ThemeToggle />
                </nav>
            </header>
            <main className='flex-1'>
                <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
                    <div className='container px-4 md:px-6'>
                        <div className='flex flex-col items-center space-y-4 text-center'>
                            <div className='space-y-2'>
                                <h1 className='text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                                    Collaborate in Real-Time with Basedbin
                                </h1>
                                <p className='mx-auto max-w-screen-sm text-balance text-muted-foreground md:text-xl'>
                                    Edit documents together, share ideas, and
                                    boost productivity with our powerful
                                    collaborative editing platform.
                                </p>
                            </div>
                            <div className='space-x-4'>
                                <Link
                                    className={buttonVariants({
                                        variant: 'default',
                                    })}
                                    href='/login'
                                >
                                    <span className='font-bold'>
                                        Get Started
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-full bg-muted/30 py-12 md:py-24 lg:py-32'>
                    <div className='container px-4 md:px-6'>
                        <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                            Features
                        </h2>
                        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
                            <div className='flex flex-col items-center text-center'>
                                <Users className='mb-4 h-12 w-12 text-primary' />
                                <h3 className='mb-2 text-xl font-bold'>
                                    Real-Time Collaboration
                                </h3>
                                <p className='text-balance text-muted-foreground'>
                                    Work together seamlessly with multiple users
                                    editing the same document simultaneously.
                                </p>
                            </div>
                            <div className='flex flex-col items-center text-center'>
                                <FileEdit className='mb-4 h-12 w-12 text-primary' />
                                <h3 className='mb-2 text-xl font-bold'>
                                    Rich Text Editing
                                </h3>
                                <p className='text-balance text-muted-foreground'>
                                    Format your documents with ease using our
                                    intuitive rich text editor.
                                </p>
                            </div>
                            <div className='flex flex-col items-center text-center'>
                                <Share2 className='mb-4 h-12 w-12 text-primary' />
                                <h3 className='mb-2 text-xl font-bold'>
                                    Easy Sharing
                                </h3>
                                <p className='text-balance text-muted-foreground'>
                                    Share your documents with anyone, anywhere,
                                    with just a few clicks.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-full py-12 md:py-24 lg:py-32'>
                    <div className='container px-4 md:px-6'>
                        <div className='flex flex-col items-center space-y-4 text-center'>
                            <div className='space-y-2'>
                                <h2 className='text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                                    Ready to Boost Your Productivity?
                                </h2>
                                <p className='mx-auto max-w-[600px] text-balance text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                                    Start collaborating in real-time with
                                    Basedbin today. Sign up now to get started!
                                </p>
                            </div>
                            <Link
                                className={buttonVariants({
                                    variant: 'default',
                                })}
                                href='/register'
                            >
                                <span className='font-bold'>Sign Up Now</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <footer className='flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
                <p className='text-xs text-muted-foreground'>
                    © {new Date().getFullYear()} Basedbin. All rights reserved.
                </p>
            </footer>
            <div className='bg-grid-gray-600/[0.3] pointer-events-none fixed inset-0 z-[-1] flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
        </div>
    )
}
