/**
 * Product photos in /public/images/equipment ship a matching .webp sibling.
 * Coffee bean products don't have real photos (SVG illustration instead),
 * so this is only ever used for equipment images.
 */
export function toWebp(url: string): string {
  return url.replace(/\.(png|jpe?g)$/i, '.webp')
}
