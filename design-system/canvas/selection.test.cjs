// These specimens are static designs; application interaction tests are intentionally replaced.
require('./static-specimens.test.cjs')("selection").catch(error=>{console.error(error);process.exitCode=1;});
