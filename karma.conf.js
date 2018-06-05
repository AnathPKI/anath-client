//jshint strict: false
module.exports = function (config) {
    config.set({

        basePath: './app',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-loader/angular-loader.js',
            'bower_components/angular-material/angular-material.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-resource/angular-resource.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-jwt/dist/angular-jwt.min.js',
            'bower_components/pkijs/org/pkijs/*.js',
            'lib/*.js',
            'app.js',
            'services/*.js',
            'view*/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
