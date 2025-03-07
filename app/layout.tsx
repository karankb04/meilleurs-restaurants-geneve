import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { Manrope as Font } from "next/font/google";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { EmailForm } from "@/components/email-form";
import { Navigation } from "@/components/navigation";

import { directory } from "@/directory.config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Mail, Utensils } from "lucide-react";

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: directory.title,
  description: directory.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={font.className}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl">GastroGenève</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Navigation />
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <Subscribe />
          </div>
        </div>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
                <Utensils className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">GastroGenève</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Découvrez les meilleurs restaurants de Genève avec notre guide gastronomique complet.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Explorer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurants" className="text-sm text-muted-foreground hover:text-primary">
                  Tous les restaurants
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-muted-foreground hover:text-primary">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/cuisines" className="text-sm text-muted-foreground hover:text-primary">
                  Cuisines
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-muted-foreground hover:text-primary">
                  Carte
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recevez les dernières actualités gastronomiques chaque semaine.
            </p>
            <EmailForm />
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {directory.name}. Tous droits réservés.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
              Conditions d'utilisation
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
};

const Subscribe = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Mail className="mr-2 h-3 w-3" /> S'abonner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abonnez-vous à notre newsletter</DialogTitle>
          <DialogDescription>
            Recevez les dernières actualités gastronomiques de Genève.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
        <div className="h-px" />
      </DialogContent>
    </Dialog>
  );
};
