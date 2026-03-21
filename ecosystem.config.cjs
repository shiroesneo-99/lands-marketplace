module.exports = {
  apps: [
    {
      name: 'lands-marketplace',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/html/lands-marketplace',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'https://land.booky-la.cloud',
        NEXT_PUBLIC_SITE_URL: 'https://lands.booky-la.cloud',
      },
    },
  ],
};
