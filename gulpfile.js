var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var rev = require('gulp-rev-append');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
const watch = require('gulp-watch');
var less = require('gulp-less');
var livereload = require('gulp-livereload');


gulp.task('default', function() {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('testRev', function() {
    gulp.src('src/html/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/html'));
});

gulp.task('gul-autoprefixer', () =>
    gulp.src('src/css/*.css')
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(postcss([autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    })]))
    .pipe(sourcemaps.write('dist/css/'))
    .pipe(gulp.dest('dist/css/'))
);


gulp.task('testConcat', function() {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(gulp.dest('dist/js'));
});

gulp.task('testHtmlmin', function() {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});
gulp.task('minify-css', function() {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }, { debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('stream', function() {
    return watch('src/**/*.css',{ignoreInitial: false}).pipe(gulp.dest('dist/css/'));
});
gulp.task('callback', function() {
    return watch('src/**/*.css', function() {
        gulp.src('src/**/*.css').pipe(gulp.dest('dist/css/'));
    });
});


'use strict';
var sass = require('gulp-sass');
gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(livereload())
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('dist/sass/'));
});
gulp.task('sass:watch', function () {
    livereload.listen();
    gulp.watch('src/sass/**/*.scss', ['sass']);
});

var http = require("http");
var st = require("st");

gulp.task('server', function(done) {
  http.createServer(
    st({ path: __dirname + '/dist', index: 'index.html', cache: false })
  ).listen(8080, done);
});


var uglify = require('gulp-uglify');
var pump = require('pump');
gulp.task('compress', function (cb) {
  pump([
        gulp.src('lib/*.js'),
        uglify(),
        gulp.dest('dist')
  ],cb);
});

var concat = require("gulp-concat");
gulp.task('concat', function () {
    gulp.src('js/*.js')  //要合并的文件
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/js'));
});

/*
var minifyHtml = require("gulp-minify-html");
gulp.task('minify-html', function () {
    gulp.src('html/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('dist/html'));
});
*/

