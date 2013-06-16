# Twitch Chat Enhancer

Google Chrome extension that enhances your [Twitch](http://twitch.tv/) chat experience.

See [Configuration](#configuration) for a list of the available settings.

## Requirements

### Google Chrome

Google Chrome is a browser that combines a minimal design with sophisticated
technology to make the web faster, safer, and easier.

  * __Version__: 27.x
  * __Website__: http://google.com/chrome/

## Installation

### Chrome Web Store

Go to [Chrome Web Store page](https://chrome.google.com/webstore/detail/twitch-chat-enhancer/gnhffjchmkbfikdknajefcfggdlpjpcp).

### Development

Clone the repository:

```
git clone git://github.com/morkai/twitch-chat-enhancer.git
```

or [download](https://github.com/morkai/twitch-chat-enhancer/zipball/master)
and extract it.

Follow the [official instructions for loading an unpacked extension](https://developer.chrome.com/extensions/getstarted.html#unpacked).

## Configuration

Open the Options page through the [chrome://extensions](chrome://extensions) page
and customize the settings:

  - Change Green, YellowGreen and SpringGreen usernames to something a little
    more readable.
  - Disable auto-scrolling of the chat area when not locked to the bottom.
  - Limit message history to n messages.
  - Disable emoticons.
  - Hide empty messages.
  - Hide messages with more than n emoticons.
  - Hide messages with more than n non-ASCII characters.
  - Hide messages longer than n characters.
  - Hide messages matching a list of regular expressions.

Changes will be picked up by the stream pages after a refresh (F5).

## License

This project is released under the
[CC BY-SA 3.0](https://raw.github.com/morkai/twitch-chat-enhancer/master/license.md).
