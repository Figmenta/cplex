import Link from "next/link";

export function HomeFooter() {
  return (
    <footer
      className="w-full items-center gap-4 px-4 py-3 md:gap-6 md:px-12"
      style={{
        minHeight: "var(--home-footer-height)",
        background:
          "background: linear-gradient(116deg, #000A21 3.93%, #0C1A39 34.71%)",
      }}
    >
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center gap-4">
          <p className="text-[#94A3B8] text-[12px]">© 2026 CP | LEX</p>
          <Link
            href="/terms-and-conditions"
            className="text-[#94A3B8] hover:text-background text-[12px] transition-colors duration-300"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-[#94A3B8] hover:text-background text-[12px] transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[#94A3B8] text-[12px] italic">
            Legal expertise, strategically delivered.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="tel:+390612345678"
            className="text-[#94A3B8] hover:text-background text-[12px] transition-colors duration-300"
          >
            Phone: +39 06 1234 5678
          </Link>
          <Link
            href="mailto:info@cplex.it"
            className="text-[#94A3B8] hover:text-background text-[12px] transition-colors duration-300"
          >
            Email: info@cplex.it
          </Link>
        </div>
      </div>
    </footer>
  );
}
