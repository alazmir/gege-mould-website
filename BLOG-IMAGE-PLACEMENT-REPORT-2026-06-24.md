# Blog Image Placement — Verification Report
## 2026-06-24

---

## IMAGES PLACED (6 of 7 placed, 1 flagged)

### blog-conformal-cooling.html (3 images)

| Image | Position | Caption | i18n Key |
|-------|----------|---------|----------|
| `blog-3d-design.png` (1547×739px) | After stat-row, before "What cooling actually controls" section (L136) | Thermal FEA simulation of conformal cooling channel layout for a large-format automotive door panel mold. Channels follow cavity contour at 8–12 mm standoff — geometry unreachable by conventional straight drilling. | `blog.conformal.fig1_caption` |
| `blog-car-door-double.jpg` (1080×1920px) | Inside case study box, before result-strip (L191) | Two-cavity door inner panel mold with LPBF-printed conformal cooling inserts installed in three critical thermal zones. Belt-line warpage reduced from 1.6 mm to 0.3 mm after retrofit. | `blog.conformal.fig2_caption` |
| `author-jiujiu.jpg` (4032×3024px → 44×44px display) | Author box — replaced text avatar "AM" | Jiujiu — Mold Development Engineer at Gege Mould | N/A (alt text only) |

### blog-gate-location.html (3 images)

| Image | Position | Caption | i18n Key |
|-------|----------|---------|----------|
| `blog-car-parts.png` (1351×784px) | After stat-row, before "What the gate actually controls" section (L136) | Selection of automotive injection-molded components produced from Gege Mould tooling. Each part's gate position determined through Moldflow simulation before any tool steel was committed. | `blog.gate_location.fig1_caption` |
| `blog-car-door-single.jpg` (1080×1920px) | Inside case study box, before result-strip (L206) | Single-cavity automotive door component mold with optimized gate positioning. Gate relocated from part edge to geometric center based on Moldflow warp analysis — reducing pressure differential from 42 MPa to 18 MPa. | `blog.gate_location.fig2_caption` |
| `author-kankan.jpg` (3774×2831px → 44×44px display) | Author box — replaced text avatar "AM" | Kankan — Mold Design Engineer at Gege Mould | N/A (alt text only) |

---

## IMAGE NOT PLACED (1)

| File | Dimensions | Size | Reason |
|------|-----------|------|--------|
| `16ddc6d7968ff790ae14c6855bfd757e.jpg` | 810×1440px (portrait) | 198KB | **Cannot identify content.** Hash-named, no descriptive filename. Vertical/portrait orientation suggests a mold standing upright or a tall component, but without visual confirmation the content cannot be matched to a specific blog section. Flagged for manual review — place once content is confirmed. |

---

## STYLE PASS

### CSS Added to Both Blog Pages

```css
.blog-article .article-fig { margin:2.25rem 0; }
.blog-article .article-fig img { width:100%; height:auto; border-radius:var(--border-radius-md); display:block; }
.blog-article .article-fig figcaption { font-size:0.8rem; color:var(--text-light); text-align:center; margin-top:0.65rem; line-height:1.55; padding:0 0.5rem; }
.blog-article .author-avatar-img { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; }
```

### Design Consistency
- Uses existing `var(--text-light)` for caption color (matches site-wide muted text)
- Uses existing `var(--border-radius-md)` for image corners (matches all site cards)
- Caption typography at 0.8rem is distinct from body text (1rem) — standard figure caption pattern
- Author avatar uses `object-fit:cover` for consistent circular crop regardless of source photo dimensions
- 2.25rem margin above/below figures matches the existing 2rem spacing between h2 elements — proportional rhythm
- All images have `loading="lazy"` (matches site-wide pattern)
- All images have `width`/`height` attributes (no CLS)

### Mobile / RTL Compatibility
- `width:100%` on images ensures they scale within the 760px max-width blog container
- `height:auto` preserves aspect ratio on narrow screens
- `rtl.css` handles text alignment flipping for Arabic — captions will center correctly in RTL
- No fixed widths that would overflow on mobile
- Author avatar at 44×44px is small enough to work in tight mobile layouts

---

## i18n VERIFICATION

All 4 caption keys exist in all 5 language files:

| Key | EN | PT | ES | AR | ID |
|-----|-----|-----|-----|-----|-----|
| `blog.conformal.fig1_caption` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blog.conformal.fig2_caption` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blog.gate_location.fig1_caption` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blog.gate_location.fig2_caption` | ✅ | ✅ | ✅ | ✅ | ✅ |

### Caption Wire-Up Pattern
All captions use the standard i18n pattern:
```html
<figcaption data-i18n="blog.conformal.fig1_caption">English fallback text</figcaption>
```
The `data-i18n` attribute triggers `js/i18n.js` to replace the text content with the translated value from the JSON file on load. The English text in the HTML serves as the fallback if JS is disabled or the i18n key is missing.

---

## BROKEN IMAGE REFERENCE CHECK

- `blog-conformal-cooling.html`: 3 blog images + 1 logo — all paths verified ✅
- `blog-gate-location.html`: 3 blog images + 1 logo — all paths verified ✅
- `news.html`: 2 article images (0008DSC08278.jpg, 0022DSC08257.jpg) — both verified ✅
- No broken references remain in the blog/news section

---

## AUTHOR BYLINE UPDATES

| Page | Before | After | Photo |
|------|--------|-------|-------|
| blog-conformal-cooling.html | Azmir Md Al — Technical Engineering Team | **Jiujiu** — Mold Development Engineer | author-jiujiu.jpg |
| blog-gate-location.html | Azmir Md Al — Technical Engineering Team | **Kankan** — Mold Design Engineer | author-kankan.jpg |

Both byline-row name/meta and author-box name/role updated consistently.

---

## SUMMARY

| Count | Status |
|-------|--------|
| 6 images placed | ✅ In correct contextual position within articles |
| 4 captions written | ✅ Descriptive, technical, specific to image content |
| 4 captions i18n-wired | ✅ All 5 languages have translations |
| 2 author photos placed | ✅ Replaced text avatars with real photos |
| 1 image flagged | ⚠️ `16ddc6d7968ff790ae14c6855bfd757e.jpg` — unidentifiable, needs manual review |
| 0 broken references | ✅ All image paths verified |
| CSS style pass | ✅ Consistent with design tokens, mobile/RTL compatible |
