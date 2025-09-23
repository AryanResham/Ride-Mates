const DEFAULT_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Safety", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Licenses", href: "#" },
    ],
  },
];

export default function Footer({
  brand = {
    name: "RideMate",
    tagline: "Share routes. Save costs. Meet people.",
  },
  columns = DEFAULT_COLUMNS,
  year = new Date().getFullYear(),
}) {
  return (
    <footer className="mt-15 border-t border-gray-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 pb-6">
        {/* Top brand row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-gray-200/70">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-yellow-400 ring-1 ring-black/5 flex items-center justify-center text-sm font-semibold">
              RM
            </div>
            <div>
              <p className="text-lg font-semibold">
                <span className="text-gray-900">Ride</span>
                <span className="text-yellow-600">Mate</span>
              </p>
              <p className="text-sm text-gray-600">{brand.tagline}</p>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="flex justify-around gap-1 py-10">
          {columns.map((col) => (
            <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
              <h3
                id={`footer-${col.title}`}
                className="text-sm font-semibold text-gray-900 tracking-wide"
              >
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-gray-200/70 flex flex-col items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {year} RideMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
