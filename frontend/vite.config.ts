import path from 'path'

import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
	},
	plugins: [
		frappeui({
			frappeProxy: true,
			lucideIcons: true,
			jinjaBootData: true,
			frappeTypes: {
				input: {
					frappe: ['file'],
					mail: [
						'email_message',
						'mail_tenant',
						'mail_tenant_member',
						'mail_domain',
						'mail_domain_request',
						'mail_alias',
						'mail_group',
						'mail_group_member',
						'mail_account',
						'mail_account_request',
						'mail_contact',
						'mail_recipient',
						'mail_settings',
					],
				},
			},
			buildConfig: {
				outDir: '../mail/public/frontend',
				baseUrl: '/assets/mail/frontend/',
				indexHtmlPath: '../mail/www/mail.html',
				emptyOutDir: true,
				sourcemap: true,
			},
		}),
		vue({
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	optimizeDeps: {
		include: [
			'frappe-ui > feather-icons',
			'showdown',
			'engine.io-client',
			'prosemirror-state',
			'prosemirror-view',
			'highlight.js/lib/core',
		],
	},
})
