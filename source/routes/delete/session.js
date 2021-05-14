module.exports = {
  '/delete/session': {
    methods: ['delete'], // TODO: We may want to use post instead?
    middleware: [],
    fn: function(req, res, next) {
      req.logout();
      req.session.destroy(function(err) {
        if (err) {
          return next(err);
        }

        res.json({result: 'Success'});
      });
    },
  },
};
