# Bootstrap-sass-grunt-setup-UXD

click here  [Bootstrap-sass grunt setup - UXD Documentation](http://iv3soj.github.io/Bootstrap-sass-grunt-setup-UXD-v2/)


## Download

click [Download Zip file](https://github.com/iv3SOJ/Bootstrap-sass-grunt-setup-UXD/zipball/master)


## Initial Setup

If you don't have Nodejs installed in your machine do not fret, we're here to do that lol.

**Installing Nodejs**

[click here](http://nodejs.org/en/download/)

_Download Node v4.2.2 LTS Windows Installer (.msi) select windows bit version 32-bit/64-bit_

**Installing Git**

[click here](http://git-scm.com/downloads)

_Download Latest version and install Git_

Next, you need to add the npm (node package manager) in the PATH.

The purpose of this is that you won't have problems when installing global plugins / components using npm.

To do this one must:

![Step 1](https://drive.google.com/a/egg.ph/file/d/0B5CtIqS0rehwRkJJWU11aFBoMk0/view?usp=sharing)


## Project Setup

* Open Command Prompt or Git Bash and Navigate your project folder directory.  ex.(`cd C:\Users\Document`)
* Type this in your Command Prompt or Git bash to download the file (`git clone https://github.com/iv3SOJ/Bootstrap-sass-grunt-setup-UXD-v2.git MyProjectName`) 



## Configuration

Open config.json using notepad

Change the value of "location" to the directory of your project.

ex. `{ "location" : "C:\\Users\\Document\\MyProjectName\\" }`

*use double back slashes (\\\\) to escape the backslash string*


## Bower & Grunt Installation

Type this in your command prompt or Git Bash then Enter.

`bower install && npm install`

*using this command, node will install all dependencies that are listed inside your bower.json and package.json


## Viewing Your Project

To view your project, just open your Command Prompt or Git Bash

`WINDOW + R`, type `cmd`

Locate your project folder

example: `C:\Users\Document\MyProjectName`

and type `grunt`

### Exporting your project

You can export your project by typing the following command:

`grunt dist`

*This will compile your project inside the `dist` folder


### Important Notes

All the files that you will be working on should be inside the `app` folder

When you run `grunt` on your project, grunt will compile and build your project to `build` folder.

Next, grunt will open the browser for you to see the preview of your project.

using the `watch` feature, grunt will be watching for changes that you make inside `app` folder and automagically compiles them to our `build` folder and reloads the page for preview.