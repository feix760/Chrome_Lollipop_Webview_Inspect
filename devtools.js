
const { tabId } = chrome.devtools.inspectedWindow;

chrome.tabs.get(tabId, data => {
  const { url } = data;
  // devtools://devtools/remote/serve_rev/@200258/inspector.html?remoteVersion=44.0.2403.147&remoteFrontend=true&dockSide=undocked
  const regexp = /^devtools:\/\/devtools\/remote\/.*?remoteVersion=(\d+)/i;
  const remoteVersion = regexp.test(url) && RegExp.$1 || '';
  if (remoteVersion && +remoteVersion < 46) {
    chrome.devtools.inspectedWindow.eval(getJS(remoteVersion), (result, isException) => {
      console.log('isException', isException);
    });
  }
});

function getJS(remoteVersion) {
  return `
    const css = '/*__FIXED*/*{min-width:0;min-height:0}.component-root{cursor:default;font-family:Lucida Grande,sans-serif;font-size:12px;tab-size:4;-webkit-user-select:none;color:#222}.platform-linux{color:#303942;font-family:Ubuntu,Arial,sans-serif}.platform-mac{color:#303942;font-family:"Lucida Grande",sans-serif}.platform-windows{font-family:"Segoe UI",Tahoma,sans-serif}.platform-mac .monospace,.platform-mac.monospace,.platform-mac .source-code,.platform-mac.source-code{font-size:11px!important;font-family:Menlo,monospace}.platform-windows .monospace,.platform-windows.monospace,.platform-windows .source-code,.platform-windows.source-code{font-size:12px!important;font-family:Consolas,Lucida Console,monospace}.platform-linux .monospace,.platform-linux.monospace,.platform-linux .source-code .platform-linux.source-code{font-size:11px!important;font-family:dejavu sans mono,monospace}.source-code{font-family:monospace;font-size:11px!important;white-space:pre-wrap}*{box-sizing:border-box}:focus{outline:0}img{-webkit-user-drag:none}iframe,a img{border:0}.fill{position:absolute;top:0;left:0;right:0;bottom:0}iframe.fill{width:100%;height:100%}.widget{position:relative;flex:auto}.hbox{display:flex;flex-direction:row!important;position:relative}.vbox{display:flex;flex-direction:column!important;position:relative}.flex-auto{flex:auto}.flex-none{flex:none}.flex-centered{display:flex;align-items:center;justify-content:center}iframe.widget{position:absolute;width:100%;height:100%;left:0;right:0;top:0;bottom:0}.hidden{display:none!important}.monospace{font-size:10px!important;font-family:monospace}.highlighted-search-result{border-radius:1px;padding:1px;margin:-1px;background-color:rgba(255,255,0,0.8)}.link{cursor:pointer;text-decoration:underline;color:#15c}button,input,select{font-family:inherit;font-size:inherit}input[type="search"]:focus,input[type="text"]:focus{outline:auto 5px -webkit-focus-ring-color}.highlighted-search-result.current-search-result{border-radius:1px;padding:1px;margin:-1px;background-color:rgba(255,127,0,0.8)}.cm-js-keyword{color:#aa0d91}.cm-js-number{color:#1c00cf}.cm-js-comment{color:#007400}.cm-js-string{color:#c41a16}.cm-js-string-2{color:#c41a16}.cm-css-keyword{color:#07909a}.cm-css-number{color:#3200ff}.cm-css-comment{color:#007400}.cm-css-def{color:#c80000}.cm-css-meta{color:#c80000}.cm-css-atom{color:#07909a}.cm-css-string{color:#07909a}.cm-css-string-2{color:#07909a}.cm-css-link{color:#07909a}.cm-css-variable{color:#c80000}.cm-css-variable-2{color:#000080}.cm-css-property,.webkit-css-property{color:#c80000}.cm-xml-meta{color:#c0c0c0}.cm-xml-comment{color:#236e25}.cm-xml-string{color:#1a1aa6}.cm-xml-tag{color:#881280}.cm-xml-attribute{color:#994500}.cm-xml-link{color:#00e}.webkit-html-comment{color:#236e25}.webkit-html-tag{color:#881280}.webkit-html-pseudo-element{color:brown}.webkit-html-js-node,.webkit-html-css-node{white-space:pre}.webkit-html-text-node{unicode-bidi:-webkit-isolate}.webkit-html-entity-value{background-color:rgba(0,0,0,0.15);unicode-bidi:-webkit-isolate}.webkit-html-doctype{color:#c0c0c0}.webkit-html-attribute-name{color:#994500;unicode-bidi:-webkit-isolate}.webkit-html-attribute-value{color:#1a1aa6;unicode-bidi:-webkit-isolate}.webkit-html-external-link,.webkit-html-resource-link{color:#00e}.webkit-html-resource-link{text-decoration:underline;cursor:pointer}.webkit-html-external-link{text-decoration:none}.webkit-html-external-link:hover{text-decoration:underline}.webkit-html-end-of-file{color:#f00;font-weight:bold}.stack-preview-async-description{padding:3px 0 1px;font-style:italic}.stack-preview-container .webkit-html-blackbox-link{opacity:.6}';
    const add = function($el) {
      if ($el.tagName === 'STYLE') {
        if (!$el.innerHTML.startsWith('/*__FIXED')) {
          $el.innerHTML = css + $el.innerHTML;
        }
      }

      if ($el.shadowRoot) {
        [].slice.call($el.shadowRoot.children || []).forEach(add);
      }

      [].slice.call($el.children || []).forEach(add);
    }

    add(document.body);
    setInterval(() => add(document.body), 1000);
    console.log('Set devtool success, remote version ${remoteVersion}');
  `;
}
