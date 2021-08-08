require('dotenv').config()

/**
 * Setup a current env and timestamp with timezone support 
 *  for use in footer and other non-content file locations
 */
module.exports = {
  BUILD_TIMESTAMP: new Date(),
  TIMEZONE: process.env.TIMEZONE || 'UTC',
  NODE_ENV: process.env.NODE_ENV || 'production',
  SITE_URL: process.env.SITE_URL || 'http://localhost:8080',
  ZOOM_LINK: process.env.ZOOM_LINK || '/',
  GA_ID: process.env.GA_ID || '',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
}
