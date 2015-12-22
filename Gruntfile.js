module.exports = function (grunt) {

  // Run all dependencies that starts with "grunt-"
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  var mozjpeg = require('imagemin-mozjpeg');

  // Setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('config.json'),
    config : {
      app : "app",
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
            '<%= config.app %>/*.json',
            '<%= config.app %>/assets/images/*.{png,jpg,jpeg,gif}',
            '<%= config.app %>/js/*.js',
            '<%= config.app %>/css/*.css',
            '<%= config.dist %>/js/*.js',
            '<%= config.dist %>/css/*.css'
          ]
        }]
      }
    },

    // SASS compilation
    sass : {
      bootstrap : {
        options: {
          includePaths: ['bower_components/bootstrap-sass/assets/stylesheets'],
          outputStyle: 'expanded'
        },
        files : {
          '<%= config.app %>/css/bootstrap.css': '<%= config.app %>/scss/bootstrap.scss'
        }
      },
      app : {
        files: {
          '<%= config.app %>/css/app.css': '<%= config.app %>/scss/app.scss'
        }
      }
    },

    // Post process CSS files
    postcss : {
      bootstrap: {
        src: '<%= config.app %>/css/bootstrap.css',
        options : { processors : [require('autoprefixer')({browsers:'last 2 versions'}) ] }
      },

      app: {
        src: '<%= config.app %>/css/app.css',
        options : { processors : [require('autoprefixer')({browsers:'last 2 versions'}) ] }
      },

      dist : {
        src : '<%= config.dist %>/css/*.css',
        options: { processors : [ require('cssnano')() ] }
      }
    },


    imagemin : {
      options : {
        optimizationLevel : 6,
        svgoPlugins: [{ removeViewBox: false }],
        use: [mozjpeg()]
      },
      dist : {
        files : [{
          expand : true,
          cwd : '<%= config.app %>/assets/images/',
          src : ['**/*.{png,gif,jpg,jpeg}'],
          dest : '<%= config.dist %>/assets/images/'
        }]
      },
      dev : {
        // options : { optimizationLevel : 7 },
        files : [{
          expand : true,
          cwd : '<%= config.app %>/assets/images/',
          src : ['**/*.{png,gif,jpg,jpeg}'],
          dest : '<%= config.build %>/assets/images/'
        }]
      }
    },

    // Copy task
    copy : {
      bootstrap_fonts : {
        files : [
          {
            expand : true,
            cwd : 'bower_components/bootstrap-sass/assets/fonts/',
            src : ['**/*'],
            dest : '<%= config.app %>/fonts/'
          }
        ]
      },
      js : {
        files : [
          {
            expand : true,
            cwd : 'bower_components/bootstrap-sass/assets/javascripts/',
            src : ['bootstrap.min.js'],
            dest : '<%= config.app %>/js/'
          },
          {
            expand : true,
            cwd : 'bower_components/jquery/dist/',
            src : ['jquery.min.js'],
            dest : '<%= config.app %>/js/'
          }
        ]
      },
      html : {
        files : [
          {
            expand : true,
            cwd : '<%= config.app %>/',
            src : ['**/*.html','fonts/{**/**/*,*}','js/app.js','css/app.css','assets/images/*'],
            dest : '<%= config.dist %>/'
          }
        ]
      }
    },

    clean : {
      dist : { src : ['<%= config.dist %>'] },
      tmp : { src : ['.tmp'] }
    },


    // Usemin
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare : {
      html : '<%= config.app %>/*.html',
      options : {
        dest : '<%= config.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        options: {
            assetsDirs: [
                '<%= config.dist %>',
                '<%= config.dist %>/assets/images',
                '<%= config.dist %>/css',
                '<%= config.dist %>/js',
                '<%= config.dist %>/vendor'
            ]
        },
        html: ['<%= config.dist %>/**/*.html'],
        js: ['<%= config.dist %>/js/*.js'],
        css: ['<%= config.dist %>/css/*.css']
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
          '<%= config.app %>/*.html',
          '<%= config.app %>/js/*.js',
          '<%= config.app %>/assets/**/*.{jpg,png,gif,jpeg}'
        ],
        options: {
          livereload: true
        }
      },
      boostrap_sass : {
        files : [
          '<%= config.app %>/scss/bootstrap.scss'
        ],
        tasks : ['sass:bootstrap','postcss:bootstrap']
      },
      app_sass : {
        files: [
          '<%= config.app %>/scss/{*,**/*,**/**/*}.scss',
          '!<%= config.app %>/scss/bootstrap.scss'
        ],
        tasks: ['sass:app','postcss:app']
      }
    }
  });

  // Developer centric tasks
  grunt.registerTask('dev', 'Build for developers', [
    'build',
    'express',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', 'Build development environment', [
    'copy:bootstrap_fonts',
    'copy:js',
    'sass',
    'postcss:bootstrap',
    'postcss:app'
  ]);

  grunt.registerTask('dist', 'Build for production environment', [
    'clean:dist',
    'build',
    'useminPrepare',
    'copy:html',
    'imagemin:dist',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
    'clean:tmp'
  ]);

  // default task for developers
  grunt.registerTask('default', ['dev']);

};