'use strict';

var DEFAULT_OPTIONS = {
  colorsState: 1,
  scrollState: 1,
  emoState: 0,
  emoFilterState: 0,
  emoLimiterState: 0,
  emoLimiterValue: 4,
  asciiLimiterState: 0,
  asciiLimiterValue: 3,
  lengthFilterState: 0,
  lengthFilterValue: 250,
  reFilterState: 0,
  reFilterValue: 'but at what cost\n=.*?no\\s*(sp|f)ace\nsmotriall\\.com\n(\\?|&)ref=',
  lineBuffer: 150
};

var options = JSON.parse(localStorage['tce'] || '{}');

document.addEventListener('DOMContentLoaded', function()
{
  Object.keys(DEFAULT_OPTIONS).forEach(function(optionKey)
  {
    if (typeof options[optionKey] === 'undefined')
    {
      options[optionKey] = DEFAULT_OPTIONS[optionKey];
    }

    applyOption(optionKey, options[optionKey]);

    document.getElementById(optionKey).addEventListener('change', function(e)
    {
      var value;

      switch (getOptionType(this))
      {
        case 'checkbox':
          value = this.checked ? 1 : 0;
          break;

        case 'number':
          value = this.valueAsNumber;
          break;

        case 'textarea':
          value = this.value;
          break;
      }

      if (typeof value !== 'undefined')
      {
        saveOption(optionKey, value);
      }
    });
  });
});

function getOptionType(optionEl)
{
  return optionEl.tagName === 'INPUT'
    ? optionEl.type
    : optionEl.tagName.toLowerCase()
}

function applyOption(optionKey, optionValue)
{
  var optionEl = document.getElementById(optionKey);

  if (optionEl === null)
  {
    console.warn("Unknown option: %s", optionKey);

    return;
  }

  var optionType = getOptionType(optionEl);

  switch (optionType)
  {
    case 'checkbox':
      optionEl.checked = optionValue === 1;
      break;

    case 'number':
    case 'textarea':
      optionEl.value = optionValue;
      break;

    default:
      console.warn("Unsupported option type: %s", optionType);
  }
}

function saveOption(optionKey, optionValue)
{
  var optionEl = document.getElementById(optionKey);

  if (optionEl === null)
  {
    console.warn("Unknown option: %s", optionKey);

    return;
  }

  switch (optionKey)
  {
    case 'reFilterValue':
      var res = [];

      optionValue.split('\n').forEach(function(line)
      {
        try
        {
          var re = new RegExp(line.trim(), 'i');

          if (re.source !== '(?:)')
          {
            res.push(re.source);
          }
        }
        catch (err)
        {
          console.warn(err.message);
        }
      });

      optionValue = res.join('\n');

      applyOption(optionKey, optionValue);
      break;
  }

  options[optionKey] = optionValue;

  localStorage['tce'] = JSON.stringify(options);
}
