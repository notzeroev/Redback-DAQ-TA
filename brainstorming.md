# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder
Task 1:
- Ok so I've never deployed a dockerized react app before, so I'm trying to figure out how the flow works here.
- It looks like with nodemon, we're configuring it so that it watches the changes in a specific file/set of files and then restarts the node app.
- It seems like there's no reason to set up nodemon on the ui module, as it already has turbopack (next's built-in hot reload). Ill have to speak to the redback team about this, becuase it seems like it might be better to just use turbopack unless we have an exremely specific use case for nodemon for the ui.


## Cloud