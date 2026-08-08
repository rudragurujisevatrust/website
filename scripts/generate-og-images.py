from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

PROJ = "/home/deccan-eye/Desktop/rudra-guruji-seva-trust"
SRC  = f"{PROJ}/public/gallery/himalaya-tapas.jpg"
OUT  = f"{PROJ}/public/og"
os.makedirs(OUT, exist_ok=True)

W, H = 1200, 630
NOTO = "/usr/share/fonts/truetype/noto"
DEJA = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

LOCALES = {
 "en": ("Rudra Guruji Naga Sadhu Charitable Trust", "Seva is the highest worship", "Om Namah Shivaya", DEJA),
 "hi": ("रुद्र गुरुजी नाग साधु चैरिटेबल ट्रस्ट", "सेवा ही सर्वोच्च पूजा है", "ॐ नमः शिवाय", f"{NOTO}/NotoSansDevanagari-Bold.ttf"),
 "te": ("రుద్ర గురూజీ నాగ సాధువు చారిటబుల్ ట్రస్ట్", "సేవయే అత్యున్నత పూజ", "ఓం నమః శివాయ", f"{NOTO}/NotoSansTelugu-Bold.ttf"),
 "kn": ("ರುದ್ರ ಗುರೂಜಿ ನಾಗ ಸಾಧು ಚಾರಿಟಬಲ್ ಟ್ರಸ್ಟ್", "ಸೇವೆಯೇ ಶ್ರೇಷ್ಠ ಪೂಜೆ", "ಓಂ ನಮಃ ಶಿವಾಯ", f"{NOTO}/NotoSansKannada-Bold.ttf"),
}

def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

# Base photo: fill 1200x630, then push it right and darken so text sits left.
base = Image.open(SRC).convert("RGB")
scale = max(W / base.width, H / base.height)
base = base.resize((int(base.width * scale), int(base.height * scale)), Image.LANCZOS)
left = (base.width - W) // 2
base = base.crop((left, 0, left + W, H))

for code, (name, tagline, mantra, fontpath) in LOCALES.items():
    img = base.copy()

    # Warm maroon scrim, heaviest on the left where the type goes.
    scrim = Image.new("RGB", (W, H), (92, 31, 20))
    mask = Image.linear_gradient("L").rotate(90, expand=False).resize((W, H))
    mask = mask.point(lambda v: int(255 - v * 0.62))          # left ~100%, right ~38%
    img = Image.composite(scrim, img, mask.filter(ImageFilter.GaussianBlur(40)))
    img = Image.blend(img, Image.new("RGB", (W, H), (46, 15, 10)), 0.18)

    d = ImageDraw.Draw(img)
    f_name    = ImageFont.truetype(fontpath, 62)
    f_tag     = ImageFont.truetype(fontpath, 30)
    f_mantra  = ImageFont.truetype(fontpath, 34)

    x, max_w = 78, 640
    lines = wrap(d, name, f_name, max_w)
    while len(lines) > 3 and f_name.size > 40:
        f_name = ImageFont.truetype(fontpath, f_name.size - 4)
        lines = wrap(d, name, f_name, max_w)

    line_h = int(f_name.size * 1.42)
    block_h = len(lines) * line_h + 52 + 46
    y = (H - block_h) // 2

    d.text((x, y), mantra, font=f_mantra, fill=(240, 186, 92))
    y += 62
    for ln in lines:
        d.text((x, y), ln, font=f_name, fill=(255, 251, 244))
        y += line_h
    y += 8
    d.text((x, y), tagline, font=f_tag, fill=(233, 205, 176))

    # Gold rule under the type, echoing the site's toran.
    d.rectangle([x, y + 58, x + 190, y + 63], fill=(212, 160, 62))

    path = f"{OUT}/{code}.jpg"
    img.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"{code}: {os.path.getsize(path)//1024} KB  {img.size}")
