# StudyNest
A super cool web app for studying with friends


# Setup
Run `npm i` then 
Run `npm start` to run the application.

If errors, navigate to the `client/` folder, and try the following:
1. You may need to re-install npm packages, before doing so you should delete the file `package-lock.json` and the `node_modules/` folder: `rm -rf node_modules/ package-lock.json; npm i`


# Context (Color & Light, Timer, User Role)
1. Add import statements to the top of your file
```
import { useRoomSettings } from "../Room/RoomSettingsContext";
import { useTimer } from "../Timer/TimerContext";
```

2. Retrieve values by calling the functions
```
const { selectedColor, selectedLight, contextUserRole } = useRoomSettings(); // access color & light and user role settings
const { isTimerDone, isActive, resetTimerStatus } = useTimer(); // access timer
```

3a. To use light mode, create backgroundColor variable to add in-line CSS styling
```
const backgroundColor = selectedLight === "light" ? "rgb(255, 253, 248)" : "rgb(69, 67, 63)"; // add at the top

// ...

<div className="brain-break"
  style={{
      "backgroundColor": backgroundColor,   
      "color": selectedLight === "light" ? "black" : "white"                    
}}>
  // ...
</div>
// backgroundColor would be off-white or dark grey depending on light mode
// color would be the color of the text
```

3b. To use color mode, add colorMapping and create buttonColor variable to add in-line styling
```
const colorMapping = {
    default: "#6fb2c5",
    red: "rgb(217, 91, 91)",
    orange: "rgb(204, 131, 53)",
    yellow: "rgb(245, 227, 125)",
    green: "rgb(118, 153, 93)",
    blue: "rgb(59, 124, 150)",
    purple: "rgb(165, 132, 224)",
    pink: "rgb(242, 170, 213)"  
};
const buttonColor = colorMapping[selectedColor || colorMapping.default];

// ...

<button className="activity-button" onClick={handleEnterHangman} style={{backgroundColor: buttonColor}}>
    Hangman
</button>
```

3c. To use timer, add useEffect to listen to when timer is done
```
useEffect(() => {
    if (isTimerDone && !isActive) {
        alert("STUDY BREAK TIME !!!");
        resetTimerStatus();
    }
}, [isTimerDone, resetTimerStatus]);
```

3d. To use a user's role, check if contextUserRole is 'host', 'editor', or 'viewer'
```
{contextUserRole && contextUserRole === 'viewer' && (
    <div>
        <p>You do not have access to Brain Break Activities.</p>
    </div>
)}

{contextUserRole && (contextUserRole === 'host' || contextUserRole === 'editor') && (
    <div>
        <p>Choose an activity!</p>

        <button className="activity-button" onClick={handleEnterMeditation} style={{backgroundColor: buttonColor}}>
            Meditation
        </button>
        <button className="activity-button" onClick={handleEnterHangman} style={{backgroundColor: buttonColor}}>
            Hangman
        </button>
    </div>
)}
```
