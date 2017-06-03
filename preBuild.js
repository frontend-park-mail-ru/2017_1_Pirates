'use strict';


const fs = require('fs');
const download = require('download-file');


const patch = () => {
    const content = fs.readFileSync('./static/babylon.d.ts', 'utf-8');

    if (!String(content).startsWith('/* ===[PROJECT MOTION PATCHED]=== */\n')) {
        const canvasContent = fs.readFileSync('./static/babylon.2.5.canvas2d.d.ts');

        fs.writeFileSync('./static/babylon.d.ts', '/* ===[PROJECT MOTION PATCHED]=== */' +
                content + canvasContent);
        fs.writeFileSync('./static/babylon.2.5.canvas2d.d.ts', '/* ===[REMOVED BY PROJECT MOTION]=== */\n');
    }
};


/*if (!fs.existsSync('./static/babylon.2.5.canvas2d.js')) {
    download('https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/babylon.2.5.canvas2d.js',
                { directory: './static/', filename: 'babylon.2.5.canvas2d.js' }, () => {
        download('https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/babylon.2.5.canvas2d.d.ts',
                    { directory: './static/', filename: 'babylon.2.5.canvas2d.d.ts' }, () => {
                patch();
            });
        });
} else {
    patch();
}*/

