// Run from the site root: swift tools/render-plainshot-social.swift
import AppKit
let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1200, pixelsHigh: 630,
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
    colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
func color(_ hex: UInt32) -> NSColor {
    NSColor(srgbRed: Double((hex >> 16) & 255)/255, green: Double((hex >> 8) & 255)/255,
            blue: Double(hex & 255)/255, alpha: 1)
}
func text(_ string: String, x: CGFloat, y: CGFloat, size: CGFloat, tint: UInt32, weight: NSFont.Weight = .regular) {
    (string as NSString).draw(at: CGPoint(x: x, y: 630-y-size*1.2), withAttributes: [
        .font: NSFont.systemFont(ofSize: size, weight: weight), .foregroundColor: color(tint)])
}
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
color(0xf5f3ed).setFill(); NSBezierPath(rect: NSRect(x:0,y:0,width:1200,height:630)).fill()
let icon = NSImage(contentsOfFile: "plain-shot/media/icon.png")!
icon.draw(in: NSRect(x:60,y:510,width:60,height:60))
text("PlainShot.", x:132, y:72, size:30, tint:0x292c26, weight:.semibold)
text("A SMALL, FOCUSED APP FOR MAC", x:64, y:170, size:15, tint:0x73766b, weight:.medium)
text("Just screenshots.", x:58, y:222, size:88, tint:0x292c26, weight:.medium)
text("Just on your Mac.", x:58, y:324, size:88, tint:0x292c26, weight:.medium)
color(0xc84d35).setStroke()
let underline = NSBezierPath(); underline.move(to:CGPoint(x:387,y:190)); underline.curve(to:CGPoint(x:795,y:194),controlPoint1:CGPoint(x:510,y:201),controlPoint2:CGPoint(x:680,y:204)); underline.lineWidth=5; underline.stroke()
text("No cloud storage. No account. All yours.", x:64, y:503, size:23, tint:0x73766b)
text("oktykrk.github.io/plain-shot", x:64, y:575, size:14, tint:0x73766b)
NSGraphicsContext.restoreGraphicsState()
try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"plain-shot/media/social.png"))
print("Wrote plain-shot/media/social.png (1200 × 630)")
