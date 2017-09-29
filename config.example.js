const CONFIG = {
  MAIN_MODIFIERS: ['cmd', 'ctrl'],
  PRESETS: [
    // Home: Colemak [1280x800, 2560x1600 (main), 1200x1600]
    // Left Screen (Macbook)
    {key: '4', width: 1280, height: 800,  x: -1280, y: 0},
    // Main Screen (Full, Vertical Halves, Quadrants)
    {key: 'f', width: 2560, height: 1578, x: 0,     y: 22},
    {key: '5', width: 1280, height: 1578, x: 0,     y: 22},
    {key: '6', width: 1280, height: 1578, x: 1280,  y: 22},
    {key: 'g', width: 1280, height: 789,  x: 0,     y: 22},
    {key: 'd', width: 1280, height: 789,  x: 0,     y: 811},
    {key: 'j', width: 1280, height: 789,  x: 1280,  y: 22},
    {key: 'h', width: 1280, height: 789,  x: 1280,  y: 811},
    // Right Screen (Full, Horizontal Halves)
    {key: '7', width: 1200, height: 1600, x: 2560,  y: 0},
    {key: 'l', width: 1200, height: 800,  x: 2560,  y: 0},
    {key: 'n', width: 1200, height: 800,  x: 2560,  y: 800},


    // Work: Colemak [1440x990, 960x1080 (main), 1080x1920]
    // Left Screen (Macbook)
    {key: 'a', width: 1440, height: 900,  x: -1440, y: 0},
    // Main Screen (Full, Vertical Halves)
    {key: 't', width: 1920, height: 1058, x: 0,     y: 22},
    {key: 'c', width: 960,  height: 1058, x: 0,     y: 22},
    {key: 'v', width: 960,  height: 1058, x: 960,   y: 22},
    // Right Screen (Vertical)
    {key: 'o', width: 1080, height: 1920, x: 1920,  y: 0},
  ],
}
