var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
   // jade = require('gulp-jade'),
    sprites = require('gulp.spritesmith');

gulp.task('connect', function () {
    connect.server();
});

var path = {
    build: {
        html: 'template/',
        js: 'template/js/',
        css: 'template/css/',
        img: 'template/img/',
        fonts: 'template/fonts/'
    },
    src: {
        html: 'build/index.html',
        js: 'build/js/scripts.js',
        style: 'build/css/style.scss',
        img: 'build/img/**/*.*',
        fonts: 'build/fonts/**/*.*'
    },
    watch: {
        html: 'build/*.html',
        js: 'build/js/**/*.js',
        style: 'build/css/**/*.scss',
        img: 'build/img/**/*.*',
        fonts: 'build/fonts/**/*.*'
    }
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
       // .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        //.pipe(rigger()) 
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(prefixer({browsers:['firefox 5']}))
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
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
        .pipe(connect.reload());
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(connect.reload());
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'watch']);