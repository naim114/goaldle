npm install -g netlify-cli
netlify link
// options - change function dir at Netlify UI
netlify functions:create // https://cli.netlify.com/functions-dev/
netlify functions:serve // to debug
import using require (const { schedule } = require('@netlify/functions');) // idk how to import local file using this