from PIL import Image, ImageDraw, ImageFont
import os
PROJ = "/home/deccan-eye/Desktop/rudra-guruji-seva-trust"
FONT = "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf"

def render(size):
    S = size * 8                       # supersample, then downscale for clean edges
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Deep maroon disc with a gold ring — the sidebar's brand mark.
    d.ellipse([0, 0, S - 1, S - 1], fill=(92, 31, 20, 255))
    ring = int(S * 0.055)
    d.ellipse([ring, ring, S - 1 - ring, S - 1 - ring], outline=(212, 160, 62, 255), width=max(1, int(S * 0.045)))
    f = ImageFont.truetype(FONT, int(S * 0.58))
    box = d.textbbox((0, 0), "ॐ", font=f)
    d.text(((S - (box[2] - box[0])) / 2 - box[0], (S - (box[3] - box[1])) / 2 - box[1] - S * 0.02),
           "ॐ", font=f, fill=(247, 190, 92, 255))
    return img.resize((size, size), Image.LANCZOS)

sizes = [16, 32, 48, 64, 128, 256]
imgs = [render(s) for s in sizes]
ico = f"{PROJ}/src/app/favicon.ico"
imgs[-1].save(ico, format="ICO", sizes=[(s, s) for s in sizes])
render(180).save(f"{PROJ}/src/app/apple-icon.png", "PNG")
render(512).save(f"{PROJ}/public/icon-512.png", "PNG")
render(192).save(f"{PROJ}/public/icon-192.png", "PNG")
print("favicon.ico", os.path.getsize(ico) // 1024, "KB")
print("apple-icon.png, icon-192.png, icon-512.png written")
