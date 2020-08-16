const { MSICreator } = require("electron-wix-msi");
const path = require("path");
(() => {
  // Step 1: Instantiate the MSICreator
  const msiCreator = new MSICreator({
    appDirectory: path.resolve(
      "..\\..\\release-builds\\DreamersPixelizer-win32-ia32"
    ),
    description: "Dreamers Pixelizer",
    exe: "DreamersPixelizer",
    name: "DreamersPixelizer",
    manufacturer: "Fucsi",
    version: "1.0.0",
    outputDirectory: path.resolve("..\\..\\installers\\windows"),
    iconPath: path.resolve("..\\..\\assets\\icon\\win\\icon.ico"),

    ui: {
      chooseDirectory: true,
    },
  });

  // Step 2: Create a .wxs template file
  msiCreator
    .create()
    .then(() => msiCreator.compile().catch((error) => console.log(error)));

  // Step 3: Compile the template to a .msi file
})();
