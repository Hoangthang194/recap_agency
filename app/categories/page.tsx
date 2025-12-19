import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { countries, cities } from '@/data'

type CategoriesPageProps = {
  searchParams?: {
    country?: string
  }
}

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const countryId = searchParams?.country || countries[0]?.id
  const currentCountry = countries.find((c) => c.id === countryId) || countries[0]
  const countryCities = cities.filter((city) => city.countryId === currentCountry.id)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">Cities</span>
        </nav>

        {/* Country selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              {currentCountry.name}
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Select a city in {currentCountry.name} to explore stories and categories.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Link
                key={country.id}
                href={`/categories?country=${country.id}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  country.id === currentCountry.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <span className="material-icons-outlined text-xs text-gray-400">
                  {country.icon}
                </span>
                <span>{country.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cities for selected country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {countryCities.map((city) => (
            <Link key={city.id} href={`/${city.id}`} className="group">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 mb-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div
                  className={`absolute inset-0 ${city.colorClass} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`}
                ></div>

                {/* Icon overlay */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="material-icons-outlined text-gray-800">{city.icon}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mb-4">
                <span className="material-icons-outlined text-gray-400 group-hover:text-primary transition-colors">
                  {city.icon}
                </span>
                <div>
                  <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors block">
                    {city.name}
                  </span>
                  <span className="text-sm text-gray-500">{city.description}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Newsletter />
    </div>
  )
}

