import gulp from 'gulp';
import browserSync from 'browser-sync';
import cssImport from 'gulp-cssimport';
import gulpCssimport from 'gulp-cssimport';
import { deleteAsync } from 'del';
import htmlmin from 'gulp-htmlmin';
import cleanCss from 'gulp-clean-css';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import gulpImg from 'gulp-image';
import { stream as critical } from 'critical';

const allJS = [
    "src/libs/jquery-3.6.0.min.js",
    "src/libs/jquery-ui.min.js",
    "src/libs/inputmask.min.js",
    "src/libs/js.cookie.min.js",
    "src/libs/just-validate.production.min.js",
    "src/libs/swiper-bundle.min.js",
    "src/libs/axios.min.js",
];

// задачи

export const html = () => gulp
    .src('src/*.html')
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

export const css = () => gulp
    .src('src/css/style.css')
    .pipe(sourcemaps.init())
    .pipe(gulpCssimport({
        extensions: ['css'],
    }))
    .pipe(cleanCss({
        2: {
            specialComments: 0,
        }
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());

export const img = () => gulp
    .src('src/img/**/*.{jpg,svg,jpeg,png}')
    .pipe(gulpImg({
        optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
        pngquant: ['--speed=1', '--force', 256],
        zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
        jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
        mozjpeg: ['-optimize', '-progressive'],
        gifsicle: ['--optimize'],
        svgo: true,
    }))
    .pipe(gulp.dest('dist/img'));

export const js = () => gulp
    .src([...allJS, 'src/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(concat('index.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());

export const critCss = () => gulp
    .src('dist/*.html')
    .pipe(critical({
        base: 'dist/',
        inline: true,
        css: ['dist/css/style.css']
    }))
    .on('error', err => {
        console.error(err.message);
    })
    .pipe(gulp.dest('dist'))

export const copy = () => gulp
    .src('src/fonts/**/*', {
        base: 'src'
    })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({
        once: true
    }));

export const server = () => {
    browserSync.init({
        ui: false,
        notify: false,
        // tunnel: true,
        server: {
            baseDir: 'dist'
        }
    })

    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/css/**/*.css', css);
    gulp.watch('./src/js/**/*.js', js);
    gulp.watch('./src/fonts/**/*', copy)
};

export const clear = (done) => {
    deleteAsync('dist/**/*', {
        force: true,
    });
    done();
};

// запуск

export const base = gulp.parallel(html, css, js, img, copy);

export const build = gulp.series(clear, base, critCss);

export default gulp.series(base, server);