.admin-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  color: #292b27;
  background: #f1f0eb;
  font-family: "Noto Sans KR", sans-serif;
}

.admin-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 34px 24px;
  color: #efede4;
  background: #303b32;
}

.admin-brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 10px;
}

.admin-brand span {
  font-size: 9px;
  letter-spacing: .2em;
}

.admin-brand strong {
  font-family: "Gowun Batang", serif;
  font-size: 23px;
  font-weight: 700;
}

.admin-user {
  margin: 38px 10px 28px;
  padding: 18px 0;
  border-top: 1px solid rgba(255,255,255,.18);
  border-bottom: 1px solid rgba(255,255,255,.18);
}

.admin-user span {
  font-size: 8px;
  letter-spacing: .16em;
  opacity: .6;
}

.admin-user p {
  margin: 7px 0 0;
  font-size: 12px;
}

.admin-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-sidebar nav button {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 0;
  border-radius: 3px;
  padding: 13px 14px;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.admin-sidebar nav button.active {
  color: #303b32;
  background: #e9e5d8;
}

.admin-sidebar nav span {
  font-size: 13px;
  font-weight: 500;
}

.admin-sidebar nav small {
  font-size: 9px;
  opacity: .6;
}

.view-site {
  margin-top: auto;
  padding: 14px;
  border: 1px solid rgba(255,255,255,.25);
  font-size: 11px;
  text-align: center;
}

.admin-main {
  min-width: 0;
}

.admin-topbar {
  position: sticky;
  z-index: 10;
  top: 0;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 25px 48px;
  border-bottom: 1px solid #d6d4cd;
  background: rgba(241,240,235,.94);
  backdrop-filter: blur(12px);
}

.admin-topbar p {
  margin: 0 0 5px;
  color: #7d7f78;
  font-size: 8px;
  letter-spacing: .18em;
}

.admin-topbar h1 {
  margin: 0;
  font-family: "Gowun Batang", serif;
  font-size: 28px;
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.save-message,
.error-message {
  font-size: 11px;
}

.save-message { color: #3f6c4c; }
.error-message { color: #9e3d30; }

.admin-actions > button {
  border: 0;
  border-radius: 2px;
  padding: 14px 22px;
  color: white;
  background: #8c533b;
  font-size: 12px;
  cursor: pointer;
}

.admin-actions > button:disabled {
  cursor: wait;
  opacity: .55;
}

.admin-content {
  max-width: 1280px;
  padding: 48px;
}

.form-sections,
.room-admin-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-section {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 35px;
  padding: 32px;
  border: 1px solid #d8d6ce;
  border-radius: 4px;
  background: #f8f7f3;
}

.form-section-heading h2 {
  margin: 0 0 10px;
  font-family: "Gowun Batang", serif;
  font-size: 20px;
}

.form-section-heading p {
  margin: 0;
  color: #777970;
  font-size: 11px;
  line-height: 1.65;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 18px;
}

.admin-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-field > span {
  font-size: 11px;
  font-weight: 500;
}

.admin-field input,
.admin-field textarea,
.inline-fields input {
  width: 100%;
  border: 1px solid #cfcdc5;
  border-radius: 2px;
  padding: 12px 13px;
  outline: none;
  color: #292b27;
  background: white;
  font-size: 12px;
}

.admin-field textarea {
  resize: vertical;
  line-height: 1.7;
}

.admin-field input:focus,
.admin-field textarea:focus,
.inline-fields input:focus {
  border-color: #788476;
  box-shadow: 0 0 0 2px rgba(85,103,86,.08);
}

.admin-field small {
  color: #8a8b84;
  font-size: 9px;
}

.wide-field {
  grid-column: 1 / -1;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.image-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #d4d2ca;
  border-radius: 3px;
  background: white;
}

.image-card img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.image-card > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
}

.image-card span {
  overflow: hidden;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-card p {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  margin: 0;
}

.image-card button,
.room-section-tools button,
.inline-fields button {
  border: 0;
  padding: 4px;
  color: #8f4a39;
  background: transparent;
  font-size: 9px;
  cursor: pointer;
}

.upload-card {
  min-height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #aaa99f;
  border-radius: 3px;
  cursor: pointer;
}

.upload-card input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.upload-card strong {
  font-size: 26px;
  font-weight: 300;
}

.upload-card span {
  margin: 8px 0 4px;
  font-size: 11px;
}

.upload-card small {
  color: #8a8b84;
  font-size: 8px;
}

.room-section-tools {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -8px;
}

.add-room {
  border: 1px dashed #9b9c95;
  padding: 24px;
  color: #4f574f;
  background: transparent;
  cursor: pointer;
}

.inline-fields {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
}

.subtle-button {
  border: 1px solid #c2c1ba;
  padding: 10px 14px;
  color: #4f574f;
  background: white;
  font-size: 11px;
  cursor: pointer;
}

.switch {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.switch input {
  position: absolute;
  opacity: 0;
}

.switch span {
  position: relative;
  width: 42px;
  height: 23px;
  border-radius: 20px;
  background: #c3c4be;
  transition: background .2s;
}

.switch span::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: white;
  transition: transform .2s;
}

.switch input:checked + span {
  background: #4f6b55;
}

.switch input:checked + span::after {
  transform: translateX(19px);
}

.switch em {
  font-size: 11px;
  font-style: normal;
}

.popup-image-admin > span {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 500;
}

.admin-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 30px;
  color: #f2efe5;
  background:
    linear-gradient(rgba(37,44,37,.82), rgba(37,44,37,.82)),
    url("/images/exterior/exterior-03.webp") center / cover;
}

.admin-login > div {
  width: min(480px, 100%);
  padding: 55px;
  background: #303b32;
  box-shadow: 0 25px 60px rgba(0,0,0,.25);
}

.admin-login p {
  margin: 0 0 25px;
  font-size: 9px;
  letter-spacing: .2em;
}

.admin-login h1 {
  margin: 0;
  font-family: "Gowun Batang", serif;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.45;
}

.admin-login span {
  display: block;
  margin: 24px 0 32px;
  font-size: 12px;
  line-height: 1.8;
  opacity: .7;
}

.admin-login form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.admin-login form label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.admin-login form label span {
  margin: 0;
  font-size: 10px;
  opacity: .72;
}

.admin-login form input {
  width: 100%;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 2px;
  padding: 13px 14px;
  outline: none;
  color: #f2efe5;
  background: rgba(255,255,255,.06);
}

.admin-login form input:focus {
  border-color: rgba(255,255,255,.7);
}

.admin-login form em {
  min-height: 18px;
  color: #f2b4a1;
  font-size: 10px;
  font-style: normal;
}

.admin-login form button {
  border: 0;
  padding: 14px;
  color: #303b32;
  background: #f2efe5;
  cursor: pointer;
}

.admin-login a {
  display: block;
  padding: 14px;
  text-align: center;
  color: #303b32;
  background: #f2efe5;
  font-size: 12px;
}

.admin-login a.plain {
  margin-top: 10px;
  color: #f2efe5;
  background: transparent;
  font-size: 10px;
}

.admin-logout {
  margin-top: 8px;
  border: 0;
  padding: 10px;
  color: rgba(255,255,255,.65);
  background: transparent;
  font-size: 10px;
  cursor: pointer;
}

.popup-sample-picker > span {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 500;
}

.popup-sample-picker > div {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.popup-sample-picker button {
  position: relative;
  overflow: hidden;
  border: 1px solid #d4d2ca;
  border-radius: 2px;
  padding: 0;
  background: white;
  cursor: pointer;
}

.popup-sample-picker img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.popup-sample-picker em {
  display: block;
  padding: 6px;
  color: #62635c;
  font-size: 8px;
  font-style: normal;
}

.github-security-note {
  padding: 15px 17px;
  border: 1px solid #dfd1b6;
  color: #675a42;
  background: #f7efdf;
}

.github-security-note strong {
  font-size: 11px;
}

.github-security-note p {
  margin: 5px 0 0;
  font-size: 10px;
  line-height: 1.7;
}

.github-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.github-buttons button {
  border: 1px solid #c7c6bf;
  padding: 11px 15px;
  color: #40483f;
  background: white;
  font-size: 10px;
  cursor: pointer;
}

.github-buttons button.primary {
  border-color: #8c533b;
  color: white;
  background: #8c533b;
}

.github-status {
  min-height: 22px;
  font-size: 11px;
}

.github-status.success { color: #3f6c4c; }
.github-status.error { color: #a04436; }
.github-status.working { color: #6b624e; }

.static-notice {
  margin: 28px 48px 0;
  padding: 16px 18px;
  border: 1px solid #d8c9aa;
  border-radius: 3px;
  color: #62563f;
  background: #f5eddb;
  font-size: 11px;
  line-height: 1.7;
}

.static-notice strong {
  margin-right: 8px;
}

.admin-backup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 28px;
  padding: 28px 32px;
  border: 1px solid #d8d6ce;
  background: #f8f7f3;
}

.admin-backup h2 {
  margin: 0 0 7px;
  font-family: "Gowun Batang", serif;
  font-size: 19px;
}

.admin-backup p {
  margin: 0;
  color: #777970;
  font-size: 10px;
}

.admin-backup > div:last-child {
  display: flex;
  gap: 8px;
}

.admin-backup button,
.admin-backup label {
  border: 1px solid #c5c4bc;
  padding: 10px 13px;
  color: #3f473f;
  background: white;
  font-size: 10px;
  cursor: pointer;
}

.admin-backup label input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.admin-backup button.danger {
  color: #934b3a;
}

[hidden] {
  display: none !important;
}

@media (max-width: 1000px) {
  .admin-shell {
    grid-template-columns: 210px 1fr;
  }

  .admin-content,
  .admin-topbar {
    padding-left: 28px;
    padding-right: 28px;
  }

  .form-section {
    grid-template-columns: 1fr;
  }

  .image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .admin-shell {
    display: block;
  }

  .admin-sidebar {
    position: static;
    width: 100%;
    height: auto;
    padding: 22px 18px 12px;
  }

  .admin-user,
  .view-site {
    display: none;
  }

  .admin-sidebar nav {
    flex-direction: row;
    overflow-x: auto;
    margin-top: 20px;
  }

  .admin-sidebar nav button {
    flex: 0 0 auto;
  }

  .admin-sidebar nav small {
    display: none;
  }

  .admin-topbar {
    min-height: 88px;
    padding: 18px;
  }

  .admin-actions span {
    display: none;
  }

  .admin-actions > button {
    padding: 12px 14px;
  }

  .admin-content {
    padding: 20px 14px 50px;
  }

  .static-notice {
    margin: 16px 14px 0;
  }

  .admin-backup {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-backup > div:last-child {
    flex-wrap: wrap;
  }

  .popup-sample-picker > div {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form-section {
    padding: 22px 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .wide-field {
    grid-column: auto;
  }

  .image-grid {
    grid-template-columns: 1fr 1fr;
  }

  .inline-fields {
    grid-template-columns: 1fr;
  }
}

.image-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))!important;gap:16px;align-items:start}.image-card{height:220px;overflow:hidden}.image-card>img{height:155px!important;object-fit:cover!important}.upload-card{height:220px}.picker-button{min-height:44px;border:1px solid #c5bead;background:#f3f0e7;cursor:pointer}.photo-picker{width:min(900px,94vw);max-height:86svh;border:1px solid #c5bead;background:#f3f0e7;padding:20px}.photo-picker::backdrop{background:#0009}.picker-head{display:flex;justify-content:space-between;align-items:center}.picker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;height:55svh;overflow:auto}.picker-grid button{height:150px;padding:0;border:0;cursor:pointer}.picker-grid img{height:150px;object-fit:cover}.static-notice{line-height:1.8} .admin-login span{line-height:1.8}details.wide-field{grid-column:1/-1}
