export default function InsuranceLogos() {
  const insuranceCompanies = [
    {
      name: 'Allianz',
      logo: '/Allianz.png',
      color: '#003781'
    },
    {
      name: 'AXA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/AXA_Logo.svg/200px-AXA_Logo.svg.png',
      color: '#00008F'
    },
    {
      name: 'Zurich',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Zurich_Insurance_Group_Logo.svg/200px-Zurich_Insurance_Group_Logo.svg.png',
      color: '#009EE3'
    },
    {
      name: 'AIG',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/AIG_logo.svg/200px-AIG_logo.svg.png',
      color: '#004F9F'
    },
    {
      name: 'Chubb',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chubb_Limited_Logo.svg/200px-Chubb_Limited_Logo.svg.png',
      color: '#002855'
    },
    {
      name: 'Liberty Mutual',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Liberty_Mutual_Insurance_Logo.svg/200px-Liberty_Mutual_Insurance_Logo.svg.png',
      color: '#003B5C'
    },
    {
      name: 'State Farm',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/State_Farm_Logo.svg/200px-State_Farm_Logo.svg.png',
      color: '#CC0000'
    },
    {
      name: 'Progressive',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Progressive_Logo.svg/200px-Progressive_Logo.svg.png',
      color: '#003087'
    },
  ]

  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: 'var(--brand-light-bg)' }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="text-center space-y-4 mb-12">
          <h2
            className="text-2xl font-bold uppercase md:text-3xl"
            style={{ color: 'var(--brand-dark)' }}
          >
            Trusted Insurance Partners
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
            We work with leading insurance providers to protect your investment
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {insuranceCompanies.map((company) => (
            <div
              key={company.name}
              className="flex h-24 items-center justify-center rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: company.color }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
