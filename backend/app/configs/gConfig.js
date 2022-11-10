module.exports = {
    https: false,
    appname: 'SugarTawng',
    port: process.env.PORT || 3001,
    //url: APIROOT_URL,
    authenticationkey: 'fdhjfdfuejfkjdhfaueyrujhgesfhjs',
    paths:{
        public: '/public',
        tmp: '/tmp',
        docs:'/docs',
        tag:'/tag'
    },
    mongodb: {
        uri: MONGODB_URL ='mongodb+srv://tangvietdien:12345678a@cluster0.fzjkskr.mongodb.net/?retryWrites=true&w=majority',
        username: ''
    }
};
