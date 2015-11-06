module.exports = function (grunt) {
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // Get information from config.json regarding the location of the project
    pkg: grunt.file.readJSON('config.json'),
    
    rev: {
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
    // copy files
    copy: {
      main: {
        files: [
                    // Vendor scripts.
          {
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/javascripts/',
            src: ['**/*.js'],
            dest: 'scripts/bootstrap-sass/'
                    },
          {
            expand: true,
            cwd: 'bower_components/jquery/dist/',
            src: ['**/*.js', '**/*.map'],
            dest: 'scripts/jquery/'
                    },

                    // Fonts.
          {
            expand: true,
            filter: 'isFile',
            flatten: true,
            cwd: 'bower_components/',
            src: ['bootstrap-sass/assets/fonts/**'],
            dest: 'fonts/'
                    },

                    // Stylesheets
          {
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/stylesheets/',
            src: ['**/*.scss'],
            dest: 'scss/'
                    }
                ]
      },
    },

    // SASS compilation
    // Compile SASS files into minified CSS.
    sass: {
      dev: {
        options: {
          includePaths: [
          'bower_components/bootstrap-sass/assets/stylesheets'
        ],
          style: 'expanded'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      },

      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'dist/css/app.min.css': 'scss/app.scss'
        }
      }
    },

    // uglify
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'js/app.js': ['scripts/*.js']
        }
      }
    },

    // The webserver
    express: {
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

    watch: {
      all: {
        files: ['Gruntfile.js', 'scripts/*.js', '*.html'],
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      },
      css: {
        files: [
          'scss/*.scss',
          'scss/**/*.scss',
          'scss/**/**/*.scss'
        ],
        tasks: ['sass:dev','sass:dist']
      }
    },

    open: {
      all: {
        path: 'http://localhost:9000/index.html',
        app: 'Chrome'
      }
    }
  });

  // grunt.loadNpmTasks('grunt-sass');
  // grunt.loadNpmTasks('grunt-express');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-rev');

  // Establish tasks we can run from the terminal.
  grunt.registerTask('build', ['sass', 'copy', 'uglify', 'express', 'open']);
  grunt.registerTask('default', ['build', 'watch']);
};