// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
// Importing all the Gulp-related packages we want to use
const babel = require("gulp-babel");
var clean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
var replace = require("gulp-replace");
var inject = require("gulp-inject");
var CacheBuster = require("gulp-cachebust");
var cachebust = new CacheBuster();

// File paths
const files = {
  scssPath: "assets/scss/*.scss",
  scssLibPath: "assets/scss/lib/*.scss",
  jsPath: "assets/js/*.js",
  jsLibPath: "assets/js/lib/*.js",
  publicCssPath: "assets/public/css",
  publicJSPath: "assets/public/js"
};

function removeCurrentCssFiles() {
  src("assets/public/css/*.css", { read: true }).pipe(clean({ force: true }));
}
// Sass task: compiles the style.scss file into style.css
function scssTask() {
  removeCurrentCssFiles();
  return src(files.scssPath)
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(cachebust.resources())
    .pipe(dest(files.publicCssPath)); // put final CSS in dist folder
}
function removeCurrentLibCssFiles() {
  src("assets/public/css/lib/*.css", { read: true }).pipe(
    clean({ force: true })
  );
}
function scssLibTask() {
  removeCurrentLibCssFiles();
  return src(files.scssLibPath)
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(dest(files.publicCssPath)); // put final CSS in dist folder
}
function removeCurrentJSFiles() {
  src("assets/public/js/main.min.*.js", { read: true }).pipe(
    clean({ force: true })
  );
}
function injectFiles() {
  var target = src("./index.html");
  var sources = src(["./assets/public/js/*.js", "./assets/public/css/*.css"], {
    read: false
  });
  return target
    .pipe(inject(sources))
    .pipe(replace('src="/assets', 'src="assets'))
    .pipe(replace('href="/assets', 'href="assets'))
    .pipe(dest("./"));
}
// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  removeCurrentJSFiles();
  return src([
    files.jsPath
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(
      babel({
        presets: [
          [
            "@babel/env",
            {
              modules: false
            }
          ]
        ]
      })
    )
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(cachebust.resources())
    .pipe(dest(files.publicJSPath));
}

function removeCurrentLibJSFiles() {
  src("assets/public/js/lib.min.*.js", { read: true }).pipe(
    clean({ force: true })
  );
}
// JS task: concatenates and uglifies JS files to script.js
function jsLibTask() {
  removeCurrentLibJSFiles();
  return src(files.jsLibPath)
    .pipe(concat("lib.min.js"))
    .pipe(uglify())
    .pipe(cachebust.resources())
    .pipe(dest(files.publicJSPath));
}

// Cachebust

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch("./assets/public/js/*.js", injectFiles);
  watch("./assets/public/css/*.css", injectFiles);
  watch(
    [files.scssPath, files.jsPath],
    { interval: 1000, usePolling: true }, //Makes docker work
    series(parallel(scssTask, scssLibTask, jsTask, jsLibTask))
  );
}
// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
  parallel(scssTask, scssLibTask, jsTask, jsLibTask, injectFiles),
  watchTask
);
