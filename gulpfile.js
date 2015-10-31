'use strict';

const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const rename = require("gulp-rename");
const source = require ('vinyl-source-stream');
const connect = require('gulp-connect');
const babelify = require('babelify');
const watchify = require('watchify');
const browserify = require('browserify');
const sequence = require('run-sequence');

gulp.task('clean', function() {
	del(['js/*.js']);
});

gulp.task('server', function() {
	gulp.watch('css/**/*', ['styles']);
	gulp.watch('*.html', ['html']);
	connect.server({
		root : '.',
		livereload : true,
		fallback : 'index.html',
	});
});

gulp.task('browserify', function() {
	return generateBundle('src/app.jsx', 'main', true);
});
function generateBundle(path, output, watch) {

	let bundler = browserify({
		entries : path,
		transform : [
			[babelify, { presets: ["es2015", "react"] }],
		]
	}, watchify.args);

	if ( watch ) {
		bundler = watchify(bundler);
		bundler.on('update', rebundle);
		bundler.on('log', gutil.log);
	}

	function rebundle() {
		bundler
			.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source('bundle.js'))
			.pipe(rename(function (path) {
				path.basename = output;
				path.extname = '.js';
			}))
			.pipe(gulp.dest('js'))
			.pipe(connect.reload());
	}

	return rebundle();
}

gulp.task('default', ['clean'], function(cb) {
	cb = cb || function() {};
	sequence(['browserify'], 'server', cb);
});
