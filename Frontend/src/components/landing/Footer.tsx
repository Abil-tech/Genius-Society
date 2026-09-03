import Logo from './Logo'
import { footerLinks } from '@/utils/landingContent'

export default function Footer() {
    return (
        <footer className="bg-brand-orange px-6 py-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Logo variant="light" />
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/80">
                        Platform pembelajaran digital untuk generasi profesional masa
                        depan.
                    </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                    <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-white/90">
                        {footerLinks.map((link) => (
                            <a key={link.label} href={link.href} className="hover:text-white">
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <p className="text-xs text-white/70">
                        © {new Date().getFullYear()} Genius Society. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}