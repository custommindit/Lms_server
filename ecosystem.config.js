module.exports = {
  apps : [{
    name   : "hest",
    script : "./index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      TIMEOUT: '1200000', // 20 minutes in milliseconds
    },
    env_production: {
      NODE_ENV: 'production',
      TIMEOUT: '1200000', // 20 minutes in milliseconds
    },
  }]
}
