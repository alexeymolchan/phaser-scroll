import WebFont from 'webfontloader';

export default () =>
  new Promise(resolve => {
    WebFont.load({
      classes: false,
      custom: {
        families: ['troika']
      },
      active: resolve
    });
  });
