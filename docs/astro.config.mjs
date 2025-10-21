// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			customCss: [
				'./src/styles/main.css'
			],
			title: 'Microservices',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jorgeluissanchez/microservices' }],
			sidebar: [
				{
					label: 'C4 Model',
					autogenerate: { directory: 'c4' },
				},
			],
		}),
	],
});
