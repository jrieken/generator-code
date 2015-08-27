
# generator-code

> A [Yeoman](http://yeoman.io) Generator for [Visual Studio Code](http://code.visualstudio.com)

<img width="491" alt="generator-code" src="https://cloud.githubusercontent.com/assets/1487073/9534574/33d3a448-4cce-11e5-9dd3-b57481b07756.png">


## Getting Started

To run Yeoman you will need to [install node](https://nodejs.org) for your platform. The setup will also install the [Node Package Manager](https://www.npmjs.com/) (npm) which you use to download Yeoman, generators, and many other software packages.

It is recommended that you install Yeoman and generators globally using  the `npm -g` switch so that you can run the generator from any folder.

```bash
npm install -g yo generator-code
```

Make a new directory and then cd into it.

```bash
mkdir myApp && cd $_
```

Run the Code generator:
```bash
yo code
```

Use the cursor up/down keys to choose the type of application you wish to create:

* **Node/Express application (JavaScript):** A simple Node application using the Express Framework. This application includes LESS style support, gulp for running tasks, as well as jsconfig.json and a set of TypeScript definition files for a great IntelliSense experience. 

* **Node/Express application (TypeScript):** Similar to above application, only written in TypeScript, including gulp tasks to automatically compile your TypeScript to JavaScript.
 
We also recommend installing the [TypeScript Definition File Manger](http://definitelytyped.org/tsd/) tool globally so that you can use the tool to download TypeScript definitions in any folder.

After the generator runs, simply start Visual Studio Code and enjoy!

```bash
code .
```

## License

[MIT](LICENSE)