// ------------------------------------------------------------------------------
// Phoenix config.
// https://github.com/kasper/phoenix/blob/d0a3ac/API.md
//
// Inspired by MercuryMover.
// http://www.heliumfoot.com/mercurymover/
// Move and resize windows from the keyboard, positioning them precisely where you want.
//
// Inspired by @kgrossjo config.
// https://github.com/kgrossjo/phoenix-config/

Phoenix.set({
  openAtLogin: true,
})

// ------------------------------------------------------------------------------
// Const and globals.

const INCREMENT_LOW = 1
const INCREMENT_MID = 10
const INCREMENT_HIGH = 100

const MENU_BAR_HEIGHT = 22

const mainShortcuts = []

// ------------------------------------------------------------------------------
// Shortcut constructor.

class Shortcut {
  constructor(key, modifiers, modalText) {
    this.modal = Modal.build({ text: modalText, weight: 16 })
    this.subShortcuts = []
    this.keys = []
    mainShortcuts.push(this)
    this.key = new Key(key, modifiers, () => {
      this.disableSubShortcuts()
      this.enableSubShortcuts()
      this.showModal()
    })
  }
  showModal() {
    this.closePreviouslyOpenedModals()
    this.centerModalOnCurrentScreen()
    this.modal.show()
  }
  closePreviouslyOpenedModals() {
    // This is necessary because we have several main shortcuts and hitting
    // them in a consecutive manner would result in multiple opened modals.
    mainShortcuts.forEach(shortcut => {
      if (shortcut !== this) {
        shortcut.modal.close()
      }
    })
  }
  centerModalOnCurrentScreen() {
    const screenFrame = Screen.main().frame()
    const modalFrame = this.modal.frame()
    this.modal.origin = {
      x: screenFrame.x + ((screenFrame.width - modalFrame.width) / 2),
      y: screenFrame.y + ((screenFrame.height - modalFrame.height) / 2),
    }
  }
  enableSubShortcuts() {
    const closeKey = new Key('escape', [], () => {
      this.modal.close()
      this.disableSubShortcuts()
    })
    closeKey.enable()
    this.keys.push(closeKey)

    this.subShortcuts.forEach(subShortcut => {
      const key = new Key(subShortcut.key, subShortcut.modifiers, subShortcut.cb)
      key.enable()
      this.keys.push(key)
    })
  }
  disableSubShortcuts() {
    this.keys.forEach(function (key) {
      key.disable()
    })
    this.keys = []
  }
  addSubShortcut(key, modifiers, cb) {
    this.subShortcuts.push({key: key, modifiers: modifiers, cb: cb})
  }
}

// ------------------------------------------------------------------------------
// Main shortcuts to activate `move` or `resize` mode.

var arrows = [
  '↑',
  '←    →',
  '↓',
].join('\n')

// Move mode.
var moveMode = new Shortcut(
  'up',
  ['cmd', 'ctrl'],
  [
    'MOVE',
    '',
    arrows,
    '',
    'Hit esc to dismiss',
    `Use no modifier key to move ${INCREMENT_LOW} pixel.`,
    `Use the shift key to move ${INCREMENT_MID} pixels.`,
    `Use the option key to move ${INCREMENT_HIGH} pixels.`,
    'Use the cmd key to move to the edge of the screen.',
  ].join('\n')
)

// Resize mode (from right/down).
var resizeMode = new Shortcut(
  'right',
  ['cmd', 'ctrl'],
  [
    'RESIZE',
    '',
    arrows,
    '',
    'Hit esc to dismiss',
    `Use no modifier key to resize ${INCREMENT_LOW} pixel.`,
    `Use the shift key to resize ${INCREMENT_MID} pixels.`,
    `Use the option key to resize ${INCREMENT_HIGH} pixels.`,
    'Use the cmd key to resize to the edge of the screen.',
  ].join('\n')
)

// ------------------------------------------------------------------------------
// Resize.

var resize = function (increment, direction) {
  var window = Window.focused()
  if (window) {
    var size
    switch (direction) {
      case 'right':
        size = { width: window.size().width + increment, height: window.size().height }
        break
      case 'left':
        size = { width: window.size().width - increment, height: window.size().height }
        break
      case 'up':
        size = { width: window.size().width, height: window.size().height - increment }
        break
      case 'down':
        size = { width: window.size().width, height: window.size().height + increment }
        break
    }
    window.setSize(size)
  }
}

