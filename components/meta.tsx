import Head from 'next/head';

const Meta = () => (
	<Head>
		<title>Parallel Reservoirs</title>
		<meta charSet='utf-8' />
		<meta name='mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-capable' content='yes' />
		<meta
			name='apple-mobile-web-app-status-bar-style'
			content='black-translucent'
		/>
		<meta name='apple-mobile-web-app-title' content='Parallel Reservoirs' />
		<meta name='application-name' content='Parallel Reservoirs' />
		<meta name='description' content='Simulating flow to multiple reservoirs' />
		<meta name='theme-color' content='#1d2020' />
		<meta
			name='viewport'
			content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
		/>
		<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
		<link rel='icon' type='image/png' href='/images/favicon.png' />
		<link rel='manifest' href='/manifest.json' />
		<link
			rel='stylesheet'
			href='https://fonts.googleapis.com/icon?family=Material+Icons'
		/>
	</Head>
);

export default Meta;
