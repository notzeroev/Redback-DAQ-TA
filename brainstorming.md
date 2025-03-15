# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder
Task 1
- I've never deployed a dockerized react app before, so I'm trying to figure out how the flow works here. It looks like with nodemon, we're configuring it so that it watches the changes in a specific file/set of files and then restarts the node app.
- It seems like there's no reason to set up nodemon on the ui module, as it already has turbopack (next's built-in hot reload). Ill have to speak to the redback team about this, becuase it seems like it might be better to just use turbopack unless we have an exremely specific use case for nodemon for the ui. *(Turbopack and install used is suitable, verified by redback team)*
- Upon reviewing the streaming-service to set up nodemon it seems like Nodemon has already been set up? I thought it's some sort of debugging task but apparently it just works. *(Confiremd to be a mistake)*

Task 2
- Updating the streaming service to prevent invalid data was fairly straightforward, I simply parsed the data and checked to see if the temperature was in the right format
- As of now, I'm simply not sending the invalid data to the frontend. (See update in task 5)

Task 3
- I've set up the battery warning to trigger at 3 attempts using a simple counter in the server.ts file
- However I decided to with an increment/decrement approach. So in this scenario if the counter goes back in the safe rnage, the counter decrements from 3->2 instead of going to 0. Which means that if it was to go back into the unsafe zone it would trigger the warning again. Rather than having to do 3 counts at before triggering the warning.
- I opted for this approach because in the scenario of the temperature fluctuating right around the danger mark it would be better, in my opinion, to have the warning show more often.

Task 4
- The reason the connect/disconnect button was not workig was because the dependency array for the WebSocket Effect Hook was empty. Meaning  the function was not being run other than on the initial render. Passing *readyState* into the array means the function is run whenever readyState changes.

Task 5
- I've updated the numeric component to have the specified colors. Opting for the implementation suggested in the file (using the cn function)
    - Nothing speccial here, but it was interesting to read up on why we use cn, and how it avoids classname collisions from **[this post](https://www.reddit.com/r/tailwindcss/comments/1egbuvx/the_buzz_around_cn_function_and_why_do_we_use_it/)**.
- Additional Features
    - Added a theme toggle, allowing the user to switch between light and dark mode.
    - Updated the layout to a "bento" grid. This allows for a modular layout as we can add as many bento cards as we like to display any vehicle information. Bento cards come in 3 predefined sizes
        - I've again used shadcn ui components in order to keep visuals consistent. Quite happy with how it turned out.
    - Added graph to visualize temperatures over the last 100 seconds. Shadcn's charts builds on top of **recharts**, so I had to add in that dependancy.
        - The chart proved to be quite the hassle as we are updating the chart data quite frequently.
        - I tried implementing the chart with react hooks, but I found that it works better when using intervals.
        - This would be one part of the submission that I would re-look into if I had more time.
    - Added a session uptime widget
        - With this I learnt just how oddly challenging handling timers/stopwatches are in react. The solution that is the most popular according to the internet is the one I opted for, though I do find it bizzare.
        - Again if I did have some more time on my hands I would look to use a plugin or something similar that streamlines this experience.
    - Added trackers for crossing threshold temperature, and recieving bad data from the streaming service.
    

## Cloud