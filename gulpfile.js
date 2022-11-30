import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import nunjucksRender from 'gulp-nunjucks-render';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Views

export const views = () => {
  return gulp.src('source/views/pages/*.html')
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: ['source/views/templates/']
    }))
    .pipe(gulp.dest('source'))
    .pipe(browser.stream());
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
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
  gulp.watch('source/*.html').on('change', browser.reload);
}

export default gulp.series(
  views, styles, server, watcher
);
