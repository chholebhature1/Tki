import Link from "next/link";
import { siteConfig, footerLinks } from "@/constants/site";
import { Container } from "./container";
import { Logo } from "./logo";

const footerSections = [
  { title: "Company", links: footerLinks.company },
  { title: "Patients", links: footerLinks.patients },
  { title: "Therapists", links: footerLinks.therapists },
  { title: "Resources", links: footerLinks.resources },
  { title: "Legal", links: footerLinks.legal },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Logo className="text-lg" />
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                India&apos;s trusted mental healthcare marketplace. Find
                verified therapists and book secure consultations.
              </p>
            </div>

            {/* Link Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-text">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-2" role="list">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <p className="text-sm text-muted">
              Made with care for better mental health.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
