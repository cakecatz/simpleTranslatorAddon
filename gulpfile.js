var gulp = require('gulp'),
    watch = require('gulp-watch'),
    exec = require('child_process').exec;
var p = require('./package.json');

var addonReloadCommand =
  'cd ./simpleTranslator/ && cfx xpi && wget --post-file=./' + p.name + '.xpi http://localhost:8888/';

gulp.task('js-watch', function(){
  watch('./simpleTranslator/**/*.js', function(){
    rebuild();
  });
});

gulp.task('html-watch', function() {
  watch('./simpleTranslator/**/*.html', function() {
    rebuild();
  });
});

function rebuild() {
  exec(addonReloadCommand, function(err, stdout, stderr){
    if (err) {
      console.error(err);
    }

    if (stderr) {
      console.error(stderr);
    }

    console.log(stdout);
  });
}

gulp.task('default', ['js-watch', 'html-watch']);