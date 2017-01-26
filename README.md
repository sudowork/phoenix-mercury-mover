# phoenix-mercury-mover

My [Phoenix](https://github.com/kasper/phoenix/) config.

I upgraded to macOS Sierra and [MercuryMover](http://www.heliumfoot.com/mercurymover/) stopped working. So I implemented some of its functionalities with Phoenix.

## Presentation

Move and resize windows on your Mac from the keyboard, positioning them precisely where you want.

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

