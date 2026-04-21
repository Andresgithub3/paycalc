import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PayCalc — Canadian Salary Calculator',
    short_name: 'PayCalc',
    description: 'Free Canadian salary and income tax calculator.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#FAFBFC',
    theme_color: '#0D6E3F',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
