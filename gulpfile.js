var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
  pages: ["src/*.html"],
};

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/amondz.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify, { target: "es6" })
      .transform("babelify", {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-runtime"],
        extensions: [".tsx", ".ts"],
      })
      .bundle()
      .pipe(source("amondz.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
  })
);
