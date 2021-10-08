import $ from 'jquery';
global.$ = global.jQuery = $;

// If you want to mock bootstrap
global.$.fn.modal = jest.fn(() => $());

