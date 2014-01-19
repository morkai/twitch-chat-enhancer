'use strict';

function twitchChatEnhancer(options, first)
{
  if (self !== top)
  {
    console.log("[TCE] self !== top");

    return;
  }

  if (typeof CurrentChat === 'undefined' || CurrentChat === null)
  {
    if (first)
    {
      console.log("[TCE] CurrentChat is not initialized yet, retrying in 1s...");
    }

    return setTimeout(twitchChatEnhancer.bind(null, options), 1000);
  }

  if (options.lineBuffer)
  {
    CurrentChat.line_buffer = options.lineBuffer;
  }

  var LINE_BUFFER = CurrentChat.line_buffer;
  var RE_FILTERS = (options.reFilterValue || '').split('\n').map(function(line)
  {
    return new RegExp(line, 'i');
  });
  var COLORS = {
    '#9ACD32': '#005500',
    '#00FF7F': '#008800',
    '#00FF00': '#008800'
  };
  var STRIP_TAGS_RE = /<(?:.|\n)*?>/gm;
  var EMOTICON_RE = /"emo\-[0-9]+ emoticon"/g;
  var EMPTY_MESSAGE_PATTERN = 'chat_line"></';

  console.log("Twitch Chat Enhancer is taking over the Kappa!");

  var insert_chat_line = CurrentChat.insert_chat_line;
  var insert_with_lock = CurrentChat.insert_with_lock;
  var set_currently_scrolling = CurrentChat.set_currently_scrolling;
  var format_message = CurrentChat.format_message;

  if (options.emoState)
  {
    CurrentChat.emoticonize = function(e) { return e; };
  }

  if (options.scrollState)
  {
    CurrentChat.chat_lines_div().addEventListener('scroll', function()
    {
      CurrentChat.set_currently_scrolling();
    });

    CurrentChat.set_currently_scrolling = function()
    {
      set_currently_scrolling.apply(this, arguments);

      this.line_buffer = this.currently_scrolling ? LINE_BUFFER : Number.MAX_VALUE;
    };
  }

  CurrentChat.insert_chat_line = function(a)
  {
    if (options.colorsState && typeof COLORS[a.color] === 'string')
    {
      a.color = COLORS[a.color];
    }

    if (a.subscriber || a.tagtype === 'mod' || !isDirtyText(a.message))
    {
      insert_chat_line.call(this, a);
    }
  };

  CurrentChat.format_message = function(e)
  {
    if (options.lengthFilterState && e.message.length > options.lengthFilterValue)
    {
      return '';
    }

    var text = format_message.apply(this, arguments);

    if (options.emoFilterState)
    {
      var textWoHtml = text.replace(STRIP_TAGS_RE, '').trim();

      if (textWoHtml.length === 0)
      {
        return '';
      }
    }

    if (options.emoLimiterState)
    {
      var emoMatches = text.match(EMOTICON_RE);

      if (emoMatches && emoMatches.length > options.emoLimiterValue)
      {
        return '';
      }
    }

    return text;
  };

  CurrentChat.insert_with_lock = function(a, line, c, b)
  {
    if (line.lastIndexOf(EMPTY_MESSAGE_PATTERN) === -1)
    {
      insert_with_lock.apply(this, arguments);
    }
  };

  function isDirtyText(text)
  {
    var i;
    var l;

    if (options.reFilterState)
    {
      for (i = 0, l = RE_FILTERS.length; i < l; ++i)
      {
        if (RE_FILTERS[i].test(text))
        {
          return true;
        }
      }
    }

    if (options.asciiLimiterState)
    {
      var dirtyChars = 0;

      for (i = 0, l = text.length; i < l; ++i)
      {
        if (text.charCodeAt(i) > 127)
        {
          ++dirtyChars;

          if (dirtyChars > options.asciiLimiterValue)
          {
            return true;
          }
        }
      }
    }

    return false;
  }
}

function contentEval(source, options)
{
  if (typeof source === 'function')
  {
    source = '(' + source + ')(' + options + ', true);';
  }

  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = source;

  document.body.appendChild(script);
  document.body.removeChild(script);
}

chrome.runtime.sendMessage('getOptions', function(options)
{
  contentEval(twitchChatEnhancer, options);
});

