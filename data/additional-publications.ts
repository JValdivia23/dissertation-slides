export interface PublicationHeader {
  id: string
  title: string
  journal: string
  year: number
  role: 'First author' | 'Shared first author' | 'Co-author'
  status: 'journal-article' | 'preprint'
  href: string
  asset: string
  width: number
  height: number
  highlight: { x: number, y: number, width: number, height: number }
  initial?: boolean
}

// The author names and header pixels are from the sources documented in
// figures/additional-publications/sources.md, not reconstructed citations.
export const additionalPublications: PublicationHeader[] = [
  {
    id: 'hailstorm',
    title: 'Hailstorm events in the Central Andes of Peru: insights from historical data and radar microphysics',
    journal: 'Atmospheric Measurement Techniques',
    year: 2024,
    role: 'First author',
    status: 'journal-article',
    href: 'https://amt.copernicus.org/articles/17/2295/2024/',
    asset: 'hailstorm-header.png',
    width: 764,
    height: 150,
    highlight: { x: 4, y: 95.5, width: 114.4, height: 24.5 },
    initial: true,
  },
  {
    id: 'precipitation-types',
    title: 'Future changes of precipitation types in the Peruvian Andes',
    journal: 'Scientific Reports',
    year: 2024,
    role: 'Shared first author',
    status: 'journal-article',
    href: 'https://www.nature.com/articles/s41598-024-71840-2',
    asset: 'precipitation-types-header.png',
    width: 795,
    height: 141,
    highlight: { x: 146.2, y: 82, width: 98.9, height: 23 },
    initial: true,
  },
  {
    id: 'sophy',
    title: 'Toward Operational Use of the SOPHy X-Band Radar in Peru: A Bayesian Fuzzy Logic Approach for Ground Clutter Filtering in Complex Orography',
    journal: 'IEEE Access',
    year: 2026,
    role: 'Co-author',
    status: 'journal-article',
    href: 'https://ieeexplore.ieee.org/document/11595539',
    asset: 'sophy-header.png',
    width: 900,
    height: 192,
    highlight: { x: 439.6, y: 128.5, width: 188.8, height: 24.5 },
    initial: true,
  },
  {
    id: 'diurnal-cycle',
    title: 'Dynamic atmospheric mechanisms associated with the diurnal cycle of hydrometeors and precipitation in the Andes–Amazon transition zone of central Peru during the summer season',
    journal: 'Journal of Earth System Science',
    year: 2024,
    role: 'Co-author',
    status: 'journal-article',
    href: 'https://link.springer.com/article/10.1007/s12040-024-02278-3',
    asset: 'diurnal-cycle-header.png',
    width: 796,
    height: 285,
    highlight: { x: 534, y: 225, width: 102.3, height: 24 },
  },
  {
    id: 'surface-energy',
    title: 'Surface energy exchanges and stability conditions associated with convective intense rainfall events on the central Andes of Peru',
    journal: 'Agricultural and Forest Meteorology',
    year: 2025,
    role: 'Co-author',
    status: 'journal-article',
    href: 'https://doi.org/10.1016/j.agrformet.2025.110570',
    asset: 'surface-energy-header.png',
    width: 1144,
    height: 173,
    highlight: { x: 625.1, y: 107.5, width: 243.5, height: 30.4 },
  },
  {
    id: 'extreme-rainfall',
    title: 'Extreme Precipitation Events Associated with Summer Rains in the Western Slope of the Peruvian Andes Using a Numerical Modeling and Weather Radar Data: Case Studies',
    journal: 'Pure and Applied Geophysics',
    year: 2025,
    role: 'Co-author',
    status: 'journal-article',
    href: 'https://link.springer.com/article/10.1007/s00024-025-03834-8',
    asset: 'extreme-rainfall-header.png',
    width: 796,
    height: 285,
    highlight: { x: 222, y: 257.4, width: 179, height: 24 },
  },
  {
    id: 'parsivel-preprint',
    title: 'Evaluation and Correction of Precipitation Types Measured by a PARSIVEL2 Disdrometer in a Tropical Glacier Environment',
    journal: 'EGUsphere',
    year: 2026,
    role: 'Co-author',
    status: 'preprint',
    href: 'https://egusphere.copernicus.org/preprints/2026/egusphere-2026-2705/',
    asset: 'parsivel-preprint-header.png',
    width: 924,
    height: 126,
    highlight: { x: 274.4, y: 95.5, width: 114.4, height: 24.5 },
  },
]
