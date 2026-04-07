import Link from "next/link";

const linkClass =
  "text-[11px] text-[#62626E] md:text-[#94A3B8] transition-colors duration-300 hover:text-foreground md:text-[12px]";

export function HomeFooter() {
  return (
    <footer
      className="w-full border-t border-[#FFFFFF0D] sm:border-t-0 px-4 py-4 md:min-h-[var(--home-footer-height)] md:px-10 md:py-0 flex flex-col justify-center"
      style={{
        background: "linear-gradient(116deg, #000A21 3.93%, #0C1A39 34.71%)",
      }}
    >
      {/* Mobile: compact, centered stack */}
      <div className="flex flex-col items-center gap-2 text-center md:hidden">
        <p className="w-full font-montserrat text-[9px] font-medium uppercase leading-tight tracking-[0.22em] text-[#62626E]">
          Legal expertise, strategically delivered.
        </p>
        <div className="w-full flex justify-between items-center gap-1">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 text-[#62626E]">
            <Link href="/" className={linkClass}>
              Terms & Conditions
            </Link>
            <Link href="/" className={linkClass}>
              Privacy Policy
            </Link>
          </div>
          <p className="text-[11px] text-[#62626E]">© 2025 CP | LEX</p>
        </div>
      </div>

      {/* Large screens: one row — legal group | centered italic tagline | contact */}
      <div className="hidden min-h-[36px] items-center md:grid md:grid-cols-[1fr_minmax(0,auto)_1fr] md:gap-4 lg:gap-6">
        <div className="flex min-w-0 flex-wrap items-center justify-start gap-x-4 gap-y-1 pr-2">
          <p className="text-[11px] text-[#94A3B8] md:text-[12px]">
            © 2025 CP | LEX
          </p>
          <Link href="/" className={linkClass}>
            Terms & Conditions
          </Link>
          <Link href="/" className={linkClass}>
            Privacy Policy
          </Link>
        </div>
        <p className="mx-auto max-w-[min(100%,28rem)] px-2 text-center font-montserrat text-[10px] italic leading-snug text-[#94A3B8] md:text-[11px] lg:text-[12px]">
          Legal expertise, strategically delivered.
        </p>
        <div className="flex min-w-0 flex-col items-end justify-end gap-1 pl-2 text-right sm:flex-row sm:gap-4">
          <Link
            href="tel:+390612345678"
            className={`${linkClass} whitespace-nowrap`}
          >
            Phone: +39 06 1234 5678
          </Link>
          <Link
            href="mailto:info@cplex.it"
            className={`${linkClass} whitespace-nowrap`}
          >
            Email: info@cplex.it
          </Link>
        </div>
      </div>
    </footer>
  );
}
