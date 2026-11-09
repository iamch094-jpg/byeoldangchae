(function () {
  const storageKey = "byeoldangchae-site-content-v1";
  let content = structuredClone(window.BYEOLDANG_DEFAULT);
  try {
    const savedContent = JSON.parse(localStorage.getItem(storageKey));
    if (savedContent) content = { ...content, ...savedContent };
  } catch (_) {}

  const lines = (text) => String(text || "").split("\n").map((line) => `<span>${escapeHtml(line)}</span>`).join("");
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  $$("[data-brand]").forEach((node) => node.textContent = content.brand);
  $$("[data-brand-en]").forEach((node) => node.textContent = content.englishBrand);
  $$("[data-phone]").forEach((node) => node.textContent = content.phone);
  $$("[data-booking]").forEach((node) => node.href = content.bookingUrl);
  $("#phoneLink").href = `tel:${content.phone.replace(/[^0-9+]/g, "")}`;
  $("#representativeName").textContent = content.representativeName || window.BYEOLDANG_DEFAULT.representativeName || "이준표";
  $("#businessNumber").textContent = content.businessNumber || window.BYEOLDANG_DEFAULT.businessNumber || "490-31-01768";
  $("#heroEyebrow").textContent = content.heroEyebrow;
  $("#heroTitle").innerHTML = lines(content.heroTitle);
  $("#heroSubtitle").textContent = content.heroSubtitle;
  $("#introEyebrow").textContent = content.introEyebrow;
  $("#introTitle").innerHTML = lines(content.introTitle);
  $("#introBody").textContent = content.introBody;
  $("#storyTitle").textContent = content.storyTitle;
  $("#storyBody").textContent = content.storyBody;
  $("#amenityTitle").innerHTML = lines(content.amenityTitle);
  $("#checkIn").textContent = content.checkIn;
  $("#checkOut").textContent = content.checkOut;
  $("#address").textContent = content.address;
  $("#footerAddress").textContent = content.address;
  document.querySelector('.story-image img').src = content.storyImage;
  document.querySelector('.story-detail img').src = content.detailImage;
  document.querySelector('.amenity-photo img').src = content.amenityImage;
  document.querySelector('.reservation-band > p').textContent = content.reservationIntro;
  document.querySelector('.reservation-band h2').innerHTML = lines(content.reservationTitle);
  const mapQuery = encodeURIComponent(`${content.brand} ${content.address}`);
  $("#mapFrame").src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  $("#mapLink").href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const heroMedia = $("#heroMedia");
  const heroShade = heroMedia.querySelector(".hero-shade");
  content.heroImages.forEach((src, index) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "경기전 별당채 한옥과 마당";
    if (index === 0) image.className = "active";
    heroMedia.insertBefore(image, heroShade);
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `메인 사진 ${index + 1}`);
    button.innerHTML = "<span></span>";
    if (index === 0) button.className = "active";
    button.addEventListener("click", () => setSlide(index));
    $("#heroPager").appendChild(button);
  });

  let slide = 0;
  function setSlide(index) {
    slide = index;
    heroMedia.querySelectorAll("img").forEach((image, i) => image.classList.toggle("active", i === index));
    $("#heroPager").querySelectorAll("button").forEach((button, i) => button.classList.toggle("active", i === index));
  }
  if (content.heroImages.length > 1) setInterval(() => setSlide((slide + 1) % content.heroImages.length), 5600);

  $("#roomList").innerHTML = content.rooms.map((room, index) => `
    <article class="room-card">
      <button type="button" data-room="${index}">
        <div class="room-photo">${room.images.length ? `<img src="${escapeHtml(room.images[0])}" loading="lazy" alt="${escapeHtml(room.name)} 객실">` : `<div class="photo-pending"><b>${escapeHtml(room.name)}</b><small>객실 사진은 예약 페이지에서 확인해 주세요</small></div>`}<span>${room.images.length ? "VIEW ROOM" : "RESERVATION"}</span></div>
        <div class="room-meta"><p>${String(index + 1).padStart(2, "0")}</p><div><small>${escapeHtml(room.englishName)}</small><h3>${escapeHtml(room.name)}</h3></div><strong>${escapeHtml(room.capacity)}</strong></div>
      </button>
    </article>`).join("");

  $("#amenities").innerHTML = content.amenities.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`).join("");
  $("#nearby").innerHTML = content.nearby.map((item) => `<li><span>${escapeHtml(item.name)}</span><em>${escapeHtml(item.distance)}</em></li>`).join("");
  $("#refundPolicy").innerHTML = content.refundPolicy.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const popups = Array.isArray(content.popups)
    ? content.popups
    : content.popup
      ? [{id: "legacy-popup", ...content.popup}]
      : [];
  const visiblePopups = popups.filter((popup) =>
    popup.enabled && localStorage.getItem(`byeoldangchae-popup-hidden-${popup.id}`) !== todayKey
  );
  $("#popupStack").innerHTML = visiblePopups.map((popup) => `
    <aside class="welcome-popup" role="dialog" aria-label="${escapeHtml(popup.title || "예약 안내")}" data-popup-id="${escapeHtml(popup.id)}">
      <button type="button" data-popup-close aria-label="팝업 닫기">×</button>
      ${popup.image ? `<div class="popup-photo"><img src="${escapeHtml(popup.image)}" alt="경기전 별당채 팝업 이미지"></div>` : ""}
      <div class="popup-content">
        <p>${escapeHtml(popup.eyebrow)}</p><h2>${lines(popup.title)}</h2><em>${escapeHtml(popup.body)}</em>
        <div class="popup-actions"><button type="button" data-popup-today>오늘 하루 보지 않기</button><a href="${escapeHtml(popup.buttonUrl || content.bookingUrl)}" target="_blank" rel="noreferrer">${escapeHtml(popup.buttonLabel)} ↗</a></div>
      </div>
    </aside>`).join("");
  $$("#popupStack .welcome-popup").forEach((popupNode) => {
    popupNode.querySelector("[data-popup-close]").addEventListener("click", () => popupNode.remove());
    popupNode.querySelector("[data-popup-today]").addEventListener("click", () => {
      localStorage.setItem(`byeoldangchae-popup-hidden-${popupNode.dataset.popupId}`, todayKey);
      popupNode.remove();
    });
  });

  $$(".room-card button").forEach((button) => button.addEventListener("click", () => openRoom(Number(button.dataset.room))));
  function openRoom(roomIndex) {
    const room = content.rooms[roomIndex];
    if (!room.images.length) { window.open(content.bookingUrl, '_blank', 'noopener,noreferrer'); return; }
    let imageIndex = 0;
    const modal = $("#roomModal");
    const draw = () => {
      modal.innerHTML = `
        <button class="modal-close" type="button" aria-label="객실 사진 닫기">×</button>
        <div class="modal-photo"><img src="${escapeHtml(room.images[imageIndex] || "")}" alt="${escapeHtml(room.name)} 사진"><button type="button" data-prev aria-label="이전 사진">←</button><button type="button" data-next aria-label="다음 사진">→</button></div>
        <div class="modal-info"><p>${escapeHtml(room.englishName)}</p><h2>${escapeHtml(room.name)}</h2><strong>${escapeHtml(room.capacity)}</strong><em>${escapeHtml(room.description)}</em><div class="modal-count">${String(imageIndex + 1).padStart(2, "0")} / ${String(room.images.length).padStart(2, "0")}</div></div>`;
      modal.querySelector(".modal-close").onclick = closeRoom;
      modal.querySelector("[data-prev]").onclick = () => { imageIndex = (imageIndex - 1 + room.images.length) % room.images.length; draw(); };
      modal.querySelector("[data-next]").onclick = () => { imageIndex = (imageIndex + 1) % room.images.length; draw(); };
    };
    draw();
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-label", room.name);
    modal.hidden = false;
    document.body.style.overflow = "hidden"; modal.querySelector(".modal-close").focus();
  }
  function closeRoom() {
    $("#roomModal").hidden = true;
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", e => {
    const modal = $("#roomModal");
    if(modal.hidden) return;
    if(e.key === "Escape") closeRoom();
    if(e.key === "ArrowRight") modal.querySelector('[data-next]').click();
    if(e.key === "ArrowLeft") modal.querySelector('[data-prev]').click();
    if(e.key === "Tab") {
      const buttons=[...modal.querySelectorAll('button')];
      if(e.shiftKey && document.activeElement===buttons[0]) {e.preventDefault();buttons.at(-1).focus();}
      else if(!e.shiftKey && document.activeElement===buttons.at(-1)) {e.preventDefault();buttons[0].focus();}
    }
  });
  $$("[data-go]").forEach((button) => button.addEventListener("click", () => {
    document.getElementById(button.dataset.go).scrollIntoView({behavior: "smooth"});
    $(".site-header nav").classList.remove("open");
  }));
  $(".menu-button").addEventListener("click", () => $(".site-header nav").classList.toggle("open"));
})();
