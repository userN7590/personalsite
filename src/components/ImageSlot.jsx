// React stand-in for the design's <image-slot> web component: a neutral
// placeholder plate shown where a real screenshot hasn't been dropped in yet.
export default function ImageSlot({ placeholder }) {
  return <div className="image-slot">{placeholder}</div>
}
