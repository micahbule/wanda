module.exports = function(grunt) {
    var NG_APP_ROOT = 'app/angular';
    
    grunt.initConfig({
        // grunt jshint
        jshint: {
            'ng-app': {
                files: {
                    src: [NG_APP_ROOT + '/**/*.js']
                }
            }
        },
        
        // grunt uglify
        uglify: {
            'ng-app': {
                options: {
                    mangle: false,
                    sourceMap: 'public/js/ng.js.map',
                    sourceMappingURL: 'ng.js.map'
                },
                src: [
                    NG_APP_ROOT + '/**/*.js',
                    '!' + NG_APP_ROOT + '/**/*.spec.js'
                ],
                dest: 'public/js/ng.js'
            }
        },
        
        // grunt jade
        jade: {
            compile: {
                options: {
                    pretty: true
                },
                files: [
                    {
                        cwd: 'app/angular',
                        expand: true,
                        ext: ".html",
                        src: '**/*.jade',
                        dest: 'public/'
                    }
                ]
            }
        },
        
        // grunt stylus
        stylus: {
            compile: {
                options: {
                    compress: true
                },
                files: {
                    'public/css/styles.css': 'app/styles/styles.styl'
                }
            }
        },
        
        // grunt watch
        watch: {
            options: {
                livereload: 35730
            },
            'ng-app': {
                files: NG_APP_ROOT + '/**/*.js',
                tasks: ['jshint:ng-app', 'uglify:ng-app'],
                options: {
                    spawn: false,
                }
            },
            jade: {
                files: 'app/angular/**/*.jade',
                tasks: ['jade'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: 'app/styles/*.styl',
                tasks: ['stylus'],
                options: {
                    spawn: false,
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build-app', ['jshint', 'uglify', 'jade', 'stylus']);
};