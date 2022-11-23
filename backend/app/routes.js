module.exports = function (app) {
    require('./route/user')(app);
    require('./route/book')(app);
};
