/* WearHaus - order form on the product page (this file only handles the order email; main.js is Lou's shared file)
   Email forms ("JavaScript Method #2": build a mailto: link and open the visitor's email app) */
(function () {
  "use strict";

  var INQUIRY_EMAIL = "hello@examplewebsite142.com";
  var ORDER_EMAIL = "orders@examplewebsite142.com";
  var NL = "\r\n";
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function openEmail(to, subject, body) {
    var link = "mailto:" + to +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    window.location.href = link;
  }

  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    if (input) {
      input.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
    }
  }

  function clearError(input, errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
    if (input) {
      input.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
    }
  }

  /* Checks a list of fields in page order. Each field: {input, error, label, type}.
     Shows a specific message for every problem and returns the first field with a problem. */
  function validateFields(fields) {
    var firstBad = null;
    fields.forEach(function (f) {
      clearError(f.input, f.error);
      var value = f.input.value.trim();
      if (!value) {
        showError(f.input, f.error, f.emptyMessage);
        firstBad = firstBad || f.input;
      } else if (f.type === "email" && !EMAIL_PATTERN.test(value)) {
        showError(f.input, f.error, "Please enter a valid email address, like name@email.com.");
        firstBad = firstBad || f.input;
      } else if (f.type === "phone" && value.replace(/\D/g, "").length < 7) {
        showError(f.input, f.error, "Please enter a phone number we can call or text, like +63 917 123 4567.");
        firstBad = firstBad || f.input;
      }
    });
    return firstBad;
  }

  function field(inputId, errorId, emptyMessage, type) {
    return {
      input: document.getElementById(inputId),
      error: document.getElementById(errorId),
      emptyMessage: emptyMessage,
      type: type || "text"
    };
  }

  /* ---------------- Order form (product pages) ---------------- */
  var orderForm = document.getElementById("order-form");
  if (orderForm) {
    var product = orderForm.getAttribute("data-product");
    var price = parseInt(orderForm.getAttribute("data-price"), 10);
    var qtyEl = document.getElementById("quantity");
    var qtyErr = document.getElementById("qty-error");
    var sizeErr = document.getElementById("size-error");
    var orderStatus = document.getElementById("order-status");
    var oName = field("od-name", "od-name-error", "Please enter your full name.");
    var oEmail = field("od-email", "od-email-error", "Please enter your email address.", "email");
    var oPhone = field("od-phone", "od-phone-error", "Please enter your phone number.", "phone");
    var oAddress = field("od-address", "od-address-error", "Please enter your delivery address.");
    var MIN = 1, MAX = 20;

    function readQty() {
      var n = parseInt(qtyEl.value, 10);
      return isNaN(n) ? NaN : n;
    }

    document.getElementById("qty-minus").addEventListener("click", function () {
      var n = readQty();
      qtyEl.value = isNaN(n) ? MIN : Math.max(MIN, n - 1);
      clearError(qtyEl, qtyErr);
    });
    document.getElementById("qty-plus").addEventListener("click", function () {
      var n = readQty();
      qtyEl.value = isNaN(n) ? MIN : Math.min(MAX, n + 1);
      clearError(qtyEl, qtyErr);
    });

    Array.prototype.forEach.call(orderForm.querySelectorAll('input[name="size"]'), function (r) {
      r.addEventListener("change", function () { clearError(null, sizeErr); });
    });

    orderForm.addEventListener("submit", function (event) {
      event.preventDefault();
      orderStatus.textContent = "";
      orderStatus.className = "form-status";
      clearError(null, sizeErr);
      clearError(qtyEl, qtyErr);

      var chosen = orderForm.querySelector('input[name="size"]:checked');
      var qty = readQty();
      var firstBad = null;

      if (!chosen) {
        showError(null, sizeErr, "Please choose a size (S, M, L, or XL).");
        firstBad = orderForm.querySelector('input[name="size"]');
      }
      if (isNaN(qty) || qty < MIN || qty > MAX) {
        showError(qtyEl, qtyErr, "Please enter a quantity from " + MIN + " to " + MAX + ".");
        firstBad = firstBad || qtyEl;
      }
      var badDetail = validateFields([oName, oEmail, oPhone, oAddress]);
      firstBad = firstBad || badDetail;

      if (firstBad) {
        firstBad.focus();
        return;
      }

      var size = chosen.value;
      var total = price * qty;
      var name = oName.input.value.trim();
      var subject = "Order: " + product + " (" + size + " x " + qty + ") - " + name;
      var body = "Hello WearHaus," + NL + NL +
        "I would like to order:" + NL +
        "T-shirt: " + product + NL +
        "Size: " + size + NL +
        "Quantity: " + qty + NL +
        "Price each: PHP " + price + NL +
        "Total: PHP " + total + NL + NL +
        "My details:" + NL +
        "Name: " + name + NL +
        "Email: " + oEmail.input.value.trim() + NL +
        "Phone number: " + oPhone.input.value.trim() + NL +
        "Delivery address: " + oAddress.input.value.trim() + NL + NL +
        "Thank you!";

      openEmail(ORDER_EMAIL, subject, body);
      orderStatus.className = "form-status ok";
      orderStatus.textContent = "Thank you, " + name + ". Your email app should open with your order for " + qty + " x " +
        product + " (size " + size + "). Press send there to finish. " +
        "If nothing opened, please email " + ORDER_EMAIL + ".";
    });
  }
})();
