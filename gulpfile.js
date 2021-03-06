/* jshint strict: false */

var del         = require('del'),
    gulp        = require('gulp'),
    yargs       = require('yargs'),
    browserSync = require('browser-sync'),
    loadplugins = require('gulp-load-plugins'),
    plugins     = loadplugins();

// Args

var argv = yargs
    .default('port',       3000)
    .default('dev',        false)
    .default('nosync',     false)
    .default('major',      false)
    .default('minor',      false)
    .default('patch',      true)
    .default('prerelease', false)
    .boolean([ 'major', 'minor', 'patch' ])
    .argv;

// Gulp

gulp.task('clean', function(next) {
    del.sync([ 'dist' ]);
    next();
});

gulp.task('bower', function() {
    return gulp.src([ 'bower_components/**/*' ])
        .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('assets', function() {
    return gulp.src([ 'src/assets/**/*.*' ])
        .pipe(gulp.dest('dist/'));
});

gulp.task('img', [ 'optimize' ], function() {
    return gulp.src([ 'src/img/**/*.*' ])
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('optimize', function() {
    return gulp.src([ 'src/img/**/*.*' ])
        .pipe(plugins.imagemin({
            progressive: true,
            optimizationLevel: 7,
        }))
        .pipe(gulp.dest('src/img/'));
});

gulp.task('sass', function() {
    return gulp.src([ 'src/sass/styles.{css,scss,sass}' ])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            outputStyle: argv.dev ? 'expanded' : 'compressed'
        }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src([ 'src/js/vendors/*' ])
        .pipe(gulp.dest('dist/js/vendors/'));

    return gulp.src([
        'bower_components/angular/angular.min.js',
        'src/js/app.{js,coffee}',
        'src/js/*/**/*.{js,coffee}',
        '!src/js/vendors/*'
    ] )
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.if(/\.coffee$/, plugins.coffee({
            sourceMap: true
        })))
        .pipe(plugins.concat('bundle.min.js'))
        // .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('pug', function () {
    return gulp.src([ 'src/pug/**/*.pug', '!src/pug/**/_*.pug' ])
        .pipe(plugins.plumber())
        .pipe(plugins.pug({
            locals: require('./config.json'),
            pretty: argv.dev
        }))
        .pipe(plugins.rename(function (path) {
            if (path.basename !== 'index') {
                path.dirname  = path.dirname + '/' + path.basename;
                path.basename = 'index';
            }
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync({
        notify:    false,
        ghostMode: !argv.nosync,
        port:      argv.port,
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('reload', function () {
    return browserSync.reload();
});

gulp.task('bump', function () {
    var version = 'patch';

    if (argv.major) {
        version = 'major';
    } else if (argv.minor) {
        version = 'minor';
    } else if (argv.prerelease) {
        version = 'prerelease';
    }

    return gulp.src([ './package.json', './bower.json', ])
        .pipe(plugins.bump({
            type: version
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build', [ 'clean', 'bower', 'js', 'sass', 'pug', 'img', 'assets' ]);

gulp.task('watch', [ 'serve' ], function() {
    gulp.watch('bower_components/**/*',         [ 'bower',  ]);
    gulp.watch('src/img/**/*',                  [ 'img',    ]);
    gulp.watch('src/js/**/*.{js,coffee}',       [ 'js',     ]);
    gulp.watch('src/sass/**/*.{css,scss,sass}', [ 'sass',   ]);
    gulp.watch('src/pug/**/*.pug',              [ 'pug',   ]);
    gulp.watch('src/assets/**/*',               [ 'assets', ]);
});

gulp.task('default', [ 'build', 'watch' ]);

