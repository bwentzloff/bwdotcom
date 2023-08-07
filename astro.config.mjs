import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://giffordlakelabs.com',
  base: '/',
  integrations: [
    starlight({
      title: 'BWdotcom',
      social: {
        github: 'https://github.com/bwentzloff',
      },
      sidebar: [
        {
          label: 'Bioinformatics',
          items: [
            // Each item here is one entry in the navigation menu.
            
          ],
        },
        /* {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        }, */
      ],
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
