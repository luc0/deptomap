const gulp = require('gulp');
const exec = require('child_process').exec;

const paths = {
  allSrcJs: 'app/**/*.js',
};

gulp.task('main', (callback) => {
  exec(`node ${paths.libDir}`, (error, stdout) => {
    console.log(stdout);
    return callback(error);
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);