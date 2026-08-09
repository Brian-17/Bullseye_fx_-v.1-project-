# 2D/3D Debug Visualizer

Visualize 2D/3D data during C++/Python debugging.

---

## Usage

1. Start a C++/Python debug session in VS Code
2. Set a breakpoint where 2D/3D variables are in scope
3. In the **Variables** or **Watch** panel, right-click on a supported variable
4. Select **"View 2D/3D Data"** from the context menu
5. The visualization will open in a new tab

---

## Function

### 🖼️ 2D Visualization
- Support for various data types: `cv::Mat`, `Numpy`, `Tensor`, etc.

### 📊 3D Visualization  
- Support for various data types: `std::vector<cv::Point3f/d>`, `pcl::PointCloud<T>`, `Numpy`, etc.
- Interactive 3D rotation with mouse

### 💾 Export Datas
- **Save PNG**: Export image as PNG file
- **Save PCD**: Export point cloud as PCD file

---


