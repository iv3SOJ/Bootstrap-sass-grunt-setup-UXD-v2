module.exports = function (grunt) {

  // Run all dependencies that starts with "grunt-"
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('config.json'),


    // Disable caching of files
    rev : {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 5
      },
      assets: {
        files: [{
          src: [
            'js/*.js',
            'css/*.css'
          ]
        }]
      }
    },

    // SASS compilation
    sass : {
      dev : {
        options: {
          includePaths: ['bower_components/bootstrap-sass/assets/stylesheets'],
          outputStyle: 'expanded',
          compress : grunt.config('compress')
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      },
      dist : {
        options : {
          outputStyle : 'compressed'
        },
        files : {
          'dist/css/app.css' : 'scss/app.scss'
        }
      }
    },

    // Post process CSS files
    postcss : {
      options: {
        map: true, // inline sourcemaps

        // or
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'css/maps/' // ...to the specified directory
        },

        processors: [
        require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer')({
            browsers: 'last 2 versions'
          }) // add vendor prefixes
      ]
      },
      dist: {
        src: 'dist/css/*.css'
      },
      dev : {
        src : 'css/*.css'
      }
    },

    // Concat JS
    concat : {
      options : {
        separator : ';'
      },
      dist: {
          src : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap-sass/assets/javascripts/{bootstrap.min,bootstrap-sprockets}.js',
            'scripts/*.js'
          ],
          dest : 'dist/js/app.js',
          nosort : false
      },
      dev: {
          src : [
            'scripts/*.js'
          ],
          dest : 'js/app.js',
          nosort : false
      }
    },


    // Injector Task
    injector : {
      options: { },
      my_target: {
        files: {
          'index.html': [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'js/app.js',
            'css/app.css'
          ]
        }
      }
    },

    // Uglify JS files
    uglify : {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'dist/js/app.js': 'dist/js/app.js'
        }
      }
    },

    // HTML minification
    htmlmin : {
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'index.html'
        }
      }
    },

    // Copy task
    copy : {
      // build : {
      //   cwd : '',
      //   src : ['**'],
      //   dest : 'build',
      //   expand : true
      // }
      main: {
        files: [
          // Vendor scripts.
          {
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/',
            src: ['**/*.js'],
            dest: 'dist/js/bootstrap/'
                    },
          {
            expand: true,
            cwd: 'bower_components/jquery/dist/',
            src: ['**/*.js', '**/*.map'],
            dest: 'dist/js/jquery/'
                    },
           // Modernizr
          {
            expand: true,
            cwd: 'bower_components/modernizr/',
            src: ['**/*.js'],
            dest: 'dist/js/modernizr/'
                    },
          {
            expand: true,
            cwd : 'js/',
            src : ['*.js'],
            dest : 'dist/js/'
          },
          {
            expand: true,
            cwd : 'css/',
            src : ['*.js'],
            dest : 'dist/css/'
          }
        ]
      }
    },

    clean : {
      build : {
        src : ['build']
      }
    },

    // Express server
    express : {
      all: {
        options: {
          // Set your file directory 
          bases : ['<%= pkg.location %>'],
          port: 9000,
          hostname: "0.0.0.0",
          livereload: true
        }
      }
    },

    // Open Browser
    open : {
      all: {
        path: 'http://localhost:9000/',
        app: 'Chrome'
      }
    },

    // Watch for file changes
    watch : {
      all: {
        files: [
          'Gruntfile.js',
          '*.html'
        ],
        options: {
          livereload: true
        }
      },
      sass : {
        files : ['scss/*.scss','scss/**/*.scss','scss/**/**/*.scss'],
        tasks: ['sass:dev','postcss:dev']
      },
      js : {
        files : ['scripts/*.js'],
        tasks : ['concat:dev']
      }
    }
  });

  // Developer centric tasks
  grunt.registerTask('dev', 'Build for development environment', [
    'sass:dev',
    'postcss:dev',
    'concat:dev',
    'injector',
    'express',
    'open',
    'watch'
  ]);

  // build task for production stage
  grunt.registerTask('build', 'Build for production environment', [
    'copy',
    'sass:dist',
    'concat:dist',
    'injector',
    'uglify',
    'htmlmin',
    'express',
    'open'
  ]);

  // default task for developers
  grunt.registerTask('default', ['dev']);

};