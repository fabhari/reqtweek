// const customValue = "RP000151";

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log("Received message from chrome:", request);
    console.log(request)
    
    if (request) {
      // chrome.tabs.create({ url: 'http://example.com' }, (tab) => {
      //   console.log("Opened new tab with ID:", tab.id);
      //   chrome.declarativeNetRequest.updateSessionRules({
      //     addRules: [{
      //       id: tab.id,
      //       priority: 1,
      //       action: {
      //         type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      //         requestHeaders: [{
      //           header: "computer-name",
      //           operation: chrome.declarativeNetRequest.HeaderOperation.SET,
      //           value: "testing"
      //         }]
      //       },
      //       condition: {
      //         urlFilter: "|http*",
      //         tabIds: [tab.id],
      //         resourceTypes: [
      //           chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
      //           chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
      //           chrome.declarativeNetRequest.ResourceType.STYLESHEET,
      //           chrome.declarativeNetRequest.ResourceType.SCRIPT,
      //           chrome.declarativeNetRequest.ResourceType.IMAGE,
      //           chrome.declarativeNetRequest.ResourceType.FONT,
      //           chrome.declarativeNetRequest.ResourceType.OBJECT,
      //           chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST
      //         ]
      //       }
      //     }]
      //   });
      // });
    }
    // Return true to indicate you want to send a response asynchronously
    return true;
  });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // console.log(tab.url)
//       if (changeInfo.status === 'complete' && tab.url.includes('/screen/welcomescreen')) {
//         chrome.tabs.remove(tabId, () => {
//           console.log(`Closed tab with ID: ${tabId} as it matched the URL condition.`);
//         });
//       }
//     });

    // chrome.runtime.onStartup.addListener(() => {
    //   chrome.tabs.query({}, (tabs) => {
    //     tabs.forEach((tab) => {
    //       if (tab.url.includes('/screen/welcomescreen')) {
    //         chrome.tabs.remove(tab.id, () => {
    //           console.log(`Closed tab with ID: ${tab.id} on startup as it matched the URL condition.`);
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