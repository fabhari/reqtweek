// const customValue = "RP000151";

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //console.log("Received message from chrome:", request);
    //console.log(request)
    
    const requestHeaders1 = Object.entries(request?.header).map(([key, value]) => ({
      header: key,
      operation: chrome.declarativeNetRequest.HeaderOperation.SET,
      value:  String(value) 
    }));

    //console.log(requestHeaders1)
    if (request) {
      chrome.tabs.create({ url: request?.url }, (tab) => {
        //console.log("Opened new tab with ID:", tab.id);
     
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
            //console.log('Session rule added successfully');
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