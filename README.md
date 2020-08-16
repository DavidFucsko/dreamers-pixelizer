# dreamers

members: DavidFucsko and AlizTotivan

## Run the app locally:

- npm i
- npm run start

## Package the app:

- npm run package-windows

### OR

- npm run package-osx

## Create installer Windows:

- npm ./build/windows/build-msi-installer.js
### OR 
- npm run create-installer

## Create installer Mac:

- npm run create-installer-osx

## Run on windows:

- Run exe in release folder
### OR 

- Install the app via msi

## Use Git Lfs

- git lfs install in local repo
- git lfs track \*.msi
- git lfs push --all origin master
- git push -u origin master