var resizeToEdge = function (direction) {
  var window = Window.focused()
  if (window) {
    var frame
    var screenFrame = window.screen().flippedFrame()
    switch (direction) {
      case 'right':
        frame = {
          x: window.topLeft().x,
          y: window.topLeft().y,
          width: screenFrame.width - Math.abs(screenFrame.x - window.topLeft().x),
          height: window.size().height,
        }
        break
      case 'left':
        frame = {
          x: screenFrame.x,
          y: window.topLeft().y,
          width: Math.abs(screenFrame.x - window.topLeft().x) + window.size().width,
          height: window.size().height,
        }
        break
      case 'up':
        frame = {
          x: window.topLeft().x,
          y: screenFrame.y,
          width: window.size().width,
          height: Math.abs(window.screen().flippedVisibleFrame().y - window.topLeft().y) + window.size().height,
        }
        break
      case 'down':
        frame = {
          x: window.topLeft().x,
          y: window.topLeft().y,
          width: window.size().width,
          height: screenFrame.height - Math.abs(screenFrame.y - window.topLeft().y),
        }
        break
    }
    window.setFrame(frame)
  }
}

resizeMode.addSubShortcut('right', [], function () { resize(INCREMENT_LOW, 'right') })
resizeMode.addSubShortcut('left', [], function () { resize(INCREMENT_LOW, 'left') })
resizeMode.addSubShortcut('up', [], function () { resize(INCREMENT_LOW, 'up') })
resizeMode.addSubShortcut('down', [], function () { resize(INCREMENT_LOW, 'down') })

resizeMode.addSubShortcut('right', ['shift'], function () { resize(INCREMENT_MID, 'right') })
resizeMode.addSubShortcut('left', ['shift'], function () { resize(INCREMENT_MID, 'left') })
resizeMode.addSubShortcut('up', ['shift'], function () { resize(INCREMENT_MID, 'up') })
resizeMode.addSubShortcut('down', ['shift'], function () { resize(INCREMENT_MID, 'down') })

resizeMode.addSubShortcut('right', ['alt'], function () { resize(INCREMENT_HIGH, 'right') })
resizeMode.addSubShortcut('left', ['alt'], function () { resize(INCREMENT_HIGH, 'left') })
resizeMode.addSubShortcut('up', ['alt'], function () { resize(INCREMENT_HIGH, 'up') })
resizeMode.addSubShortcut('down', ['alt'], function () { resize(INCREMENT_HIGH, 'down') })

resizeMode.addSubShortcut('right', ['cmd'], function () { resizeToEdge('right') })
resizeMode.addSubShortcut('left', ['cmd'], function () { resizeToEdge('left') })
resizeMode.addSubShortcut('up', ['cmd'], function () { resizeToEdge('up') })
resizeMode.addSubShortcut('down', ['cmd'], function () { resizeToEdge('down') })

// ------------------------------------------------------------------------------
// Move.

var move = function (increment, direction) {
  var window = Window.focused()
  if (window) {
    var coords
    switch (direction) {
      case 'right':
        coords = { x: window.topLeft().x + increment, y: window.topLeft().y }
        break
      case 'left':
        coords = { x: window.topLeft().x - increment, y: window.topLeft().y }
        break
      case 'up':
        coords = { x: window.topLeft().x, y: window.topLeft().y - increment }
        break
      case 'down':
        coords = { x: window.topLeft().x, y: window.topLeft().y + increment }
        break
    }
    window.setTopLeft(coords)
  }
}

var moveToEdge = function (direction) {
  var window = Window.focused()
  if (window) {
    var coords
    var screenFrame = window.screen().flippedFrame()
    switch (direction) {
      case 'right':
        coords = {
          x: screenFrame.x + screenFrame.width - window.size().width,
          y: window.topLeft().y,
        }
        break
      case 'left':
        coords = {
          x: screenFrame.x,
          y: window.topLeft().y,
        }
        break
      case 'up':
        coords = {
          x: window.topLeft().x,
          y: screenFrame.y,
        }
        break
      case 'down':
        coords = {
          x: window.topLeft().x,
          y: screenFrame.y + screenFrame.height - window.size().height,
        }
        break
    }
    window.setTopLeft(coords)
  }
}

