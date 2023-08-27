const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
// const groupMedia = require('gulp-group-css-media-queries'); //! Соединяеит повтор media
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


// Обработка CLEAN
gulp.task('clean', (done) => {

  if (fs.existsSync('./dist/')) {
    return gulp
      .src('./dist', { read: false })
      .pipe(clean({ force: true }))
  }
  done();
});

// Обработка INCLUDE
const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file'
};


const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      tittle: 'tittle',
      message: 'Error <%= error.message %>',
      sound: false
    }),
  }
};

// Обработка HTML
gulp.task('html', () => {
  return gulp
    .src('./src/html/**/*.html')
    .pipe(changed('./dist/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest('./dist'))
});

// Обработка SASS
gulp.task('sass', () => {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./dist/css/'))
    .pipe(plumber(plumberNotify('Scss')))
    .pipe(sourceMaps.init())
    .pipe(sass())
    // .pipe(groupMedia()) //! Соединяеит повтор media
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./dist/css/'))
});

// Обработка JS
gulp.task('js', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./dist/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest('./dist/js'))
});

// Обработка ICONS
gulp.task('icons', () => {
  return gulp
    .src('./src/icons/**/*')
    .pipe(changed('./dist/icons/'))
    .pipe(gulp.dest('./dist/icons/'))

});


// Обработка IMG
gulp.task('images', () => {
  return gulp
    .src('./src/images/**/*')
    .pipe(changed('./dist/images/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./dist/images/'))

});

// Обработка FONTS
gulp.task('fonts', () => {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./dist/fonts/'))
    .pipe(gulp.dest('./dist/fonts/'))

});

// Обработка FILES
gulp.task('files', () => {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./dist/files/'))
    .pipe(gulp.dest('./dist/files/'))

});

// Обработка SERVERA
const serverOptions = {
  Livereload: true,
  open: true
};

gulp.task('server', () => {
  return gulp
    .src('./dist/')
    .pipe(server(serverOptions))
})

// Обработка WATCH
gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./src/**/*.html', gulp.parallel('html'));
  gulp.watch('./src/icons/**/*', gulp.parallel('icons'));
  gulp.watch('./src/images/**/*', gulp.parallel('images'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
  gulp.watch('./src/files/**/*', gulp.parallel('files'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
});


// Запуск всей сборки
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel(
    'html',
    'sass',
    'images',
    'icons',
    'fonts',
    'files',
    'js'),
  gulp.parallel('server', 'watch')
));