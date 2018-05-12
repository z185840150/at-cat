import del from 'del'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import webpack from 'webpack'
import path from 'path'
import RunSequence from 'run-sequence'

const plugins = gulpLoadPlugins()

const paths = {
  es5: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
  tests: './server/tests/*.js'
}

// Clean up dist and coverage directory
gulp.task('clean', () => {
  del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage'])
})

// Copy non-js files to dist
gulp.task('copy', () => gulp.src(paths.nonJs)
  .pipe(plugins.newer('dist'))
  .pipe(gulp.dest('dist')))

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () => gulp
  .src([...paths.es5, '!gulpfile.babel.js'], { base: '.' })
  .pipe(plugins.newer('dist'))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel())
  .pipe(plugins.sourcemaps.write('.', {
    includeContent: false,
    sourceRoot: file => path.relative(file.path, __dirname)
  }))
  .pipe(gulp.dest('dist')))

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel'], () => plugins
  .nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel']
  })
)

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => { RunSequence(['copy', 'babel']) })

// gulp serve for development
gulp.task('dev', ['clean'], () => RunSequence('nodemon'))

gulp.task('webpack', ['clean:webpack'], cb => {
  webpack(require('../webpack.config.js')(), (err, stats) => {
    console.log(err, stats)
    cb()
  })
})

gulp.task('watch:webpack', ['clean:webpack'], () => {})

gulp.task('build:webpack', ['clean:webpack'], cb => {})

gulp.task('clean:webpack', () => {})
