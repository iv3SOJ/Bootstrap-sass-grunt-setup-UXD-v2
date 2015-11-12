module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Setup
  grunt.initConfig({
    mods : {
      dev : ['grunt-sass','grunt-contrib-watch','grunt-express','grunt-open','grunt-rev']
    },
    pkg: grunt.file.readJSON('config.json')
  });


  grunt.config('env', grunt.option('env') || process.env.GRUNT_ENV || 'dev');
  grunt.config('compress', grunt.config('env') === 'prod');

  // Disable caching of files
  grunt.config('rev', {
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
  });

  // SASS compilation
  grunt.config('sass', {
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
  });

  grunt.config('postcss', {
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
  });

  // Concat function for js files
  grunt.config('concat', {
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
  });


  grunt.config('injector', {
    options: {},
    my_target: {
      files: {
        '*.html': [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
          'js/app.js',
          'css/app.css'
        ]
      }
    }
  });

  // Uglify files
  grunt.config('uglify', {
    options: {
      mangle: false
    },
    my_target: {
      files: {
        'dist/js/app.js': 'dist/js/app.js'
      }
    }
  });

  // HTML Minification
  grunt.config('htmlmin',{
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   // Dictionary of files
        'dist/index.html': 'index.html'
      }
    }
  });

  // Webserver setup
  grunt.config('express', {
    all: {
      options: {
        // Set your file directory 
        bases : ['<%= pkg.location %>'],
        port: 9000,
        hostname: "0.0.0.0",
        livereload: true
      }
    }
  });

  // Open Browser
  grunt.config('open', {
    all: {
      path: 'http://localhost:9000/index.html',
      app: 'Chrome'
    }
  });

  // Watcher for file changes
  grunt.config('watch', {
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
  });

  // Developer centric tasks
  grunt.registerTask('dev', [], function(){
    // for(i = 0; i < grunt.config('mods').dev.length ; i++){
    //   grunt.loadNpmTasks(grunt.config('mods').dev[i]);
    //   console.log(grunt.config('mods').dev[i]);
    // }

    grunt.task.run(
      'sass:dev',
      'postcss:dev',
      'concat:dev',
      'injector',
      'express',
      'open',
      'watch'
      );
  });

  // default task for developers
  grunt.registerTask('default', ['dev']);

  // build task for production stage
  grunt.registerTask('build', [], function(){
    grunt.task.run(
      'sass:dist',
      'concat:dist',
      'uglify',
      'htmlmin'
      );
  });
};