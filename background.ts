// const customValue = "RP000151";

function calculateScale(display) {
  const scale = Math.min(display.bounds.width / 1080, display.bounds.height / 1920);
  console.log("Calculated Scale:", scale);
  console.log("Calculated display.bounds:", display.bounds);
  return scale;
}

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    const requestHeaders1 = Object.entries(request?.header).map(([key, value]) => ({
      header: key,
      operation: chrome.declarativeNetRequest.HeaderOperation.SET,
      value:  String(value) 
    }));

    //console.log(requestHeaders1)
    if (request) {
      chrome.tabs.create({ url: request?.url }, (tab) => {
        console.log("Opened new tab with ID:", tab.id);
     
        chrome.declarativeNetRequest.updateSessionRules({
          addRules: [{
            id: tab.id,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
              requestHeaders: requestHeaders1
            },
            condition: {
              urlFilter: "|http*",
              tabIds: [tab.id],
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
                chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
                chrome.declarativeNetRequest.ResourceType.STYLESHEET,
                chrome.declarativeNetRequest.ResourceType.SCRIPT,
                chrome.declarativeNetRequest.ResourceType.IMAGE,
                chrome.declarativeNetRequest.ResourceType.FONT,
                chrome.declarativeNetRequest.ResourceType.OBJECT,
                chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST
              ]
            }
          }],
          removeRuleIds: [tab.id]
        },()=>{
          if (chrome.runtime.lastError) {
            console.error('Error updating session rule:', chrome.runtime.lastError);
            sendResponse({ success: false, error: "process has failed.." });

          } else {
            console.log('Session rule added successfully');



        if(request?.isChecked || false)
        {
            chrome.windows.get(tab.windowId, { populate: false }, (window) => {
              if (chrome.runtime.lastError || !window) {
                console.error("Error getting window info:", chrome.runtime.lastError);
                return;
              }
                console.log("Window Bounds:", window.left, window.top, window.width, window.height);

                chrome.system.display.getInfo((displays) => {
                  if (chrome.runtime.lastError) {
                    console.error("Error getting display info:", chrome.runtime.lastError);
                    return;
                  }

                    const activeDisplay = displays.find((display) => {
                      return (
                        window.left >= display.bounds.left &&
                        window.left < display.bounds.left + display.bounds.width &&
                        window.top >= display.bounds.top &&
                        window.top < display.bounds.top + display.bounds.height
                      );
                    });

                // Find the display and attach debugger
                chrome.debugger.attach({ tabId : tab.id }, "1.3", () => {
                  console.log("Debugger attached",tab.id)
                  chrome.debugger.sendCommand({ tabId : tab.id  }, "Emulation.setDeviceMetricsOverride", {
                      width: 1080,
                      height: 1920,
                      deviceScaleFactor: 1.5, // Adjust as needed
                      mobile: true,
                      screenWidth: 1080,
                      screenHeight: 1920,
                      screenOrientation: { type: "portraitPrimary", angle: 0 },
                      viewport : {
                        x : 0,
                        y : 0,
                        width: 1080,
                        height: 1920,
                        scale : calculateScale(activeDisplay)
                      }
                  }).then(() => { 
                    if (chrome.runtime.lastError) {
                      console.error("Device emulation failed: " + chrome.runtime.lastError.message);
                    } else {
                      console.log("Device emulation set to 1080x1920.");
                    }
                    }); 
                  });
                });
             });

            }
            //End of atatching debugger

            chrome.tabs.update(tab.id, { url: request?.url }, () => {
              //console.log("Tab updated to load the specific URL.");
            });
            sendResponse({ success: true, data:tab.id });

          }
        });
      });
    }
    return true;
  });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // //console.log(tab.url)
//       if (changeInfo.status === 'complete' && tab.url.includes('/screen/welcomescreen')) {
//         chrome.tabs.remove(tabId, () => {
//           //console.log(`Closed tab with ID: ${tabId} as it matched the URL condition.`);
//         });
//       }
//     });

    // chrome.runtime.onStartup.addListener(() => {
    //   chrome.tabs.query({}, (tabs) => {
    //     tabs.forEach((tab) => {
    //       if (tab.url.includes('/screen/welcomescreen')) {
    //         chrome.tabs.remove(tab.id, () => {
    //           //console.log(`Closed tab with ID: ${tab.id} on startup as it matched the URL condition.`);
    //         });
    //       }
    //     });
    //   });
    // });


// chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [{
//     id: 1,
//     priority: 1,
//     action: {
//       type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
//       requestHeaders: [{
//         header: "computer-name",
//         operation: chrome.declarativeNetRequest.HeaderOperation.SET,
//         value: customValue
//       }]
//     },
//     condition: {
//       urlFilter: "|http*",
//       // tabIds:
//       resourceTypes: [  chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
//         chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
//         chrome.declarativeNetRequest.ResourceType.STYLESHEET,
//         chrome.declarativeNetRequest.ResourceType.SCRIPT,
//         chrome.declarativeNetRequest.ResourceType.IMAGE,
//         chrome.declarativeNetRequest.ResourceType.FONT,
//         chrome.declarativeNetRequest.ResourceType.OBJECT,
//         chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
//         chrome.declarativeNetRequest.ResourceType.PING,
//         chrome.declarativeNetRequest.ResourceType.CSP_REPORT,
//         chrome.declarativeNetRequest.ResourceType.MEDIA,
//         chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
//         chrome.declarativeNetRequest.ResourceType.OTHER,
//       ]
//     }
//   }],
//   removeRuleIds: [1]
// });