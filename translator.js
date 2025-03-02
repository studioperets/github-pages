// Hebrew Translation for GoHighLevel
(function() {
  // Dictionary - English to Hebrew
  const translations = {
    // Menu items
    " Dashboard ": "דאשבורד",
    " Conversations ": "שיחות",
    " Calendars ": "לוחות שנה",
    " Contacts ": "אנשי קשר",
    " Opportunities ": "הזדמנויות",
    " Payments ": "תשלומים",
    " Marketing ": "שיווק",
    " Automation ": "אוטומציה",
    " Sites ": "אתרים",
    " Settings ": "הגדרות",
    
    // Common terms
    "Save": "שמור",
    "Delete": "מחק",
    "Add": "הוסף",
    "Cancel": "ביטול",
    "Search": "חיפוש",
    "Clear": "נקה",
    "Send": "שלח",
    "Yes": "כן",
    "No": "לא",
    
    // Fields
    "Name": "שם",
    "Email": "דואר אלקטרוני",
    "Phone": "טלפון",
    "Type": "סוג",
    "Title": "כותרת",
    "Description": "תיאור",
    "Tasks": "משימות",
    "Notes": "פתקים",
    "Company": "חברה",
    "Created": "נוצר",
    "Status": "סטטוס",
    
    // Other terms
    "Contact": "איש קשר",
    "Last Activity": "פעילות אחרונה",
    "Smart Lists": "רשימות חכמות",
    "Create new": "צור חדש",
    "Edit": "ערוך",
    "View": "צפה",
    "Appointments": "פגישות",
    "Calendar": "לוח שנה",
    "Followers": "עוקבים"
  };
  
  // Function to translate text
  function translateText(text) {
    if (!text || typeof text !== "string") return text;
    
    let result = text;
    for (const [eng, heb] of Object.entries(translations)) {
      if (result.includes(eng)) {
        try {
          result = result.replace(new RegExp(eng.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), heb);
        } catch (error) {
          console.log("Error translating: " + eng);
        }
      }
    }
    return result;
  }
  
  // Function to translate all text nodes in page
  function translatePage() {
    if (!document || !document.body) return;
    
    // Elements to skip
    const excludeNodeNames = ["SCRIPT", "STYLE", "CODE", "PRE"];
    
    // Check if node should be translated
    function shouldTranslateNode(node) {
      if (node.nodeType !== Node.TEXT_NODE) return false;
      if (!node.nodeValue || !node.nodeValue.trim()) return false;
      
      let parent = node.parentNode;
      while (parent) {
        if (excludeNodeNames.includes(parent.nodeName)) return false;
        if (parent.hasAttribute && parent.hasAttribute("data-no-translate")) return false;
        if (parent.classList && (
          parent.classList.contains("CodeMirror") || 
          parent.classList.contains("code-editor") || 
          parent.classList.contains("js-code") ||
          parent.classList.contains("ace_editor")
        )) return false;
        
        parent = parent.parentNode;
      }
      
      return true;
    }
    
    // Collect all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { acceptNode: node => shouldTranslateNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
    );
    
    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }
    
    // Translate each text node
    textNodes.forEach(node => {
      try {
        const originalText = node.nodeValue;
        const translatedText = translateText(originalText);
        if (translatedText !== originalText) {
          node.nodeValue = translatedText;
        }
      } catch (error) {
        console.log("Error translating node:", error);
      }
    });
  }
  
  // Monitor DOM changes
  function observeChanges() {
    if (!window.MutationObserver) return;
    
    const observer = new MutationObserver(mutations => {
      let shouldTranslate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "characterData") {
          shouldTranslate = true;
          break;
        }
      }
      
      if (shouldTranslate) {
        setTimeout(translatePage, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // Start translation
  function startTranslation() {
    translatePage();
    observeChanges();
    setTimeout(translatePage, 1000);
    setTimeout(translatePage, 3000);
  }
  
  // Wait for page to load
  if (document.readyState === "complete") {
    startTranslation();
  } else {
    window.addEventListener("load", startTranslation);
  }
  
  // Start immediately
  setTimeout(startTranslation, 500);
})();
