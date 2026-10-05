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
let kinds = CommandLine.arguments.count > 1 ? Array(CommandLine.arguments.dropFirst()) : ["portfolio", "floe"]
for kind in kinds {
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
        box(0,0,1200,630,0xfafaf8)
        box(61,101,1078,1,0xe0e2e5)
        if let icon = NSImage(contentsOfFile: "assets/floe-icon.png") {
            icon.draw(in: NSRect(x:61,y:630-33-42,width:42,height:42))
        }
        text("floe",112,31,160,58,size:35,tint:0x171c26,weight:.bold)
        text("WINDOW MANAGEMENT, FOR MAC",63,161,590,32,size:13,tint:0x2855ef,weight:.semibold)
        text("Make room",58,213,680,110,size:78,tint:0x171c26,weight:.semibold)
        text("for your work.",58,301,680,110,size:78,tint:0x2855ef,weight:.semibold)
        text("Snap into place. Resize together.",64,428,650,38,size:21,tint:0x646974)
        text("Get on with your day.",64,459,650,38,size:21,tint:0x646974)
        box(63,529,238,47,0x2855ef,radius:7)
        text("Try Floe free for 7 days",83,540,218,32,size:17,tint:0xffffff,weight:.medium)
        text("macOS 15+",318,542,190,30,size:15,tint:0x646974)
        box(738,145,401,420,0x2459e8,radius:15)
        box(754,181,210,334,0xf6f3eb,radius:8)
        box(754,181,210,25,0xf0f0f0,radius:8)
        box(774,192,5,5,0xff5f57,radius:3)
        box(784,192,5,5,0xfebc2e,radius:3)
        box(794,192,5,5,0x28c840,radius:3)
        text("fieldnotes.",772,222,178,35,size:19,tint:0x243d30,serif:true)
        text("Somewhere\na little quieter.",772,269,178,88,size:26,tint:0x243d30,serif:true)
        if let photo = NSImage(contentsOfFile: "floe/media/lake.webp") {
            photo.draw(in: NSRect(x:772,y:630-366-129,width:174,height:129))
        } else {
            box(772,366,174,129,0x426650,radius:2)
        }
        window(974,181,149,190,tint:0xf0f0f0,content:0xffffff)
        text("The weekend\nplan",987,230,128,65,size:18,tint:0x171c26,weight:.semibold)
        for i in 0..<3 { box(989,301+CGFloat(i)*14,106-CGFloat(i)*12,3,0xe6e1d8,radius:2) }
        window(974,381,149,134,tint:0xf0f0f0,content:0xffffff)
        for i in 0..<2 {
            let x: CGFloat = 989 + CGFloat(i)*61
            box(x,432,23,8,0x73c7fa,radius:2)
            box(x,438,44,30,0x39a7ed,radius:3)
        }
        box(899,529,82,23,0x87bcf4,radius:7)
        for i in 0..<3 { box(910+CGFloat(i)*22,535,13,12,[UInt32(0x2586d7),0xffffff,0xf5d264][i],radius:3) }
        text("oktykrk.github.io/floe",905,39,240,27,size:15,tint:0x646974)

    }
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"assets/\(kind)-social.png"))
}
