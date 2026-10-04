// Rebuild original social cards: swift tools/render-social.swift
import AppKit

let width = 1200, height = 630
func color(_ hex: UInt32) -> NSColor {
    NSColor(srgbRed: Double((hex >> 16) & 255) / 255, green: Double((hex >> 8) & 255) / 255,
            blue: Double(hex & 255) / 255, alpha: 1)
}
func box(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ tint: UInt32, radius: CGFloat = 0) {
    color(tint).setFill()
    NSBezierPath(roundedRect: NSRect(x: x, y: 630-y-h, width: w, height: h), xRadius: radius, yRadius: radius).fill()
}
func text(_ value: String, _ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, size: CGFloat,
          tint: UInt32, serif: Bool = false, weight: NSFont.Weight = .regular) {
    let font = serif ? NSFont(name: "Georgia", size: size)! : NSFont.systemFont(ofSize: size, weight: weight)
    (value as NSString).draw(in: NSRect(x: x, y: 630-y-h, width: w, height: h), withAttributes: [.font: font, .foregroundColor: color(tint)])
}
func window(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, tint: UInt32, content: UInt32) {
    box(x,y,w,h,0xffffff,radius:12)
    box(x+1,y+1,w-2,27,tint,radius:10)
    for (index, c) in [UInt32(0xde9e90),0xe7ce99,0xa8c4a7].enumerated() {
        box(x+12+CGFloat(index)*11,y+11,6,6,c,radius:3)
    }
    box(x+18,y+49,w-36,h-69,content,radius:5)
}
for kind in ["portfolio", "floe"] {
    let bitmap = NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:width,pixelsHigh:height,bitsPerSample:8,
                                 samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    if kind == "portfolio" {
        box(0,0,1200,630,0xf5f3ec)
        text("ok.",65,30,160,80,size:58,tint:0x26382b,serif:true)
        text("OKTAY KIRIK / INDEPENDENT DEVELOPER",68,147,650,35,size:14,tint:0x687065,weight:.medium)
        text("Small apps.\nThoughtfully",62,206,700,200,size:77,tint:0x26382b,serif:true)
        text("made.",62,405,500,100,size:77,tint:0xb35a37,serif:true)
        text("Useful little things for your everyday.",68,551,650,35,size:20,tint:0x5b645a)
        box(798,120,330,367,0xe8e5d8,radius:165)
        box(744,193,253,278,0xfffdf7,radius:3)
        text("A LITTLE LESS\nBUSYWORK.",771,220,230,110,size:28,tint:0x26382b,weight:.bold)
        for i in 0..<3 { box(772,347+CGFloat(i)*16,174-CGFloat(i)*16,5,0xd9d8ca,radius:2) }
        box(998,164,110,110,0xc4e5f5,radius:23)
        box(1013,179,32,79,0x3fa7d8,radius:8)
        box(1051,179,40,36,0x81c9ed,radius:8)
        box(1051,221,40,37,0x3fa7d8,radius:8)
        box(727,417,103,106,0xbd572f,radius:20)
        text("TAKE",744,453,80,40,size:22,tint:0xfff3db,weight:.bold)
        box(1033,377,101,120,0xd1dab5,radius:20)
        text("PDF",1055,421,80,40,size:24,tint:0x26382b,weight:.medium)
        text("✳",864,99,80,80,size:54,tint:0xb35a37)
    } else {
        box(0,0,1200,630,0xf0f8fe)
        text("floe",61,33,220,80,size:51,tint:0x173149,weight:.bold)
        text("A LITTLE MORE SPACE. A LOT MORE FLOW.",67,161,700,35,size:13,tint:0x477899,weight:.semibold)
        text("Your windows.",62,215,740,110,size:68,tint:0x173149,weight:.bold)
        text("In a better place.",62,303,780,110,size:68,tint:0x1788bd,weight:.bold)
        text("Adaptive layouts. Shared resizing. A calmer Mac.",67,450,780,45,size:21,tint:0x577084)
        box(66,530,270,49,0x157cac,radius:10)
        text("Coming soon for macOS",91,542,250,35,size:17,tint:0xffffff,weight:.medium)
        box(847,126,305,376,0xc4deed,radius:17)
        window(866,145,145,333,tint:0xf0f5f9,content:0xe3eff7)
        window(1021,145,112,183,tint:0xf0f5f9,content:0xafd1dc)
        window(1021,339,112,139,tint:0xf0f5f9,content:0xccddea)
        text("A little\nroom to\nthink.",892,211,111,150,size:24,tint:0x173149,weight:.semibold)
        for i in 0..<3 { box(892,363+CGFloat(i)*18,88-CGFloat(i)*9,4,0xa6c4d8,radius:2) }
    }
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"assets/\(kind)-social.png"))
}