moveMode.addSubShortcut('right', [], function () { move(INCREMENT_LOW, 'right') })
moveMode.addSubShortcut('left', [], function () { move(INCREMENT_LOW, 'left') })
moveMode.addSubShortcut('up', [], function () { move(INCREMENT_LOW, 'up') })
moveMode.addSubShortcut('down', [], function () { move(INCREMENT_LOW, 'down') })

moveMode.addSubShortcut('right', ['shift'], function () { move(INCREMENT_MID, 'right') })
moveMode.addSubShortcut('left', ['shift'], function () { move(INCREMENT_MID, 'left') })
moveMode.addSubShortcut('up', ['shift'], function () { move(INCREMENT_MID, 'up') })
moveMode.addSubShortcut('down', ['shift'], function () { move(INCREMENT_MID, 'down') })

moveMode.addSubShortcut('right', ['alt'], function () { move(INCREMENT_HIGH, 'right') })
moveMode.addSubShortcut('left', ['alt'], function () { move(INCREMENT_HIGH, 'left') })
moveMode.addSubShortcut('up', ['alt'], function () { move(INCREMENT_HIGH, 'up') })
moveMode.addSubShortcut('down', ['alt'], function () { move(INCREMENT_HIGH, 'down') })

moveMode.addSubShortcut('right', ['cmd'], function () { moveToEdge('right') })
moveMode.addSubShortcut('left', ['cmd'], function () { moveToEdge('left') })
moveMode.addSubShortcut('up', ['cmd'], function () { moveToEdge('up') })
moveMode.addSubShortcut('down', ['cmd'], function () { moveToEdge('down') })

// ------------------------------------------------------------------------------
// Custom size/position shortcuts.

var maximise = function () {
  var window = Window.focused()
  if (window) {
    window.maximise()
  }
}

var center = function () {
  var window = Window.focused()
  if (window) {
    var screenFrame = window.screen().flippedVisibleFrame()
    window.setTopLeft({
      x: parseInt(screenFrame.x + ((screenFrame.width - window.size().width) / 2)),
      y: parseInt(screenFrame.y + ((screenFrame.height - window.size().height) / 2)),
    })
  }
}

// Move and resize the window to the left half of the screen.
var half = function () {
  var window = Window.focused()
  if (window) {
    var screenFrame = window.screen().flippedFrame()
    window.setFrame({
      x: screenFrame.x,
      y: screenFrame.y,
      width: parseInt(screenFrame.width / 2),
      height: screenFrame.height,
    })
  }
}

resizeMode.addSubShortcut('m', [], maximise)
resizeMode.addSubShortcut('=', [], center)
resizeMode.addSubShortcut('h', [], half)

moveMode.addSubShortcut('m', [], maximise)
moveMode.addSubShortcut('=', [], center)
moveMode.addSubShortcut('h', [], half)

// ------------------------------------------------------------------------------
// The following are personal custom shortcuts which are heavily dependent
// on my current screen resolutions and sizes.

// Safari size/position.
var customShortcut1 = function () {
  var window = Window.focused()
  if (window) {
    window.setFrame({ x: 5, y: 5 + MENU_BAR_HEIGHT, width: 1204, height: 756 })
  }
}

// Safari (external monitor) size/position.
var customShortcut2 = function () {
  var window = Window.focused()
  if (window) {
    window.setFrame({ x: 5, y: 5 + MENU_BAR_HEIGHT, width: 1615, height: 1069 })
  }
}

// Terminal position.
var customShortcut3 = function () {
  var window = Window.focused()
  if (window) {
    window.setTopLeft({ x: 5, y: 5 + MENU_BAR_HEIGHT })
  }
}

resizeMode.addSubShortcut('s', [], customShortcut1)
resizeMode.addSubShortcut('f', [], customShortcut2)
resizeMode.addSubShortcut('t', [], customShortcut3)

moveMode.addSubShortcut('s', [], customShortcut1)
moveMode.addSubShortcut('f', [], customShortcut2)
moveMode.addSubShortcut('t', [], customShortcut3)
