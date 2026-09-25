/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://izies.in',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/server-sitemap.xml', '/api/*', '/candidate/*', '/jobs/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/candidate/', '/jobs/'] },
    ],
    additionalSitemaps: ['https://izies.in/sitemap.xml'],
  },
  transform: async (config, path) => {
    const priorityMap = {
      '/': 1.0,
      '/services': 0.9,
      '/about': 0.8,
      '/contact': 0.8,
      '/careers': 0.7,
      '/team': 0.7,
    };

    const changeFreqMap = {
      '/': 'weekly',
      '/services': 'weekly',
      '/about': 'monthly',
      '/contact': 'monthly',
      '/careers': 'weekly',
      '/team': 'monthly',
    };

    return {
      loc: path,
      changefreq: changeFreqMap[path] || 'monthly',
      priority: priorityMap[path] || 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async () => [
    { loc: '/services/ai-development', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/web-development', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/mobile-app-development', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/business-automation', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/api-development', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/cloud-devops', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/data-engineering-analytics', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/blockchain-web3-development', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/media-streaming-development', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/gaming-3d-development', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/software-testing-qa', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/dedicated-development-teams', changefreq: 'monthly', priority: 0.85 },
    { loc: '/services/software-support-maintenance', changefreq: 'monthly', priority: 0.85 },
  ],
};