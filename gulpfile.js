var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var Server = require('karma').Server;
var stylish = require('jshint-stylish').reporter;
var localizeForFirefox = require('chrome-to-firefox-translation');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat');

var lintFiles = ['source/**/*.js', '!Source/**/*.min.js', '!Source/Chrome/background/google-maps-api.js'];

var chormeBuildpath = 'Build/Chrome/';
var firefoxBuildpath = 'Build/Firefox/';
var safariBuildpath = 'Build/Safari/CarbonFootprint.safariextension/';

gulp.task('karma', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('gjslint', function() {
	return gulp.src(lintFiles)
	  .pipe(gjslint())
	  .pipe(gjslint.reporter('jshint', stylish));
});

gulp.task('localesFF', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(localizeForFirefox())
	  .pipe(flatten())
	  .pipe(gulp.dest(firefoxBuildpath + 'locale'));
});

gulp.task('coreFirefox', function() {
	return gulp.src('Source/Core/**')
	  .pipe(gulp.dest(firefoxBuildpath + 'data'));
});

gulp.task('foldersFirefox', function() {
	return gulp.src('Source/Firefox/*/**')
	  .pipe(gulp.dest(firefoxBuildpath + 'data'));
});

gulp.task('filesFirefox', function() {
	return gulp.src('Source/Firefox/*.*')
	  .pipe(gulp.dest(firefoxBuildpath));
});

gulp.task('specificFirefox', ['foldersFirefox', 'filesFirefox']);

gulp.task('localesChrome', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(gulp.dest(chormeBuildpath + '_locales'));
});

gulp.task('coreChrome', function() {
	return gulp.src('Source/Core/**')
	  .pipe(gulp.dest(chormeBuildpath));
});

gulp.task('specificChrome', function() {
	return gulp.src('Source/Chrome/**')
	  .pipe(gulp.dest(chormeBuildpath));
});
gulp.task('coreSafari', function() {
	return gulp.src('Source/Core/**')
	  .pipe(gulp.dest(safariBuildpath));
});

gulp.task('chromeShared', function() {
	return gulp.src('Source/Chrome/background/**')
	  .pipe(gulp.dest(safariBuildpath + 'background/'));
});

gulp.task('specificSafari', function() {
	return gulp.src('Source/Safari/**')
	  .pipe(gulp.dest(safariBuildpath));
});

gulp.task('localesSafari', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(gulp.dest(safariBuildpath + '_locales'));
});

gulp.task('groupFirefox', ['localesFF', 'coreFirefox', 'specificFirefox']);
gulp.task('groupChrome', ['localesChrome', 'coreChrome', 'specificChrome']);
gulp.task('groupSafari', ['localesSafari', 'coreSafari', 'chromeShared','specificSafari']);

gulp.task('group', ['groupChrome', 'groupFirefox', 'groupSafari']);


gulp.task('test', ['gjslint']);
