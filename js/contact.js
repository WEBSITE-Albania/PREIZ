/* =========================================================================
   PREIZ Co. — CONTACT (WhatsApp message composer)
   Builds a WhatsApp click-to-chat link with the visitor's message prefilled.
   No backend: the visitor confirms and sends the message inside WhatsApp.
   ========================================================================= */

(function () {
  "use strict";

  var P = window.PREIZ;
  P.renderers = P.renderers || [];

  P.renderers.push(function () {
    var form = document.getElementById("wa-form");
    if (!form) return;

    var nameField = form.querySelector("#wa-name");
    var msgField = form.querySelector("#wa-message");
    var error = form.querySelector("#wa-error");
    var status = form.querySelector("#wa-status");
    var touchedByUser = false;
    var prefill = null;

    /* Prefill from ?package=<id> (links on the Products & Services page) */
    var pkgId = new URLSearchParams(location.search).get("package");
    var found = pkgId && P.findItem ? P.findItem(pkgId) : null;

    function packageText() {
      if (!found) return "";
      return P.t("contact.form.packageMsg", {
        name: P.L(found.item.name),
        price: P.price(found.item.price)
      });
    }

    if (found) {
      prefill = packageText();
      msgField.value = prefill;
    }

    msgField.addEventListener("input", function () {
      touchedByUser = true;
      if (msgField.value.trim()) hideError();
    });

    // Keep the prefilled package sentence in the active language
    P.onLang(function () {
      if (found && (!touchedByUser || msgField.value === prefill)) {
        prefill = packageText();
        msgField.value = prefill;
      }
      if (!error.hidden) error.textContent = P.t("contact.form.error");
    });

    function showError() {
      error.textContent = P.t("contact.form.error");
      error.hidden = false;
      msgField.setAttribute("aria-invalid", "true");
      form.classList.add("has-error");
      msgField.focus();
    }
    function hideError() {
      error.hidden = true;
      msgField.removeAttribute("aria-invalid");
      form.classList.remove("has-error");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var message = msgField.value.trim();
      if (!message) { showError(); return; }
      hideError();

      var name = nameField ? nameField.value.trim() : "";
      var text = name ? P.t("contact.form.namePrefix") + ": " + name + "\n\n" + message : message;
      var url = P.waLink(text);

      status.textContent = P.t("contact.form.opening");
      setTimeout(function () { status.textContent = ""; }, 4000);

      // Open WhatsApp in a new tab; fall back to same-tab navigation if blocked.
      // (The "noopener" feature string would make window.open return null,
      //  so the opener reference is cleared manually instead.)
      var win = window.open(url, "_blank");
      if (win) {
        try { win.opener = null; } catch (err) { /* ignore */ }
      } else {
        window.location.href = url;
      }
    });
  });
})();
