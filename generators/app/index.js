
'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');

var VSCodeGenerator = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
  },

  init: function() {
    this.log(yosay('Welcome to the Visual Studio Code generator!'));
    this.templatedata = {};
  },

  askFor: function() {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of application do you want to create?',
      choices: [{
          name: 'Node/Express application (JavaScript)',
          value: 'expressJS'
        }
      ]
    }];

    this.prompt(prompts, function(props) {
      this.type = props.type;
      done();
    }.bind(this));
  },

  askForName: function() {
    var done = this.async();
    var app = '';
    switch (this.type) {
      case 'expressJS':
        app = 'expressApp';
        break;
    }
    
    var prompts = [{
      name: 'applicationName',
      message: 'What\'s the name of your application?',
      default: app
    }];
    
    this.prompt(prompts, function(props) {
      this.templatedata.namespace = props.applicationName;
      this.templatedata.applicationname = props.applicationName;
      this.applicationName = props.applicationName;
      done();
    }.bind(this));
  },

  writing: function() {
    this.sourceRoot(path.join(__dirname, './templates/projects'));

    switch (this.type) {

      case 'expressJS':
        this._writingExpressJS();
        break;

      default:
        this.log('Unknown project type');
    }
  },

  _writingExpressJS: function () {
//        console.log('source root', this.sourceRoot());
//        console.log('destination root', this.destinationRoot());
        var context = {
            appName: this.applicationName
        };
        
        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));

        this.template(this.sourceRoot() + '/_package.json', this.applicationName + '/package.json', context);
        
        this.copy(this.sourceRoot() + '/app.js', this.applicationName + '/app.js');
        this.copy(this.sourceRoot() + '/README.md', this.applicationName + '/README.md');
        this.copy(this.sourceRoot() + '/LICENSE', this.applicationName + '/LICENSE');
        this.copy(this.sourceRoot() + '/gulpfile.js', this.applicationName + '/gulpfile.js');
        this.copy(this.sourceRoot() + '/jsconfig.json', this.applicationName + '/jsconfig.json');
        this.copy(this.sourceRoot() + '/_gitignore', this.applicationName + '/.gitignore');
      
        this.directory(this.sourceRoot() + '/.settings', this.applicationName + '/.settings');
        this.directory(this.sourceRoot() + '/bin', this.applicationName + '/bin');
        this.directory(this.sourceRoot() + '/images', this.applicationName + '/images');
        this.directory(this.sourceRoot() + '/public', this.applicationName + '/public');
        this.directory(this.sourceRoot() + '/routes', this.applicationName + '/routes');
        this.directory(this.sourceRoot() + '/tests', this.applicationName + '/tests');
        this.directory(this.sourceRoot() + '/typings', this.applicationName + '/typings');
        this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
  },

    
  install: function () {
    if (this.noNpmInstall) {
      return;
    }
    process.chdir(this.applicationName);
    this.installDependencies({
      bower: false,
      npm: true
    });
  },
  
  end: function() {
    
    this.log('\r\n');
    this.log('Your project is now created! To start Visual Studio Code, use the following commands:');
    this.log(chalk.bold('cd ' + this.applicationName));
    this.log(chalk.bold('code .'));
    
    this.log('\r\n');
    this.log('For more information, please visit http://code.visualstudio.com and follow us on twitter @code.');
    
    if (this.notice) {
        this.log(chalk.red(this.notice));      
    }
  }
});

module.exports = VSCodeGenerator;