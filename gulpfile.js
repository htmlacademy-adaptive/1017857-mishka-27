import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import browser from 'browser-sync';
import nunjucksRender from 'gulp-nunjucks-render';
import htmlmin from 'gulp-htmlmin';
import del from 'del';


// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Views

const views = () => {
  return gulp.src('source/views/pages/*.html')
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: ['source/views/templates/'],
      envOptions: {
        autoescape: false
      },
    }))
    .pipe(gulp.dest('source'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
}

//Scripts
const scripts = () => {
  return gulp.src('source/js/scripts.js')
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

//Images
const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(gulp.dest('build/img'));
}

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () =>
  gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Clean
const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/views/**/*.html', gulp.series(views));
  gulp.watch('source/js/script.js', gulp.series(scripts));
}

// Build

export const build = gulp.series(
    clean,
    copy,
    optimizeImages,
    gulp.parallel(styles, views, scripts, svg, sprite, createWebp),
  );


// Default

export default gulp.series(
    clean,
    copy,
    copyImages,
    gulp.parallel(
      styles,
      views,
      scripts,
      svg,
      sprite,
      createWebp
    ),
    gulp.series(
      server,
      watcher
    )
  );
