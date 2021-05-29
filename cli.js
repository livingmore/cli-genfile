#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const rootDir = process.cwd();

const appConfig = require(path.join(rootDir, 'app.json'));

const DIRS = {
    pages: 'pages',
    components: 'components'
}

program
  .version('0.1.3')
  .option('-p, --page-name <pageName...>', 'page name')
  .option('-c, --component-name <componentName...>', 'component name')

program.parse(process.argv);

const options = program.opts();

if(options.pageName) {
    console.log(`create page: ${options.pageName}`);
    copyDemoToPageName(options.pageName, DIRS.pages);
    writeAppConfig(options.pageName, DIRS.pages);
}

if(options.componentName) {
    console.log(`create component: ${options.componentName}`);
    copyDemoToPageName(options.componentName, DIRS.components);
    writeAppConfig(options.componentName, DIRS.components);
}


function _makeDirsSync(dirname) {
    if(fs.existsSync(dirname)) {
        return true;
    } else {
        if(_makeDirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function copyDemoToPageName(dirNames, baseDir) {
    const baseDirPath = path.join(rootDir, baseDir);
    if(!fs.existsSync(baseDirPath)){
        fs.mkdirSync(baseDirPath);
    }

    dirNames.forEach(dir => {
        const dirPath = path.join(baseDirPath, dir);
        if(fs.existsSync(dirPath)) {
            throw new Error(`目录已存在： ${dir}`);
        }
    });

    dirNames.forEach(dir => {
        const dirPath = path.join(baseDirPath, dir);
        _makeDirsSync(dirPath);

        const sourcePath = baseDir === DIRS.pages ? path.join(__dirname, 'demo', 'page-demo') : path.join(__dirname, 'demo', 'component-demo');
        
        const dirs = dir.split('/');
        const targetFileName = dirs[dirs.length - 1];

        _copyFile(sourcePath, dirPath, targetFileName);
    });
}

function _copyFile (sourcePath, targetPath, targetFileName) {
    const sourceFiles = fs.readdirSync(sourcePath);
    sourceFiles.forEach(fileName => {
        const sourceFilePath = path.resolve(sourcePath, fileName);
        const ext = fileName.split('.')[1];
        const targetFilePath = path.resolve(targetPath, `${targetFileName}.${ext}`);
        fs.copyFileSync(sourceFilePath, targetFilePath);
    })
}

function writeAppConfig(dirNames, baseDir) {
    baseDir = baseDir === DIRS.pages ? DIRS.pages: '/' + DIRS.components

    if(baseDir === DIRS.pages) {
        dirNames.forEach(dir => {
            const dirs = dir.split('/');
            const targetFileName = dirs[dirs.length - 1];
    
            if(!appConfig['pages']) {
                appConfig['pages'] = [];
            }
            const newPageRoute = `${DIRS.pages}/${dir}/${targetFileName}`
            if(!appConfig['pages'].includes(newPageRoute)) appConfig['pages'].push(newPageRoute);
        });
    } 
    // else {
    //     dirNames.forEach(dir => {
    //         const dirs = dir.split('/');
    //         const targetFileName = dirs[dirs.length - 1];
    
    //         if(!appConfig['usingComponents']) {
    //             appConfig['usingComponents'] = {};
    //         }
    //         appConfig['usingComponents'][targetFileName] = `/${DIRS.components}/${dir}/${targetFileName}`;
    //     })
    // }
    fs.writeFileSync(path.join(rootDir, 'app.json'), JSON.stringify(appConfig, null, 2));
}


