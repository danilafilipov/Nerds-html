var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var watch = require("gulp-watch");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();
var run = require("run-sequence");

gulp.task("style", function () {
  gulp.src("source/sass/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(gulp.dest("source/css/style.css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task("sprite", function () {
	return gulp.src("source/img/icon-*.svg")
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("sprite.svg"))
	.pipe(gulp.dest("source/img"));
});

gulp.task("images", function () {
	return gulp.src("source/img/**/*.{png,jpg,svg}")
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
	.pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
	return gulp.src("source/img/**/*.{png,jpg}")
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest("source/img"));
});

gulp.task("html", function () {
	return gulp.src("source/*.html")
	.pipe(posthtml([
		include()
		]))
	.pipe(gulp.dest("source"));
});

gulp.task("copy", function (){
	return gulp.src([   
		"source/fonts/**/*.{woff,woff2}",
		"source/img/**",
		"source/js/**"
		], {
			base: "source"
		})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
	return del("build/");
});

gulp.task("serve", ["style"], function() {
	server.init({
		server: "source/"
	});

	gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
	gulp.watch("source/*.html")
		.on("change", server.reload);
});

gulp.task("build", function (done) {
	run("style", "sprite", "html", done);
});

