{
  "baseUrl": ".",
  "optimize": "none",
  "paths": {
    "optional": "build/rjs/optional",

    "eventemitter2": "node_modules/eventemitter2/lib/eventemitter2",
    "wingman": "node_modules/wingman/dist/wingman",
    
    "util": "src/util",
    "events": "src/util/events",
    "services": "src/services",
    
    "arbiter": "src/arbiter"
  },
  "include": [
    "node_modules/almond/almond", 
    "arbiter"
  ],
  "exclude": [
  ],
  "out": "dist/arbiter.js",
  "wrap": {
    "startFile": "build/wrap.start",
    "endFile": "build/wrap.end"
  }
}