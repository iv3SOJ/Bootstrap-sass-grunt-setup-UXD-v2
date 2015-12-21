module.exports = function (grunt) {

  // Run all dependencies that starts with "grunt-"
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);
  // Setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('config.json'),
    config : {
      app : "app",
      build : "build",
      dist : "dist"
    },


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
          outputStyle: 'expanded'
        },
        files: {
          '<%= config.build %>/css/app.css': '<%= config.app %>/scss/app.scss'
        }
      },
      dist : {
        options : {
          includePaths: ['bower_components/bootstrap-sass/assets/stylesheets'],
          outputStyle : 'compressed'
        },
        files : {
          '<%= config.dist %>/css/app.css' : '<%= config.app %>/scss/app.scss'
        }
      }
    },

    // Post process CSS files
    postcss : {
      options: {
        // map: true, // inline sourcemaps

        // or
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: '<%= config.build %>/css/maps/' // ...to the specified directory
        },

        processors: [
        require('autoprefixer')({
            browsers: 'last 2 versions'
          }) // add vendor prefixes
      ]
      },
      dist: {
        src: '<%= config.dist %>/css/*.css'
      },
      dev : {
        src : '<%= config.build %>/css/*.css'
      }
    },

    // Concat JS
    concat : {
      options : {
        separator : ';'
      },
      dist: {
          src : [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            '<%= config.app %>/scripts/*.js'
          ],
          dest : '<%= config.dist %>/js/app.js',
          nosort : false
      },
      dev: {
          src : [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            '<%= config.app %>/scripts/*.js'
          ],
          dest : '<%= config.build %>/js/app.js',
          nosort : false
      }
    },

    // Uglify JS files
    uglify : {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          '<%= config.dist %>/js/app.js': '<%= config.dist %>/js/app.js'
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
          '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
        }
      }
    },

    // Copy task
    copy : {
      html : {
        files : [
          {
            expand : true,
            cwd : '<%= config.app %>/',
            src : ['*.html'],
            dest : '<%= config.build %>/'
          }
        ]
      },
      html_dist : {
        files : [
          {
            expand : true,
            cwd : '<%= config.app %>/',
            src : ['*.html'],
            dest : '<%= config.dist %>/'
          }
        ]
      }
    },

    clean : {
      build : {
        src : ['<%= config.build %>']
      },
      dist : {
        src : ['<%= config.dist %>']
      }
    },

    // Express server
    express : {
      all: {
        options: {
          // Set your file directory 
          bases : ['<%= pkg.location %>/<%= config.build %>'],
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
          '<%= config.app %>/*.html'
        ],
        tasks : ['copy:html'],
        options: {
          livereload: true
        }
      },
      sass : {
        files : ['<%= config.app %>/scss/*.scss','<%= config.app %>/scss/**/*.scss','<%= config.app %>/scss/**/**/*.scss'],
        tasks: ['sass:dev','postcss:dev']
      },
      js : {
        files : ['<%= config.app %>/scripts/*.js'],
        tasks : ['concat:dev']
      }
    }
  });

  // Developer centric tasks
  grunt.registerTask('dev', 'Build for development environment', [
    'clean:build',
    'sass:dev',
    'postcss:dev',
    'concat:dev',
    'copy:html',
    'express',
    'open',
    'watch'
  ]);

  // build task for production stage
  grunt.registerTask('dist', 'Build for production environment', [
    'clean:dist',
    'sass:dist',
    'postcss:dist',
    'concat:dist',
    'copy:html_dist',
    'uglify'
  ]);

  // default task for developers
  grunt.registerTask('default', ['dev']);

};