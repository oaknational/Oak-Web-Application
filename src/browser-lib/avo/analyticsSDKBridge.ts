import { CustomDestination } from "./Avo";

const analyticsSDKBridge: CustomDestination = {
  make: function (env) {
    /*
        Triggered during Avo initialization. Here you can initialize an analytics SDK with a development or production key
        based on the env parameter. If analytics SDK has already been initialized you can leave this function blank.
  
        Example: analytics.init(env);      
      */
    console.log("avo.make", env);
  },
  logEvent: (eventName, eventProperties) => {
    /*
        All your events are managed in the Tracking Plan in Avo. Each event gets a generated Avo Function. Avo events can
        have a Log Event action attached. This callback is triggered when an Avo Function with Log Event action is called.
        Here you perform the actual event tracking, calling the track/log methods of the analytics SDK. Event name and event
        properties are provided as parameters.
  
        Example: analytics.track(eventName, eventProperties);  
      */
    console.log("avo.logEvent", { eventName, eventProperties });
  },
  logPage: (pageName, eventProperties) => {
    /*
        All your events are managed in the Tracking Plan in Avo. Each event gets a generated Avo Function. Avo events can
        have a Log Page View action attached. This callback is triggered when an Avo Function with Log Page View action is called.
        Here you perform the navigation tracking, providing the new page name when user opens a new page.
  
        Example: analytics.pageView(pageName, eventProperties);  
      */
    console.log("avo.logPage", { pageName, eventProperties });
  },
  setUserProperties: (userId, userProperties) => {
    /*
        You can add User Properties to events in the Trackin Plan in Avo. When an Avo Function with attached user properties
        is called, this callback is triggered. Here you would attach user properties to the currently identified user in your
        analytics platform.
  
        Example: analytics.setUserProperties(userId, userProperties);  
      */

    console.log("avo.setUserProperties", { userId, userProperties });
  },
  identify: (userId) => {
    /*
        You can add the Identify User action to events in the Trackin Plan in Avo. When calling an Avo Function that includes
        the Identify User action you'll need to provide a user ID. Calling an Avo Function that has the Identify User action
        will trigger this callback. The main use cases are signup and login. Here you would pass the user ID to the analytics
        SDK for it to create a new user or attach a session to an existing user.
  
        Example: analytics.identify(userId);
      */

    console.log("avo.identify", { userId });
  },
  unidentify: () => {
    /*
        You can add the Unidentify User action to events in the Trackin Plan in Avo When calling an Avo Function that includes
        the Unidentify User action this callback will be triggered. Here you would call an analytics SDK method to detach subsequent
        actions from the currently identified user.
  
        Example: analytics.identify(null);
      */

    console.log("avo.unidentify");
  },
};

export default analyticsSDKBridge