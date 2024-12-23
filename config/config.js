module.exports = {
  /**
   * Name of the integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @required
   */
  name: 'OpenCTI',
  /**
   * The acronym that appears in the notification window when information from this integration
   * is displayed.  Note that the acronym is included as part of each "tag" in the summary information
   * for the integration.  As a result, it is best to keep it to 4 or less characters.  The casing used
   * here will be carried forward into the notification window.
   *
   * @type String
   * @required
   */
  acronym: 'OCTI',
  /**
   * Description for this integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @optional
   */
  description:
    'OpenCTI is an open source platform allowing organizations to store, organize, visualize and share their knowledge on cyber threats.',
  entityTypes: ['domain', 'MD5', 'SHA1', 'SHA256', 'email', 'IPv4'],
  styles: ['./styles/style.less'],
  defaultColor: 'light-gray',
  /**
   * Provide custom component logic and template for rendering the integration details block.  If you do not
   * provide a custom template and/or component then the integration will display data as a table of key value
   * pairs.
   *
   * @type Object
   * @optional
   */
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  /**
   * Options that are displayed to the user/admin in the Polarity integration user-interface.  Should be structured
   * as an array of option objects.
   *
   * @type Array
   * @optional
   */
  options: [
    {
      key: 'url',
      name: 'OpenCTI URL',
      description:
        'The Base URL for your OpenCTI instance including the scheme. (i.e. - https://myopenctiserver). Option must be set to "Users can view only"',
      type: 'text',
      default: '',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiKey',
      name: 'Valid OpenCTI API Key',
      description: 'Valid OpenCTI API Key',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'dataSources',
      name: 'Data Sources',
      description:
        'Select the data sources you would like to use for the OpenCTI integration.  If no data sources are selected, all data sources will be used.',
      default: {
        value: 'observable',
        display: 'Observable'
      },
      type: 'select',
      options: [
        {
          value: 'observable',
          display: 'Observable'
        },
        {
          value: 'indicators',
          display: 'Indicators'
        }
      ],
      multiple: false,
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
