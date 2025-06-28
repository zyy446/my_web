import os

def rename_images_two_steps():
    folder_path = os.getcwd()
    print(f"当前文件夹: {folder_path}")

    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif']

    # 获取所有图片文件，按名称排序
    images = [f for f in os.listdir(folder_path) if os.path.splitext(f)[1].lower() in image_extensions]
    images.sort()

    # -------------------
    # 第一步：先重命名为10000开始
    # -------------------
    print("🔧 正在将所有图片重命名为 10000 开始的编号...")
    for idx, filename in enumerate(images, start=10000):
        ext = os.path.splitext(filename)[1].lower()
        new_name = f"{idx}{ext}"

        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_name)

        os.rename(old_path, new_path)
        print(f"已将 {filename} 重命名为 {new_name}")

    # -------------------
    # 第二步：再重命名为1开始
    # -------------------
    # 重新获取所有10000开始的图片
    images = [f for f in os.listdir(folder_path) if os.path.splitext(f)[1].lower() in image_extensions]
    images.sort()

    print("🔧 正在将图片重命名为 1 开始的编号...")
    for idx, filename in enumerate(images, start=1):
        ext = os.path.splitext(filename)[1].lower()
        new_name = f"{idx}{ext}"

        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_name)

        os.rename(old_path, new_path)
        print(f"已将 {filename} 重命名为 {new_name}")

if __name__ == "__main__":
    rename_images_two_steps()
