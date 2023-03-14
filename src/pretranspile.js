import gulp from "gulp";
import esbuild from "gulp-esbuild";
import babel from "gulp-babel";

function build() {
    return gulp.src("tests/sources/async.js")
        // .pipe(esbuild({
        //     entryPoints: ["tests/sources/async.js"],
        //     outfile: "dist/bundle.js",
        //     bundle: true
        // }))
        .pipe(babel({
            plugins: ["babel-plugin-transform-async-to-promises"]
        }))
        .pipe(gulp.dest("dist"))
        .on("end", () => console.log("End"));
}

build();
