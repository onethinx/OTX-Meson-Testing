//import * as logging from '@cmt/logging';
var output;

exports.execute = async (args) => {
    var ret = null;
    const vscode = args.require('vscode');
    switch (args.command)
    {
        case 'otx.preLaunch':
            ret = await otxBuild(vscode); 
            break;
        case 'otx.clean':
            ret = await otxClean(vscode);
            break;
        case 'otx.build':
            ret = await otxBuild(vscode);
            break;
        case 'otx.run':
            ret = await otxRun(vscode);
            break;
    }
    return ret;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


otxPreLaunch = async (vscode) => {
    var ret = await executeTask(vscode, "Meson: build");
    if (ret == 0) return '';
    vscode.window.showErrorMessage("The build task terminated with exit code:" + JSON.stringify(ret));
    vscode.commands.executeCommand('workbench.action.problems.focus');
    //await vscode.commands.executeCommand('workbench.panel.output.focus', 'Adapter Output');
    return null;
};

otxPreLaunchOLD = async (vscode) => {
    //var ret = await vscode.commands.executeCommand("mesonbuild.build", "");
    var ret = null;
    ret = await runMesonBuild(vscode, vscode.workspace.workspaceFolders[0].uri.path, "Debug");

     if (ret == '0') return '';
     // vscode.commands.executeCommand('workbench.panel.output.focus', 'Adapter Output');
      return null;

    // if (ret == 0) 
    // {
    //      vscode.commands.executeCommand('workbench.panel.output.focus', 'Adapter Output');
    //     return '';
    // }
    // //var ret2 = JSON.stringify(ret);
    // vscode.commands.executeCommand('workbench.action.problems.focus');
    // vscode.window.showErrorMessage("Your Onethinx code didn't built well...\n\nTry some more :-)", { modal: true });
    // return null;
};

otxClean = async (vscode) => {
    let { status, basePath } = await checkSetup(vscode);
    if (status == 'error') 
    {
        vscode.window.showErrorMessage("The build task terminated with exit code:" + JSON.stringify(ret));
        return null;
    }
    if (status == 'configured') return '';
    var ret = await executeTask(vscode, "Meson: clean-reconfigure");
    if (ret == 0) return '';
    vscode.window.showErrorMessage("The build task terminated with exit code:" + JSON.stringify(ret));
    return null;
};

otxBuild = async (vscode) => {
    let { status, basePath } =  await checkSetup(vscode);
    if (status == 'error') 
    {
        vscode.window.showErrorMessage("The build task terminated with exit code:" + JSON.stringify(ret));
        return null;
    }
    let sourcePath = path.join(basePath, "source");
    const mesonBuildFile = path.join(basePath, "meson.build");
    if (!fs.existsSync(mesonBuildFile))
    {
        vscode.window.showErrorMessage("meson.build file not found!");
        return null;
    }
    var headerContents = readDirectory(basePath, [], sourcePath, '.h', true);
    var sourceContents = readDirectory(basePath, [], sourcePath, '.c', false);

    updateMeson(mesonBuildFile, headerContents, sourceContents);
    var ret = await executeTask(vscode, "Meson: build");
    if (ret == 0) return '';
    vscode.window.showErrorMessage("The build task terminated with exit code:" + JSON.stringify(ret));
    vscode.commands.executeCommand('workbench.action.problems.focus');
    //await vscode.commands.executeCommand('workbench.panel.output.focus', 'Adapter Output');
    return null;
}

async function executeTask(vscode, taskName)
{   
    var tasks = await vscode.tasks.fetchTasks();
    var task = undefined;
    for (var t of tasks) {
        if (t.name === taskName) task = t;
    }
    if (task === undefined)
    {
        vscode.window.showErrorMessage("Can not find " + taskName + " task.");
        return;
    }
    const taskExecution = await vscode.tasks.executeTask(task);
    return new Promise((resolve) => {
        vscode.tasks.onDidEndTaskProcess(e => {
            if (e.execution === taskExecution || e.execution.task === task) 
                resolve(e.exitCode);
        });
    });
}

async function executeBuildTask(vscode) {
    var problemMatchers = [{
        owner: "linker1",
        severity: "error",
        fileLocation : "absolute",
        pattern: {
           regexp: "(\\S*\\.cp{0,2}):(\\d*):\\s(undefined reference to \\S*')",
           file: 1,
           line: 2,
           message: 3
        }
    }];
    let buildTask = 
    new vscode.Task(
        { type: 'shell' },
        vscode.TaskScope.Workspace,
        'Build',
        'Meson',
        new vscode.ShellExecution('ninja -C build'),
        problemMatchers
    );

    //buildTask.presentationOptions.clear = clearTerminalOutput;
   // buildTask.presentationOptions.showReuseMessage = true;
    const buildTaskExecution = await vscode.tasks.executeTask(buildTask);
    return new Promise((resolve) => {
        vscode.tasks.onDidEndTaskProcess(e => {
            if (e.execution === buildTaskExecution || e.execution.task === buildTask) 
                resolve(e.exitCode);
        });
    });

    // const execution =  vscode.tasks.executeTask(
    //     new vscode.Task(
    //       { type: 'Build' },
    //       vscode.TaskScope.Workspace,
    //       'Build',
    //       'Debug',
    //       new vscode.ShellExecution('ninja -C build'),
    //     ),
    //   );
    // return new Promise(resolve => {
    //     let disposable = vscode.tasks.onDidEndTask(e => {
    //         if (e.execution.task.group === vscode.TaskGroup.Build) {
    //             vscode.window.showErrorMessage("Your Onethinx code didn't built well...\n\nTry some more :-)", { modal: true });
    //             disposable.dispose();
    //             resolve();
    //         }
    //     });
    // });
}

async function executeCleanTask(vscode) {
    let buildTask = 
    new vscode.Task(
        { type: 'Meson Build' },
        vscode.TaskScope.Workspace,
        'Meson Build',
        'Meson Build',
        new vscode.ShellExecution('ninja -C build -t clean'),
      );
        const buildTaskExecution = await vscode.tasks.executeTask(buildTask);
        return new Promise((resolve) => {
            vscode.tasks.onDidEndTaskProcess(e => {
                if (e.execution === buildTaskExecution || e.execution.task === buildTask) 
                    resolve(e.exitCode);
            });
        });
}

async function getBuildTasks(vscode) {
    return new Promise<vscode.Task(resolve => {
        vscode.tasks.fetchTasks().then((tasks) => {
            resolve(tasks.filter((task) => task.group === vscode.TaskGroup.Build));
        });
    });
}

        //    vscode.window.showErrorMessage("Your Onethinx code didn't built well...\n\nTry some more :-)", { modal: true });
//                // if (ret == 0) 
//     {
//         //vscode.commands.executeCommand('workbench.action.problems.focus');
//         //vscode.commands.executeCommand('workbench.panel.output.focus', 'Git');
//         //vscode.commands.executeCommand('workbench.action.focusPanel', 'Problems');
//        // return '';
//     }
//     //vscode.commands.executeCommand('workbench.action.problems.focus');
//     //const output2 = logging.channelManager.get('CMake/Build');

//     //vscode.window.showErrorMessage("1" + output2 );
//     sleep(2000);
//   //    vscode.window.showErrorMessage("Your Onethinx code didn't built well...\n\nTry some more :-)");
//   if (output == null) output = vscode.window.createOutputChannel('OTX5');
//    vscode.commands.executeCommand('workbench.panel.output.focus', 'OTX3');
//        output.show();
//         output.clear();
//         output.appendLine(JSON.stringify(ret));
//         sleep(2000);
//         output.show();
//     return null;


otxRun = async (vscode) => {
    //var ret = await vscode.commands.executeCommand('workbench.action.debug.run');
    //var ret = await vscode.commands.executeCommand('workbench.action.debug.selectandstart');
    var ret = await vscode.commands.executeCommand('workbench.action.debug.start');
    //vscode.treeView.reveal('Run', {focus: true});
    //vscode.commands.executeCommand('workbench.action.output.focus');
    vscode.commands.executeCommand('workbench.debug.action.focusRepl');
    return ret;
};

const fs = require("fs");
const path = require("path");

async function checkSetup(vscode)
{
    var basePath = "";
    if(vscode.workspace.workspaceFolders === undefined)
    {
        vscode.window.showErrorMessage("No workspace opened!");
        return { 'status': 'error', 'basePath': basePath };
    }
    basePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    buildDir = path.join(basePath, "build");
    if (!fs.existsSync(path.join(buildDir, "meson-info")))
    {
        if (!fs.existsSync(buildDir))
            await fs.promises.mkdir(buildDir)
        var ret = await executeTask(vscode, "Meson: configure");
        return { 'status': 'configured', 'basePath': basePath };
    }
    return { 'status': 'ok', 'basePath': basePath };
}

function writeFile(fileName, contents)
{
	fs.writeFile(fileName, contents, (err) => {
        if (err) throw err;
    })
}

function readDirectory(basePath, refArray, dir, extension, foldersOnly) {
	var pushed = false;
	fs.readdirSync(dir).forEach(file => {
		let current = path.join(dir,file);
		if (fs.statSync(current).isFile()) {
			if(current.endsWith(extension)) {
				if (foldersOnly) {
                    var fle = path.relative(basePath, dir).replaceAll('\\', '/');
					if (!pushed) refArray.push('\t\'' + fle + '\',');
					pushed = true;
				}
				else
                {
                    var fle = path.relative(basePath, current).replaceAll("\\", "/");
					refArray.push('\t\'' + fle + '\',');
                }
			} 
		} else
			readDirectory(basePath, refArray, current, extension, foldersOnly)
	});
    return refArray;
}

function updateMeson(mesonFile, headerContents, sourceContents) {
	const mesonContents = fs.readFileSync(mesonFile, 'utf-8');
	var arr = [];
	var logOut = true;
	mesonContents.split(/\r?\n/).forEach((line) => {
		if (line.includes("OTX_Extension_HeaderFiles_End") || line.includes("OTX_Extension_SourceFiles_End")) logOut = true;
		if (logOut) arr.push(line);
		if (line.includes("OTX_Extension_HeaderFiles_Start")) {
			arr = arr.concat(headerContents);
			logOut = false;
		}
		if (line.includes("OTX_Extension_SourceFiles_Start")) {
			arr = arr.concat(sourceContents);
			logOut = false;
		}
	});
	const contents= arr.join('\n');
	//console.log(contents);
	if(contents == mesonContents) return;
	writeFile(mesonFile, contents);
}




async function runMesonBuild(vscode, buildDir, name) {

    try {
        let buildTask = await getTask(vscode, "build", name);
        const buildTaskExecution = await vscode.tasks.executeTask(buildTask);
        return new Promise((resolve) => {
            vscode.tasks.onDidEndTaskProcess(e => {
                if (e.execution === buildTaskExecution || e.execution.task === buildTask) 
                    resolve(e.exitCode);
            });
        });
        
    } catch (e) {
        //vscode.window.showErrorMessage(ret);
      // vscode.window.showErrorMessage(`Could not build ${name}`);
     // console.log(`Building target ${name}:`);
      //console.log(e);
      //getOutputChannel().show(true);
      return new Promise((resolve, reject) => reject(e));
    }
    
   // await new Promise((resolve) => {
   //     emitter.on("terminated", (code) => resolve(code));
   // });
  }

// async function runMesonBuild2(vscode, buildDir, name) {
//     // emitter used to detect task completition
//     var emitter = new EventEmitter();
//     try {
//         let buildTask = await getTask(vscode, "build", name);
//         const buildTaskExecution = await vscode.tasks.executeTask(buildTask);

//         vscode.tasks.onDidEndTaskProcess(e => {
//             if (e.execution === buildTaskExecution || e.execution.task === buildTask) {
//                 vscode.window.showErrorMessage(`Detected that my task exited with exit code ${e.exitCode}`);
//                 emitter.emit("terminated", e.exitCode);
//                 isBuilding = false;
//             }
//         });
//     } catch (e) {
//         //vscode.window.showErrorMessage(ret);
//        vscode.window.showErrorMessage(`Could not build ${name}`);
//       console.log(`Building target ${name}:`);
//       console.log(e);
//       getOutputChannel().show(true);
//       return false;
//     }
//     await new Promise((resolve) => {
//         emitter.on("terminated", (code) => resolve(code));
//     });
//   }

  async function getTask(vscode, mode, name) {
    const tasks = await vscode.tasks.fetchTasks({ type: "meson" });
    const filtered = tasks.filter(
      t => t.definition.mode === mode && (!name || t.definition.target === name)
    );
    if (filtered.length === 0)
      throw new Error(`Cannot find ${mode} target ${name}.`);
    return filtered[0];
  }