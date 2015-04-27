'use strict'

var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    streamify = require('gulp-streamify'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber')

var path = {
  HTML: 'index.html',
  SASS_FILES: '../**/*.{scss,sass}',
  SASS_ROOT: './style/main.scss',
  FONT_FILES: './fonts/**/*.{ttf,woff,eof,svg}',
  IMG_FILES: './images/**/*.{png,gif,jpg}',
  DIST: 'dist',
  DIST_JS: 'dist/js/',
  DIST_STYLE: 'dist/style/',
  DIST_IMG: 'dist/images/',
  DIST_FONTS: 'dist/fonts/',
  BROWSERIFY_ROOT: './js/index.js'
}

gulp.task('src_html_replace', function() {
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      js:  'js/build.js',
      css: 'style/main.css',
    }))
    .pipe(gulp.dest(path.DIST))
})


// The gulp-sass wrapper will fail when there is an error
// processing the SCSS files, breaking the Gulp pipe.
// That is somehow fixed with gulp-plumber.
gulp.task('src_styles', function() {
  
  return gulp.src(path.SASS_ROOT)
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({ errLogToConsole: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.DIST_STYLE))
})

// Gulp has a built-in watch system. We watch index.html and SCSS files. 
// Tasks are run beforehand to start in a clean way.
gulp.task('ordinary_watch', [ 'src_html_replace', 'src_styles', 'copyfiles' ], function () {
  gulp.watch(path.HTML, ['src_html_replace'])
  gulp.watch(path.SASS_FILES, ['src_styles'])
  gulp.watch([path.IMG_FILES, path.FONT_FILES], ['copyfiles'])
})

// Watchify was invented to avoid rebuilding the whole dependency tree from scratch
// when a single file was changed and it introduces significant time savings.
gulp.task('watchify', function() {

  // Browserify bundler, configured for reactify
  // with sources having a .jsx extension
  var bundler = browserify({
    entries: [path.BROWSERIFY_ROOT],
    transform: [reactify],
    extensions: ['.js', '.jsx'],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true // for watchify
  })

  var watcher = watchify(bundler)

  function updater() {
    watcher.bundle()
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // './' writes sourcemap in separate .map file 
      .pipe(gulp.dest(path.DIST_JS))

    gutil.log("JavaScript sources updated.")
  }

  var watcherReady = watcher
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .on('update', updater)
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('build.js'))
    .pipe(gulp.dest(path.DIST_JS))

  // Run the updater beforehand for a fresh start
  updater()

  return watcherReady
})


// Copy images and fonts
gulp.task('copyfiles', function() {
  gulp.src(path.FONT_FILES)
    .pipe(gulp.dest(path.DIST_FONTS))
  gulp.src(path.IMG_FILES)
    .pipe(gulp.dest(path.DIST_IMG))      
})

gulp.task('watch',
  [ 'ordinary_watch', 'watchify'])

gulp.task('default',
  ['watch'])
