/**
 * Created by way on 2015/1/14.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var less = require('gulp-less');
var mincss = require('gulp-clean-css');
var tap = require('gulp-tap');
var pkg = require('./package.json');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('webpack-stream');
var named = require('vinyl-named');
var wpcfg = require('./webpack.config.js');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');

var dst = './dist/'; // 'dist'  /Users/way/prj/koa/koastart/public/

gulp.task('build', function () {
  var banner = ['/*!',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.repository.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

  // 复制 HTML 到 public 目录
  gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dst));

  // 复制 view 文件到 public/view/flightmb
  gulp.src('src/flightmb/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dst + 'flightmb/'));

  gulp.src([
    'src/flightmb.js',
  ]) // , {common: ['whatwg-fetch']}
    .pipe(named())
    .pipe(webpack(wpcfg))
    // .pipe(gulp.dest('./build'));
  // gulp.src('src/editTable.js')
    .pipe(tap(function(file, t){
      var contents = file.contents.toString();
      contents = contents.replace('${version}', pkg.version);
      file.contents = new Buffer(contents);
    }))
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest(dst+'js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dst + 'js'));

  gulp.src([
    'src/less/knife.less',
    'src/less/flightmb.less',

  ])
    .pipe(less().on('error', function (e) {
      console.error(e.message);
      this.emit('end');
    }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest(dst+'css'))
    .pipe(mincss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dst + 'css'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['watch']);
