var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var pug = require('gulp-pug');
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var jsmin = require('gulp-jsmin');
var rigger = require('gulp-rigger');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var pngquant = require('imagemin-pngquant');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        pug: 'src/pug/*.pug',
        html: 'src/html/*.html',
        js: 'src/js/**/*.*',
        style: 'src/scss/*.scss',
        img: 'src/img/**/*.*'
    },
    watch: {
        html: 'src/html/*.html',
        pug: 'src/pug/*.pug',
        style: 'src/scss/**/*.*',
        js: 'src/js/**/*.*',
        img: 'src/img/**/*.*'
    },
    clean: './build'
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('pug:build', function () {
    gulp.src(path.src.pug)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(jsmin())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({errLogToConsole: true}))
        .pipe(prefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'], { cascade: true })) // Создаем префиксы
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('build', [
    'html:build',
    'style:build',
    'js:build',
    'image:build'
]);

gulp.task('buildPug', [
    'pug:build',
    'style:build',
    'js:build',
    'image:build'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        setTimeout(function(){
            gulp.start('style:build');
        }, 1500);
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('watchPug', function () {
    watch([path.watch.pug], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        setTimeout(function(){
            gulp.start('style:build');
        }, 1500);
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('html', ['build', 'browser-sync', 'watch']);
gulp.task('pug', ['buildPug', 'browser-sync', 'watchPug']);