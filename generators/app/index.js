
'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');

var VSCodeGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  init: function () {
    this.log(yosay('Welcome to the Visual Studio Code generator!'));
    this.templatedata = {};
  },

  initializing: function () {
    // happens after yeoman logo
  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of application do you want to create?',
      choices: [
        {
          name: 'Node/Express application (' + chalk.bold('JavaScript') + ')',
          value: 'expressJS'
        },
        {
          name: 'Node/Express application (' + chalk.bold('TypeScript') + ')',
          value: 'expressTS'
        },
        {
          name: 'ASP.NET ' + chalk.bold('5') + ' Application',
          value: 'aspnet'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      done();
    }.bind(this));
  },

  askForName: function () {
    var done = this.async();
    var app = 'expressApp';

    var prompts = [{
      name: 'applicationName',
      message: 'What\'s the name of your application?',
      default: app
    },
      {
        name: 'gitInit',
        type: 'confirm',
        message: 'Initialize a git repository?',
        default: true
      }];

    switch (this.type) {
      case 'expressJS':
      // fall through
      case 'expressTS':
        this.prompt(prompts, function (props) {
          this.templatedata.namespace = props.applicationName;
          this.templatedata.applicationname = props.applicationName;
          this.applicationName = props.applicationName;
          this.gitInit = props.gitInit;
          done();
        }.bind(this));
        break;

      case 'aspnet':
        this.composeWith('aspnet', { options: {} });
        done();
        break;
    }
  },

  writing: function () {
    this.sourceRoot(path.join(__dirname, './templates/projects'));

    switch (this.type) {
      case 'expressJS':
      // fall through
      case 'expressTS':
        this._writingExpress();
        break;
      case 'aspnet':
        //aspnet generator will do its own writing
        break;
      default:
        //unknown project type
        break;
    }
  },

  _writingExpress: function () {

    var context = {
      appName: this.applicationName
    };

    //copy files and folders that are common to both JS and TS 
    this.sourceRoot(path.join(__dirname, '../templates/projects/expressCommon'));

    this.directory(this.sourceRoot() + '/public', this.applicationName + '/public');
    this.directory(this.sourceRoot() + '/styles', this.applicationName + '/styles');
    this.directory(this.sourceRoot() + '/typings', this.applicationName + '/typings');
    this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
    this.copy(this.sourceRoot() + '/_gitignore', this.applicationName + '/.gitignore');
    this.template(this.sourceRoot() + '/README.md', this.applicationName + '/README.md', context);
    this.copy(this.sourceRoot() + '/tsd.json', this.applicationName + '/tsd.json');
        
    // now copy app specific files and folders
    switch (this.type) {
      case 'expressJS':
        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));
        //copy js specific files
        this.template(this.sourceRoot() + '/bin/www', this.applicationName + '/bin/www', context);
        this.copy(this.sourceRoot() + '/app.js', this.applicationName + '/app.js');
        this.copy(this.sourceRoot() + '/jsconfig.json', this.applicationName + '/jsconfig.json');
        this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
        break;

      case 'expressTS':
        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));
        //copy ts specific files
        this.template(this.sourceRoot() + '/bin/www.ts', this.applicationName + '/bin/www.ts', context);
        this.template(this.sourceRoot() + '/bin/www.js', this.applicationName + '/bin/www.js', context);
        this.copy(this.sourceRoot() + '/app.ts', this.applicationName + '/app.ts');
        this.copy(this.sourceRoot() + '/app.js', this.applicationName + '/app.js');
        this.copy(this.sourceRoot() + '/tsconfig.json', this.applicationName + '/tsconfig.json');
        this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
        break;

      default:
        // unknown why we are here, get out!
        return;
    }
    
    // NOTE: this.sourceRoot is set in the switch statement above
    // copy common file and folder names that have different content
    this.template(this.sourceRoot() + '/_package.json', this.applicationName + '/package.json', context);
    this.copy(this.sourceRoot() + '/vscodequickstart.md', this.applicationName + '/vscodequickstart.md');
    this.copy(this.sourceRoot() + '/gulpfile.js', this.applicationName + '/gulpfile.js');
    this.directory(this.sourceRoot() + '/.settings', this.applicationName + '/.settings');
    this.directory(this.sourceRoot() + '/routes', this.applicationName + '/routes');
    this.directory(this.sourceRoot() + '/tests', this.applicationName + '/tests');

  },

  install: function () {

      switch (this.type) {

        case 'expressJS':
        // fall through
      
        case 'expressTS':

          if (this.noNpmInstall) {
            break;
          }

          process.chdir(this.applicationName);

          this.installDependencies({
            bower: false,
            npm: true
          });

          break;

        case 'aspnet':
          // aspnet wil do its own installation
          break;

        default:
          break;
      }
  },

  end: function () {

    switch (this.type) {

      case 'expressJS':
      // fall through
      case 'expressTS':
        this.log('\r\n');

        if (this.gitInit) {
          this.spawnCommand('git', ['init', '--quiet']);
        }

        this.log('Your project ' + chalk.bold(this.applicationName) + ' has been created! Next steps:');
        this.log('');
        this.log('We recommended installing the TypeScript Definition File Manager (http://definitelytyped.org/tsd/) globally using the following command. This will let you easily download additional definition files to any folder.');
        this.log('');
        this.log(chalk.bold('     npm install tsd -g'));
        this.log('');
        this.log('To start editing with Visual Studio Code, use the following commands.');
        this.log('');
        this.log(chalk.bold('     cd ' + this.applicationName));
        this.log(chalk.bold('     code .'));
        this.log(' ');
        this.log('For more information, visit http://code.visualstudio.com and follow us @code.');
        this.log('\r\n');

        break;

      case 'aspnet':
        // aspnet wil handle its end
        break;

      default:
        break;
    }

    if (this.notice) {
      this.log(chalk.red(this.notice));
    }
  }
});

module.exports = VSCodeGenerator;