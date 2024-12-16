module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/link/:url/ask',
      handler: 'link.askQuestion',
      config: {
            policies: [],
            middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/link/:url/sections',
      handler: 'link.sections',
      config: {
            policies: [],
            middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/link/:url/answer',
      handler: 'link.answer',
      config: {
            policies: [],
            middlewares: [],
      },
    },
  ],
};
