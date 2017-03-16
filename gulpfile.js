'use strict';

var gulp = require('gulp'),
		prefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		cssnano = require('gulp-cssnano'),
		concat = require('gulp-concat'),
		connect = require('gulp-connect'),
		livereload = require('gulp-livereload');

var path = {
		dist: {
				html: {
						main: 'dist/',
						templ: 'dist/templates/',
				},
				js: 'dist/js/',
				css: 'dist/css/',
				img: 'dist/img/',
				fonts: 'dist/fonts/'
		},
		src: {
				html: {
						main: 'src/index.html',
						templ: 'src/templates/**/*.html'
				},
				js: 'src/js/**/*.js',
				style: {
						main: 'src/style/style.scss',
						libs: 'src/style/libs.scss'
				},
				img: 'src/img/**/*.*',
				fonts: 'src/fonts/**/*.*'
		},
		watch: {
				html: {
						main: 'src/index.html',
						templ: 'src/templates/**/*.html'
				},
				js: {
						main: 'src/js/**/*.js',
						libs: 'src/js/**/*.js'
				},
				style: {
						main: 'src/style/_main_main.scss',
						libs: 'src/style/libs.scss'
				},
				img: 'src/img/**/*.*',
				fonts: 'src/fonts/**/*.*'
		},
		clean: './dist'
};

gulp.task('webserver', function() {
		connect.server({
				root: './dist/',
				livereload: true,
				port: 8080
		});
});


gulp.task('html:main', function() {
		gulp.src(path.src.html.main)
				.pipe(gulp.dest(path.dist.html.main))
				.pipe(connect.reload());
});

gulp.task('js', function() {
		gulp.src([
						'src/js/app.js',
						'src/js/controllers/mainCtrl.js',
				])
				.pipe(concat('main.js'))
				.pipe(gulp.dest(path.dist.js))
				.pipe(connect.reload());
});

gulp.task('style', function() {
		gulp.src(path.src.style.main)
				.pipe(sourcemaps.init({
						loadMaps: true
				}))
				.pipe(sass().on('error', sass.logError))
				.pipe(prefixer(['last 15 versions', '> 1%', 'ie 9', 'ie 8'], {
						cascade: true
				}))
				.pipe(cssnano())
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(path.dist.css))
				.pipe(connect.reload());
});
gulp.task('img', function() {
		gulp.src(path.src.img)
				.pipe(gulp.dest(path.dist.img))
				.pipe(connect.reload());
});

gulp.task('watch', function() {
		gulp.watch(path.watch.style.main, ['style']);
		gulp.watch(path.watch.js.main, ['js']);
		gulp.watch(path.watch.html.main, ['html:main']);
		gulp.watch(path.watch.img, ['img']);
});

gulp.task('build', [
		'html:main',
		'js',
		'style',
		'img'
]);
gulp.task('default', ['build', 'webserver', 'watch']);