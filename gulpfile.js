const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    src('./src/scss/style.scss', { sourcemaps: true})
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('./dist/css', {sourcemaps: '.'}));
    done();
}

function dev() {
    watch('./src/scss/**/*.scss', css);
    watch('./src/assets/img/**/*', imagenes)
}

function imagenes() {
    return src('./src/assets/img/**/*')
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe(dest('./dist/img'));
}

function versionWebp() {
    return src('./src/assets/img/**/*.{jpg, png}')
    .pipe(webp({quality: 50}))
    .pipe(dest('./dist/img'));
}

function versionAvif() {
    return src('./src/assets/img/**/*.{jpg, png}')
    .pipe(avif({quality: 50}))
    .pipe(dest('./dist/img'));
}


exports.css = css;
exports.dev = dev;
exports.imagenes = series(imagenes, versionWebp, versionAvif);
exports.default = series(css, dev);