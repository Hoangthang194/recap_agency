import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { cities } from '@/data'

export default function CategoriesPage() {
  // Group cities by region
  const citiesByRegion = cities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">Categories</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 tracking-tight">
          Categories
        </h1>

        {/* Display cities grouped by region */}
        {Object.entries(citiesByRegion).map(([region, regionCities]) => (
          <div key={region} className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">{region}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {regionCities.map((city) => (
                <div key={city.id} className="group">
                  <Link href={`/${city.id}`} className="block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 mb-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                      <img 
                        src={city.image} 
                        alt={city.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                      />
                      <div className={`absolute inset-0 ${city.colorClass} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                      
                      {/* Icon overlay */}
                      <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="material-icons-outlined text-gray-800">{city.icon}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mb-4">
                      <span className="material-icons-outlined text-gray-400 group-hover:text-primary transition-colors">{city.icon}</span>
                      <div>
                        <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors block">{city.name}</span>
                        <span className="text-sm text-gray-500">{city.description}</span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Categories for this city */}
                  <div className="px-2">
                    <div className="flex flex-wrap gap-2">
                      {city.categories.map((category) => (
                        <Link 
                          href={`/${category.id}`} 
                          key={category.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-white text-xs font-medium text-gray-700 transition-colors group/cat"
                        >
                          <span className="material-icons-outlined text-sm group-hover/cat:text-white">{category.icon}</span>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Newsletter />
    </div>
  )
}

