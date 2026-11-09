(function () {
  const storageKey = "byeoldangchae-site-content-v1";
  const githubConfigKey = "byeoldangchae-github-config-v1";
  const authKey = "byeoldangchae-admin-authenticated";
  const accountKey = "byeoldangchae-local-account-v1";
  const popupSampleImages = [...new Set([...(window.BYEOLDANG_DEFAULT.photoLibrary || []), ...window.BYEOLDANG_DEFAULT.heroImages, ...window.BYEOLDANG_DEFAULT.rooms.flatMap(r => r.images)])];
  let githubConfig = {owner:"", repo:"", branch:"main", path:"", token:""};
  try { const saved = JSON.parse(localStorage.getItem(githubConfigKey) || "{}"); delete saved.token; githubConfig = {...githubConfig,...saved}; } catch(_){}
  if(location.hostname.endsWith('.github.io')) { githubConfig.owner = location.hostname.split('.')[0]; githubConfig.repo = location.pathname.split('/').filter(Boolean)[0] || location.hostname; }
  const persistGithub = () => { const {token,...safe} = githubConfig; localStorage.setItem(githubConfigKey,JSON.stringify(safe)); };
  let content = structuredClone(window.BYEOLDANG_DEFAULT);
  try {
    const savedContent = JSON.parse(localStorage.getItem(storageKey));
    if (savedContent) content = { ...content, ...savedContent };
  } catch (_) {}
  if (!Array.isArray(content.popups)) {
    content.popups = content.popup ? [{id:"legacy-popup", ...content.popup}] : [];
    delete content.popup;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));
  const field = (label, key, value, options = {}) => `
    <label class="admin-field ${options.wide ? "wide-field" : ""}">
      <span>${label}</span>
      ${options.area
        ? `<textarea rows="${options.rows || 4}" data-key="${key}">${escapeHtml(value)}</textarea>`
        : `<input data-key="${key}" value="${escapeHtml(value)}">`}
      ${options.help ? `<small>${options.help}</small>` : ""}
    </label>`;
  const section = (title, description, body) => `
    <section class="form-section">
      <div class="form-section-heading"><h2>${title}</h2><p>${description}</p></div>
      <div class="form-grid">${body}</div>
    </section>`;

  function renderAll() {
    renderCopy();
    renderHero();
    renderRooms();
    renderGuide();
    renderPopup();
    renderGitHub();
    bindFields();
  }

  function renderCopy() {
    $("[data-panel=copy]").innerHTML = `<div class="form-sections">${
      section("브랜드와 첫 화면", "첫 화면에 표시되는 제목과 소개입니다.",
        field("숙소명", "brand", content.brand) +
        field("영문 숙소명", "englishBrand", content.englishBrand) +
        field("작은 제목", "heroEyebrow", content.heroEyebrow, {wide:true}) +
        field("메인 제목", "heroTitle", content.heroTitle, {wide:true, area:true, rows:3, help:"줄을 바꾸면 홈페이지에서도 줄바꿈됩니다."}) +
        field("한줄 소개", "heroSubtitle", content.heroSubtitle, {wide:true})
      ) +
      section("숙소 소개", "경기전 별당채의 분위기와 이야기를 소개합니다.",
        field("소개 작은 제목", "introEyebrow", content.introEyebrow, {wide:true}) +
        field("소개 제목", "introTitle", content.introTitle, {wide:true, area:true, rows:3}) +
        field("상세 소개", "introBody", content.introBody, {wide:true, area:true, rows:5}) +
        field("이야기 제목", "storyTitle", content.storyTitle) +
        field("이야기 본문", "storyBody", content.storyBody, {wide:true, area:true, rows:5}) +
        field("이야기 큰 사진", "storyImage", content.storyImage) + field("이야기 작은 사진", "detailImage", content.detailImage) + field("시설 소개 사진", "amenityImage", content.amenityImage) + field("예약 안내 문구", "reservationIntro", content.reservationIntro) + field("예약 제목", "reservationTitle", content.reservationTitle, {area:true}) +
        field("편의시설 제목", "amenityTitle", content.amenityTitle, {wide:true, area:true, rows:3})
      )
    }</div>`;
  }

  function imageCard(src, label, group, index, roomIndex) {
    const roomAttr = roomIndex === undefined ? "" : ` data-room-index="${roomIndex}"`;
    return `<div class="image-card"><img src="${escapeHtml(src)}" alt="${escapeHtml(label)}"><div><span>${label}</span><p>${index > 0 ? `<button type="button" data-image-left data-group="${group}" data-index="${index}"${roomAttr}>← 앞으로</button>` : ""}<button type="button" data-image-remove data-group="${group}" data-index="${index}"${roomAttr}>삭제</button></p></div></div>`;
  }

  function renderHero() {
    const cards = content.heroImages.map((src, index) => imageCard(src, `메인 ${String(index + 1).padStart(2, "0")}`, "hero", index)).join("");
    $("[data-panel=hero]").innerHTML = section("메인 슬라이드 사진", "첫 번째 사진이 대표 이미지로 표시됩니다.",
      `<div class="image-grid wide-field">${cards}<label class="upload-card"><input type="file" accept="image/*" data-upload="hero"><strong>＋</strong><span>메인 사진 추가</span><small>현재 브라우저에 저장</small></label></div>`
    );
    bindImageButtons();
  }

  function renderRooms() {
    const roomSections = content.rooms.map((room, roomIndex) => section(
      `${String(roomIndex + 1).padStart(2, "0")} · ${escapeHtml(room.name)}`,
      "객실 이름, 인원, 설명과 사진을 수정할 수 있습니다.",
      `<div class="room-section-tools wide-field"><button type="button" data-room-remove="${roomIndex}">객실 삭제</button></div>` +
      field("객실명", `rooms.${roomIndex}.name`, room.name) +
      field("영문 객실명", `rooms.${roomIndex}.englishName`, room.englishName) +
      field("기준/최대 인원", `rooms.${roomIndex}.capacity`, room.capacity) +
      field("객실 설명", `rooms.${roomIndex}.description`, room.description, {wide:true, area:true, rows:4}) +
      `<div class="image-grid wide-field">${room.images.map((src, imageIndex) => imageCard(src, `객실 사진 ${imageIndex + 1}`, "room", imageIndex, roomIndex)).join("")}<label class="upload-card"><input type="file" accept="image/*" data-upload="room" data-room-index="${roomIndex}"><strong>＋</strong><span>객실 사진 추가</span><small>현재 브라우저에 저장</small></label></div>`
    )).join("");
    $("[data-panel=rooms]").innerHTML = `<div class="room-admin-list">${roomSections}<button class="add-room" type="button" id="addRoom">＋ 새 객실 추가</button></div>`;
    bindImageButtons();
    $("#addRoom").onclick = () => {
      content.rooms.push({id:`room-${Date.now()}`, name:"새 객실", englishName:"NEW ROOM", capacity:"기준 2명 · 최대 4명", description:"객실 소개를 입력해 주세요.", images:[]});
      renderRooms(); bindFields(); markChanged();
    };
    $$("[data-room-remove]").forEach((button) => button.onclick = () => {
      if (!confirm("이 객실을 삭제할까요?")) return;
      content.rooms.splice(Number(button.dataset.roomRemove), 1);
      renderRooms(); bindFields(); markChanged();
    });
  }

  function renderGuide() {
    $("[data-panel=guide]").innerHTML = `<div class="form-sections">${
      section("기본 이용 정보", "연락처와 예약 버튼, 체크인 정보를 관리합니다.",
        field("대표 전화", "phone", content.phone) +
        field("주소", "address", content.address) +
        field("대표자명", "representativeName", content.representativeName || window.BYEOLDANG_DEFAULT.representativeName || "이준표") +
        field("사업자등록번호", "businessNumber", content.businessNumber || window.BYEOLDANG_DEFAULT.businessNumber || "490-31-01768") +
        field("체크인", "checkIn", content.checkIn) +
        field("체크아웃", "checkOut", content.checkOut) +
        field("실시간 예약 주소", "bookingUrl", content.bookingUrl, {wide:true, help:"신청서에 기재된 떠나요 예약 링크입니다."})
      ) +
      section("편의시설", "한 줄에 하나씩 입력해 주세요.",
        field("시설 목록", "amenities", content.amenities.join("\n"), {wide:true, area:true, rows:7})
      ) +
      section("주변 관광지", "관광지 이름과 이동 시간을 한 줄씩 입력해 주세요. 예: 경기전 | 도보 1분",
        field("관광지 목록", "nearby", content.nearby.map((item) => `${item.name} | ${item.distance}`).join("\n"), {wide:true, area:true, rows:7})
      ) +
      section("환불 규정", "한 줄에 하나씩 입력해 주세요.",
        field("환불 안내", "refundPolicy", content.refundPolicy.join("\n"), {wide:true, area:true, rows:10})
      )
    }</div>`;
  }

  function renderPopup() {
    const popupSections = content.popups.map((popup, popupIndex) => section(
      `${String(popupIndex + 1).padStart(2, "0")} · ${escapeHtml(popup.title.split("\\n")[0] || "새 팝업")}`,
      "각 팝업의 사진과 문구, 노출 여부를 따로 관리할 수 있습니다.",
      `<div class="room-section-tools wide-field"><button type="button" data-popup-remove="${popupIndex}">팝업 삭제</button></div>
      <label class="admin-field"><span>팝업 노출</span><label class="switch"><input type="checkbox" data-popup-enabled="${popupIndex}" ${popup.enabled ? "checked" : ""}><span></span><em>${popup.enabled ? "사용 중" : "사용 안 함"}</em></label></label>
      <div class="wide-field popup-image-admin">
        <span>팝업 사진</span>
        <div class="image-grid">
          ${popup.image ? `<div class="image-card"><img src="${escapeHtml(popup.image)}" alt="팝업 사진"><div><span>현재 팝업 사진</span><p><button type="button" data-popup-image-remove="${popupIndex}">삭제</button></p></div></div>` : ""}
          <label class="upload-card"><input type="file" accept="image/*" data-upload="popup" data-popup-index="${popupIndex}"><strong>＋</strong><span>팝업 사진 ${popup.image ? "교체" : "추가"}</span><small>1.5MB 이하 권장</small></label>
        </div>
      </div>` +
      field("작은 제목", `popups.${popupIndex}.eyebrow`, popup.eyebrow, {wide:true}) +
      field("팝업 제목", `popups.${popupIndex}.title`, popup.title, {wide:true, area:true, rows:3}) +
      field("팝업 내용", `popups.${popupIndex}.body`, popup.body, {wide:true, area:true, rows:5}) +
      field("버튼 주소 (비우면 예약 링크)", `popups.${popupIndex}.buttonUrl`, popup.buttonUrl || "", {wide:true}) + field("버튼 문구", `popups.${popupIndex}.buttonLabel`, popup.buttonLabel)
    )).join("");
    $("[data-panel=popup]").innerHTML = `<div class="form-sections">${popupSections}<button class="add-room" type="button" id="addPopup">＋ 새 팝업 추가</button></div>`;
    $$("[data-popup-enabled]").forEach((checkbox) => checkbox.onchange = () => {
      const popup = content.popups[Number(checkbox.dataset.popupEnabled)];
      popup.enabled = checkbox.checked;
      checkbox.parentElement.querySelector("em").textContent = checkbox.checked ? "사용 중" : "사용 안 함";
      markChanged();
    });
    $$("[data-popup-image-remove]").forEach((button) => button.onclick = () => {
      content.popups[Number(button.dataset.popupImageRemove)].image = "";
      renderPopup(); bindFields(); markChanged();
    });
    $$("[data-popup-sample]").forEach((button) => button.onclick = () => {
      content.popups[Number(button.dataset.popupIndex)].image = button.dataset.popupSample;
      renderPopup(); bindFields(); markChanged();
    });
    $$("[data-popup-remove]").forEach((button) => button.onclick = () => {
      if (!confirm("이 팝업을 삭제할까요?")) return;
      content.popups.splice(Number(button.dataset.popupRemove), 1);
      renderPopup(); bindFields(); markChanged();
    });
    $("#addPopup").onclick = () => {
      content.popups.push({
        id: `popup-${Date.now()}`,
        enabled: true,
        image: "",
        eyebrow: "NEW NOTICE",
        title: "새로운 안내",
        body: "팝업 내용을 입력해 주세요.",
        buttonLabel: "실시간 예약"
      });
      renderPopup(); bindFields(); markChanged();
    };
  }

  function renderGitHub() {
    $("[data-panel=github]").innerHTML = `<div class="form-sections">${
      section("GitHub 저장소 연결", "배포한 GitHub 저장소 정보를 입력하면 관리자 수정 내용을 사이트에 직접 반영할 수 있습니다.",
        `<details ${githubConfig.owner && githubConfig.repo ? "" : "open"} class="wide-field"><summary>저장소 정보 ${githubConfig.owner && githubConfig.repo ? "(자동 인식됨)" : "직접 입력"}</summary><div class="form-grid">` + field("저장소 소유자", "github.owner", githubConfig.owner) +
        field("저장소 이름", "github.repo", githubConfig.repo) +
        field("배포 브랜치", "github.branch", githubConfig.branch || "main") + field("하위 경로 (보통 비움)", "github.path", githubConfig.path || "") + `</div></details>` +
        `<label class="admin-field"><span>GitHub 토큰</span><input type="password" id="githubToken" value="${escapeHtml(githubConfig.token)}" autocomplete="off"><small>Fine-grained token의 Contents 권한을 Read and write로 설정해 주세요.</small></label>
        <div class="wide-field github-security-note"><strong>토큰 저장 안내</strong><p>토큰은 현재 페이지 메모리에서만 사용하며 저장하지 않습니다. 페이지를 닫거나 새로고침하면 사라집니다. <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Fine-grained token 생성 ↗</a><br>대상 저장소는 이 숙소 저장소 하나만 선택하고, Repository permissions → Contents → Read and write 권한을 설정하세요. 관리자 배포는 콘텐츠와 새 사진 전용입니다. 코드 변경은 ZIP 전체를 다시 업로드해야 합니다.</p></div>
        <div class="wide-field github-buttons"><button type="button" id="saveGithubConfig">연결 정보 저장</button><button type="button" id="testGithubConnection">연결 확인</button><button type="button" class="primary" id="publishGithub">GitHub에 수정 반영</button></div>
        <div class="wide-field github-status" id="githubStatus" role="status"></div>`
      )
    }</div>`;

    $$("[data-key^='github.']").forEach((input) => input.oninput = () => {
      githubConfig[input.dataset.key.split(".")[1]] = input.value.trim();
    });
    $("#githubToken").oninput = () => { githubConfig.token = $("#githubToken").value.trim(); };
    $("#saveGithubConfig").onclick = () => {
      syncGithubInputs();
      persistGithub();
      setGithubStatus("GitHub 연결 정보를 이 브라우저에 저장했습니다.", "success");
    };
    $("#testGithubConnection").onclick = () => verifyGithubConnection();
    $("#publishGithub").onclick = () => publishContentToGithub();
  }

  function syncGithubInputs() {
    githubConfig.owner = $("[data-key='github.owner']").value.trim();
    githubConfig.repo = $("[data-key='github.repo']").value.trim();
    githubConfig.branch = $("[data-key='github.branch']").value.trim() || "main";
    githubConfig.token = $("#githubToken").value.trim();
  }

  function githubHeaders() {
    return {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${githubConfig.token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function validateGithubConfig() {
    syncGithubInputs();
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.branch || !githubConfig.token) {
      setGithubStatus("저장소 소유자, 저장소 이름, 브랜치, 토큰을 모두 입력해 주세요.", "error");
      return false;
    }
    persistGithub();
    return true;
  }

  async function verifyGithubConnection() {
    if (!validateGithubConfig()) return;
    setGithubStatus("GitHub 연결을 확인하고 있습니다...", "working");
    try {
      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(githubConfig.owner)}/${encodeURIComponent(githubConfig.repo)}`, {
        headers: githubHeaders()
      });
      if (!response.ok) throw new Error(await githubErrorMessage(response));
      setGithubStatus("저장소 연결을 확인했습니다. 이제 수정 내용을 반영할 수 있습니다.", "success");
    } catch (error) {
      setGithubStatus(error.message || "GitHub 연결을 확인하지 못했습니다.", "error");
    }
  }

  async function publishContentToGithub() {
    if (!validateGithubConfig()) return;
    if (!confirm("현재 관리자 수정 내용을 GitHub 홈페이지에 반영할까요?")) return;
    localStorage.setItem(storageKey, JSON.stringify(content));
    setGithubStatus("GitHub에 수정 내용을 반영하고 있습니다...", "working");
    const owner = encodeURIComponent(githubConfig.owner);
    const repo = encodeURIComponent(githubConfig.repo);
    const branch = githubConfig.branch;
    const base = `https://api.github.com/repos/${owner}/${repo}/contents/`;
    const prefix = (githubConfig.path || '').replace(/^\/+|\/+$/g,'');
    async function putFile(path, base64) {
      const full = [prefix,path].filter(Boolean).join('/').split('/').map(encodeURIComponent).join('/');
      const url = base + full;
      const current = await fetch(`${url}?ref=${encodeURIComponent(branch)}&t=${Date.now()}`, {headers:githubHeaders(),cache:'no-store'});
      let sha;
      if(current.ok) sha=(await current.json()).sha;
      else if(current.status!==404) throw new Error(await githubErrorMessage(current));
      const payload={message:`Update Byeoldangchae ${path}`,content:base64,branch};
      if(sha) payload.sha=sha;
      const response=await fetch(url,{method:'PUT',headers:{...githubHeaders(),'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok) throw new Error(await githubErrorMessage(response));
    }
    const publishButton = $("#publishGithub"); publishButton.disabled = true;
    try {
      const deploymentContent=structuredClone(content);
      const uploaded=new Map();
      async function images(value) {
        if(typeof value==='string' && /^data:image\//.test(value)) {
          if(uploaded.has(value)) return uploaded.get(value);
          const bytes=Uint8Array.from(atob(value.split(',')[1]),c=>c.charCodeAt(0));
          const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
          const ext=value.slice(5,value.indexOf(';')).split('/')[1].replace('jpeg','jpg');
          if(!['jpg','png','webp','gif'].includes(ext)) throw new Error('JPG, PNG, WEBP, GIF 사진을 사용해 주세요.');
          const path=`assets/uploads/${digest}.${ext}`;
          await putFile(path,value.split(',')[1]);uploaded.set(value,path);return path;
        }
        if(Array.isArray(value)) { const out=[];for(const v of value) out.push(await images(v));return out; }
        if(value && typeof value==='object') {for(const k of Object.keys(value)) value[k]=await images(value[k]);}
        return value;
      }
      await images(deploymentContent);
      await putFile('site-data.js',utf8ToBase64(`window.BYEOLDANG_DEFAULT = ${JSON.stringify(deploymentContent,null,2)};\n`));
      content=deploymentContent;localStorage.setItem(storageKey,JSON.stringify(content));renderHero();renderRooms();bindFields();
      setGithubStatus("GitHub 반영이 완료되었습니다. Pages 갱신에는 잠시 시간이 걸릴 수 있습니다.","success");
    } catch(error) {setGithubStatus(error.message || "GitHub 반영 중 문제가 발생했습니다.","error");}
    finally { publishButton.disabled = false; }
  }

  function utf8ToBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
    return btoa(binary);
  }

  async function githubErrorMessage(response) {
    try {
      const data = await response.json();
      if (response.status === 401) return "토큰이 올바르지 않거나 만료되었습니다.";
      if (response.status === 403) return "토큰의 저장소 Contents 쓰기 권한을 확인해 주세요.";
      if (response.status === 404) return "저장소를 찾을 수 없습니다. 소유자와 저장소 이름을 확인해 주세요.";
      if (response.status === 409) return "GitHub 파일이 동시에 변경되었습니다. 잠시 후 다시 시도해 주세요.";
      return data.message || `GitHub 요청에 실패했습니다. (${response.status})`;
    } catch (_) {
      return `GitHub 요청에 실패했습니다. (${response.status})`;
    }
  }

  function setGithubStatus(message, type) {
    const status = $("#githubStatus");
    status.textContent = message;
    status.className = `wide-field github-status ${type}`;
  }

  function bindFields() {
    document.querySelectorAll('.picker-button').forEach(n=>n.remove());
    document.querySelectorAll('[data-upload]').forEach(input=>{
      const button=document.createElement('button');button.type='button';button.className='picker-button';button.textContent='기존 사진 선택';
      input.closest('label').after(button);
      button.onclick=()=>openPicker(input);
    });
    $$("[data-key]:not([data-key^='github.'])").forEach((input) => input.oninput = () => {
      setValue(input.dataset.key, input.value);
      markChanged();
    });
    $$("[data-upload]").forEach((input) => input.onchange = () => uploadImage(input));
  }

  function openPicker(input) {
    const all=[...new Set([...popupSampleImages,...content.heroImages,...content.rooms.flatMap(r=>r.images)])];
    const dialog=document.createElement('dialog');dialog.className='photo-picker';
    dialog.innerHTML=`<div class="picker-head"><h2>기존 사진 선택</h2><button type="button" data-close>닫기 ×</button></div><div class="picker-grid">${all.map((src,i)=>`<button type="button" data-pick="${i}"><img src="${escapeHtml(src)}" alt="사진 ${i+1}" loading="lazy"></button>`).join('')}</div>`;
    document.body.append(dialog);dialog.showModal();
    dialog.querySelector('[data-close]').onclick=()=>{dialog.close();dialog.remove();};
    dialog.addEventListener('close',()=>dialog.remove());
    dialog.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
      const src=all[Number(b.dataset.pick)];
      if(input.dataset.upload==='popup') content.popups[Number(input.dataset.popupIndex)].image=src;
      else {const list=input.dataset.upload==='hero'?content.heroImages:content.rooms[Number(input.dataset.roomIndex)].images;if(!list.includes(src)) list.push(src);}
      dialog.close();dialog.remove();renderAll();markChanged();
    });
  }
  function setValue(path, value) {
    if (path === "amenities" || path === "refundPolicy") {
      content[path] = value.split("\n").map((item) => item.trim()).filter(Boolean);
      return;
    }
    if (path === "nearby") {
      content.nearby = value.split("\n").map((line) => {
        const [name, distance = ""] = line.split("|");
        return {name:name.trim(), distance:distance.trim()};
      }).filter((item) => item.name);
      return;
    }
    const parts = path.split(".");
    let target = content;
    parts.slice(0, -1).forEach((part) => target = target[Number.isNaN(Number(part)) ? part : Number(part)]);
    target[parts.at(-1)] = value;
  }

  function bindImageButtons() {
    $$("[data-image-remove]").forEach((button) => button.onclick = () => {
      const list = button.dataset.group === "hero" ? content.heroImages : content.rooms[Number(button.dataset.roomIndex)].images;
      list.splice(Number(button.dataset.index), 1);
      button.dataset.group === "hero" ? renderHero() : renderRooms();
      bindFields(); markChanged();
    });
    $$("[data-image-left]").forEach((button) => button.onclick = () => {
      const list = button.dataset.group === "hero" ? content.heroImages : content.rooms[Number(button.dataset.roomIndex)].images;
      const index = Number(button.dataset.index);
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      button.dataset.group === "hero" ? renderHero() : renderRooms();
      bindFields(); markChanged();
    });
  }

  function uploadImage(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 1500000) {
      alert("정적 관리자 저장 용량을 위해 1.5MB 이하 이미지를 사용해 주세요.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (input.dataset.upload === "hero") { if(!content.heroImages.includes(reader.result)) content.heroImages.push(reader.result); }
      else if (input.dataset.upload === "popup") content.popups[Number(input.dataset.popupIndex)].image = reader.result;
      else { const list=content.rooms[Number(input.dataset.roomIndex)].images; if(!list.includes(reader.result)) list.push(reader.result); }
      if (input.dataset.upload === "hero") renderHero();
      else if (input.dataset.upload === "popup") renderPopup();
      else renderRooms();
      bindFields(); markChanged();
    };
    reader.readAsDataURL(file);
  }

  function markChanged() {
    $("#saveMessage").textContent = "저장되지 않은 변경사항";
    $("#saveMessage").className = "error-message";
  }

  $("#saveButton").onclick = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(content));
      $("#saveMessage").textContent = "저장되었습니다";
      $("#saveMessage").className = "save-message";
    } catch (_) {
      alert("브라우저 저장 공간이 부족합니다. 큰 업로드 이미지를 줄여 주세요.");
    }
  };

  $$("#adminNav [data-tab]").forEach((button) => button.onclick = () => {
    $$("#adminNav [data-tab]").forEach((item) => item.classList.toggle("active", item === button));
    $$("[data-panel]").forEach((panel) => panel.hidden = panel.dataset.panel !== button.dataset.tab);
    $("#adminTitle").textContent = button.querySelector("span").textContent;
  });

  $("#exportButton").onclick = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {type:"application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "byeoldangchae-site-settings.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  $("#importInput").onchange = async () => {
    const file = $("#importInput").files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!imported.brand || !Array.isArray(imported.rooms)) throw new Error();
      content = {...structuredClone(window.BYEOLDANG_DEFAULT),...imported};
      localStorage.setItem(storageKey, JSON.stringify(content));
      renderAll();
      alert("설정을 불러왔습니다.");
    } catch (_) {
      alert("올바른 경기전 별당채 설정 파일이 아닙니다.");
    }
  };

  $("#resetButton").onclick = () => {
    if (!confirm("모든 수정 내용을 초기 상태로 되돌릴까요?")) return;
    localStorage.removeItem(storageKey);
    content = structuredClone(window.BYEOLDANG_DEFAULT);
    renderAll();
    $("#saveMessage").textContent = "초기 상태로 되돌렸습니다";
  };

  function openAdmin() {
    $("#adminLogin").hidden = true;
    $("#adminShell").hidden = false;
    renderAll();
  }

  const firstVisit = !localStorage.getItem(accountKey);
  if(firstVisit) {$("#adminLogin h1").textContent="관리자 계정 설정";$("#loginForm button").textContent="이 브라우저에 계정 만들기";}
  $("#loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    const id=$("#loginId").value.trim(), password=$("#loginPassword").value;
    if(password.length<6) {$("#loginError").textContent="비밀번호는 6자 이상 입력해 주세요.";return;}
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(password)))).map(b=>b.toString(16).padStart(2,'0')).join('');
    let account;try{account=JSON.parse(localStorage.getItem(accountKey));}catch(_){}
    if(!account) {account={id,digest};localStorage.setItem(accountKey,JSON.stringify(account));}
    if(account.id===id && account.digest===digest){sessionStorage.setItem(authKey,'yes');$("#loginError").textContent='';openAdmin();}
    else $("#loginError").textContent="아이디 또는 비밀번호가 올바르지 않습니다.";
  });

  $("#logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem(authKey);
    location.reload();
  });

  if (sessionStorage.getItem(authKey) === "yes") openAdmin();
})();
