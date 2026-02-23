import os
from PIL import Image, ImageSequence

# --- CONFIGURATION ---
TARGET_FOLDER = './assets'   # Folder to scan
MAX_WIDTH_IMG = 1200         # Max width for static images
MAX_WIDTH_GIF = 600          # Max width for GIFs
QUALITY = 80                 # JPG/WebP quality

def reduce_file_size():
    print(f"🚀 Starting compression in {TARGET_FOLDER}...")
    
    for root, dirs, files in os.walk(TARGET_FOLDER):
        for file in files:
            file_path = os.path.join(root, file)
            filename, ext = os.path.splitext(file_path)
            ext = ext.lower()

            # --- OPTIMIZE IMAGES (JPG/PNG) ---
            if ext in ['.jpg', '.jpeg', '.png']:
                try:
                    with Image.open(file_path) as img:
                        if img.width > MAX_WIDTH_IMG:
                            ratio = MAX_WIDTH_IMG / float(img.width)
                            new_height = int((float(img.height) * float(ratio)))
                            img = img.resize((MAX_WIDTH_IMG, new_height), Image.Resampling.LANCZOS)
                            
                            if ext == '.png':
                                img = img.convert("RGBA")
                                img.save(file_path, optimize=True)
                            else:
                                img = img.convert("RGB")
                                img.save(file_path, optimize=True, quality=QUALITY)
                                
                            print(f"✅ [Resized Image] {file}")
                except Exception as e:
                    print(f"❌ Error image {file}: {e}")

            # --- OPTIMIZE GIFS (NEW BLOCK) ---
            elif ext == '.gif':
                try:
                    with Image.open(file_path) as img:
                        if img.width > MAX_WIDTH_GIF:
                            ratio = MAX_WIDTH_GIF / float(img.width)
                            new_height = int((float(img.height) * float(ratio)))
                            
                            frames = []
                            # Extract and resize every frame in the GIF
                            for frame in ImageSequence.Iterator(img):
                                frame = frame.convert("RGBA")
                                resized_frame = frame.resize((MAX_WIDTH_GIF, new_height), Image.Resampling.LANCZOS)
                                frames.append(resized_frame)
                            
                            # Save the frames back into an animated GIF
                            frames[0].save(
                                file_path,
                                save_all=True,
                                append_images=frames[1:],
                                optimize=True,
                                duration=img.info.get('duration', 100),
                                loop=img.info.get('loop', 0),
                                disposal=2  # Prevents overlapping frames
                            )
                            print(f"✅ [Resized GIF] {file}")
                except Exception as e:
                    print(f"❌ Error GIF {file}: {e}")

    print("\n🎉 Optimization Complete!")

if __name__ == "__main__":
    reduce_file_size()