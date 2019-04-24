const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const svgSprite = require("gulp-svg-sprite");
const rimraf = require("rimraf");

const config = {
  svgSprite: {
    shape: {
      dimension: {
        // Set maximum dimensions
        maxWidth: 500,
        maxHeight: 500
      },
      spacing: {
        // Add padding
        padding: 0
      }
    },
    mode: {
      symbol: {
        dest: "."
      }
    }
  },
  server: {
    baseDir: "./"
  },
  path: {
    clean: "./build",
    dest: {
      svg: "./build/img/vector/sprite",
      styles: "./build/css",
      scripts: "./build/js",
      images: "./build/img",
      fonts: "./build/fonts"
    },
    src: {
      svg: "./src/img/svg/*.svg",
      styles: "./src/sass/main.scss",
      scripts: "./src/js/**/*.js",
      images: "./src/img/**/*.*",
      fonts: "./src/fonts/*"
    },
    watch: {
      styles: "./src/sass/**/*.scss",
      scripts: "./src/js/**/*.js",
      images: "./src/img/**/*.*",
      fonts: "",
      html: "./*.html"
    }
  }
};

function clean(cb) {
  rimraf(config.path.clean, cb);
}

function makeSvgSprite() {
  return gulp
    .src(config.path.src.svg)
    .pipe(svgSprite(config.svgSprite))
    .pipe(gulp.dest(config.path.dest.svg));
}

function makeStyles() {
  return gulp
    .src(config.path.src.styles)
    .pipe(
      sass({
        outputStyle: "expanded"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["> 0.1%"],
        cascade: false
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(config.path.dest.styles))
    .pipe(browserSync.stream());
}

function makeScripts() {
  return gulp
    .src(config.path.src.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(config.path.dest.scripts))
    .pipe(browserSync.stream());
}

function copyImages() {
  return gulp
    .src(config.path.src.images)
    .pipe(gulp.dest(config.path.dest.images));
}

function makeFonts() {
  return gulp.src(config.path.src.fonts)
    .pipe(gulp.dest(config.path.dest.fonts));
}

function watch() {
  browserSync.init({
    server: config.server,
    notify: false
  });

  gulp.watch(config.path.watch.styles, makeStyles);
  gulp.watch(config.path.watch.scripts, makeScripts);
  // gulp.watch(config.path.watch.images, copyImages);
  gulp.watch(config.path.watch.html).on("change", browserSync.reload);
}

gulp.task("clean", clean);
gulp.task("svgsprite", makeSvgSprite);
gulp.task("copyimg", copyImages);
gulp.task("styles", makeStyles);
gulp.task("scripts", makeScripts);
gulp.task("fonts", makeFonts);
gulp.task("watch", watch);

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.series("scripts", "styles", "fonts", "copyimg", "svgsprite")
  )
);
