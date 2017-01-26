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
// Load config

function loadConfig() {
  try {
    require('./config.js')
    return CONFIG
  } catch (e) {
    Phoenix.log('No config found.')
    Phoenix.log(e)
    return {}
  }
}

const { PRESETS = [], MAIN_MODIFIERS = ['cmd', 'ctrl'] } = loadConfig()
Phoenix.log(`Loaded ${PRESETS.length} presets`)

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

const arrows = [
  '↑',
  '←    →',
  '↓',
].join('\n')

// Move mode.
const moveMode = new Shortcut(
  'up',
  MAIN_MODIFIERS,
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
const resizeMode = new Shortcut(
  'right',
  MAIN_MODIFIERS,
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

function resize(increment, direction) {
  const window = Window.focused()
  if (window) {
    let size
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

function resizeToEdge(direction) {
  const window = Window.focused()
  if (window) {
    let frame
    const screenFrame = window.screen().flippedFrame()
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

function move(increment, direction) {
  const window = Window.focused()
  if (window) {
    let coords
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

function moveToEdge(direction) {
  const window = Window.focused()
  if (window) {
    let coords
    const screenFrame = window.screen().flippedFrame()
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

const maximise = () => {
  const window = Window.focused()
  if (window) {
    window.maximise()
  }
}

const center = () => {
  const window = Window.focused()
  if (window) {
    const screenFrame = window.screen().flippedVisibleFrame()
    window.setTopLeft({
      x: parseInt(screenFrame.x + ((screenFrame.width - window.size().width) / 2), 10),
      y: parseInt(screenFrame.y + ((screenFrame.height - window.size().height) / 2), 10),
    })
  }
}

addSubShortcutToMenus('m', maximise)
addSubShortcutToMenus('=', center)

// ------------------------------------------------------------------------------
// Load any presets define in presets.js
// Must be stored in a variable called PRESETS

function configurePresets() {
  PRESETS.forEach(addPreset)
}

function addPreset({key, width, height, x, y, shortcut}) {
  const defaultShortcut = () => {
    const window = Window.focused()
    if (window) {
      window.setFrame({width, height, x, y})
    }
  }
  addSubShortcutToMenus(key, shortcut || defaultShortcut)
}

function addSubShortcutToMenus(key, shortcut) {
  mainShortcuts.forEach(mode => {
    mode.addSubShortcut(key, [], shortcut)
  })
}

configurePresets()

