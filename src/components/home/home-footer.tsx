export function HomeFooter() {
  return (
    <footer
      className="grid w-full shrink-0 grid-cols-1 items-center gap-4 border-t border-border/20 bg-background px-4 py-3 md:grid-cols-3 md:gap-6 md:px-12"
      style={{ minHeight: "var(--home-footer-height)" }}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] leading-none text-muted-foreground md:justify-start md:text-xs">
        <span>© 2025 CP | LEX</span>
        <a href="#" className="hover:text-foreground/90">
          Terms &amp; Conditions
        </a>
        <a href="#" className="hover:text-foreground/90">
          Privacy Policy
        </a>
      </div>
      <p className="text-footer-slogan text-center font-serif text-[10px] italic leading-tight md:text-xs">
        Legal expertise, strategically delivered.
      </p>
      <div className="text-center text-[10px] leading-snug text-muted-foreground md:text-right md:text-xs">
        <p>Phone: +39 06 1234 5678</p>
        <p>Email: info@cplex.it</p>
      </div>
    </footer>
  );
}
