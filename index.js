const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// 读取原始图片
const imagePath = 'botw.png'
const outputDir = 'tiles'
const zoom = 7  // zoom range [3,7]
const tileSize = 1024 / Math.pow(2, zoom - 3)  // 
const zoomDir = path.join(outputDir, `${zoom}`)
fs.rmSync(zoomDir, { recursive: true, force: true })

// 读取大图并获取其元数据
sharp(imagePath)
  .metadata()
  .then(metadata => {
    // 图片宽度和高度
    const width = metadata.width
    const height = metadata.height

    // 计算瓦片数量
    const numTilesX = Math.ceil(width / tileSize)
    const numTilesY = Math.ceil(height / tileSize)
    if (!fs.existsSync(zoomDir)) {
      fs.mkdirSync(zoomDir, { recursive: true })
    }
    // 遍历每个瓦片的位置
    for (let tileX = 0; tileX < numTilesX; tileX++) {
      for (let tileY = 0; tileY < numTilesY; tileY++) {
        // 计算瓦片左上角相对于大图的坐标
        const tileLeft = tileX * tileSize
        const tileTop = tileY * tileSize

        // 确保瓦片坐标在图片范围内
        const right = Math.min(tileLeft + tileSize, width)
        const bottom = Math.min(tileTop + tileSize, height)
        const tileFileName = `${tileX}_${tileY}.png`

        const tileFilePath = path.join(zoomDir, tileFileName)
        // 切割瓦片
        sharp(imagePath)
          .extract({
            left: tileLeft,
            top: tileTop,
            width: right - tileLeft,
            height: bottom - tileTop
          })
          .toFile(tileFilePath) // 保存瓦片到指定路径
          .then(() => {
            console.log(`Tile ${tileX}-${tileY} saved.`)
          })
          .catch(err => {
            console.error(`Error saving tile ${tileX}-${tileY}:`, err)
          })

        // 生成瓦片坐标（x, y）
        const tileCoordinate = {
          x: tileX * tileSize,
          y: tileY * tileSize
        }

        // 输出或记录瓦片坐标
        console.log(`Tile ${tileX}-${tileY} coordinate:`, tileCoordinate)
        // 你可以将坐标保存到文件或数据库中
      }
    }
  })
  .catch(err => {
    console.error('Error getting metadata:', err)
  })
