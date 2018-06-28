var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var bytediff = require('gulp-bytediff');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var bowerFiles = require('main-bower-files');
var plugins = require('gulp-load-plugins')();
var es = require('event-stream');  
var pipes = {};




pipes.orderedVendorScripts = function() {
    return plugins.order(['angular-route.js','angular.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};




pipes.validatedAppScripts = function() {  
    return gulp.src(['public/app/**/app.js', 'public/app/**/services/*.js','public/app/**/controllers/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};


pipes.builtVendorScriptsProd = function() {
    return gulp.src(bowerFiles('**/**/*.js'))
        .pipe(pipes.orderedVendorScripts())
         .pipe(ngAnnotate({add: true}))
       .pipe(plugins.concat('vendor.min.js'))

       .pipe(plugins.uglify())
        .pipe(gulp.dest('public/src/'));
};




pipes.builtStylesProd = function() {
    return gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.css','./public/app/**/*.css', ])
         .pipe(plugins.minifyCss())
        .pipe(gulp.dest('public/src/'));
};





pipes.validatedPartials = function() {
    return gulp.src(['public/app/**/*.html', '!public/app/index.html'])
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};
pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
               root: "/",
            moduleName: "templates"
        }))
        .pipe(gulp.dest('public/src/'))
};

pipes.builtAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();
    return es.merge(scriptedPartials, validatedAppScripts)
      .pipe(plugins.concat('app.min.js'))
        .pipe(pipes.orderedAppScripts())
          
            .pipe(babel({
            presets: ['env']
        }))

       
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('public/src/'));
};


pipes.buildAppScriptsProd = function(){
	  return gulp.src(['public/app/**/app.js', 'public/app/**/services/*.js', 'public/app/**/controllers/*.js'])
	    .pipe(plumber())
			.pipe(concat('app.js', {newLine: ';'}))
			.pipe(ngAnnotate({add: true}))
		.pipe(babel({
            presets: ['env']
        }))
			.pipe(bytediff.start())
				//.pipe(uglify())
			.pipe(bytediff.stop())
			.pipe(rename('app.min.js'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('public/src/'));
}


pipes.validatedIndex = function() {
    return gulp.src('./public/app/index.html')
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndexProd = function(){
	 var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest('public/src/')) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('public/src/'));
}


gulp.task('app', pipes.builtAppScriptsProd);

gulp.task('vendors',pipes.builtVendorScriptsProd);
gulp.task('css',pipes.builtStylesProd);

gulp.task('prod', pipes.builtIndexProd);


gulp.task('watch', ['prod'], function () {
	return gulp.watch('public/app/**/*.js', ['prod']);
});

gulp.task('default', ['watch', 'app']);