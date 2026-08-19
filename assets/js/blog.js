/* chmakorkrich_ blog — custom UI behaviour */

(function () {
  "use strict";

  /* ---------- Theme toggle (strict light/dark, persisted) ---------- */

  var modeBtn = document.getElementById("mode-toggle");
  if (modeBtn) {
    modeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
      root.setAttribute("data-mode", next);
      try {
        sessionStorage.setItem("mode", next);
      } catch (err) {}
    });
  }

  /* ---------- Back to top ---------- */

  var topBtn = document.getElementById("back-to-top");
  if (topBtn) {
    var onScroll = function () {
      var show = window.scrollY > 400;
      topBtn.classList.toggle("show", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Search ---------- */

  var searchTrigger = document.getElementById("search-trigger");
  var searchBar = document.getElementById("search");
  var searchInput = document.getElementById("search-input");
  var searchCancel = document.getElementById("search-cancel");
  var searchResults = document.getElementById("search-result-wrapper");

  var searchOn = function (on) {
    if (searchBar) searchBar.classList.toggle("d-flex", on);
    if (searchResults) searchResults.classList.toggle("on", on && searchInput && searchInput.value.length > 0);
    if (on && searchInput) {
      searchInput.focus();
      if (searchResults) searchResults.classList.add("on");
    }
  };

  if (searchTrigger && searchInput) {
    searchTrigger.addEventListener("click", function () { searchOn(true); });

    if (searchCancel) {
      searchCancel.addEventListener("click", function () {
        searchInput.value = "";
        searchOn(false);
      });
    }

    searchInput.addEventListener("input", function () {
      if (searchResults) {
        searchResults.classList.toggle("on", this.value.length > 0);
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        searchOn(false);
      }
    });
  }

  /* ---------- Code copy buttons ---------- */

  function codeText(btn) {
    var block = btn.closest(".highlight");
    if (block) {
      var rouge = block.querySelector(".rouge-code pre");
      if (rouge) return rouge.innerText;
      var code = block.querySelector("code");
      if (code) return code.innerText;
    }
    var wrap = btn.parentElement;
    if (wrap) {
      var next = wrap.nextElementSibling;
      if (next) {
        var nrouge = next.querySelector(".rouge-code pre");
        if (nrouge) return nrouge.innerText;
        var ncode = next.querySelector("code");
        if (ncode) return ncode.innerText;
      }
    }
    return "";
  }

  document.querySelectorAll(".code-header button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = codeText(btn);
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(ta);
      }
      var label = btn.getAttribute("data-title-succeed") || "Copied";
      var icon = btn.querySelector("i");
      var old = btn.innerHTML;
      btn.innerHTML = "<i class=\"fas fa-check\"></i>";
      btn.title = label;
      setTimeout(function () { btn.innerHTML = old; }, 1500);
    });
  });

  /* ---------- Lightbox (glightbox) ---------- */

  if (document.querySelector(".popup") && window.GLightbox) {
    GLightbox({ selector: ".popup" });
  }

  /* ---------- Table of contents ---------- */

  var tocWrap = document.getElementById("toc-side");
  var tocList = tocWrap ? tocWrap.querySelector("ul") : null;
  var content = document.querySelector("article .content");

  if (tocList && content) {
    var headings = content.querySelectorAll("h2, h3");
    var links = [];
    var frag = document.createDocumentFragment();
    var lastH2 = null;

    headings.forEach(function (h) {
      if (!h.id) {
        h.id = "sec-" + Math.random().toString(36).slice(2, 8);
      }
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      a.dataset.target = h.id;
      li.appendChild(a);
      if (h.tagName === "H3") {
        li.style.paddingLeft = "14px";
      }
      if (h.tagName === "H2") {
        lastH2 = li;
      }
      frag.appendChild(li);
      links.push({ a: a, id: h.id, h: h });
    });

    tocList.appendChild(frag);

    if (links.length > 1) {
      var spy = function () {
        var pos = window.scrollY + 120;
        var current = links[0];
        links.forEach(function (item) {
          if (item.h.getBoundingClientRect().top + window.scrollY <= pos) {
            current = item;
          }
        });
        links.forEach(function (item) {
          item.a.classList.toggle("active", item === current);
        });
      };
      window.addEventListener("scroll", spy, { passive: true });
      spy();
    }
  }
})();
