# phoenix-mercury-mover

My [Phoenix](https://github.com/kasper/phoenix/) config.

I upgraded to macOS Sierra and [MercuryMover](http://www.heliumfoot.com/mercurymover/) stopped working. So I implemented some of its functionalities with Phoenix.

## Presentation

Move and resize windows on your Mac from the keyboard, positioning them precisely where you want.

## Installation

Clone this git repository, then symlink `phoenix.js` to `~/.phoenix.js`:

```shell
# Backup old config
[ -e ~/.phoenix.js ] && mv ~/.phoenix.js ~/".phoenix.js-$(date +%s)"
# Symlink new config
ln -s /path/to/repo/phoenix.js ~/.phoenix.js
```

### Configuring Presets

Configure custom presets and modifier keys by creating a `config.js` file in this repository's directory.
The file should define a variable `CONFIG` with optional properties `PRESETS` and `MAIN_MODIFIERS`.
`CONFIG.PRESETS` should be an array of presets, where each preset is an object with `{key, width, height, x, y}` or `{key, shortcut}` properties.
`CONFIG.MAIN_MODIFIERS` should be an array of modifier keys.
Here's an example below:

```javascript
// config.js

const PRESETS = [
  {key: 'f', width: 2560, height: 1573, x: 0, y: 23},
  // Using a custom shortcut
  {key: 'x', shortcut: () => Window.focused().setTopLeft({x: 0, y: 0})},
]
```

See `config.example.js` for my personal setup.

## Usage

Hit one of the main shortcut keys to activate the **move** or **resize** mode:

1. `cmd-ctrl-up` to move the frontmost window

2. `cmd-ctrl-right` to resize (from right/down) the frontmost window

A popup shows up that explains which keys to press and what they do.

Additionally you can hit some keys while the popup is shown to move the frontmost window to a preset position and/or size:

- `m` to maximise the window

- `=` to center the window

- `h` to move and resize the window to the left half of the screen

Hit `esc` to dismiss the popup.

![Demo](demo.gif)

## Acknowledgements

Released under the [MIT License](http://opensource.org/licenses/mit-license).

This repository is a fork of `phoenix-mercury-mover`, authored by [Kemar](https://marcarea.com).

The main goals of this fork are:
1. Implement all of mercury mover
1. Make it easier for people to configure their own presets
1. Switch to ES2015 for cleaner code

