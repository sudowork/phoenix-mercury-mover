const CONFIG = {
  MAIN_MODIFIERS: ['cmd', 'ctrl'],
  PRESETS: [
    // Home: Colemak [1920x1200?, 2560x1600 (main), 1200x1600]
    // Optional Left Screen (Macbook, Full, Vertical Halves)
    {key: '4', width: 1920, height: 1200, x: -1920, y: 0},
    {key: '1', width: 960,  height: 1200, x: -1920, y: 0},
    {key: '2', width: 960,  height: 1200, x: -960,  y: 0},
    // Main Screen (Full, Vertical Halves)
    {key: 'f', width: 2560, height: 1578, x: 0,     y: 22},
    {key: '5', width: 1280, height: 1578, x: 0,     y: 22},
    {key: '6', width: 1280, height: 1578, x: 1280,  y: 22},
    // Right Screen
    {key: '7', width: 1200, height: 1600, x: 2560,  y: 0},

    // MacBook Pro Only: Colemak [1920x1200]
    {key: 't', width: 1920, height: 1178, x: 0,     y: 22},
    {key: 'c', width: 960,  height: 1178, x: 0,     y: 22},
    {key: 'v', width: 960,  height: 1178, x: 960,   y: 22},
  ],
}
