chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  if (request == 'getOptions')
  {
    sendResponse(localStorage['tce'] || '{}');
  }
  else
  {
    sendResponse(null);
  }
});
